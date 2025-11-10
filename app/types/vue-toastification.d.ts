declare module 'vue-toastification' {
  import { Plugin } from 'vue'
  
  export enum POSITION {
    TOP_LEFT = 'top-left',
    TOP_CENTER = 'top-center',
    TOP_RIGHT = 'top-right',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_RIGHT = 'bottom-right'
  }
  
  export interface PluginOptions {
    position?: POSITION | string
    timeout?: number
    closeOnClick?: boolean
    pauseOnFocusLoss?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    draggablePercent?: number
    showCloseButtonOnHover?: boolean
    hideProgressBar?: boolean
    closeButton?: string | boolean
    icon?: boolean
    rtl?: boolean
    transition?: string
    maxToasts?: number
    newestOnTop?: boolean
  }
  
  export interface ToastInterface {
    success: (message: string, options?: any) => any
    error: (message: string, options?: any) => any
    warning: (message: string, options?: any) => any
    info: (message: string, options?: any) => any
    clear: () => void
    dismiss: (id: any) => void
  }
  
  export const useToast: () => ToastInterface
  
  const VueToastificationPlugin: Plugin
  export default VueToastificationPlugin
}