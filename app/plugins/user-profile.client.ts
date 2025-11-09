/**
 * Plugin para gerenciar estado do usuário com Supabase
 * Carrega dados do perfil automaticamente quando usuário faz login
 */
export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const userStore = useUserStore()

  // Observar mudanças no estado de autenticação do Supabase
  watch(user, async (newUser: any) => {
    if (newUser) {
      // Usuário logou - carregar dados do perfil em background
      userStore.fetchProfile().catch(() => {
        // Erro silencioso
      })
    } else {
      // Usuário deslogou - limpar dados
      userStore.clearProfile()
    }
  }, { immediate: true })

  // Também escutar eventos de autenticação do Supabase
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Garantir que o perfil seja carregado sem bloquear
      userStore.fetchProfile().catch(() => {
        // Erro silencioso
      })
    } else if (event === 'SIGNED_OUT') {
      // Limpar dados do usuário
      userStore.clearProfile()
    }
  })
})