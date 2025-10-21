// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  srcDir: 'app',
  components: [{ path: '~/components', pathPrefix: false }],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/',
      exclude: ['/login']
    }
  }
})