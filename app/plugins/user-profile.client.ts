/**
 * Plugin para gerenciar estado do usuário com Supabase
 * Carrega dados do perfil automaticamente quando usuário faz login
 */
export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const userStore = useUserStore()

  // Observar mudanças no estado de autenticação do Supabase
  watch(user, async (newUser) => {
    if (newUser) {
      // Usuário logou - carregar dados do perfil em background
      console.log('🔄 Usuário detectado, carregando perfil...')
      userStore.fetchProfile().catch(err => {
        console.error('❌ Erro ao carregar perfil no watcher:', err)
      })
    } else {
      // Usuário deslogou - limpar dados
      console.log('🧹 Usuário deslogado, limpando perfil...')
      userStore.clearProfile()
    }
  }, { immediate: true })

  // Também escutar eventos de autenticação do Supabase
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`🔐 [Auth] Evento: ${event}`)
    
    if (event === 'SIGNED_IN' && session?.user) {
      // Garantir que o perfil seja carregado sem bloquear
      console.log('🚀 [Auth] Carregando perfil em background...')
      userStore.fetchProfile().catch(err => {
        console.error('❌ [Auth] Erro ao carregar perfil:', err)
      })
    } else if (event === 'SIGNED_OUT') {
      // Limpar dados do usuário
      console.log('🧹 [Auth] Limpando perfil...')
      userStore.clearProfile()
    }
  })
})