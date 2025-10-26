import type { Especialidade } from '~/types/especialidade'
import type { Cliente } from '~/types/cliente'

export const useProfissionais = () => {
  const supabase = useSupabaseClient()

  const buscarEspecialidades = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('afaas_especialidades')
        .select('id, especialidade')
        .order('especialidade')

      if (error) throw error

      return { success: true, data: data as Especialidade[] }
    } catch (error: any) {
      console.error('Erro ao buscar especialidades:', error.message)
      return { success: false, error: error.message, data: [] }
    }
  }

  const buscarClientes = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('afaas_clientes')
        .select(`
          id,
          created_at,
          deleted_at,
          nome_completo,
          cpf,
          data_nascimento,
          altura,
          peso,
          tipo_sanguineo,
          sexo,
          naturalidade,
          estado_naturalidade,
          telefone,
          profissao,
          cep,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          pais,
          como_se_sente_em_casa,
          quantas_pessoas_moram_com_voce,
          aspecto_genetico_familiar,
          historico_doencas_familia,
          acompanhamento_medico,
          patologia,
          tratamento_utilizado,
          usa_protese,
          tipo_protese,
          fez_transplante,
          tipo_transplante,
          ferimentos_graves,
          medicamentos_em_uso,
          procedimentos_cirurgicos,
          uso_substancias_quimicas,
          historico_doencas_passadas,
          outras_condicoes,
          dorme_bem
        `)
        .is('deleted_at', null) // Filtrar registros não deletados
        .order('nome_completo')

      if (error) throw error

      return { success: true, data: data as Cliente[] }
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error.message)
      return { success: false, error: error.message, data: [] }
    }
  }

  const inserirEspecialidade = async (_especialidade: string) => {
    try {
      const { data, error } = await (supabase as any).rpc('afaas_add_especialidade', {
        _especialidade
      })

      if (error) {
        console.error('Erro ao inserir especialidade:', error)
        return { success: false, message: error.message || 'Erro ao inserir especialidade' }
      }

      // Expecting backend to return { success: boolean, message: string }
      return { success: data?.success ?? true, message: data?.message ?? 'Operação concluída', raw: data }
    } catch (err: any) {
      console.error('Erro no RPC inserirEspecialidade:', err)
      return { success: false, message: err.message || 'Erro interno' }
    }
  }

  const editarEspecialidade = async (p_especialidade: string, p_id: number) => {
    try {
      const { data, error } = await (supabase as any).rpc('afaas_update_especialidade', {
        p_especialidade,
        p_id
      })

      if (error) {
        console.error('Erro ao editar especialidade:', error)
        return { success: false, message: error.message || 'Erro ao editar especialidade' }
      }

      // Expecting backend to return { success: boolean, message: string }
      return { success: data?.success ?? true, message: data?.message ?? 'Operação concluída', raw: data }
    } catch (err: any) {
      console.error('Erro no RPC editarEspecialidade:', err)
      return { success: false, message: err.message || 'Erro interno' }
    }
  }

  const removerEspecialidade = async (id: number) => {
    try {
      const { error } = await (supabase as any)
        .from('afaas_especialidades')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao remover especialidade:', error)
        return { success: false, message: error.message || 'Erro ao remover especialidade' }
      }

      return { success: true, message: 'Especialidade removida com sucesso' }
    } catch (err: any) {
      console.error('Erro ao remover especialidade:', err)
      return { success: false, message: err.message || 'Erro interno' }
    }
  }

  const inserirCliente = async (clienteData: Omit<Cliente, 'id' | 'created_at' | 'deleted_at'>) => {
    try {
      // Garante que o campo email está presente
      const { data, error } = await (supabase as any)
        .from('afaas_clientes')
        .insert(clienteData)
        .select()
        .single()

      if (error) {
        console.error('Erro ao inserir cliente:', error)
        return { success: false, message: error.message || 'Erro ao inserir cliente', data: null }
      }

      return { success: true, message: 'Cliente inserido com sucesso', data: data as Cliente }
    } catch (err: any) {
      console.error('Erro ao inserir cliente:', err)
      return { success: false, message: err.message || 'Erro interno', data: null }
    }
  }

  const editarCliente = async (id: number, clienteData: Partial<Omit<Cliente, 'id' | 'created_at' | 'deleted_at'>>) => {
    try {
      // Garante que o campo email está presente
      const { data, error } = await (supabase as any)
        .from('afaas_clientes')
        .update(clienteData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao editar cliente:', error)
        return { success: false, message: error.message || 'Erro ao editar cliente', data: null }
      }

      return { success: true, message: 'Cliente editado com sucesso', data: data as Cliente }
    } catch (err: any) {
      console.error('Erro ao editar cliente:', err)
      return { success: false, message: err.message || 'Erro interno', data: null }
    }
  }

  const removerCliente = async (id: number) => {
    try {
      // Soft delete - marca como deletado
      const { error } = await (supabase as any)
        .from('afaas_clientes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Erro ao remover cliente:', error)
        return { success: false, message: error.message || 'Erro ao remover cliente' }
      }

      return { success: true, message: 'Cliente removido com sucesso' }
    } catch (err: any) {
      console.error('Erro ao remover cliente:', err)
      return { success: false, message: err.message || 'Erro interno' }
    }
  }

  return {
    buscarEspecialidades,
    buscarClientes,
    inserirEspecialidade,
    editarEspecialidade,
    removerEspecialidade,
    inserirCliente,
    editarCliente,
    removerCliente
  }
}