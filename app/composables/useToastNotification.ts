/**
 * Composable centralizado para notificações toast
 * Resolve problema de compatibilidade ESM/CommonJS com vue-toastification
 */
import pkg from 'vue-toastification'

// Extrai as funções do pacote CommonJS
const { useToast: useToastOriginal, POSITION } = pkg as any

export const useToastNotification = () => {
  return useToastOriginal()
}

export { POSITION }
