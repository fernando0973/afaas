export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  
  // Páginas que não precisam de autenticação
  const publicPages = ['/login', '/esqueci-senha', '/recuperar-senha']
  
  // Se estiver em uma página pública, permite o acesso
  if (publicPages.includes(to.path)) {
    return
  }
  
  // Se não estiver autenticado e tentar acessar página protegida
  if (!user.value) {
    // Aguarda um pouco para ver se o usuário está sendo carregado
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Verifica novamente
    if (!user.value) {
      return navigateTo('/login')
    }
  }
})