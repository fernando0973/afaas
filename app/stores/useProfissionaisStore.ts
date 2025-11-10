import type { Profissional } from '~/types/profissional'
import type { Database } from '~/types/database.types'

/**
 * Store Pinia para gerenciar lista de profissionais com cache
 * Evita requisições duplicadas ao Supabase
 */
export const useProfissionaisStore = defineStore('profissionais', () => {
  // Estado
  const profissionais = ref<Profissional[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number>(0)
  
  // Cache Time-To-Live: 5 minutos
  const CACHE_TTL = 5 * 60 * 1000
  
  /**
   * Buscar lista de profissionais do Supabase
   * Usa cache para evitar requisições redundantes
   * 
   * @param forceRefresh - Força nova busca ignorando cache
   * @returns Array de profissionais
   */
  async function buscarProfissionais(forceRefresh = false): Promise<Profissional[]> {
    const now = Date.now()
    
    // Se já tem dados em cache e não passou TTL, retorna do cache
    if (!forceRefresh && profissionais.value.length > 0 && (now - lastFetch.value) < CACHE_TTL) {
      return profissionais.value
    }
    
    // Se já está carregando, aguarda a requisição em andamento
    if (loading.value) {
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (!loading.value) {
            clearInterval(interval)
            resolve(true)
          }
        }, 100)
      })
      return profissionais.value
    }
    
    loading.value = true
    error.value = null
    
    try {
      const client = useSupabaseClient()
      
      // @ts-ignore - RPC function não tipada no schema gerado
      const { data, error: supabaseError } = await client.rpc('afaas_get_profissionais')
      
      if (supabaseError) {
        error.value = supabaseError.message
        throw supabaseError
      }
      
      if (data && Array.isArray(data)) {
        const profsList = data as Profissional[]
        profissionais.value = profsList
        lastFetch.value = now
      }
      
      return profissionais.value
    } catch (err: any) {
      error.value = err.message || 'Erro desconhecido'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Invalida cache e força nova busca
   */
  async function recarregarProfissionais(): Promise<Profissional[]> {
    return await buscarProfissionais(true)
  }
  
  /**
   * Limpa cache e estado
   */
  function limparCache() {
    profissionais.value = []
    lastFetch.value = 0
    error.value = null
  }
  
  /**
   * Busca profissional por ID no cache
   */
  function buscarPorId(id: number): Profissional | undefined {
    return profissionais.value.find((p: Profissional) => p.id === id)
  }
  
  return {
    // Estado
    profissionais: readonly(profissionais),
    loading: readonly(loading),
    error: readonly(error),
    
    // Ações
    buscarProfissionais,
    recarregarProfissionais,
    limparCache,
    buscarPorId
  }
})
