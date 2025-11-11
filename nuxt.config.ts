import { execSync } from 'node:child_process'

const safeGit = (command: string): string => {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return ''
  }
}

const envCommitHash = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NUXT_BUILD_COMMIT_SHA || ''
const commitHash = envCommitHash || safeGit('git rev-parse HEAD')
const commitShort = envCommitHash ? envCommitHash.slice(0, 7) : safeGit('git rev-parse --short HEAD')
const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || process.env.NUXT_BUILD_COMMIT_MESSAGE || safeGit('git log -1 --format=%s')
const commitAuthor = process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || process.env.NUXT_BUILD_COMMIT_AUTHOR || safeGit('git log -1 --format=%an')
const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.NUXT_BUILD_BRANCH || safeGit('git rev-parse --abbrev-ref HEAD')
const commitDateFromEnv = process.env.NUXT_BUILD_COMMIT_DATE || ''
const commitDate = commitDateFromEnv || safeGit('git log -1 --format=%cI')
const buildTimestamp = process.env.NUXT_BUILD_TIMESTAMP || new Date().toISOString()

const buildInfo = {
  commitHash: commitHash || 'indisponível',
  commitShort: commitShort || (commitHash ? commitHash.slice(0, 7) : 'indisponível'),
  commitDate: commitDate || buildTimestamp,
  commitMessage: commitMessage || 'Não foi possível obter mensagem do commit',
  commitAuthor: commitAuthor || 'Indisponível',
  branch: branch || 'indisponível',
  buildTimestamp
}

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
  runtimeConfig: {
    buildInfo,
    public: {
      // Expor apenas o hash curto no client para possibilitar verificações rápidas sem revelar metadados adicionais
      buildInfoPublic: {
        commitShort: buildInfo.commitShort,
        buildTimestamp: buildInfo.buildTimestamp
      }
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
    esbuild: {
      target: 'node14'
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        '@supabase/supabase-js',
        'vue-toastification',
        '@tabler/icons-vue'
      ],
      exclude: ['cookie'],
      force: true
    },
    ssr: {
      noExternal: ['cookie']
    }
  }
})