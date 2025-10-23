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
        icon="AcademicCapIcon"
        :label="isCollapsed ? '' : 'Especialidades'"
        :active="$route.path === '/especialidades'"
        :collapsed="isCollapsed"
        @click="navigateTo('/especialidades')"
      />
      
      <!-- Botão Administração - apenas para admins -->
      <ClientOnly>
        <SidebarMenuItem 
          v-if="isAdmin"
          icon="ShieldCheckIcon"
          :label="isCollapsed ? '' : 'Administração'"
          :active="$route.path === '/admin'"
          :collapsed="isCollapsed"
          @click="navigateTo('/admin')"
        />
      </ClientOnly>
      
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
              <ClientOnly>
                <p class="text-sm text-neutral-500">{{ userName }}</p>
                <template #fallback>
                  <p class="text-sm text-neutral-500">Carregando...</p>
                </template>
              </ClientOnly>
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
    <DropdownMenu
      :show="showConfigDropdown"
      :items="dropdownItems"
      :position="isCollapsed ? 'custom' : 'bottom-left'"
      :custom-position="isCollapsed ? { bottom: '5rem', left: '0.5rem' } : undefined"
      :width="isCollapsed ? 'auto' : 'md'"
      trigger-class=".config-button"
      @close="closeDropdown"
      @item-click="handleDropdownItemClick"
    />
    
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
  PencilIcon,
  ShieldCheckIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'
import { IconLeaf } from '@tabler/icons-vue'
import { useUserStore } from '~/stores/useUserStore'
import type { DropdownItem } from '../types/dropdown'

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

const { logout, checkIsAdmin } = useAuth()
const { userName, loadUserProfile } = useUserData()

// Estado reativo para controlar se é admin
const isAdmin = ref(false)

// Definir os itens do dropdown
const dropdownItems: DropdownItem[] = [
  {
    type: 'item',
    label: 'Perfil',
    icon: 'UserIcon',
    action: () => handleProfile()
  },
  {
    type: 'divider'
  },
  {
    type: 'item',
    label: 'Sair',
    icon: 'ArrowRightOnRectangleIcon',
    action: () => handleDropdownLogout(),
    variant: 'danger'
  }
]

// Função para verificar se usuário é admin
const checkAdminStatus = async () => {
  if (!process.client) return
  
  try {
    const result = await checkIsAdmin()
    isAdmin.value = result.success && result.isAdmin
  } catch (error) {
    console.error('Erro ao verificar status de admin:', error)
    isAdmin.value = false
  }
}

// Inicialização do componente - SSR safe
onMounted(async () => {
  if (!process.client) return

  // Carrega dados do perfil
  await nextTick()
  await loadUserProfile()
  
  // Verifica status de admin
  await checkAdminStatus()

  // Configurar click outside para dropdown
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
  navigateTo('/profile')
}

// Função para lidar com logout do dropdown
const handleDropdownLogout = async () => {
  await logout()
}

// Função para lidar com clique em item do dropdown
const handleDropdownItemClick = (item: DropdownItem) => {
  if (item.action && typeof item.action === 'function') {
    item.action()
  }
  closeDropdown()
}
</script>