export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  
  // Escuta mudanças no estado de autenticação apenas para logout
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    try {
      // Apenas processa logout - login é gerenciado pelo useAuth
      if (event === 'SIGNED_OUT') {
        await navigateTo('/login')
      }
    } catch (error) {
      console.error('Erro na navegação durante mudança de auth:', error)
    }
  })
  
  // Cleanup da subscription no fechamento da página (apenas no client)
  if (process.client) {
    window.addEventListener('beforeunload', () => {
      subscription?.unsubscribe()
    })
  }
})