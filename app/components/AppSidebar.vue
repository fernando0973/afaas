<template>
  <aside :class="['h-full bg-white border-r border-neutral-200 flex flex-col transition-all duration-300', isCollapsed ? 'w-20' : 'w-64']">
    <!-- Cabeçalho -->
    <header class="p-4 border-b border-neutral-200 h-20 flex items-center">
      <div v-if="!isCollapsed" class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-3">
          <img 
            src="~/assets/images/AFAAS_Logo_2.svg" 
            alt="AFAAS - Associação Filantrópica de Apoio Alternativo à Saúde" 
            class="h-12 w-auto flex-shrink-0"
          />
          <div>
            <h1 class="text-lg font-semibold text-neutral-900">AFAAS</h1>
            <p class="text-sm text-neutral-500">Sistema de Atendimento</p>
          </div>
        </div>
        
        <!-- Botão de toggle quando expandido -->
        <ClientOnly>
          <button 
            @click="toggleSidebar"
            class="p-1 rounded hover:bg-neutral-100 transition-colors"
            title="Recolher menu"
          >
            <ChevronLeftIcon class="w-5 h-5 text-neutral-600 transition-transform duration-300" />
          </button>
        </ClientOnly>
      </div>
      
      <!-- Layout quando colapsado -->
      <div v-else class="flex items-center justify-between w-full">
        <img 
          src="~/assets/images/AFAAS_Logo_2.svg" 
          alt="AFAAS" 
          class="h-12 w-auto flex-shrink-0"
        />
        
        <!-- Botão de toggle quando colapsado -->
        <ClientOnly>
          <button 
            @click="toggleSidebar"
            class="p-1 rounded hover:bg-neutral-100 transition-colors"
            title="Expandir menu"
          >
            <ChevronLeftIcon class="w-5 h-5 text-neutral-600 transition-transform duration-300 rotate-180" />
          </button>
        </ClientOnly>
      </div>
    </header>

    <!-- Navegação Principal -->
    <nav class="flex-1 px-2 py-6 space-y-2">
      <SidebarMenuItem 
        icon="HomeIcon"
        :label="isCollapsed ? '' : 'Dashboard'"
        :active="$route.path === '/'"
        :collapsed="isCollapsed"
        @click="navigateTo('/')"
      />
      
      <SidebarMenuItem 
        icon="UserGroupIcon"
        :label="isCollapsed ? '' : 'Clientes'"
        :active="$route.path === '/clientes'"
        :collapsed="isCollapsed"
        @click="navigateTo('/clientes')"
      />
      
      <SidebarMenuItem 
        icon="UsersIcon"
        :label="isCollapsed ? '' : 'Atendentes'"
        :active="$route.path === '/atendentes'"
        :collapsed="isCollapsed"
        @click="navigateTo('/atendentes')"
      />
      
      <SidebarMenuItem 
        icon="CalendarDaysIcon"
        :label="isCollapsed ? '' : 'Atendimentos'"
        :active="$route.path === '/atendimentos'"
        :collapsed="isCollapsed"
        @click="navigateTo('/atendimentos')"
      />
      
      <SidebarMenuItem 
        icon="ClipboardDocumentListIcon"
        :label="isCollapsed ? '' : 'Relatórios'"
        :active="$route.path === '/relatorios'"
        :collapsed="isCollapsed"
        @click="navigateTo('/relatorios')"
      />
      
      <SidebarMenuItem 
        icon="IconLeaf"
        :label="isCollapsed ? '' : 'Plantas'"
        :active="$route.path === '/plantas'"
        :collapsed="isCollapsed"
        @click="navigateTo('/plantas')"
      />
      
      <SidebarMenuItem 
        icon="Cog6ToothIcon"
        :label="isCollapsed ? '' : 'Configurações'"
        :active="$route.path === '/configuracoes'"
        :collapsed="isCollapsed"
        @click="navigateTo('/configuracoes')"
      />
      
      <SidebarMenuItem 
        icon="QuestionMarkCircleIcon"
        :label="isCollapsed ? '' : 'Ajuda'"
        :active="$route.path === '/ajuda'"
        :collapsed="isCollapsed"
        @click="navigateTo('/ajuda')"
      />
    </nav>

    <!-- Rodapé -->
    <footer class="p-4 border-t border-neutral-200">
      <ClientOnly>
        <!-- Layout quando expandido -->
        <div v-if="!isCollapsed">
          <!-- Botão de configurações -->
          <button 
            @click="handleConfigClick"
            class="config-button w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
            title="Configurações"
          >
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Cog6ToothIcon class="w-5 h-5 text-primary-600" />
            </div>
            <div class="flex-1 text-left">
              <p class="font-medium text-neutral-900">Configurações</p>
              <p class="text-sm text-neutral-500">{{ userName }}</p>
            </div>
          </button>
        </div>
        
        <!-- Layout quando colapsado -->
        <div v-else class="flex justify-center">
          <button
            @click="handleConfigClick"
            class="config-button w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors"
            title="Configurações"
          >
            <Cog6ToothIcon class="w-5 h-5 text-primary-600" />
          </button>
        </div>
      </ClientOnly>
    </footer>
    
    <!-- Dropdown de configurações -->
    <ClientOnly>
      <div v-if="showConfigDropdown && !isCollapsed" class="config-dropdown absolute bottom-20 left-4 z-50 w-56">
        <div class="bg-white rounded-lg shadow-lg border border-neutral-200 py-2">
          <!-- Opção Perfil -->
          <button 
            @click="handleProfile"
            class="w-full flex items-center px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
          >
            <UserIcon class="w-5 h-5 text-neutral-600 mr-3" />
            <span class="text-sm font-medium text-neutral-900">Perfil</span>
          </button>
          
          <!-- Separador -->
          <div class="border-t border-neutral-100 my-1"></div>
          
          <!-- Opção Sair -->
          <button 
            @click="handleDropdownLogout"
            class="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 transition-colors group"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5 text-neutral-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span class="text-sm font-medium text-neutral-900 group-hover:text-red-600 transition-colors">Sair</span>
          </button>
        </div>
      </div>
      
      <!-- Dropdown quando colapsado -->
      <div v-if="showConfigDropdown && isCollapsed" class="config-dropdown absolute bottom-20 left-2 z-50">
        <div class="bg-white rounded-lg shadow-lg border border-neutral-200 py-2 min-w-40">
          <!-- Opção Perfil -->
          <button 
            @click="handleProfile"
            class="w-full flex items-center px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
          >
            <UserIcon class="w-5 h-5 text-neutral-600 mr-3" />
            <span class="text-sm font-medium text-neutral-900">Perfil</span>
          </button>
          
          <!-- Separador -->
          <div class="border-t border-neutral-100 my-1"></div>
          
          <!-- Opção Sair -->
          <button 
            @click="handleDropdownLogout"
            class="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 transition-colors group"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5 text-neutral-600 group-hover:text-red-600 mr-3 transition-colors" />
            <span class="text-sm font-medium text-neutral-900 group-hover:text-red-600 transition-colors">Sair</span>
          </button>
        </div>
      </div>
    </ClientOnly>
    
    <!-- Modal de edição de nome -->
    <ClientOnly>
      <div v-if="showEditNameModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showEditNameModal = false">
        <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Editar Nome</h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Nome de exibição
            </label>
            <input 
              v-model="newDisplayName"
              type="text"
              class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Digite seu nome"
              @keyup.enter="saveDisplayName"
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showEditNameModal = false"
              class="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              @click="saveDisplayName"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>
  </aside>
