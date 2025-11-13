import type { 
  Tables, 
  TablesInsert, 
  TablesUpdate,
  AtendimentoCompleto,
  CriarAtendimentoInput 
} from '~/types/database.types'

export function useAtendimentos() {
  const supabase = useSupabaseClient()

  /**
   * Conta o total de atendimentos
   */
  const contarAtendimentos = async (): Promise<number> => {
    const { count, error } = await supabase
      .from('afaas_atendimentos')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Erro ao contar atendimentos:', error)
      return 0
    }

    return count || 0
  }

  /**
   * Busca todos os atendimentos com informações completas de cliente, profissional e plantas
   */
  const buscarAtendimentosCompletos = async (): Promise<AtendimentoCompleto[]> => {
    const { data, error } = await supabase
      .from('afaas_atendimentos')
      .select(`
        *,
        cliente:afaas_clientes(*),
        profissional:afaas_profissionais(
          id,
          afaas_profiles(nome),
          afaas_especialidades(nome)
        ),
        afaas_atendimento_plantas(
          id,
          observacao_planta,
          afaas_plantas_medicinais(
            id,
            nome_popular,
            nome_cientifico
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar atendimentos: ${error.message}`)
    }

    // Transformar os dados para o formato esperado
    return (data || []).map((atendimento: any) => ({
      ...atendimento,
      profissional: atendimento.profissional ? {
        id: atendimento.profissional.id,
        nome: atendimento.profissional.afaas_profiles?.nome || 'Nome não disponível',
        especialidade: atendimento.profissional.afaas_especialidades?.nome || 'Especialidade não disponível'
      } : undefined,
      plantas: (atendimento.afaas_atendimento_plantas || []).map((ap: any) => ({
        id: ap.afaas_plantas_medicinais?.id,
        atendimento_plantas_id: ap.id,
        nome_popular: ap.afaas_plantas_medicinais?.nome_popular || '',
        nome_cientifico: ap.afaas_plantas_medicinais?.nome_cientifico || null,
        observacao_planta: ap.observacao_planta
      }))
    }))
  }

  /**
   * Busca um atendimento específico por ID com todas as informações relacionadas
   */
  const buscarAtendimentoPorId = async (id: number): Promise<AtendimentoCompleto | null> => {
    const { data, error } = await supabase
      .from('afaas_atendimentos')
      .select(`
        *,
        cliente:afaas_clientes(*),
        profissional:afaas_profissionais(
          id,
          afaas_profiles(nome),
          afaas_especialidades(nome)
        ),
        afaas_atendimento_plantas(
          id,
          observacao_planta,
          afaas_plantas_medicinais(
            id,
            nome_popular,
            nome_cientifico
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Erro ao buscar atendimento: ${error.message}`)
    }

    if (!data) return null

    const dataAny = data as any

    // Transformar os dados para o formato esperado
    return {
      ...dataAny,
      profissional: dataAny.profissional ? {
        id: dataAny.profissional.id,
        nome: dataAny.profissional.afaas_profiles?.nome || 'Nome não disponível',
        especialidade: dataAny.profissional.afaas_especialidades?.nome || 'Especialidade não disponível'
      } : undefined,
      plantas: (dataAny.afaas_atendimento_plantas || []).map((ap: any) => ({
        id: ap.afaas_plantas_medicinais?.id,
        atendimento_plantas_id: ap.id,
        nome_popular: ap.afaas_plantas_medicinais?.nome_popular || '',
        nome_cientifico: ap.afaas_plantas_medicinais?.nome_cientifico || null,
        observacao_planta: ap.observacao_planta
      }))
    }
  }

  /**
   * Busca atendimentos de um cliente específico
   */
  const buscarAtendimentosPorCliente = async (clienteId: number): Promise<AtendimentoCompleto[]> => {
    const { data, error } = await supabase
      .from('afaas_atendimentos')
      .select(`
        *,
        cliente:afaas_clientes(*),
        profissional:afaas_profissionais(
          id,
          afaas_profiles(nome),
          afaas_especialidades(nome)
        ),
        afaas_atendimento_plantas(
          id,
          observacao_planta,
          afaas_plantas_medicinais(
            id,
            nome_popular,
            nome_cientifico
          )
        )
      `)
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar atendimentos do cliente: ${error.message}`)
    }

    return (data || []).map((atendimento: any) => ({
      ...atendimento,
      profissional: atendimento.profissional ? {
        id: atendimento.profissional.id,
        nome: atendimento.profissional.afaas_profiles?.nome || 'Nome não disponível',
        especialidade: atendimento.profissional.afaas_especialidades?.nome || 'Especialidade não disponível'
      } : undefined,
      plantas: (atendimento.afaas_atendimento_plantas || []).map((ap: any) => ({
        id: ap.afaas_plantas_medicinais?.id,
        atendimento_plantas_id: ap.id,
        nome_popular: ap.afaas_plantas_medicinais?.nome_popular || '',
        nome_cientifico: ap.afaas_plantas_medicinais?.nome_cientifico || null,
        observacao_planta: ap.observacao_planta
      }))
    }))
  }

  /**
   * Cria um novo atendimento com plantas associadas
   */
  const criarAtendimento = async (input: CriarAtendimentoInput): Promise<AtendimentoCompleto> => {
    // 1. Criar o atendimento
    const { data: atendimento, error: atendimentoError } = await supabase
      .from('afaas_atendimentos')
      .insert(input.atendimento as any)
      .select()
      .single()

    if (atendimentoError) {
      throw new Error(`Erro ao criar atendimento: ${atendimentoError.message}`)
    }

    const atendimentoAny = atendimento as any

    // 2. Se houver plantas, criar as associações
    if (input.plantas && input.plantas.length > 0) {
      const plantasParaInserir = input.plantas.map(planta => ({
        atendimento_id: atendimentoAny.id,
        planta_id: planta.planta_id,
        observacao_planta: planta.observacao_planta
      }))

      const { error: plantasError } = await supabase
        .from('afaas_atendimento_plantas')
        .insert(plantasParaInserir as any)

      if (plantasError) {
        // Se houver erro ao inserir plantas, deletar o atendimento criado
        await supabase.from('afaas_atendimentos').delete().eq('id', atendimentoAny.id)
        throw new Error(`Erro ao associar plantas ao atendimento: ${plantasError.message}`)
      }
    }

    // 3. Buscar o atendimento completo criado
    const atendimentoCompleto = await buscarAtendimentoPorId(atendimentoAny.id)
    if (!atendimentoCompleto) {
      throw new Error('Erro ao recuperar atendimento criado')
    }

    return atendimentoCompleto
  }

  /**
   * Atualiza um atendimento existente
   */
  const atualizarAtendimento = async (
    id: number, 
    dados: TablesUpdate<'afaas_atendimentos'>
  ): Promise<Tables<'afaas_atendimentos'>> => {
    const { data, error } = await supabase
      .from('afaas_atendimentos')
      // @ts-ignore - Tabela afaas_atendimentos ainda não está no tipo Database
      .update(dados)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar atendimento: ${error.message}`)
    }

    return data as any
  }

  /**
   * Adiciona plantas a um atendimento existente
   */
  const adicionarPlantas = async (
    atendimentoId: number,
    plantas: Array<{ planta_id: number; observacao_planta?: string | null }>
  ): Promise<void> => {
    const plantasParaInserir = plantas.map(planta => ({
      atendimento_id: atendimentoId,
      planta_id: planta.planta_id,
      observacao_planta: planta.observacao_planta
    }))

    const { error } = await supabase
      .from('afaas_atendimento_plantas')
      .insert(plantasParaInserir as any)

    if (error) {
      throw new Error(`Erro ao adicionar plantas: ${error.message}`)
    }
  }

  /**
   * Remove uma planta de um atendimento
   */
  const removerPlanta = async (atendimentoPlantaId: number): Promise<void> => {
    const { error } = await supabase
      .from('afaas_atendimento_plantas')
      .delete()
      .eq('id', atendimentoPlantaId)

    if (error) {
      throw new Error(`Erro ao remover planta: ${error.message}`)
    }
  }

  /**
   * Atualiza a observação de uma planta em um atendimento
   */
  const atualizarObservacaoPlanta = async (
    atendimentoPlantaId: number,
    observacao: string | null
  ): Promise<void> => {
    const { error } = await supabase
      .from('afaas_atendimento_plantas')
      // @ts-ignore - Tabela afaas_atendimento_plantas ainda não está no tipo Database
      .update({ observacao_planta: observacao })
      .eq('id', atendimentoPlantaId)

    if (error) {
      throw new Error(`Erro ao atualizar observação da planta: ${error.message}`)
    }
  }

  /**
   * Deleta um atendimento (cascade deleta as plantas associadas automaticamente)
   */
  const deletarAtendimento = async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('afaas_atendimentos')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar atendimento: ${error.message}`)
    }
  }

  return {
    contarAtendimentos,
    buscarAtendimentosCompletos,
    buscarAtendimentoPorId,
    buscarAtendimentosPorCliente,
    criarAtendimento,
    atualizarAtendimento,
    adicionarPlantas,
    removerPlanta,
    atualizarObservacaoPlanta,
    deletarAtendimento
  }
}
