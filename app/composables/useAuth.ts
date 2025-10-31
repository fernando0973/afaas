export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Cache para resultado da verificação de admin
  const adminCheckCache = ref<{ isAdmin: boolean; timestamp: number } | null>(null)
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  // Verifica se o usuário é válido
  const isValidUser = (user: any) => {
    return user && user.id && user.email
  }

  // Verifica se o usuário está autenticado
  const isAuthenticated = computed(() => {
    return !!user.value && isValidUser(user.value)
  })

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Aguarda um momento para garantir que a sessão seja estabelecida
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Força o redirecionamento imediatamente após login bem-sucedido
      await navigateTo('/')
      
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Erro no login:', error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Aguarda um pouco antes de redirecionar para evitar race conditions
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirecionar para página de login após logout
      await navigateTo('/login')

      return { success: true }
    } catch (error: any) {
      console.error('Erro no logout:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Verifica o status da sessão atual com debounce
  let sessionCheckTimeout: NodeJS.Timeout | null = null
  const checkSession = async () => {
    // Cancela verificação anterior se ainda estiver pendente
    if (sessionCheckTimeout) {
      clearTimeout(sessionCheckTimeout)
    }
    
    return new Promise<boolean>((resolve) => {
      sessionCheckTimeout = setTimeout(async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Erro ao verificar sessão:', error.message)
            resolve(false)
            return
          }
          
          if (session?.user && !isValidUser(session.user)) {
            // Se a sessão existe mas o usuário não é válido, faz logout
            await logout()
            resolve(false)
            return
          }
          
          resolve(!!session?.user)
        } catch (error: any) {
          console.error('Erro ao verificar sessão:', error.message)
          resolve(false)
        }
      }, 50) // Pequeno delay para evitar múltiplas chamadas
    })
  }

  // Função para obter nome de exibição do usuário
  const getUserDisplayName = () => {
    if (!user.value) return 'Usuário'
    
    const userData = user.value as any
    const userMetadata = userData.user_metadata || {}
    const appMetadata = userData.app_metadata || {}
    
    // Busca APENAS dados reais da tabela, sem formatação de email
    return (
      userMetadata.full_name ||
      userMetadata.name ||
      userMetadata.display_name ||
      (userMetadata.first_name && userMetadata.last_name ? 
        `${userMetadata.first_name} ${userMetadata.last_name}` : null) ||
      userMetadata.first_name ||
      appMetadata.full_name ||
      appMetadata.name ||
      'Usuário sem nome' // Se não há nome na tabela, mostra isso
    )
  }

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (profileData: { full_name?: string; display_name?: string }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: profileData
      })
      
      if (error) throw error
      
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Função para alterar a senha do usuário
  const updatePassword = async (newPassword: string) => {
    try {
      if (!user.value) {
        return { success: false, error: 'Usuário não autenticado' }
      }

      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'Nova senha deve ter pelo menos 6 caracteres' }
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Função para verificar se o usuário é admin via RPC
  const checkIsAdmin = async (useCache = true) => {
    try {
      if (!user.value) {
        return { success: false, isAdmin: false, error: 'Usuário não autenticado' }
      }

      // Verificar cache se solicitado
      if (useCache && adminCheckCache.value) {
        const now = Date.now()
        if (now - adminCheckCache.value.timestamp < CACHE_DURATION) {
          return { success: true, isAdmin: adminCheckCache.value.isAdmin }
        }
      }

      // Usar any para contornar limitações de tipagem da RPC
      const { data, error } = await (supabase as any).rpc('afaas_isadmin')
      
      if (error) {
        console.error('Erro ao verificar se usuário é admin:', error.message)
        return { success: false, isAdmin: false, error: error.message }
      }
      
      // A RPC retorna {"isadmin": true/false}
      const isAdmin = data?.isadmin === true
      
      // Atualizar cache
      adminCheckCache.value = {
        isAdmin,
        timestamp: Date.now()
      }
      
      return { success: true, isAdmin }
    } catch (error: any) {
      console.error('Erro ao verificar se usuário é admin:', error.message)
      return { success: false, isAdmin: false, error: error.message }
    }
  }

  // ==========================================
  // Funcionalidades de gestão de usuários
  // ==========================================

  /**
   * Criar um novo usuário no sistema
   */
  const criarUsuario = async (dados: {
    nome: string
    email: string
    senha: string
    role: string
  }): Promise<{
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
  }> => {
    try {
      const response = await $fetch<{
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
      }>('/api/usuarios', {
        method: 'POST',
        body: dados
      })

      return response
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error)
      
      // Se for um erro da API, retornar a mensagem
      if (error.data?.message) {
        return {
          success: false,
          message: error.data.message
        }
      }

      // Erro genérico
      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Deletar usuário do sistema
   */
  const deletarUsuario = async (user_id: string): Promise<{
    success: boolean
    message: string
  }> => {
    try {
      const response = await $fetch<{
        success: boolean
        message: string
      }>('/api/usuarios', {
        method: 'DELETE',
        body: { user_id }
      })

      return response
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error)
      
      // Se for um erro da API, retornar a mensagem
      if (error.data?.statusMessage) {
        return {
          success: false,
          message: error.data.statusMessage
        }
      }

      // Erro genérico
      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Editar usuário no sistema
   */
  const editarUsuario = async (dados: {
    user_id: string
    nome: string
    email: string
    senha?: string
  }): Promise<{
    success: boolean
    message: string
    data?: any
  }> => {
    try {
      const response = await $fetch<{
        success: boolean
        message: string
        data?: any
      }>('/api/usuarios', {
        method: 'PUT',
        body: dados
      })

      return response
    } catch (error: any) {
      console.error('Erro ao editar usuário:', error)
      
      // Se for um erro da API, retornar a mensagem
      if (error.data?.statusMessage) {
        return {
          success: false,
          message: error.data.statusMessage
        }
      }

      // Erro genérico
      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Atualizar informações do próprio usuário logado
   */
  const atualizarInfosUsuario = async (nome: string): Promise<{
    success: boolean
    message: string
  }> => {
    try {
      if (!user.value) {
        return { success: false, message: 'Usuário não autenticado' }
      }

      if (!nome || nome.trim().length < 2) {
        return { success: false, message: 'Nome deve ter pelo menos 2 caracteres' }
      }

      // Usar any para contornar limitações de tipagem da RPC
      const { data, error } = await (supabase as any).rpc('afaas_update_infos_user', {
        p_nome: nome.trim()
      })

      if (error) {
        console.error('Erro ao atualizar informações do usuário:', error)
        return {
          success: false,
          message: error.message || 'Erro ao atualizar informações'
        }
      }

      return data || { success: true, message: 'Informações atualizadas com sucesso' }
    } catch (error: any) {
      console.error('Erro ao atualizar informações do usuário:', error)
      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Enviar e-mail de recuperação de senha
   * 
   * Envia um link de recuperação de senha para o e-mail especificado.
   * Por segurança, sempre retorna sucesso, mesmo se o e-mail não existir.
   * 
   * Estados de link de recuperação:
   * - Válido: Link pode ser usado uma única vez dentro de 1 hora
   * - Expirado: Link passou de 1 hora desde a criação
   * - Já utilizado: Link já foi usado para alterar a senha
   * - Inválido: Link com formato incorreto ou corrompido
   */
  const esqueceuSenha = async (email: string): Promise<{
    success: boolean
    message: string
  }> => {
    try {
      if (!email || !email.trim()) {
        return { success: false, message: 'E-mail é obrigatório' }
      }

      // Validação básica de formato de e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        return { success: false, message: 'Formato de e-mail inválido' }
      }

      // Configurar a URL de redirecionamento para a página de recuperação
      const redirectTo = `${window.location.origin}/recuperar-senha`

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo
      })

      if (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error.message)
        return {
          success: false,
          message: error.message || 'Erro ao enviar e-mail de recuperação'
        }
      }

      return {
        success: true,
        message: 'E-mail de recuperação enviado com sucesso'
      }
    } catch (error: any) {
      console.error('Erro ao processar recuperação de senha:', error.message)
      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  return {
    user,
    isAuthenticated,
    isValidUser,
    login,
    logout,
    checkSession,
    getUserDisplayName,
    updateUserProfile,
    updatePassword,
    checkIsAdmin,
    criarUsuario,
    deletarUsuario,
    editarUsuario,
    atualizarInfosUsuario,
    esqueceuSenha
  }
}
