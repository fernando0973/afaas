import type { AgendamentoFormatado } from '~/composables/useAgendamentos'

/**
 * Store para gerenciar agendamentos e navegação semanal
 * 
 * Funcionalidades:
 * - Controla uma data de referência para navegação semanal
 * - Calcula automaticamente os 7 dias da semana (domingo a sábado)
 * - Permite navegar entre semanas (avançar/voltar)
 * - Mantém reatividade automática entre data de referência e dias da semana
 * - Cache persistente de agendamentos durante navegação
 */
export const useAgendamentoStore = defineStore('agendamento', () => {
  // ===== ESTADO REATIVO =====
  
  /**
   * Data de referência para cálculo da semana atual
   * Inicializada com a data atual do sistema
   * Quando alterada, automaticamente recalcula os dias da semana
   */
  const dataReferencia = ref(new Date())

  /**
   * ID do profissional selecionado para visualização de agendamentos
   * Inicializado como null - deve ser definido quando um profissional for selecionado
   */
  const profissionalSelecionadoId = ref<number | null>(null)

  /**
   * Lista de agendamentos carregados do profissional atual
   * Mantém os dados mesmo durante navegação entre páginas
   */
  const agendamentos = ref<AgendamentoFormatado[]>([])
  
  /**
   * Estados de carregamento e erro
   */
  const carregandoAgendamentos = ref(false)
  const erroAgendamentos = ref<string | null>(null)

  /**
   * Cache de agendamentos por chave (profissional + semana)
   * Mantém cache in-memory que sobrevive à navegação
   */
  const cacheAgendamentos = ref(new Map<string, AgendamentoFormatado[]>())

  // ===== COMPUTED (DADOS DERIVADOS) =====
  
  /**
   * Array reativo com os 7 dias da semana atual
   * Baseado na dataReferencia, sempre retorna domingo a sábado
   * 
   * Exemplo: se dataReferencia = 26/10/2025 (quinta-feira)
   * Retorna: [20/10 (dom), 21/10 (seg), ..., 26/10 (qui)...]
   * 
   * @returns Array<Date> - 7 objetos Date representando domingo a sábado
   */
  const diasSemana = computed(() => {
    const dias = []
    
    // 1. Clonar a data de referência para não modificar o original
    const domingoAtual = new Date(dataReferencia.value)
    
    // 2. Descobrir qual é o dia da semana (0=domingo, 1=segunda, ..., 6=sábado)
    const diaDaSemana = domingoAtual.getDay()
    
    // 3. Voltar para o domingo da semana atual
    // Ex: se hoje é quinta (4), volta 4 dias para chegar no domingo
    domingoAtual.setDate(domingoAtual.getDate() - diaDaSemana)
    
    // 4. Gerar array com os 7 dias consecutivos (domingo a sábado)
    for (let i = 0; i < 7; i++) {
      // Clona o domingo e adiciona 'i' dias
      const dia = new Date(domingoAtual)
      dia.setDate(domingoAtual.getDate() + i)
      dias.push(dia)
    }
    
    return dias
  })

  /**
   * Mapeia agendamentos por data para acesso otimizado
   * Evita reprocessamento em cada componente filho
   */
  const agendamentosPorData = computed(() => {
    const mapa = new Map<string, AgendamentoFormatado[]>()
    
    agendamentos.value.forEach((agendamento: AgendamentoFormatado) => {
      const data = agendamento.dataInicio
      const chave = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`
      
      if (!mapa.has(chave)) {
        mapa.set(chave, [])
      }
      mapa.get(chave)!.push(agendamento)
    })
    
    return mapa
  })

  /**
   * Gerar chave de cache baseada no profissional e período da semana
   */
  const gerarChaveCache = (profissionalId: number, dataInicio: Date, dataFim: Date): string => {
    const inicio = dataInicio.toISOString().split('T')[0]
    const fim = dataFim.toISOString().split('T')[0]
    return `prof-${profissionalId}-${inicio}-${fim}`
  }

  // ===== ACTIONS (FUNÇÕES) =====
  
  /**
   * Avança para a próxima semana
   * Adiciona 7 dias à data de referência
   * Automaticamente recalcula os diasSemana devido à reatividade
   */
  const avancarSemana = () => {
    // Cria nova instância para evitar mutação direta
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() + 7)
    dataReferencia.value = novaData
  }

  /**
   * Volta para a semana anterior
   * Subtrai 7 dias da data de referência
   * Automaticamente recalcula os diasSemana devido à reatividade
   */
  const voltarSemana = () => {
    // Cria nova instância para evitar mutação direta
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() - 7)
    dataReferencia.value = novaData
  }

  /**
   * Define o profissional selecionado
   * @param profissionalId - ID do profissional ou null para limpar seleção
   */
  const setProfissionalSelecionado = (profissionalId: number | null) => {
    profissionalSelecionadoId.value = profissionalId
  }

  /**
   * Função para obter agendamentos de uma data específica
   * Utiliza o mapa otimizado para acesso rápido
   */
  const obterAgendamentosDoDia = (data: Date): AgendamentoFormatado[] => {
    const chave = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`
    return agendamentosPorData.value.get(chave) || []
  }

  /**
   * Definir agendamentos no store
   * @param novosAgendamentos - Lista de agendamentos para definir
   */
  const setAgendamentos = (novosAgendamentos: AgendamentoFormatado[]) => {
    agendamentos.value = novosAgendamentos
  }

  /**
   * Definir estado de carregamento
   * @param carregando - Verdadeiro se está carregando
   */
  const setCarregando = (carregando: boolean) => {
    carregandoAgendamentos.value = carregando
  }

  /**
   * Definir erro
   * @param erro - Mensagem de erro ou null
   */
  const setErro = (erro: string | null) => {
    erroAgendamentos.value = erro
  }

  /**
   * Buscar agendamentos no cache
   * @param profissionalId - ID do profissional
   * @param diasSemana - Array de dias da semana
   * @returns Agendamentos do cache ou null se não encontrado
   */
  const buscarNoCache = (profissionalId: number, diasSemana: Date[]): AgendamentoFormatado[] | null => {
    if (diasSemana.length !== 7) return null
    
    const dataInicio = diasSemana[0]!
    const dataFim = diasSemana[6]!
    const chave = gerarChaveCache(profissionalId, dataInicio, dataFim)
    
    return cacheAgendamentos.value.get(chave) || null
  }

  /**
   * Armazenar agendamentos no cache
   * @param profissionalId - ID do profissional
   * @param diasSemana - Array de dias da semana  
   * @param agendamentos - Lista de agendamentos para cachear
   */
  const armazenarNoCache = (profissionalId: number, diasSemana: Date[], agendamentosParaCache: AgendamentoFormatado[]) => {
    if (diasSemana.length !== 7) return
    
    const dataInicio = diasSemana[0]!
    const dataFim = diasSemana[6]!
    const chave = gerarChaveCache(profissionalId, dataInicio, dataFim)
    
    cacheAgendamentos.value.set(chave, agendamentosParaCache)
  }

  /**
   * Limpar cache de agendamentos
   * @param profissionalId - ID do profissional específico ou undefined para limpar tudo
   */
  const limparCache = (profissionalId?: number) => {
    if (profissionalId) {
      // Limpar apenas caches deste profissional
      const chavesParaRemover = Array.from(cacheAgendamentos.value.keys())
        .filter((chave) => (chave as string).startsWith(`prof-${profissionalId}-`))
      
      chavesParaRemover.forEach(chave => cacheAgendamentos.value.delete(chave))
    } else {
      // Limpar todo o cache
      const totalEntradas = cacheAgendamentos.value.size
      cacheAgendamentos.value.clear()
    }
  }

  /**
   * Limpar dados de agendamentos (útil ao trocar profissional)
   */
  const limparAgendamentos = () => {
    agendamentos.value = []
    erroAgendamentos.value = null
  }

    /**
   * Atualiza um agendamento específico no estado atual
   */
  const atualizarAgendamento = (agendamentoAtualizado: AgendamentoFormatado) => {
    const agendamentosAtuais = agendamentos.value
    const index = agendamentosAtuais.findIndex((ag: AgendamentoFormatado) => ag.id === agendamentoAtualizado.id)
    
    if (index !== -1) {
      // Atualizar diretamente o item no array reativo
      agendamentosAtuais[index] = agendamentoAtualizado
      
      // Forçar reatividade
      triggerRef(agendamentos)
    }
  }

  // ===== RETORNO PÚBLICO =====
  return {
    // Estados reativos
    dataReferencia: readonly(dataReferencia),
    profissionalSelecionadoId: readonly(profissionalSelecionadoId),
    agendamentos: readonly(agendamentos),
    carregando: readonly(carregandoAgendamentos),
    erro: readonly(erroAgendamentos),
    
    // Dados derivados (computed)
    diasSemana,
    agendamentosPorData,
    
    // Ações/funções
    avancarSemana,
    voltarSemana,
    setProfissionalSelecionado,
    obterAgendamentosDoDia,
    setAgendamentos,
    setCarregando,
    setErro,
    buscarNoCache,
    armazenarNoCache,
    limparCache,
    limparAgendamentos,
    atualizarAgendamento
  }
})