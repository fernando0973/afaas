export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  
  // Se não há usuário logado e não está tentando acessar a página de login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  // Se há usuário logado e está tentando acessar a página de login
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})