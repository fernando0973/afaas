/**
 * Composable centralizado para vue-toastification
 */
import { useToast } from 'vue-toastification'

export const useToastNotification = () => {
  try {
    return useToast()
  } catch (error) {
    // Fallback que implementa a mesma interface
    return {
      success: (message: string) => console.log('[Toast Success]:', message),
      error: (message: string) => console.error('[Toast Error]:', message),
      warning: (message: string) => console.warn('[Toast Warning]:', message),
      info: (message: string) => console.info('[Toast Info]:', message),
      clear: () => console.log('[Toast] Clear called'),
      dismiss: () => console.log('[Toast] Dismiss called')
    }
  }
}

// Exporta POSITION da biblioteca
import { POSITION as ToastPosition } from 'vue-toastification'
export const POSITION = ToastPosition
