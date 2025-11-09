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
  
  
  // Primeiro, verificar se usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return navigateTo('/login', { replace: true })
  }
  
  
  // Verifica permissão de admin usando a função RPC
  const { data, error } = await supabase.rpc('afaas_isadmin')


  if (error) {
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
    isAdmin = false
  }

  if (!isAdmin) {
    return navigateTo('/', { replace: true })
  }

  // Usuário é admin, permite navegação
  return
})