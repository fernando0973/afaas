export default defineNuxtRouteMiddleware(async (to, from) => {
  // Verificação de autenticação primeiro
  const user = useSupabaseUser()
  
  // Se não há usuário autenticado, redireciona imediatamente
  if (!user.value) {
    return navigateTo('/login')
  }

  // No servidor, permitimos a navegação e deixamos a verificação para o componente
  if (process.server) {
    return
  }

  // No cliente, fazemos uma verificação rápida se possível
  // Mas a verificação principal será feita no componente da página
})