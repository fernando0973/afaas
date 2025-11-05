/**
 * Middleware de verificação de permissão administrativa
 * 
 * IMPORTANTE: Este middleware deve ser usado sempre em conjunto com 'auth'
 * Exemplo: middleware: ['auth', 'admin']
 * 
 * Responsável por:
 * - Verificar se usuário tem permissão de administrador
 * - Bloquear acesso a páginas administrativas para usuários comuns
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient<any>()
  
  // Verifica permissão de admin no banco de dados
  const { data: isAdmin, error } = await supabase
    .rpc('afaas_isadmin')
    .single()
  
  // Se não é admin ou houve erro, redireciona para home
  if (error || !isAdmin) {
    console.log('[admin] Acesso negado - usuário não é administrador')
    return navigateTo('/', { replace: true })
  }
  
  // Usuário é admin, permite navegação
  return
})