export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  
  // Páginas que não precisam de autenticação
  const publicPages = ['/login', '/esqueci-senha', '/recuperar-senha']
  
  // Evita loops infinitos - verifica se já está tentando navegar para o mesmo lugar
  if (from && to.path === from.path) {
    return
  }
  
  // Se não há usuário logado e não está tentando acessar uma página pública
  if (!user.value && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }
  
  // Se há usuário logado e está tentando acessar a página de login
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})