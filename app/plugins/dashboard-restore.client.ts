export default defineNuxtPlugin(() => {
  // Só executa no cliente
  if (!process.client) return

  const router = useRouter()
  
  router.afterEach(async (to, from) => {
    // Só se interessar por navegação para o dashboard
    if (to.path !== '/') return
    
    // Só agir se veio de outra página (não refresh ou carregamento inicial)
    if (!from.path || from.path === '/') return
    
    // Aguardar próximo tick para garantir que componentes estão montados
    await nextTick()
    
    try {
      const agendamentoStore = useAgendamentoStore()
      const { 
        profissionalSelecionadoId, 
        agendamentos, 
        diasSemana,
        carregando 
      } = storeToRefs(agendamentoStore)
      
      // Verificar se precisa carregar dados
      const profId = profissionalSelecionadoId.value
      const temProfissional = !!profId
      const semAgendamentos = agendamentos.value.length === 0
      const naoEstaCarregando = !carregando.value
      
      if (temProfissional && profId && semAgendamentos && naoEstaCarregando) {
        // Verificar cache primeiro
        const agendamentosCache = agendamentoStore.buscarNoCache(
          profId, 
          diasSemana.value
        )
        
        if (agendamentosCache) {
          agendamentoStore.setAgendamentos(agendamentosCache)
        } else {
          // Usar composable para buscar dados
          const { buscarAgendamentosSemana } = useAgendamentos()
          await buscarAgendamentosSemana(
            profId, 
            diasSemana.value, 
            false // Não forçar - deixar cache funcionar
          )
        }
      }
    } catch (error) {
      // Erro silencioso
    }
  })
})