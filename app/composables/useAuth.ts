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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.session || !data.user) {
        return { success: false, error: 'Dados de sessão inválidos' }
      }

      return { success: true, user: data.user, session: data.session }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      console.log('🚪 [useAuth] Iniciando logout...')
      adminCheckCache.value = null
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ [useAuth] Erro no logout:', error.message)
        return { success: false, error: error.message }
      }

      console.log('✅ [useAuth] Logout realizado com sucesso')
      
      // Redirecionar para login após logout
      await navigateTo('/login', { replace: true })
      
      return { success: true }
    } catch (error: any) {
      console.error('❌ [useAuth] Falha no logout:', error.message)
      return { success: false, error: error.message }
    }
  }

  const isAdmin = async () => {
    try {
      if (!user.value) {
        console.log('🚫 [useAuth] isAdmin: Usuário não está logado')
        return false
      }

      console.log('🔍 [useAuth] Verificando admin para usuário:', user.value.id)

      if (adminCheckCache.value && 
          (Date.now() - adminCheckCache.value.timestamp) < CACHE_DURATION) {
        console.log('📦 [useAuth] isAdmin: Usando cache:', adminCheckCache.value.isAdmin)
        return adminCheckCache.value.isAdmin
      }

      // Usar a função RPC do Supabase
      console.log('🔄 [useAuth] Chamando RPC afaas_isadmin...')
      const { data, error } = await supabase.rpc('afaas_isadmin')

      if (error) {
        console.error('❌ [useAuth] Erro ao verificar permissão admin:', error.message)
        return false
      }

      console.log('📊 [useAuth] Resultado bruto da RPC afaas_isadmin:', data)

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
          console.log('📊 [useAuth] Formato {"isadmin": X} detectado:', adminValue)
        }

        // Caso array retornado pelo supabase (ex.: [{ afaasisadmin: true }])
        else if (Array.isArray(data) && data.length > 0) {
          const first = data[0]
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
        console.error('❌ [useAuth] Erro ao normalizar resultado da RPC afaas_isadmin:', parseErr)
        isAdminResult = false
      }

      adminCheckCache.value = {
        isAdmin: isAdminResult,
        timestamp: Date.now()
      }

      console.log('✅ [useAuth] Resultado final isAdmin (normalizado):', isAdminResult)

      return isAdminResult
    } catch (error) {
      console.error('❌ [useAuth] Erro na verificação de admin:', error)
      return false
    }
  }

  const atualizarInfosUsuario = async (novoNome: string) => {
    try {
      console.log('🔄 [useAuth] Iniciando atualização do nome:', novoNome)
      
      // Usar a RPC customizada para atualizar informações do usuário
      const { data, error } = await supabase.rpc('afaas_update_infos_user', {
        p_nome: novoNome
      })
      
      if (error) {
        console.error('❌ [useAuth] Erro na RPC afaas_update_infos_user:', error)
        return { success: false, error: error.message, message: error.message }
      }
      
      console.log('✅ [useAuth] Resultado da RPC:', data)
      
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
      console.error('❌ [useAuth] Erro inesperado ao atualizar nome:', error)
      return { success: false, error: error.message, message: error.message }
    }
  }

  // Função auxiliar para verificar admin com opções
  const checkIsAdmin = async (useCache = true) => {
    try {
      if (!user.value) {
        console.log('🚫 [useAuth] checkIsAdmin: Usuário não autenticado')
        return { success: false, isAdmin: false, error: 'Usuário não autenticado' }
      }

      console.log('🔍 [useAuth] checkIsAdmin chamada com useCache:', useCache)

      // Se não usar cache, limpar cache e fazer nova consulta
      if (!useCache) {
        console.log('🧹 [useAuth] Limpando cache de admin...')
        adminCheckCache.value = null
      }

      const isAdminResult = await isAdmin()
      console.log('📊 [useAuth] checkIsAdmin resultado:', isAdminResult)
      return { success: true, isAdmin: isAdminResult }
    } catch (error: any) {
      console.error('❌ [useAuth] Erro em checkIsAdmin:', error)
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
    redefinirSenha
  }
}
