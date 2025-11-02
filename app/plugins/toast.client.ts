import pkg from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const Toast = (pkg as any).default || pkg
const POSITION = (pkg as any).POSITION

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
    transition: 'Vue-Toastification__fade',
    maxToasts: 5,
    newestOnTop: true
  }

  nuxtApp.vueApp.use(Toast, options)
})
