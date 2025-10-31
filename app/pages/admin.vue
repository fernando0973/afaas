<template>
  <div v-if="!isLoading && isAdmin" class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Administração</h1>
        <p class="text-neutral-600">Painel de controle administrativo do sistema</p>
      </div>

      <!-- Grid de Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card 1: Usuários -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 ml-3">Usuários</h3>
          </div>
          <p class="text-neutral-600 text-sm mb-4">Gerenciar usuários do sistema</p>
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Gerenciar
          </button>
        </div>

        <!-- Card 2: Logs -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 ml-3">Logs</h3>
          </div>
          <p class="text-neutral-600 text-sm mb-4">Visualizar logs do sistema</p>
          <button class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Ver Logs
          </button>
        </div>

        <!-- Card 3: Configurações -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Cog6ToothIcon class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 ml-3">Sistema</h3>
          </div>
          <p class="text-neutral-600 text-sm mb-4">Configurações do sistema</p>
          <button class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Configurar
          </button>
        </div>

        <!-- Card 4: Backup -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <ServerIcon class="w-6 h-6 text-orange-600" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 ml-3">Backup</h3>
          </div>
          <p class="text-neutral-600 text-sm mb-4">Gerenciar backups</p>
          <button class="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
            Gerenciar
          </button>
        </div>

        <!-- Card 5: Estatísticas -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon class="w-6 h-6 text-indigo-600" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 ml-3">Estatísticas</h3>
          </div>
          <p class="text-neutral-600 text-sm mb-4">Relatórios administrativos</p>
          <button class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Ver Relatórios
          </button>
        </div>

        <!-- Card 6: Manutenção -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <WrenchScrewdriverIcon class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 ml-3">Manutenção</h3>
          </div>
          <p class="text-neutral-600 text-sm mb-4">Ferramentas de manutenção</p>
          <button class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Acessar
          </button>
        </div>
      </div>

      <!-- Seção de Usuários do Sistema -->
      <div class="mt-8">
        <TabelaAdmin />
      </div>

      <!-- Seção de Status do Sistema -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-neutral-900 mb-4">Status do Sistema</h2>
        <div class="bg-white rounded-lg border border-neutral-200 p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Status 1: Servidor -->
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p class="font-medium text-neutral-900">Servidor</p>
                <p class="text-sm text-neutral-600">Online</p>
              </div>
            </div>

            <!-- Status 2: Banco de Dados -->
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p class="font-medium text-neutral-900">Banco de Dados</p>
                <p class="text-sm text-neutral-600">Conectado</p>
              </div>
            </div>

            <!-- Status 3: Cache -->
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p class="font-medium text-neutral-900">Cache</p>
                <p class="text-sm text-neutral-600">Limpeza necessária</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ServerIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

// Definir meta da página
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'admin']
})

// Estados da página
const isLoading = ref(false) // Não mostrar loading
const isAdmin = ref(false)

// Composables
const { checkIsAdmin } = useAuth()

// Verificar se é admin ao montar o componente
onMounted(async () => {
  try {
    const result = await checkIsAdmin(false) // Sem cache para verificação em tempo real
    
    if (!result.success || !result.isAdmin) {
      // Se não for admin, redireciona imediatamente sem mostrar nada
      await navigateTo('/')
      return
    }
    
    // Se chegou aqui, é admin
    isAdmin.value = true
  } catch (error) {
    console.error('Erro ao verificar permissão de admin:', error)
    // Em caso de erro, redireciona imediatamente
    await navigateTo('/')
    return
  }
})

// Definir título da página
useHead({
  title: 'Administração - AFAAS'
})
</script>