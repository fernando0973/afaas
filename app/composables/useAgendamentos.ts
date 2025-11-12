import type { AgendamentoCompletoView, Tables } from '~/types/database.types'

export type Agendamento = Tables<'afaas_agendamentos'>

// Interface para agendamento formatado para uso nos componentes
export interface AgendamentoFormatado {
  id: number
  dataInicio: Date
  dataFim: Date
  titulo: string
  descricao: string
  clienteId: number | null
  profissionalId: number | null
  cor: string
  cancelado?: boolean | null
  dataCancelamento?: Date | null
}

export interface RelatorioAgendamentosFiltro {
  profissionalId?: number
  clienteId?: number
  dataInicio?: Date
  dataFim?: Date
  incluirCancelados?: boolean
}

export const useAgendamentos = () => {
  const supabase = useSupabaseClient()
  const agendamentoStore = useAgendamentoStore()
  
  /**
   * Busca agendamentos por profissional e período específico
   * Filtra apenas agendamentos não cancelados (cancelado = false)
   */
  const buscarAgendamentosPorProfissional = async (
    profissionalId: number, 
    dataInicio?: Date, 
    dataFim?: Date
  ): Promise<Agendamento[]> => {
    try {
      let query = supabase
        .from('afaas_agendamentos')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)

      // Aplicar filtro de data se fornecido
      if (dataInicio) {
        const dataInicioStr = dataInicio.toISOString().split('T')[0]
        query = query.gte('data', dataInicioStr)
      }
      
      if (dataFim) {
        const dataFimStr = dataFim.toISOString().split('T')[0]
        query = query.lte('data', dataFimStr)
      }

      const { data, error } = await query
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      throw error
    }
  }

  /**
   * Formatar agendamentos do database para uso nos componentes
   * Converte strings de data/hora em objetos Date
   * @param agendamentos - Lista de agendamentos do database
   * @returns Lista de agendamentos formatados
   */
  const formatarAgendamentos = (agendamentos: Agendamento[]): AgendamentoFormatado[] => {
    return agendamentos.map(agendamento => {
      // Tratar horários que podem vir com timezone (-03, etc)
      // Remove o timezone e mantém apenas a parte do horário (HH:MM:SS)
      const horaInicioLimpa = agendamento.hora_inicio?.split(/[-+]/)[0] || agendamento.hora_inicio
      const horaFimLimpa = agendamento.hora_fim?.split(/[-+]/)[0] || agendamento.hora_fim
      
      // Combinar data + hora_inicio para criar Date
      const dataInicio = agendamento.data && horaInicioLimpa
        ? new Date(`${agendamento.data}T${horaInicioLimpa}`)
        : new Date()

      // Combinar data + hora_fim para criar Date
      const dataFim = agendamento.data && horaFimLimpa
        ? new Date(`${agendamento.data}T${horaFimLimpa}`)
        : new Date()

      return {
        id: agendamento.id,
        dataInicio,
        dataFim,
        titulo: agendamento.titulo || 'Sem título',
        descricao: agendamento.descricao || 'Sem descrição',
        clienteId: agendamento.cliente_id,
        profissionalId: agendamento.profissional_id,
        cor: agendamento.cor || '#DBE9FE',
        cancelado: agendamento.cancelado,
        dataCancelamento: agendamento.cancelado_as ? new Date(agendamento.cancelado_as) : null
      }
    })
  }

  /**
   * Buscar agendamentos de uma semana específica
   * Usa cache do store para otimizar performance e manter dados durante navegação
   */
  const buscarAgendamentosSemana = async (
    profissionalId: number, 
    diasSemana: Date[],
    forcarAtualizacao = false
  ): Promise<AgendamentoFormatado[]> => {
    if (!profissionalId || diasSemana.length !== 7) {
      return []
    }

    const dataInicio = diasSemana[0]! // Domingo
    const dataFim = diasSemana[6]!   // Sábado

    // Verificar cache no store primeiro
    if (!forcarAtualizacao) {
      const agendamentosCache = agendamentoStore.buscarNoCache(profissionalId, diasSemana)
      if (agendamentosCache) {
        agendamentoStore.setAgendamentos(agendamentosCache)
        return agendamentosCache
      }
    }

    try {
      agendamentoStore.setCarregando(true)
      agendamentoStore.setErro(null)
      
      const agendamentos = await buscarAgendamentosPorProfissional(profissionalId, dataInicio, dataFim)
      const agendamentosFormatados = formatarAgendamentos(agendamentos)
      
      // Armazenar no cache do store
      agendamentoStore.armazenarNoCache(profissionalId, diasSemana, agendamentosFormatados)
      
      // Atualizar store com os dados
      agendamentoStore.setAgendamentos(agendamentosFormatados)
      
      
      return agendamentosFormatados
    } catch (error) {
      agendamentoStore.setErro('Erro ao carregar agendamentos')
      throw error
    } finally {
      agendamentoStore.setCarregando(false)
    }
  }

  /**
   * Limpar cache de agendamentos (delega para o store)
   */
  const limparCache = (profissionalId?: number) => {
    agendamentoStore.limparCache(profissionalId)
  }

  const buscarRelatorioAgendamentos = async (
    filtros: RelatorioAgendamentosFiltro = {}
  ): Promise<AgendamentoCompletoView[]> => {
    const {
      profissionalId,
      clienteId,
      dataInicio,
      dataFim,
      incluirCancelados = false
    } = filtros

    try {
      let query = supabase
        .from('afaas_view_agendamentos_completos')
        .select('*')

      if (!incluirCancelados) {
        query = query.eq('cancelado', false)
      }

      if (profissionalId) {
        query = query.eq('profissional_id', profissionalId)
      }

      if (clienteId) {
        query = query.eq('cliente_id', clienteId)
      }

      if (dataInicio) {
        const inicio = dataInicio.toISOString().split('T')[0]
        query = query.gte('data', inicio)
      }

      if (dataFim) {
        const fim = dataFim.toISOString().split('T')[0]
        query = query.lte('data', fim)
      }

      const { data, error } = await query
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (error) {
        throw error
      }

      return (data || []) as AgendamentoCompletoView[]
    } catch (error) {
      throw error
    }
  }

  return {
    buscarAgendamentosSemana,
    limparCache,
    formatarAgendamentos,
    buscarRelatorioAgendamentos
  }
}