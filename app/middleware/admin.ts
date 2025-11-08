/**
 * Middleware de verificação de permissão administrativa
 * 
 * Responsável por:
 * - Verificar autenticação através do Supabase
 * - Verificar se usuário tem permissão de administrador
 * - Bloquear acesso a páginas administrativas para usuários comuns ou não autenticados
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient<any>()
  
  console.log('🔍 [admin middleware] Iniciando verificação...')
  
  // Primeiro, verificar se usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    console.log('🚫 [admin middleware] Usuário não autenticado - redirecionando para login')
    return navigateTo('/login', { replace: true })
  }
  
  console.log('👤 [admin middleware] Usuário logado:', session.user.email)
  
  // Verifica permissão de admin usando a função RPC
  console.log('🔄 [admin middleware] Chamando RPC afaas_isadmin...')
  const { data, error } = await supabase.rpc('afaas_isadmin')

  console.log('📊 [admin middleware] Resultado RPC:', { data, error })

  if (error) {
    console.log('❌ [admin middleware] Erro ao chamar RPC afaas_isadmin:', error.message || error)
    return navigateTo('/', { replace: true })
  }

  // Normalizar possíveis formatos de retorno da RPC para boolean
  let isAdmin = false
  try {
    if (data === true || data === 'true' || data === 't') {
      isAdmin = true
    } else if (Array.isArray(data) && data.length > 0) {
      const first = data[0]
      if (typeof first === 'boolean') {
        isAdmin = first
      } else if (typeof first === 'object' && first !== null) {
        const v = Object.values(first)[0]
        isAdmin = v === true || v === 'true' || v === 't'
      }
    } else if (typeof data === 'object' && data !== null) {
      const vals = Object.values(data)
      if (vals.length > 0) {
        const v = vals[0]
        isAdmin = v === true || v === 'true' || v === 't'
      }
    }
  } catch (err) {
    console.error('❌ [admin middleware] Erro ao normalizar retorno da RPC:', err)
    isAdmin = false
  }

  if (!isAdmin) {
    console.log('❌ [admin middleware] Acesso negado - usuário não é administrador')
    console.log('🔄 [admin middleware] Redirecionando para home...')
    return navigateTo('/', { replace: true })
  }

  // Usuário é admin, permite navegação
  console.log('✅ [admin middleware] Usuário é administrador - permitindo acesso')
  return
})