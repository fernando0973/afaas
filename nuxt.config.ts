// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },
  build: {
    transpile: ['vue-toastification']
  },
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
      ],
      exclude: ['cookie']
    },
    ssr: {
      noExternal: ['cookie']
    }
  }
})