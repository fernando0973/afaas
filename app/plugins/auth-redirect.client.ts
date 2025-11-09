export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Função para verificar e restaurar a sessão do usuário
  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Erro ao recuperar sessão:', error)
        return
      }

      // Se temos uma sessão mas não temos usuário, aguarda a sincronização
      if (session && session.user && !user.value) {
        // Aguarda um pouco para o Nuxt sincronizar o estado
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error)
    }
  }

  // Listener para mudanças no estado de autenticação
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Usuário fez login com sucesso
      // Aguarda um pouco para garantir que o estado foi sincronizado
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Se estamos na página de login, redireciona
      const route = useRoute()
      if (route.path === '/login') {
        await navigateTo('/', { replace: true })
      }
    } else if (event === 'SIGNED_OUT') {
      // Usuário fez logout
      const route = useRoute()
      const publicPages = ['/login', '/esqueci-senha', '/recuperar-senha']
      
      if (!publicPages.includes(route.path)) {
        await navigateTo('/login', { replace: true })
      }
    }
  })

  // Inicializa a verificação de autenticação
  if (process.client) {
    await initializeAuth()
  }
})