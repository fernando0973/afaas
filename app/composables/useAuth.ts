export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const adminCheckCache = ref<{ isAdmin: boolean; timestamp: number } | null>(null)
  const CACHE_DURATION = 5 * 60 * 1000

  const isValidUser = (user: any) => {
    return user && user.id && user.email
  }

  const isAuthenticated = computed(() => {
    return !!user.value && isValidUser(user.value)
  })

  const login = async (email: string, password: string) => {
    try {
      // Debug: Verificar se o Supabase está inicializado
      if (!supabase) {
        return { success: false, error: 'Cliente Supabase não inicializado' }
      }

      // Debug: Verificar se temos uma URL válida
      const config = useRuntimeConfig()
      if (!config.public?.supabase?.url) {
        return { success: false, error: 'URL do Supabase não configurada' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        // Melhorar as mensagens de erro
        let userFriendlyMessage = 'Erro ao fazer login'
        
        switch (error.message) {
          case 'Invalid login credentials':
            userFriendlyMessage = 'E-mail ou senha incorretos'
            break
          case 'Email not confirmed':
            userFriendlyMessage = 'E-mail não confirmado. Verifique sua caixa de entrada.'
            break
          case 'Too many requests':
            userFriendlyMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
            break
          default:
            userFriendlyMessage = error.message
        }
        
        return { success: false, error: userFriendlyMessage }
      }

      if (!data.session || !data.user) {
        return { success: false, error: 'Dados de sessão inválidos' }
      }

      return { success: true, user: data.user, session: data.session }
    } catch (error: any) {
      // Debug mais detalhado para errors de conexão
      if (error.message.includes('fetch')) {
        return { success: false, error: 'Erro de conexão com o servidor. Verifique sua internet.' }
      }
      
      return { success: false, error: error.message || 'Erro inesperado durante o login' }
    }
  }

  const logout = async () => {
    try {
      adminCheckCache.value = null
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      
      // Redirecionar para login após logout
      await navigateTo('/login', { replace: true })
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const isAdmin = async () => {
    try {
      if (!user.value) {
        return false
      }


      if (adminCheckCache.value && 
          (Date.now() - adminCheckCache.value.timestamp) < CACHE_DURATION) {
        return adminCheckCache.value.isAdmin
      }

      // Usar a função RPC do Supabase
      const { data, error } = await supabase.rpc('afaas_isadmin')

      if (error) {
        return false
      }


      // Normalizar diferentes formatos de retorno possíveis da RPC
      let isAdminResult = false

      try {
        // Caso simples: booleano direto
        if (data === true || (typeof data === 'string' && (data === 'true' || data === 't'))) {
          isAdminResult = true
        }

        // Caso objeto com propriedade "isadmin": {"isadmin": true/false}
        else if (typeof data === 'object' && data !== null && data && typeof (data as any).isadmin !== 'undefined') {
          const adminValue = (data as any).isadmin
          isAdminResult = Boolean(adminValue)
        }

        // Caso array retornado pelo supabase (ex.: [{ afaasisadmin: true }])
        else if (Array.isArray(data) && (data as any[]).length > 0) {
          const first = (data as any[])[0]
          if (typeof first === 'boolean') {
            isAdminResult = first
          } else if (typeof first === 'object' && first !== null) {
            const firstVal = Object.values(first)[0]
            isAdminResult = firstVal === true || (typeof firstVal === 'string' && (firstVal === 'true' || firstVal === 't'))
          }
        }

        // Caso objeto genérico: { afaasisadmin: true } ou { is_admin: true }
        else if (typeof data === 'object' && data !== null) {
          const vals = Object.values(data)
          if (vals.length > 0) {
            const firstVal = vals[0]
            isAdminResult = firstVal === true || (typeof firstVal === 'string' && (firstVal === 'true' || firstVal === 't'))
          }
        }
      } catch (parseErr) {
        isAdminResult = false
      }

      adminCheckCache.value = {
        isAdmin: isAdminResult,
        timestamp: Date.now()
      }


      return isAdminResult
    } catch (error) {
      return false
    }
  }

  const atualizarInfosUsuario = async (novoNome: string) => {
    try {
      
      // Usar a RPC customizada para atualizar informações do usuário
      // @ts-ignore - RPC afaas_update_infos_user definida no banco de dados
      const { data, error } = await supabase.rpc('afaas_update_infos_user', {
        p_nome: novoNome
      })
      
      if (error) {
        return { success: false, error: error.message, message: error.message }
      }
      
      
      // A RPC retorna {success: bool, message: mensagem informativa}
      if (data && typeof data === 'object' && 'success' in data) {
        const result = data as { success: boolean; message: string }
        if (result.success) {
          return { 
            success: true, 
            message: result.message || 'Nome atualizado com sucesso!' 
          }
        } else {
          return { 
            success: false, 
            error: result.message || 'Erro desconhecido ao atualizar nome',
            message: result.message || 'Erro desconhecido ao atualizar nome'
          }
        }
      } else {
        return { 
          success: false, 
          error: 'Resposta inválida da função de atualização',
          message: 'Resposta inválida da função de atualização'
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message, message: error.message }
    }
  }

  // Função auxiliar para verificar admin com opções
  const checkIsAdmin = async (useCache = true) => {
    try {
      if (!user.value) {
        return { success: false, isAdmin: false, error: 'Usuário não autenticado' }
      }


      // Se não usar cache, limpar cache e fazer nova consulta
      if (!useCache) {
        adminCheckCache.value = null
      }

      const isAdminResult = await isAdmin()
      return { success: true, isAdmin: isAdminResult }
    } catch (error: any) {
      return { success: false, isAdmin: false, error: error.message }
    }
  }

  const alterarSenha = async (novaSenha: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: novaSenha
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, user: data.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const recuperarSenha = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recuperar-senha`
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const redefinirSenha = async (novaSenha: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: novaSenha
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, user: data.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const deletarUsuario = async (userId: string) => {
    try {
      
      // Fazer requisição para a API de deleção
      const response = await $fetch('/api/usuarios', {
        method: 'DELETE',
        body: {
          user_id: userId
        }
      })
      
      
      return {
        success: true,
        message: response.message || 'Usuário deletado com sucesso'
      }
    } catch (error: any) {
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro inesperado ao deletar usuário'
      
      if (error.data?.message) {
        errorMessage = error.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      }
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    isAdmin,
    checkIsAdmin,
    atualizarInfosUsuario,
    alterarSenha,
    recuperarSenha,
    redefinirSenha,
    deletarUsuario
  }
}
