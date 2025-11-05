/**
 * Middleware de autenticação principal
 * 
 * Responsável por:
 * - Verificar se há sessão válida do Supabase
 * - Proteger rotas que necessitam autenticação
 * - Prevenir loops de redirecionamento
 * - Gerenciar acesso a páginas públicas
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient()
  
  // Páginas que não precisam de autenticação
  const publicPages = ['/login', '/esqueci-senha', '/recuperar-senha']
  const isPublicPage = publicPages.includes(to.path)
  
  // Verifica sessão no Supabase
  const { data: { session } } = await supabase.auth.getSession()
  const hasValidSession = !!session
  
  // Caso 1: Usuário não autenticado tentando acessar página protegida
  if (!hasValidSession && !isPublicPage) {
    console.log('[auth] Redirecionando para /login - sessão inválida')
    return navigateTo('/login', { replace: true })
  }
  
  // Caso 2: Usuário autenticado tentando acessar página de login
  if (hasValidSession && to.path === '/login') {
    console.log('[auth] Redirecionando para / - usuário já autenticado')
    return navigateTo('/', { replace: true })
  }
  
  // Caso 3: Permitir navegação
  return
})