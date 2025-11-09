/**
 * Composable centralizado para vue-toastification
 */
import { useToast } from 'vue-toastification'

export const useToastNotification = () => {
  try {
    return useToast()
  } catch (error) {
    return {
    }
  }
}

// Exporta POSITION da biblioteca
import { POSITION as ToastPosition } from 'vue-toastification'
export const POSITION = ToastPosition
