import { defineStore } from 'pinia'

/**
 * Store para gerenciar agendamentos e navegação semanal
 * 
 * Funcionalidades:
 * - Controla uma data de referência para navegação semanal
 * - Calcula automaticamente os 7 dias da semana (domingo a sábado)
 * - Permite navegar entre semanas (avançar/voltar)
 * - Mantém reatividade automática entre data de referência e dias da semana
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

  // ===== RETORNO DO STORE =====
  
  return {
    // Estado reativo
    dataReferencia,
    profissionalSelecionadoId,
    
    // Dados derivados (computed)
    diasSemana,
    
    // Ações/funções
    avancarSemana,
    voltarSemana,
    setProfissionalSelecionado
  }
})