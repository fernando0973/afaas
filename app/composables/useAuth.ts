export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Redirecionar para página index após login bem-sucedido
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

      // Redirecionar para página de login após logout
      await navigateTo('/login')

      return { success: true }
    } catch (error: any) {
      console.error('Erro no logout:', error.message)
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    login,
    logout
  }
}
