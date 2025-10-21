export default defineNuxtRouteMiddleware(async (to) => {
  const { checkSession } = useAuth()
  
  // Verifica se a sessão é válida
  const isValidSession = await checkSession()
  
  if (!isValidSession) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Acesso não autorizado. Por favor, faça login novamente.'
    })
  }
})