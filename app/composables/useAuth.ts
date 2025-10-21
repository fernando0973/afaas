export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

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

  return {
    user,
    isAuthenticated,
    isValidUser,
    login,
    logout,
    checkSession,
    getUserDisplayName,
    updateUserProfile
  }
}
