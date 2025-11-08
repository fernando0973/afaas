import type { Tables } from '~/types/database.types'

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
        console.error('Erro ao buscar agendamentos:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro no composable useAgendamentos:', error)
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
      
      console.log('🔄 Formatando agendamento:', {
        id: agendamento.id,
        data: agendamento.data,
        horaInicioOriginal: agendamento.hora_inicio,
        horaFimOriginal: agendamento.hora_fim,
        horaInicioLimpa,
        horaFimLimpa
      })
      
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
        console.log(`💾 Cache hit: Usando agendamentos do store`)
        agendamentoStore.setAgendamentos(agendamentosCache)
        return agendamentosCache
      }
    }

    try {
      console.log(`🔄 Buscando dados frescos no banco`)
      agendamentoStore.setCarregando(true)
      agendamentoStore.setErro(null)
      
      const agendamentos = await buscarAgendamentosPorProfissional(profissionalId, dataInicio, dataFim)
      const agendamentosFormatados = formatarAgendamentos(agendamentos)
      
      // Armazenar no cache do store
      agendamentoStore.armazenarNoCache(profissionalId, diasSemana, agendamentosFormatados)
      
      // Atualizar store com os dados
      agendamentoStore.setAgendamentos(agendamentosFormatados)
      
      console.log(`✅ Dados frescos carregados: ${agendamentosFormatados.length} agendamentos`)
      
      return agendamentosFormatados
    } catch (error) {
      console.error('Erro ao buscar agendamentos da semana:', error)
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

  return {
    buscarAgendamentosSemana,
    limparCache,
    formatarAgendamentos
  }
}