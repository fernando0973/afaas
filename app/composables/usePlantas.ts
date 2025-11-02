import type { PlantaMedicinal } from '~/types/planta'

/**
 * usePlantas composable
 *
 * Composable para manipular dados de plantas medicinais
 */
export const usePlantas = () => {
  const supabase = useSupabaseClient()

  /**
   * Busca todas as plantas medicinais do banco de dados
   * @returns Promise com lista de plantas ou erro
   */
  const buscarPlantas = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .select(`
          id,
          created_at,
          deleted_at,
          nome_popular,
          nome_cientifico,
          partes_usadas,
          sabor_propriedade,
          meridianos,
          acao_terapeutica,
          indicacoes,
          contraindicacoes,
          renisus
        `)
        .is('deleted_at', null) // Filtrar registros não deletados
        .order('nome_popular')

      if (error) throw error



      return { success: true, data: data as PlantaMedicinal[] }
    } catch (error: any) {
      console.error('Erro ao buscar plantas medicinais:', error.message)
      return { success: false, error: error.message, data: [] }
    }
  }

  /**
   * Insere uma nova planta medicinal no banco de dados
   * @param dados - Dados da planta medicinal (sem id)
   * @returns Promise com resultado da operação
   */
  const inserirPlanta = async (dados: Omit<PlantaMedicinal, 'id' | 'created_at' | 'deleted_at'>) => {
    try {
      // Validação básica
      if (!dados.nome_popular?.trim()) {
        throw new Error('Nome popular é obrigatório')
      }

      // Verificar se já existe uma planta com o mesmo nome popular
      const { data: plantaExistente, error: errorVerificacao } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .select('id')
        .eq('nome_popular', dados.nome_popular.trim())
        .is('deleted_at', null)
        .single()

      if (errorVerificacao && errorVerificacao.code !== 'PGRST116') {
        throw errorVerificacao
      }

      if (plantaExistente) {
        throw new Error('Já existe uma planta medicinal com este nome popular')
      }

      // Preparar dados para inserção
      const dadosParaInserir = {
        nome_popular: dados.nome_popular.trim(),
        nome_cientifico: dados.nome_cientifico?.trim() || null,
        partes_usadas: dados.partes_usadas && dados.partes_usadas.length > 0 ? dados.partes_usadas : null,
        sabor_propriedade: dados.sabor_propriedade && dados.sabor_propriedade.length > 0 ? dados.sabor_propriedade : null,
        meridianos: dados.meridianos && dados.meridianos.length > 0 ? dados.meridianos : null,
        acao_terapeutica: dados.acao_terapeutica?.trim() || null,
        indicacoes: dados.indicacoes?.trim() || null,
        contraindicacoes: dados.contraindicacoes?.trim() || null,
        renisus: dados.renisus ?? false,
        created_at: new Date().toISOString()
      }



      const { data, error } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .insert(dadosParaInserir)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: data as PlantaMedicinal }
    } catch (error: any) {
      console.error('Erro ao inserir planta medicinal:', error.message)
      return { success: false, error: error.message, data: null }
    }
  }

  /**
   * Edita uma planta medicinal existente no banco de dados
   * @param id - ID da planta medicinal
   * @param dados - Novos dados da planta medicinal
   * @returns Promise com resultado da operação
   */
  const editarPlanta = async (id: number, dados: Omit<PlantaMedicinal, 'id' | 'created_at' | 'deleted_at'>) => {
    try {
      // Validação básica
      if (!dados.nome_popular?.trim()) {
        throw new Error('Nome popular é obrigatório')
      }

      if (!id || id <= 0) {
        throw new Error('ID da planta é inválido')
      }

      // Verificar se a planta existe
      const { data: plantaExistente, error: errorVerificacao } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .select('id')
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (errorVerificacao) {
        throw new Error('Planta medicinal não encontrada')
      }

      // Verificar se já existe outra planta com o mesmo nome popular
      const { data: plantaDuplicada, error: errorDuplicacao } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .select('id')
        .eq('nome_popular', dados.nome_popular.trim())
        .neq('id', id)
        .is('deleted_at', null)
        .single()

      if (errorDuplicacao && errorDuplicacao.code !== 'PGRST116') {
        throw errorDuplicacao
      }

      if (plantaDuplicada) {
        throw new Error('Já existe outra planta medicinal com este nome popular')
      }

      // Preparar dados para atualização
      const dadosParaAtualizar = {
        nome_popular: dados.nome_popular.trim(),
        nome_cientifico: dados.nome_cientifico?.trim() || null,
        partes_usadas: dados.partes_usadas && dados.partes_usadas.length > 0 ? dados.partes_usadas : null,
        sabor_propriedade: dados.sabor_propriedade && dados.sabor_propriedade.length > 0 ? dados.sabor_propriedade : null,
        meridianos: dados.meridianos && dados.meridianos.length > 0 ? dados.meridianos : null,
        acao_terapeutica: dados.acao_terapeutica?.trim() || null,
        indicacoes: dados.indicacoes?.trim() || null,
        contraindicacoes: dados.contraindicacoes?.trim() || null,
        renisus: dados.renisus ?? false,
      }



      const { data, error } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .update(dadosParaAtualizar)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: data as PlantaMedicinal }
    } catch (error: any) {
      console.error('Erro ao editar planta medicinal:', error.message)
      return { success: false, error: error.message, data: null }
    }
  }

  /**
   * Deleta uma planta medicinal (soft delete)
   * @param id - ID da planta medicinal
   * @returns Promise com resultado da operação
   */
  const deletarPlanta = async (id: number) => {
    try {
      // Validação básica
      if (!id || id <= 0) {
        throw new Error('ID da planta é inválido')
      }

      // Verificar se a planta existe e não está deletada
      const { data: plantaExistente, error: errorVerificacao } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .select('id, nome_popular')
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (errorVerificacao) {
        throw new Error('Planta medicinal não encontrada ou já foi removida')
      }

      // Realizar soft delete (marcar como deletado)
      const { data, error } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .update({
          deleted_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { 
        success: true, 
        data: { 
          id, 
          nome_popular: plantaExistente.nome_popular 
        } 
      }
    } catch (error: any) {
      console.error('Erro ao deletar planta medicinal:', error.message)
      return { success: false, error: error.message, data: null }
    }
  }

  /**
   * Busca plantas medicinais por nome (popular ou científico)
   * @param termo - Termo de busca
   * @param limite - Limite de resultados (padrão: 10)
   * @returns Promise com lista de plantas encontradas
   */
  const buscarPlantasPorNome = async (termo: string, limite: number = 10) => {
    try {
      if (!termo || termo.trim().length < 2) {
        return { success: true, data: [] }
      }

      const termoLimpo = termo.trim().toLowerCase()

      // Buscar nos campos nome_popular e nome_cientifico usando ilike (insensitive to case)
      const { data, error } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .select(`
          id,
          nome_popular,
          nome_cientifico,
          partes_usadas,
          sabor_propriedade,
          meridianos,
          acao_terapeutica,
          indicacoes,
          contraindicacoes,
          renisus
        `)
        .is('deleted_at', null)
        .or(`nome_popular.ilike.%${termoLimpo}%,nome_cientifico.ilike.%${termoLimpo}%`)
        .order('nome_popular')
        .limit(limite)

      if (error) throw error

      return { success: true, data: data as PlantaMedicinal[] }
    } catch (error: any) {
      console.error('Erro ao buscar plantas por nome:', error.message)
      return { success: false, error: error.message, data: [] }
    }
  }

  /**
   * Busca uma planta medicinal específica por ID
   * @param id - ID da planta medicinal
   * @returns Promise com dados da planta
   */
  const buscarPlantaPorId = async (id: number) => {
    try {
      if (!id || id <= 0) {
        throw new Error('ID da planta é inválido')
      }

      const { data, error } = await (supabase as any)
        .from('afaas_plantas_medicinais')
        .select(`
          id,
          created_at,
          nome_popular,
          nome_cientifico,
          partes_usadas,
          sabor_propriedade,
          meridianos,
          acao_terapeutica,
          indicacoes,
          contraindicacoes,
          renisus
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (error) throw error

      return { success: true, data: data as PlantaMedicinal }
    } catch (error: any) {
      console.error('Erro ao buscar planta por ID:', error.message)
      return { success: false, error: error.message, data: null }
    }
  }

  return {
    buscarPlantas,
    buscarPlantasPorNome,
    buscarPlantaPorId,
    inserirPlanta,
    editarPlanta,
    deletarPlanta
  }
}
