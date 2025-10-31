export default defineNuxtRouteMiddleware((to) => {
  // Middleware específico para páginas de recuperação de senha
  // Previne redirecionamentos automáticos do Supabase
  
  if (to.path === '/recuperar-senha') {
    // Não fazer nenhum redirecionamento automático
    // Deixar a página gerenciar os estados internamente
    return
  }
})