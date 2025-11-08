import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/user'

/**
 * Store Pinia minimalista para gerenciar o estado do usuário
 */
export const useUserStore = defineStore('user', () => {
  // Estado básico
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters simples
  const userName = computed(() => profile.value?.nome || 'Usuário')
  const userRole = computed(() => profile.value?.role || 'user')
  const isAdmin = computed(() => userRole.value === 'admin')
  const isAtendente = computed(() => userRole.value === 'atendente')
  
  /**
   * Busca o perfil do usuário - versão simplificada
   */
  const fetchProfile = async () => {
    if (!process.client) return
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🔍 [UserStore] Iniciando fetchProfile...')
      const supabase = useSupabaseClient<any>()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user?.id) {
        console.log('❌ [UserStore] Sem sessão válida')
        profile.value = null
        return
      }
      
      console.log('🔍 [UserStore] Buscando perfil para:', session.user.id)
      const { data } = await supabase
        .from('afaas_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1)
      
      profile.value = data?.[0] || null
      console.log('✅ [UserStore] Perfil carregado:', profile.value ? 'encontrado' : 'não encontrado')
      
    } catch (err: any) {
      console.error('❌ [UserStore] Erro ao buscar perfil:', err)
      error.value = err.message
      profile.value = null
    } finally {
      loading.value = false
      console.log('🏁 [UserStore] fetchProfile finalizado')
    }
  }
  
  /**
   * Atualiza o perfil do usuário
   */
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile.value) return { success: false, error: 'Perfil não carregado' }
    
    try {
      const supabase = useSupabaseClient<any>()
      const { data, error: updateError } = await supabase
        .from('afaas_profiles')
        .update(updates)
        .eq('id', profile.value.id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      profile.value = data
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }
  
  /**
   * Limpa o estado do perfil
   */
  const clearProfile = () => {
    profile.value = null
    error.value = null
    loading.value = false
  }
  
  return {
    // Estado
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    
    // Getters
    userName,
    userRole,
    isAdmin,
    isAtendente,
    
    // Actions
    fetchProfile,
    updateProfile,
    clearProfile
  }
})
