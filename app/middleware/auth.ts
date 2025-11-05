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
  // Páginas que não precisam de autenticação
  const publicPages = ['/login', '/esqueci-senha', '/recuperar-senha']
  const isPublicPage = publicPages.includes(to.path)
  
  const ambiente = process.server ? '[SERVER]' : '[CLIENT]'
  console.log(`${ambiente} [auth.middleware] Verificando rota:`, to.path, '| Pública:', isPublicPage, '| From:', from.path)
  
  // Se é página pública, permitir acesso
  if (isPublicPage) {
    console.log(`${ambiente} [auth.middleware] ✅ Página pública - permitindo acesso`)
    return
  }
  
  // Verificar sessão no Supabase
  const supabase = useSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  const hasValidSession = !!session
  
  console.log(`${ambiente} [auth.middleware] Sessão válida:`, hasValidSession, '| User:', session?.user?.email || 'nenhum')
  
  if (error) {
    console.error(`${ambiente} [auth.middleware] Erro ao verificar sessão:`, error)
  }
  
  // Se não tem sessão válida e não é página pública, redirecionar para login
  if (!hasValidSession) {
    console.log(`${ambiente} [auth.middleware] ❌ Sem sessão - redirecionando para /login`)
    return navigateTo('/login', { replace: true })
  }
  
  // Tem sessão válida, permitir navegação
  console.log(`${ambiente} [auth.middleware] ✅ Sessão válida - permitindo navegação`)
  return
})