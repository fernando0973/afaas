export default defineNuxtRouteMiddleware((to) => {
  // No servidor, permitir acesso para evitar problemas de hidratação
  if (process.server) return
  
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