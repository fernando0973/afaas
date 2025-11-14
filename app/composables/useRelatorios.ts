/**
 * Composable para funcionalidades de relatórios
 * Centraliza lógica de busca e cálculo de estatísticas para relatórios
 */
export function useRelatorios() {
  const supabase = useSupabaseClient()

  /**
   * Busca estatísticas gerais do sistema
   */
  const buscarEstatisticasGerais = async () => {
    try {
      const [
        { count: totalAtendimentos },
        { count: totalClientes },
        { count: totalProfissionais },
        { count: totalPlantas }
      ] = await Promise.all([
        supabase.from('afaas_atendimentos').select('*', { count: 'exact', head: true }),
        supabase.from('afaas_clientes').select('*', { count: 'exact', head: true }),
        supabase.from('afaas_profissionais').select('*', { count: 'exact', head: true }),
        supabase.from('afaas_plantas_medicinais').select('*', { count: 'exact', head: true })
      ])

      return {
        totalAtendimentos: totalAtendimentos || 0,
        totalClientes: totalClientes || 0,
        totalProfissionais: totalProfissionais || 0,
        totalPlantas: totalPlantas || 0
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas gerais:', error)
      return {
        totalAtendimentos: 0,
        totalClientes: 0,
        totalProfissionais: 0,
        totalPlantas: 0
      }
    }
  }

  /**
   * Busca atendimentos completos com profissionais e plantas
   */
  const buscarAtendimentosCompletos = async () => {
    try {
      // Buscar atendimentos básicos com clientes
      const { data, error } = await supabase
        .from('afaas_atendimentos')
        .select(`
          *,
          cliente:afaas_clientes(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar atendimentos:', error)
        return []
      }

      if (!data || data.length === 0) {
        return []
      }

      // Para cada atendimento, buscar profissionais e plantas
      const atendimentosCompletos = await Promise.all(
        data.map(async (atendimento: any) => {
          // Buscar profissionais
          const { data: profissionaisData } = await supabase
            .from('afaas_atendimento_profissionais')
            .select(`
              id,
              funcao,
              afaas_profissionais(
                id,
                afaas_profiles(nome),
                afaas_especialidades(especialidade)
              )
            `)
            .eq('atendimento_id', atendimento.id)
            .order('funcao', { ascending: true }) // Principal primeiro

          // Buscar plantas
          const { data: plantasData } = await supabase
            .from('afaas_atendimento_plantas')
            .select(`
              id,
              afaas_plantas_medicinais(
                id,
                nome_popular
              )
            `)
            .eq('atendimento_id', atendimento.id)

          return {
            ...atendimento,
            profissionais: (profissionaisData || []).map((ap: any) => ({
              id: ap.afaas_profissionais?.id,
              nome: ap.afaas_profissionais?.afaas_profiles?.nome || 'Nome não disponível',
              especialidade: ap.afaas_profissionais?.afaas_especialidades?.especialidade || 'Especialidade não disponível',
              funcao: ap.funcao
            })),
            plantas: (plantasData || []).map((ap: any) => ({
              id: ap.afaas_plantas_medicinais?.id,
              nome_popular: ap.afaas_plantas_medicinais?.nome_popular || ''
            }))
          }
        })
      )

      return atendimentosCompletos
    } catch (error) {
      console.error('Erro ao buscar atendimentos completos:', error)
      return []
    }
  }

  /**
   * Calcula estatísticas de atendimentos
   */
  const calcularEstatisticasAtendimentos = (atendimentos: any[]) => {
    const total = atendimentos.length
    
    const hoje = new Date()
    const mesAtual = hoje.getMonth()
    const anoAtual = hoje.getFullYear()
    
    // Atendimentos do mês atual
    const atendimentosMesAtual = atendimentos.filter((a: any) => {
      const data = new Date(a.created_at)
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
    })
    
    const esteMes = atendimentosMesAtual.length
    
    // Atendimentos do mês anterior
    const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1
    const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual
    
    const atendimentosMesAnterior = atendimentos.filter((a: any) => {
      const data = new Date(a.created_at)
      return data.getMonth() === mesAnterior && data.getFullYear() === anoMesAnterior
    })
    
    // Calcular crescimento percentual
    let crescimento = 0
    if (atendimentosMesAnterior.length > 0) {
      crescimento = Math.round(
        ((esteMes - atendimentosMesAnterior.length) / atendimentosMesAnterior.length) * 100
      )
    }
    
    // Calcular média diária (últimos 30 dias)
    const trintaDiasAtras = new Date()
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)
    
    const atendimentosUltimos30Dias = atendimentos.filter((a: any) => {
      const data = new Date(a.created_at)
      return data >= trintaDiasAtras
    })
    
    const mediaDiaria = Math.round(atendimentosUltimos30Dias.length / 30)
    
    // Clientes únicos
    const clientesUnicos = new Set(atendimentos.map((a: any) => a.cliente_id))
    const clientesUnicosCount = clientesUnicos.size
    
    return {
      total,
      esteMes,
      crescimento,
      mediaDiaria,
      clientesUnicos: clientesUnicosCount
    }
  }

  /**
   * Obtém o profissional principal de um atendimento
   */
  const obterProfissionalPrincipal = (atendimento: any) => {
    if (atendimento.profissionais && atendimento.profissionais.length > 0) {
      return atendimento.profissionais[0].nome || 'N/A'
    }
    return atendimento.profissional?.nome || 'N/A'
  }

  /**
   * Obtém a especialidade principal de um atendimento
   */
  const obterEspecialidadePrincipal = (atendimento: any) => {
    if (atendimento.profissionais && atendimento.profissionais.length > 0) {
      return atendimento.profissionais[0].especialidade || 'N/A'
    }
    return atendimento.profissional?.especialidade || 'N/A'
  }

  /**
   * Formata data para formato brasileiro
   */
  const formatarData = (data: string) => {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Filtra atendimentos por termo de busca
   */
  const filtrarAtendimentosPorBusca = (atendimentos: any[], termo: string) => {
    if (!termo) return atendimentos
    
    const termoLower = termo.toLowerCase()
    return atendimentos.filter((a: any) => 
      a.cliente?.nome_completo?.toLowerCase().includes(termoLower) ||
      obterProfissionalPrincipal(a).toLowerCase().includes(termoLower) ||
      a.id.toString().includes(termo)
    )
  }

  /**
   * Filtra atendimentos por mês
   */
  const filtrarAtendimentosPorMes = (atendimentos: any[], mes: string) => {
    if (!mes) return atendimentos
    
    return atendimentos.filter((a: any) => {
      const mesAtendimento = new Date(a.created_at).getMonth() + 1
      return mesAtendimento.toString().padStart(2, '0') === mes
    })
  }

  /**
   * Filtra atendimentos por ano
   */
  const filtrarAtendimentosPorAno = (atendimentos: any[], ano: string) => {
    if (!ano) return atendimentos
    
    return atendimentos.filter((a: any) => {
      const anoAtendimento = new Date(a.created_at).getFullYear()
      return anoAtendimento.toString() === ano
    })
  }

  /**
   * Aplica todos os filtros aos atendimentos
   */
  const filtrarAtendimentos = (
    atendimentos: any[],
    filtros: { busca?: string; mes?: string; ano?: string }
  ) => {
    let resultado = atendimentos

    if (filtros.busca) {
      resultado = filtrarAtendimentosPorBusca(resultado, filtros.busca)
    }

    if (filtros.mes) {
      resultado = filtrarAtendimentosPorMes(resultado, filtros.mes)
    }

    if (filtros.ano) {
      resultado = filtrarAtendimentosPorAno(resultado, filtros.ano)
    }

    return resultado
  }

  return {
    buscarEstatisticasGerais,
    buscarAtendimentosCompletos,
    calcularEstatisticasAtendimentos,
    obterProfissionalPrincipal,
    obterEspecialidadePrincipal,
    formatarData,
    filtrarAtendimentosPorBusca,
    filtrarAtendimentosPorMes,
    filtrarAtendimentosPorAno,
    filtrarAtendimentos
  }
}
