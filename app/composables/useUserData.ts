/**
 * Composable seguro para acessar dados do usuário
 */
export const useUserData = () => {
  const { user } = useAuth()
  
  // Estado local como fallback - SSR safe
  const fallbackName = computed(() => {
    // No servidor, sempre retorna valor padrão
    if (!process.client) return 'Usuário'
    
    if (!user.value) return 'Usuário'
    
    if (user.value.user_metadata?.full_name) {
      return user.value.user_metadata.full_name
    }
    
    if (user.value.email) {
      return user.value.email.split('@')[0]
    }
    
    return 'Usuário'
  })
  
  // Tenta usar o store, com fallback seguro
  const storeData = computed(() => {
    if (!process.client) return null
    
    try {
      const userStore = useUserStore()
      return {
        profile: userStore.profile,
        userName: userStore.userName,
        userRole: userStore.userRole,
        isAdmin: userStore.isAdmin,
        isAtendente: userStore.isAtendente,
        loading: userStore.loading,
        error: userStore.error
      }
    } catch (err) {
      return null
    }
  })
  
  // Nome final: prioriza store, fallback para auth
  const userName = computed(() => {
    return storeData.value?.userName || fallbackName.value
  })
  
  const isAuthenticated = computed(() => {
    // No servidor, assumir não autenticado para evitar hidratação
    if (!process.client) return false
    return !!user.value
  })
  
  // Função para carregar dados do store
  // REMOVIDO: userStore.fetchProfile() - Plugin auth.client.ts já faz isso
  const loadUserProfile = async () => {
    if (!process.client) return
    
    // O perfil já é carregado pelo plugin auth.client.ts após login
    // Esta função agora é um no-op, mantida para compatibilidade
    return Promise.resolve()
  }
  
  return {
    userName,
    isAuthenticated,
    userRole: computed(() => storeData.value?.userRole || 'user'),
    isAdmin: computed(() => storeData.value?.isAdmin || false),
    isAtendente: computed(() => storeData.value?.isAtendente || false),
    loading: computed(() => storeData.value?.loading || false),
    error: computed(() => storeData.value?.error || null),
    profile: computed(() => storeData.value?.profile || null),
    loadUserProfile
  }
}