/**
 * Plugin client-side para gerenciar autenticação e dados do usuário
 */
export default defineNuxtPlugin(() => {
  if (process.server) return

  const supabase = useSupabaseClient()
  const userStore = useUserStore()
  
  // Flag para evitar múltiplos processamentos
  let processingAuth = false
  
  // Função global para buscar dados do usuário
  const refreshUserProfile = async () => {
    try {
      await userStore.fetchProfile()
    } catch (err) {
      console.warn('Erro ao buscar perfil:', err)
    }
  }

  // Escutar mudanças no estado de autenticação
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    // Evitar processamento múltiplo simultâneo
    if (processingAuth) return
    processingAuth = true
    
    try {
      if (event === 'SIGNED_IN' && session?.user) {
        // Usuário acabou de fazer login - garantir que o perfil seja carregado
        try {
          await refreshUserProfile()
          
          // Aguardar um pouco para garantir que o perfil seja propagado
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Força atualização de componentes dependentes do profile
          await nextTick()
          
          // Recarregar a página apenas se não estivermos na página de login
          // e se o login foi feito via formulário (não refresh da página)
          if (process.client && window.location.pathname !== '/login' && !sessionStorage.getItem('page_reloaded_after_login')) {
            sessionStorage.setItem('page_reloaded_after_login', 'true')
            window.location.reload()
          }
        } catch (error) {
          console.warn('Erro ao carregar perfil após login:', error)
        }
      } else if (event === 'SIGNED_OUT') {
        // Limpar dados do store quando usuário fizer logout
        userStore.clearProfile()
        
        // Limpar flag de reload
        if (process.client) {
          sessionStorage.removeItem('page_reloaded_after_login')
        }
        
        // Redirecionar para login após logout
        try {
          await navigateTo('/login')
        } catch (error) {
          console.error('Erro na navegação durante logout:', error)
          // Fallback: redirect manual
          if (process.client && window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
      }
    } catch (error) {
      console.error('Erro no processamento de mudança de auth:', error)
    } finally {
      // Reset da flag após processamento
      processingAuth = false
    }
  })
  
  // Cleanup da subscription no fechamento da página
  if (process.client) {
    window.addEventListener('beforeunload', () => {
      subscription?.unsubscribe()
    })
  }

  // Disponibiliza a função globalmente
  return {
    provide: {
      refreshUserProfile
    }
  }
})