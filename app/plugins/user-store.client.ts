/**
 * Plugin client-side para gerenciar dados do usuário
 */
export default defineNuxtPlugin(() => {
  if (process.server) return

  // Função global para buscar dados do usuário
  const refreshUserProfile = async () => {
    try {
      const userStore = useUserStore()
      await userStore.fetchProfile()
    } catch (err) {
      console.warn('Erro ao buscar perfil:', err)
    }
  }

  // Disponibiliza a função globalmente
  return {
    provide: {
      refreshUserProfile
    }
  }
})