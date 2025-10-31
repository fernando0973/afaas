// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  nitro: {
    devServer: {
      watch: ['app/**/*']
    }
  },
  srcDir: 'app',
  components: [{ path: '~/components', pathPrefix: false }],
  supabase: {
    redirect: false
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.includes('-')
    }
  },
  vite: {
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('-')
        }
      }
    },
    server: {
      hmr: {
        port: 24678,
        timeout: 30000
      },
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/.git/**']
      }
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@supabase/supabase-js',
        'vue-toastification',
        '@heroicons/vue/24/outline'
      ]
    }
  }
})