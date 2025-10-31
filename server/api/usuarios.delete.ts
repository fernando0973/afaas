import { serverSupabaseServiceRole } from '#supabase/server'

interface DeletarUsuarioRequest {
  user_id: string
}

interface DeletarUsuarioResponse {
  success: boolean
  message: string
}

export default defineEventHandler(async (event): Promise<DeletarUsuarioResponse> => {
  // Verificar se é uma requisição DELETE
  if (getMethod(event) !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método não permitido'
    })
  }

  try {
    // Obter dados do corpo da requisição
    const body = await readBody(event) as DeletarUsuarioRequest

    // Validar dados obrigatórios
    if (!body.user_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'user_id é obrigatório'
      })
    }

    // Validar formato do user_id (deve ser um UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(body.user_id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de user_id inválido'
      })
    }

    // Obter cliente Supabase com privilégios de admin
    const supabase = await serverSupabaseServiceRole(event)

    // 1. Verificar se o perfil existe antes de deletar
    const { data: perfilExistente, error: perfilError } = await supabase
      .from('afaas_profiles')
      .select('id, nome, email, role')
      .eq('user_id', body.user_id)
      .single()

    if (perfilError && perfilError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erro ao buscar perfil:', perfilError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao verificar perfil do usuário'
      })
    }

    if (!perfilExistente) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuário não encontrado'
      })
    }

    // 2. Deletar perfil da tabela afaas_profiles
    // O CASCADE na foreign key deletará automaticamente quando o usuário da auth for deletado
    // Mas vamos deletar explicitamente para ter controle
    const { error: deletePerfilError } = await supabase
      .from('afaas_profiles')
      .delete()
      .eq('user_id', body.user_id)

    if (deletePerfilError) {
      console.error('Erro ao deletar perfil:', deletePerfilError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao deletar perfil do usuário'
      })
    }

    // 3. Deletar usuário da autenticação do Supabase
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(body.user_id)

    if (deleteAuthError) {
      console.error('Erro ao deletar usuário da auth:', deleteAuthError)
      
      // Se der erro ao deletar da auth, tentar restaurar o perfil seria complexo
      // Melhor logar o erro e informar que houve problema parcial
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao deletar usuário da autenticação'
      })
    }

    // Retorno de sucesso
    return {
      success: true,
      message: `Usuário ${perfilExistente.nome} foi deletado com sucesso`
    }

  } catch (error: any) {
    console.error('Erro na API de deletar usuário:', error)
    
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