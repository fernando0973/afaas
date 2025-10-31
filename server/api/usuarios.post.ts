import { serverSupabaseServiceRole } from '#supabase/server'

interface CriarUsuarioRequest {
  nome: string
  email: string
  senha: string
  role: string
}

interface CriarUsuarioResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
  }
  profile?: {
    id: number
    user_id: string | null
    nome: string | null
    email: string | null
    role: string | null
  }
}

export default defineEventHandler(async (event): Promise<CriarUsuarioResponse> => {
  // Verificar se é uma requisição POST
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método não permitido'
    })
  }

  try {
    // Obter dados do corpo da requisição
    const body = await readBody(event) as CriarUsuarioRequest

    // Validar dados obrigatórios
    if (!body.nome || !body.email || !body.senha || !body.role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados obrigatórios: nome, email, senha e role'
      })
    }

    // Validar formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de e-mail inválido'
      })
    }

    // Validar role
    const rolesPermitidos = ['user', 'admin', 'atendente']
    if (!rolesPermitidos.includes(body.role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Role deve ser: user, admin ou atendente'
      })
    }

    // Validar senha
    if (body.senha.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha deve ter pelo menos 6 caracteres'
      })
    }

    // Obter cliente Supabase com privilégios de admin
    const supabase = await serverSupabaseServiceRole(event)

    // 1. Criar usuário na autenticação do Supabase
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.senha,
      email_confirm: true // Confirma o e-mail automaticamente
    })

    if (authError) {
      console.error('Erro ao criar usuário na auth:', authError)
      throw createError({
        statusCode: 400,
        statusMessage: authError.message || 'Erro ao criar usuário na autenticação'
      })
    }

    if (!authUser.user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno: usuário não foi criado'
      })
    }

    // 2. Criar perfil na tabela afaas_profiles
    const { data: profile, error: profileError } = await supabase
      .from('afaas_profiles')
      .insert({
        user_id: authUser.user.id,
        nome: body.nome.trim(),
        email: body.email.toLowerCase().trim(),
        role: body.role
      })
      .select()
      .single()

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      
      // Se der erro ao criar o perfil, deletar o usuário da auth
      try {
        await supabase.auth.admin.deleteUser(authUser.user.id)
      } catch (deleteError) {
        console.error('Erro ao fazer rollback do usuário:', deleteError)
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao criar perfil do usuário'
      })
    }

    // Retorno de sucesso
    return {
      success: true,
      message: 'Usuário criado com sucesso',
      user: {
        id: authUser.user.id,
        email: authUser.user.email!
      },
      profile: {
        id: profile.id,
        user_id: profile.user_id,
        nome: profile.nome,
        email: profile.email,
        role: profile.role
      }
    }

  } catch (error: any) {
    console.error('Erro na API de criar usuário:', error)
    
    // Se for um erro já tratado (createError), re-lançar
    if (error.statusCode) {
      throw error
    }
    
    // Erro genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})