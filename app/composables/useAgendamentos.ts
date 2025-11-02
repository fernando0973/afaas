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
}

export const useAgendamentos = () => {
  const supabase = useSupabaseClient()
  
  // Cache para armazenar agendamentos por profissional e semana
  const cacheAgendamentos = new Map<string, AgendamentoFormatado[]>()
  
  /**
   * Gerar chave de cache baseada no profissional e período da semana
   */
  const gerarChaveCache = (profissionalId: number, dataInicio: Date, dataFim: Date): string => {
    const inicio = dataInicio.toISOString().split('T')[0]
    const fim = dataFim.toISOString().split('T')[0]
    return `prof-${profissionalId}-${inicio}-${fim}`
  }
  
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
        cor: agendamento.cor || '#DBE9FE'
      }
    })
  }

  /**
   * Buscar e formatar agendamentos por profissional (sem filtro de data - legacy)
   * @deprecated Use buscarAgendamentosSemana para melhor performance
   */
  const buscarAgendamentosFormatados = async (profissionalId: number): Promise<AgendamentoFormatado[]> => {
    const agendamentos = await buscarAgendamentosPorProfissional(profissionalId)
    return formatarAgendamentos(agendamentos)
  }

  /**
   * Buscar agendamentos de uma semana específica sempre do banco
   * Cache é usado apenas durante a mesma sessão para evitar requests duplicados
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
    const chaveCache = gerarChaveCache(profissionalId, dataInicio, dataFim)

    // Verificar cache apenas se não foi solicitada atualização forçada
    if (!forcarAtualizacao && cacheAgendamentos.has(chaveCache)) {
      console.log(`💾 Cache hit: Usando agendamentos temporários para ${chaveCache}`)
      return cacheAgendamentos.get(chaveCache)!
    }

    try {
      console.log(`� Buscando dados frescos no banco para ${chaveCache}`)
      
      const agendamentos = await buscarAgendamentosPorProfissional(profissionalId, dataInicio, dataFim)
      const agendamentosFormatados = formatarAgendamentos(agendamentos)
      
      // Armazenar no cache temporário (apenas para evitar requests duplicados na mesma operação)
      cacheAgendamentos.set(chaveCache, agendamentosFormatados)
      
      console.log(`✅ Dados frescos carregados: ${agendamentosFormatados.length} agendamentos`)
      
      return agendamentosFormatados
    } catch (error) {
      console.error('Erro ao buscar agendamentos da semana:', error)
      throw error
    }
  }

  /**
   * Limpar cache de agendamentos (útil quando dados são alterados)
   */
  const limparCache = (profissionalId?: number) => {
    if (profissionalId) {
      // Limpar apenas caches deste profissional
      const chavesParaRemover = Array.from(cacheAgendamentos.keys())
        .filter(chave => chave.startsWith(`prof-${profissionalId}-`))
      
      chavesParaRemover.forEach(chave => cacheAgendamentos.delete(chave))
      console.log(`🧹 Cache limpo para profissional ${profissionalId}: ${chavesParaRemover.length} entradas removidas`)
    } else {
      // Limpar todo o cache
      const totalEntradas = cacheAgendamentos.size
      cacheAgendamentos.clear()
      console.log(`🧹 Cache totalmente limpo: ${totalEntradas} entradas removidas`)
    }
  }

  return {
    buscarAgendamentosSemana,
    limparCache
  }
}