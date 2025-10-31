import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Verificar se é uma requisição PUT
    if (event.node.req.method !== 'PUT') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Método não permitido'
      })
    }

    // Obter body da requisição
    const body = await readBody(event)
    
    // Validar campos obrigatórios
    if (!body.user_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do usuário é obrigatório'
      })
    }

    if (!body.nome || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nome e email são obrigatórios'
      })
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email inválido'
      })
    }

    // Validar formato do user_id (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(body.user_id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do usuário inválido'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // 1. Verificar se o usuário existe na tabela afaas_profiles
    const { data: perfilExistente, error: erroVerificacao } = await supabase
      .from('afaas_profiles')
      .select('user_id, nome, email, created_at')
      .eq('user_id', body.user_id)
      .single()

    if (erroVerificacao || !perfilExistente) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuário não encontrado'
      })
    }

    // 2. Verificar se o novo email já está em uso por outro usuário
    if (body.email !== perfilExistente.email) {
      const { data: emailJaUsado } = await supabase
        .from('afaas_profiles')
        .select('user_id')
        .eq('email', body.email)
        .neq('user_id', body.user_id)
        .single()

      if (emailJaUsado) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Este email já está sendo usado por outro usuário'
        })
      }
    }

    // 3. Atualizar o perfil na tabela afaas_profiles
    const { error: erroProfile } = await supabase
      .from('afaas_profiles')
      .update({
        nome: body.nome.trim(),
        email: body.email.toLowerCase().trim()
      })
      .eq('user_id', body.user_id)

    if (erroProfile) {
      console.error('Erro ao atualizar perfil:', erroProfile)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao atualizar perfil do usuário'
      })
    }

    // 4. Se foi fornecida uma nova senha, atualizar também
    if (body.senha && body.senha.trim()) {
      if (body.senha.length < 6) {
        throw createError({
          statusCode: 400,
          statusMessage: 'A senha deve ter pelo menos 6 caracteres'
        })
      }

      const { error: erroSenha } = await supabase.auth.admin.updateUserById(
        body.user_id,
        { 
          password: body.senha,
          email: body.email.toLowerCase().trim()
        }
      )

      if (erroSenha) {
        console.error('Erro ao atualizar senha:', erroSenha)
        // Se falhou a atualização da senha, reverter a atualização do perfil
        await supabase
          .from('afaas_profiles')
          .update({
            nome: perfilExistente.nome,
            email: perfilExistente.email
          })
          .eq('user_id', body.user_id)

        throw createError({
          statusCode: 500,
          statusMessage: 'Erro ao atualizar senha do usuário'
        })
      }
    } else if (body.email !== perfilExistente.email) {
      // Se só o email foi alterado (sem senha), atualizar apenas o email no auth
      const { error: erroEmail } = await supabase.auth.admin.updateUserById(
        body.user_id,
        { 
          email: body.email.toLowerCase().trim()
        }
      )

      if (erroEmail) {
        console.error('Erro ao atualizar email no auth:', erroEmail)
        // Se falhou a atualização do email, reverter a atualização do perfil
        await supabase
          .from('afaas_profiles')
          .update({
            nome: perfilExistente.nome,
            email: perfilExistente.email
          })
          .eq('user_id', body.user_id)

        throw createError({
          statusCode: 500,
          statusMessage: 'Erro ao atualizar email do usuário'
        })
      }
    }

    // 5. Buscar os dados atualizados
    const { data: usuarioAtualizado, error: erroBusca } = await supabase
      .from('afaas_profiles')
      .select(`
        id,
        user_id,
        nome,
        email,
        role,
        created_at
      `)
      .eq('user_id', body.user_id)
      .single()

    if (erroBusca) {
      console.error('Erro ao buscar usuário atualizado:', erroBusca)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao buscar dados atualizados do usuário'
      })
    }

    return {
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: usuarioAtualizado
    }

  } catch (error: any) {
    console.error('Erro na atualização do usuário:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})