import type { Tables } from '~/types/database.types'

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
   * Busca clientes e agrega dados de atendimentos para o relatório
   */
  const buscarClientesRelatorio = async () => {
    type ClienteRow = Pick<
      Tables<'afaas_clientes'>,
      'id' | 'nome_completo' | 'cpf' | 'cidade' | 'estado' | 'created_at' | 'telefone'
    >
    type AtendimentoRow = Pick<Tables<'afaas_atendimentos'>, 'id' | 'cliente_id' | 'created_at'>
    type ClienteRelatorio = ClienteRow & {
      totalAtendimentos: number
      ultimoAtendimento: string | null
    }

    try {
      const [clientesRes, atendimentosRes] = await Promise.all([
        supabase
          .from('afaas_clientes')
          .select('id, nome_completo, cpf, cidade, estado, created_at, telefone')
          .order('nome_completo', { ascending: true }),
        supabase
          .from('afaas_atendimentos')
          .select('id, cliente_id, created_at')
      ])

      if (clientesRes.error) {
        throw clientesRes.error
      }

      if (atendimentosRes.error) {
        throw atendimentosRes.error
      }

      const clientesData = (clientesRes.data ?? []) as ClienteRow[]
      const atendimentosData = (atendimentosRes.data ?? []) as AtendimentoRow[]

      const contador = new Map<number, { total: number; ultimo: string | null }>()

      atendimentosData.forEach(atendimento => {
        if (typeof atendimento.cliente_id !== 'number') {
          return
        }

        const agregado = contador.get(atendimento.cliente_id) || { total: 0, ultimo: null }
        agregado.total += 1

        if (!agregado.ultimo || new Date(atendimento.created_at) > new Date(agregado.ultimo)) {
          agregado.ultimo = atendimento.created_at
        }

        contador.set(atendimento.cliente_id, agregado)
      })

      return clientesData.map<ClienteRelatorio>(cliente => {
        const agregado = contador.get(cliente.id) || { total: 0, ultimo: null }
        return {
          ...cliente,
          totalAtendimentos: agregado.total,
          ultimoAtendimento: agregado.ultimo
        }
      })
    } catch (error) {
      console.error('Erro ao buscar clientes para relatório:', error)
      return []
    }
  }

  /**
   * Calcula estatísticas gerais dos clientes
   */
  const calcularEstatisticasClientes = (
    clientes: Array<
      Partial<Tables<'afaas_clientes'>> & {
        created_at?: string | null
        totalAtendimentos?: number
        ultimoAtendimento?: string | null
      }
    >
  ) => {
    const totalClientes = clientes.length
    const agora = new Date()
    const trintaDiasAtras = new Date(agora)
    trintaDiasAtras.setDate(agora.getDate() - 30)

    const clientesComAtendimentos = clientes.filter(cliente => (cliente.totalAtendimentos ?? 0) > 0).length
    const clientesSemAtendimento = totalClientes - clientesComAtendimentos
    const clientesNovosUltimos30Dias = clientes.filter(cliente => {
      if (!cliente.created_at) return false
      return new Date(cliente.created_at) >= trintaDiasAtras
    }).length

    const totalAtendimentos = clientes.reduce(
      (acumulado, cliente) => acumulado + (cliente.totalAtendimentos ?? 0),
      0
    )

    const mediaAtendimentosPorCliente = totalClientes > 0
      ? Number((totalAtendimentos / totalClientes).toFixed(1))
      : 0

    return {
      totalClientes,
      clientesComAtendimentos,
      clientesSemAtendimento,
      clientesNovosUltimos30Dias,
      mediaAtendimentosPorCliente
    }
  }

  /**
   * Busca plantas cadastradas e dados auxiliares para o relatório
   */
  const buscarPlantasRelatorio = async () => {
    type PlantaRow = Tables<'afaas_plantas_medicinais'>

    try {
      const { data, error } = await supabase
        .from('afaas_plantas_medicinais')
        .select(
          'id, created_at, nome_popular, nome_cientifico, partes_usadas, sabor_propriedade, meridianos, acao_terapeutica, indicacoes, contraindicacoes, renisus'
        )
        .is('deleted_at', null)
        .order('nome_popular', { ascending: true })

      if (error) {
        throw error
      }

      return (data ?? []) as PlantaRow[]
    } catch (error) {
      console.error('Erro ao buscar plantas para relatório:', error)
      return []
    }
  }

  /**
   * Calcula estatísticas gerais das plantas cadastradas
   */
  const calcularEstatisticasPlantas = (plantas: Array<Partial<Tables<'afaas_plantas_medicinais'>>>) => {
    const totalPlantas = plantas.length
    const plantasRenisus = plantas.filter(planta => planta.renisus === true).length
    const plantasComIndicacoes = plantas.filter(planta => (planta.indicacoes ?? '').toString().trim().length > 0).length
    const plantasComContraindicacoes = plantas.filter(planta => (planta.contraindicacoes ?? '').toString().trim().length > 0).length

    const conjuntoPartes = new Set<string>()
    plantas.forEach(planta => {
      if (Array.isArray(planta.partes_usadas)) {
        planta.partes_usadas.forEach(parte => {
          if (parte) {
            conjuntoPartes.add(parte)
          }
        })
      }
    })

    const agora = new Date()
    const trintaDiasAtras = new Date(agora)
    trintaDiasAtras.setDate(agora.getDate() - 30)

    const plantasRecentes = plantas.filter(planta => {
      if (!planta.created_at) {
        return false
      }
      return new Date(planta.created_at) >= trintaDiasAtras
    }).length

    return {
      totalPlantas,
      plantasRenisus,
      plantasComIndicacoes,
      plantasComContraindicacoes,
      totalPartesCatalogadas: conjuntoPartes.size,
      plantasNovasUltimos30Dias: plantasRecentes
    }
  }

  /**
   * Busca atendimentos completos com profissionais e plantas
   */
  const buscarAtendimentosCompletos = async () => {
    try {
      const dados = await $fetch<any[]>('/api/relatorios/atendimentos')
      return dados || []
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
  const obterProfissionalPorFuncao = (atendimento: any, funcao: string) => {
    if (Array.isArray(atendimento.profissionais) && atendimento.profissionais.length > 0) {
      const encontrado = atendimento.profissionais.find((prof: any) => prof.funcao === funcao)
      if (encontrado) {
        return encontrado.nome || 'N/A'
      }
    }
    return 'N/A'
  }

  const obterProfissionalAuxiliar = (atendimento: any) => {
    const porFuncao = obterProfissionalPorFuncao(atendimento, 'auxiliar')
    if (porFuncao !== 'N/A') {
      return porFuncao
    }

    if (Array.isArray(atendimento.profissionais) && atendimento.profissionais.length > 1) {
      return atendimento.profissionais[1].nome || 'N/A'
    }

    return 'N/A'
  }

  /**
   * Obtém o profissional principal de um atendimento
   */
  const obterProfissionalPrincipal = (atendimento: any) => {
    const principal = obterProfissionalPorFuncao(atendimento, 'principal')
    if (principal !== 'N/A') {
      return principal
    }

    if (Array.isArray(atendimento.profissionais) && atendimento.profissionais.length > 0) {
      return atendimento.profissionais[0].nome || 'N/A'
    }

    return atendimento.profissional?.nome || 'N/A'
  }

  const obterEspecialidadePorFuncao = (atendimento: any, funcao: string) => {
    if (Array.isArray(atendimento.profissionais) && atendimento.profissionais.length > 0) {
      const encontrado = atendimento.profissionais.find((prof: any) => prof.funcao === funcao)
      if (encontrado) {
        return encontrado.especialidade || 'N/A'
      }
    }
    return 'N/A'
  }

  const obterEspecialidadeAuxiliar = (atendimento: any) => {
    const porFuncao = obterEspecialidadePorFuncao(atendimento, 'auxiliar')
    if (porFuncao !== 'N/A') {
      return porFuncao
    }

    if (Array.isArray(atendimento.profissionais) && atendimento.profissionais.length > 1) {
      return atendimento.profissionais[1].especialidade || 'N/A'
    }

    return 'N/A'
  }

  /**
   * Obtém a especialidade principal de um atendimento
   */
  const obterEspecialidadePrincipal = (atendimento: any) => {
    const principal = obterEspecialidadePorFuncao(atendimento, 'principal')
    if (principal !== 'N/A') {
      return principal
    }

    if (Array.isArray(atendimento.profissionais) && atendimento.profissionais.length > 0) {
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

  /**
   * Busca especialidades e agrega dados de profissionais e atendimentos para o relatório
   */
  const buscarEspecialidadesRelatorio = async () => {
    type EspecialidadeRow = {
      id: number
      especialidade: string
      created_at: string
    }
    type EspecialidadeRelatorio = EspecialidadeRow & {
      totalProfissionais: number
      totalAtendimentos: number
    }

    try {
      console.log('Iniciando busca de especialidades...')
      
      // Primeiro, buscar todas as especialidades
      const { data: especialidadesData, error: especialidadesError } = await supabase
        .from('afaas_especialidades')
        .select('id, especialidade, created_at')
        .order('especialidade', { ascending: true })

      if (especialidadesError) {
        console.error('Erro ao buscar especialidades:', especialidadesError)
        throw especialidadesError
      }

      console.log('Especialidades encontradas:', especialidadesData)
      const especialidades = (especialidadesData || []) as EspecialidadeRow[]
      
      if (especialidades.length === 0) {
        console.log('Nenhuma especialidade encontrada')
        return []
      }
      
      // Para cada especialidade, buscar dados de profissionais e atendimentos
      const especialidadesComDados = await Promise.all(
        especialidades.map(async (especialidade: EspecialidadeRow) => {
          console.log(`Processando especialidade: ${especialidade.especialidade} (ID: ${especialidade.id})`)
          
          // Contar profissionais desta especialidade
          const { count: totalProfissionais, error: profError } = await supabase
            .from('afaas_profissionais')
            .select('*', { count: 'exact', head: true })
            .eq('especialidade_id', especialidade.id)

          if (profError) {
            console.error(`Erro ao buscar profissionais da especialidade ${especialidade.especialidade}:`, profError)
          }

          console.log(`Especialidade ${especialidade.especialidade}: ${totalProfissionais || 0} profissionais`)

          // Buscar IDs dos profissionais desta especialidade
          const { data: profissionaisIds, error: profIdsError } = await supabase
            .from('afaas_profissionais')
            .select('id')
            .eq('especialidade_id', especialidade.id)

          if (profIdsError) {
            console.error(`Erro ao buscar IDs dos profissionais da especialidade ${especialidade.especialidade}:`, profIdsError)
          }

          let totalAtendimentos = 0
          if (profissionaisIds && profissionaisIds.length > 0) {
            // Contar atendimentos onde estes profissionais foram os principais
            const ids = profissionaisIds.map((p: any) => p.id)
            console.log(`IDs dos profissionais da especialidade ${especialidade.especialidade}:`, ids)
            
            const { count, error: atendError } = await supabase
              .from('afaas_atendimentos')
              .select('*', { count: 'exact', head: true })
              .in('profissional_principal_id', ids)

            if (atendError) {
              console.error(`Erro ao buscar atendimentos da especialidade ${especialidade.especialidade}:`, atendError)
            }

            totalAtendimentos = count || 0
            console.log(`Especialidade ${especialidade.especialidade}: ${totalAtendimentos} atendimentos`)
          }

          const resultado = {
            id: especialidade.id,
            especialidade: especialidade.especialidade,
            created_at: especialidade.created_at,
            totalProfissionais: totalProfissionais || 0,
            totalAtendimentos
          } as EspecialidadeRelatorio

          console.log(`Resultado para especialidade ${especialidade.especialidade}:`, resultado)
          return resultado
        })
      )

      console.log('Especialidades carregadas:', especialidadesComDados)
      return especialidadesComDados
    } catch (error) {
      console.error('Erro ao buscar especialidades para relatório:', error)
      return []
    }
  }

  /**
   * Busca estatísticas simples das especialidades
   */
  const buscarEstatisticasEspecialidades = async () => {
    try {
      const { count: totalEspecialidades } = await supabase
        .from('afaas_especialidades')
        .select('*', { count: 'exact', head: true })

      const { count: totalProfissionais } = await supabase
        .from('afaas_profissionais')
        .select('*', { count: 'exact', head: true })

      const { count: totalAtendimentos } = await supabase
        .from('afaas_atendimentos')
        .select('*', { count: 'exact', head: true })

      return {
        totalEspecialidades: totalEspecialidades || 0,
        totalProfissionais: totalProfissionais || 0,
        totalAtendimentos: totalAtendimentos || 0
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas das especialidades:', error)
      return {
        totalEspecialidades: 0,
        totalProfissionais: 0,
        totalAtendimentos: 0
      }
    }
  }

  return {
    buscarEstatisticasGerais,
    buscarClientesRelatorio,
    calcularEstatisticasClientes,
    buscarPlantasRelatorio,
    calcularEstatisticasPlantas,
    buscarAtendimentosCompletos,
    calcularEstatisticasAtendimentos,
    obterProfissionalPorFuncao,
    obterProfissionalPrincipal,
    obterProfissionalAuxiliar,
    obterEspecialidadePorFuncao,
    obterEspecialidadePrincipal,
    obterEspecialidadeAuxiliar,
    formatarData,
    filtrarAtendimentosPorBusca,
    filtrarAtendimentosPorMes,
    filtrarAtendimentosPorAno,
    filtrarAtendimentos,
    buscarEspecialidadesRelatorio,
    buscarEstatisticasEspecialidades
  }
}
