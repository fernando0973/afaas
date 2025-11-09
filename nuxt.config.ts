// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
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
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/',
      include: undefined,
      exclude: ['/login', '/esqueci-senha', '/recuperar-senha']
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
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