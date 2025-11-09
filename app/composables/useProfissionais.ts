import type { Especialidade } from '~/types/especialidade'
import type { Cliente } from '~/types/cliente'
import type { ProfissionalRPC } from '~/types/user'
import type { PerfilRPC } from '~/types/database.types'

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
      return { success: false, error: error.message, data: [] }
    }
  }

  const inserirEspecialidade = async (_especialidade: string) => {
    try {
      const { data, error } = await (supabase as any).rpc('afaas_add_especialidade', {
        _especialidade
      })

      if (error) {
        return { success: false, message: error.message || 'Erro ao inserir especialidade' }
      }

      // Expecting backend to return { success: boolean, message: string }
      return { success: data?.success ?? true, message: data?.message ?? 'Operação concluída', raw: data }
    } catch (err: any) {
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
        return { success: false, message: error.message || 'Erro ao editar especialidade' }
      }

      // Expecting backend to return { success: boolean, message: string }
      return { success: data?.success ?? true, message: data?.message ?? 'Operação concluída', raw: data }
    } catch (err: any) {
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
        return { success: false, message: error.message || 'Erro ao remover especialidade' }
      }

      return { success: true, message: 'Especialidade removida com sucesso' }
    } catch (err: any) {
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
        return { success: false, message: error.message || 'Erro ao inserir cliente', data: null }
      }

      return { success: true, message: 'Cliente inserido com sucesso', data: data as Cliente }
    } catch (err: any) {
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
        return { success: false, message: error.message || 'Erro ao editar cliente', data: null }
      }

      return { success: true, message: 'Cliente editado com sucesso', data: data as Cliente }
    } catch (err: any) {
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
        return { success: false, message: error.message || 'Erro ao remover cliente' }
      }

      return { success: true, message: 'Cliente removido com sucesso' }
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro interno' }
    }
  }

  const buscarProfissionais = async () => {
    try {
      const { data, error } = await (supabase as any)
        .rpc('afaas_get_profissionais')

      if (error) {
        return { success: false, error: error.message || 'Erro ao buscar profissionais', data: [] as ProfissionalRPC[] }
      }

      return { success: true, data: (data || []) as ProfissionalRPC[] }
    } catch (error: any) {
      return { success: false, error: error.message, data: [] as ProfissionalRPC[] }
    }
  }

  const buscarPerfis = async () => {
    try {
      const { data, error } = await (supabase as any)
        .rpc('afaas_get_profiles_if_admin')

      if (error) {
        return { success: false, error: error.message || 'Erro ao buscar perfis', data: [] as PerfilRPC[] }
      }

      return { success: true, data: (data || []) as PerfilRPC[] }
    } catch (error: any) {
      return { success: false, error: error.message, data: [] as PerfilRPC[] }
    }
  }

  const inserirProfissional = async (profile_id: number, especialidade_id: number) => {
    try {
      const { data, error } = await (supabase as any)
        .from('afaas_profissionais')
        .insert({
          profile_id,
          especialidade_id
        })
        .select()
        .single()

      if (error) {
        return { success: false, message: error.message || 'Erro ao inserir profissional', data: null }
      }

      return { success: true, message: 'Profissional adicionado com sucesso', data }
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro interno', data: null }
    }
  }

  const editarProfissional = async (id: number, perfil_id: number, especialidade_id: number) => {
    try {
      const { data, error } = await (supabase as any)
        .from('afaas_profissionais')
        .update({
          perfil_id,
          especialidade_id
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { success: false, message: error.message || 'Erro ao editar profissional', data: null }
      }

      return { success: true, message: 'Profissional atualizado com sucesso', data }
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro interno', data: null }
    }
  }

  const removerProfissional = async (id: number) => {
    try {
      const { error } = await (supabase as any)
        .from('afaas_profissionais')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, message: error.message || 'Erro ao remover profissional' }
      }

      return { success: true, message: 'Profissional removido com sucesso' }
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro interno' }
    }
  }

  return {
    buscarEspecialidades,
    buscarClientes,
    buscarProfissionais,
    buscarPerfis,
    inserirEspecialidade,
    editarEspecialidade,
    removerEspecialidade,
    inserirCliente,
    editarCliente,
    removerCliente,
    inserirProfissional,
    editarProfissional,
    removerProfissional
  }
}