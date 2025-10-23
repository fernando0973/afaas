import type { Especialidade } from '~/types/especialidade'

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

  return {
    buscarEspecialidades,
    inserirEspecialidade,
    editarEspecialidade,
    removerEspecialidade
  }
}