/**
 * Composable centralizado para vue-toastification
 */
import { useToast } from 'vue-toastification'

export const useToastNotification = () => {
  try {
    return useToast()
  } catch (error) {
    console.warn('Erro ao inicializar toast:', error)
    return {
      success: (msg: string) => console.log('✅ Toast Success:', msg),
      error: (msg: string) => console.error('❌ Toast Error:', msg),
      warning: (msg: string) => console.warn('⚠️ Toast Warning:', msg),
      info: (msg: string) => console.info('ℹ️ Toast Info:', msg),
    }
  }
}

// Exporta POSITION da biblioteca
import { POSITION as ToastPosition } from 'vue-toastification'
export const POSITION = ToastPosition
