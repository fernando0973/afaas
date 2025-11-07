/**
 * Plugin para restaurar dados do dashboard ao retornar da navegação
 * 
 * Funcionalidades:
 * - Detecta quando usuário volta para dashboard (página inicial)
 * - Verifica se há profissional selecionado mas sem agendamentos carregados
 * - Força carregamento dos dados se necessário
 * - Mantém experiência fluida durante navegação
 */
export default defineNuxtPlugin(() => {
  // Só executa no cliente
  if (!process.client) return

  const router = useRouter()
  
  router.afterEach(async (to, from) => {
    // Só se interessar por navegação para o dashboard
    if (to.path !== '/') return
    
    // Só agir se veio de outra página (não refresh ou carregamento inicial)
    if (!from.path || from.path === '/') return
    
    console.log(`🏠 Retornando ao Dashboard vindo de: ${from.path}`)
    
    // Aguardar próximo tick para garantir que componentes estão montados
    await nextTick()
    
    try {
      const agendamentoStore = useAgendamentoStore()
      const { 
        profissionalSelecionadoId, 
        agendamentos, 
        diasSemana,
        carregandoAgendamentos 
      } = storeToRefs(agendamentoStore)
      
      // Verificar se precisa carregar dados
      const profId = profissionalSelecionadoId.value
      const temProfissional = !!profId
      const semAgendamentos = agendamentos.value.length === 0
      const naoEstaCarregando = !carregandoAgendamentos.value
      
      if (temProfissional && profId && semAgendamentos && naoEstaCarregando) {
        console.log('📊 Dashboard: Restaurando agendamentos...')
        
        // Verificar cache primeiro
        const agendamentosCache = agendamentoStore.buscarNoCache(
          profId, 
          diasSemana.value
        )
        
        if (agendamentosCache) {
          console.log('✅ Dashboard: Dados restaurados do cache')
          agendamentoStore.setAgendamentos(agendamentosCache)
        } else {
          console.log('🔄 Dashboard: Carregando dados frescos')
          
          // Usar composable para buscar dados
          const { buscarAgendamentosSemana } = useAgendamentos()
          await buscarAgendamentosSemana(
            profId, 
            diasSemana.value, 
            false // Não forçar - deixar cache funcionar
          )
        }
      } else if (!temProfissional) {
        console.log('⚠️  Dashboard: Sem profissional selecionado')
      } else if (!semAgendamentos) {
        console.log('✅ Dashboard: Agendamentos já carregados')
      }
      
    } catch (error) {
      console.error('❌ Erro ao restaurar dashboard:', error)
    }
  })
})