</template>

<script setup lang="ts">
import { 
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import { IconLeaf } from '@tabler/icons-vue'
import { useUserStore } from '~/stores/useUserStore'

// Estado do sidebar - inicialização segura para SSR
const isCollapsed = ref(false)

// Estado do modal de edição de nome - inicialização segura para SSR
const showEditNameModal = ref(false)
const newDisplayName = ref('')

// Estado do dropdown de configurações - inicialização segura para SSR
const showConfigDropdown = ref(false)

// Função para alternar o estado do sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const { logout } = useAuth()
const { userName, loadUserProfile } = useUserData()

// Carrega dados do perfil após o componente montar
onMounted(async () => {
  if (process.client) {
    // Aguarda um pouco para garantir que tudo está pronto
    await nextTick()
    await loadUserProfile()
  }
})

// Fechar dropdown quando clicar fora - apenas no client
onMounted(() => {
  if (!process.client) return

  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (showConfigDropdown.value && !target.closest('.config-dropdown') && !target.closest('.config-button')) {
      showConfigDropdown.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

// Função de logout
const handleLogout = async () => {
  await logout()
}

// Função para abrir modal de edição de nome
const openEditNameModal = () => {
  newDisplayName.value = userName.value
  showEditNameModal.value = true
}

// Função para salvar novo nome
const saveDisplayName = async () => {
  if (!newDisplayName.value.trim()) return
  showEditNameModal.value = false
}

// Função para lidar com clique em configurações
const handleConfigClick = () => {
  showConfigDropdown.value = !showConfigDropdown.value
}

// Função para fechar dropdown
const closeDropdown = () => {
  showConfigDropdown.value = false
}

// Função para lidar com perfil
const handleProfile = () => {
  // TODO: Implementar navegação para página de perfil
  console.log('Perfil clicado')
  closeDropdown()
}

// Função para lidar com logout
const handleDropdownLogout = async () => {
  await logout()
  closeDropdown()
}
</script>