export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  
  // Evita loops infinitos - verifica se já está tentando navegar para o mesmo lugar
  if (from && to.path === from.path) {
    return
  }
  
  // Se não há usuário logado e não está tentando acessar a página de login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  // Se há usuário logado e está tentando acessar a página de login
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})