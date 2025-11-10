<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Header da página -->
    <header class="bg-white border-b border-neutral-200">
      <div class="max-w-4xl mx-auto px-6 py-6">
        <div class="flex items-center">
          <ClientOnly>
            <button 
              @click="$router.back()"
              class="mr-4 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Voltar"
            >
              <ArrowLeftIcon class="w-5 h-5 text-neutral-600" />
            </button>
          </ClientOnly>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900">Perfil</h1>
            <p class="text-sm text-neutral-600">Gerencie suas informações pessoais e configurações</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Informações do Perfil -->
        <div class="bg-white rounded-lg border border-neutral-200 p-6 h-fit">
          <div class="flex items-center mb-6">
            <UserIcon class="w-5 h-5 text-neutral-600 mr-3" />
            <h2 class="text-lg font-medium text-neutral-900">Informações Pessoais</h2>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <!-- Nome - Editável -->
            <div>
              <label for="displayName" class="block text-sm font-medium text-neutral-700 mb-2">
                Nome de Exibição
              </label>
              <ClientOnly>
                <div class="flex">
                  <input
                    id="displayName"
                    v-model="editableUserName"
                    :disabled="!isEditingName || updatingName"
                    type="text"
                    class="flex-1 px-3 py-2 border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    placeholder="Digite seu nome"
                  />
                  <button
                    @click="toggleEditName"
                    :disabled="updatingName"
                    class="px-3 py-2 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-md hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="updatingName ? 'Salvando...' : isEditingName ? 'Salvar' : 'Editar nome'"
                  >
                    <PencilIcon v-if="!isEditingName && !updatingName" class="w-4 h-4 text-neutral-600" />
                    <CheckIcon v-else-if="isEditingName && !updatingName" class="w-4 h-4 text-green-600" />
                    <ArrowPathIcon v-else class="w-4 h-4 text-neutral-600 animate-spin" />
                  </button>
                </div>
                <p v-if="nameUpdateMessage" class="mt-1 text-xs text-green-600">
                  {{ nameUpdateMessage }}
                </p>
                <template #fallback>
                  <div class="flex">
                    <input
                      id="displayName"
                      value="Carregando..."
                      disabled
                      type="text"
                      class="flex-1 px-3 py-2 border border-neutral-300 rounded-l-md bg-neutral-50 text-neutral-500 cursor-not-allowed"
                      placeholder="Digite seu nome"
                    />
                    <div class="px-3 py-2 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-md">
                      <PencilIcon class="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                </template>
              </ClientOnly>
            </div>

            <!-- Email - Somente leitura -->
            <div>
              <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <ClientOnly>
                <div class="relative">
                  <input
                    id="email"
                    :value="userEmail"
                    type="email"
                    disabled
                    class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  />
                  <EnvelopeIcon class="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                </div>
                <template #fallback>
                  <div class="relative">
                    <input
                      id="email"
                      type="email"
                      value="Carregando..."
                      disabled
                      class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500 cursor-not-allowed"
                    />
                    <EnvelopeIcon class="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                  </div>
                </template>
              </ClientOnly>
              <p class="mt-1 text-xs text-neutral-500">
                O email não pode ser alterado
              </p>
            </div>

            <!-- Role/Cargo - Somente leitura -->
            <div>
              <label for="role" class="block text-sm font-medium text-neutral-700 mb-2">
                Cargo
              </label>
              <ClientOnly>
                <div class="relative">
                  <input
                    id="role"
                    :value="userRole"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  />
                  <ShieldCheckIcon class="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                </div>
                <template #fallback>
                  <div class="relative">
                    <input
                      id="role"
                      type="text"
                      value="Carregando..."
                      disabled
                      class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500 cursor-not-allowed"
                    />
                    <ShieldCheckIcon class="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                  </div>
                </template>
              </ClientOnly>
            </div>

            <!-- Data de Criação - Somente leitura -->
            <div>
              <label for="createdAt" class="block text-sm font-medium text-neutral-700 mb-2">
                Membro desde
              </label>
              <div class="relative">
                <ClientOnly>
                  <input
                    id="createdAt"
                    :value="formattedCreatedAt"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  />
                  <template #fallback>
                    <input
                      id="createdAt"
                      value="Carregando..."
                      type="text"
                      disabled
                      class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500 cursor-not-allowed"
                    />
                  </template>
                </ClientOnly>
                <CalendarIcon class="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Componente de Alteração de Senha -->
        <div class="space-y-8">
          <ChangePassword 
            @password-changed="handlePasswordChange"
            @cancel="handlePasswordCancel"
          />

          <!-- Avatar/Foto (placeholder para futuro) -->
          <div class="bg-white rounded-lg border border-neutral-200 p-6">
          <div class="flex items-center mb-6">
            <PhotoIcon class="w-5 h-5 text-neutral-600 mr-3" />
            <h2 class="text-lg font-medium text-neutral-900">Foto do Perfil</h2>
          </div>
          
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon class="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <ClientOnly>
                <h3 class="font-medium text-neutral-900">{{ userName }}</h3>
                <p class="text-sm text-neutral-500 mb-3">{{ userRole }}</p>
                <template #fallback>
                  <h3 class="font-medium text-neutral-900">Carregando...</h3>
                  <p class="text-sm text-neutral-500 mb-3">Carregando...</p>
                </template>
              </ClientOnly>
              <button 
                class="text-sm text-neutral-500 hover:text-neutral-700 transition-colors cursor-not-allowed"
                disabled
              >
                Alterar foto (em breve)
              </button>
            </div>
          </div>
        </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ArrowPathIcon, UserIcon, EnvelopeIcon, ShieldCheckIcon, CalendarIcon, PhotoIcon, PencilIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useToastNotification as useToast, POSITION } from '~/composables/useToastNotification'
import { useUserData } from '~/composables/useUserData'

// Usar dados do usuário do store
const { userName, userRole, profile, loadUserProfile } = useUserData()
const { user, atualizarInfosUsuario } = useAuth()
const toast = useToast()

// Computed para dados derivados - SSR safe
const userEmail = computed(() => {
  if (!process.client) return 'Carregando...'
  return user.value?.email || 'email@example.com'
})
const userCreatedAt = computed(() => {
  if (!process.client) return null
  return profile.value?.created_at || null
})

// Estados para edição de nome - inicialização SSR safe
const isEditingName = ref(false)
const editableUserName = ref('')
const nameUpdateMessage = ref('')
const updatingName = ref(false)

// Computed para data formatada - SSR safe
const formattedCreatedAt = computed(() => {
  if (!process.client) return 'Carregando...'
  if (!userCreatedAt.value) return 'Não disponível'
  
  try {
    return new Date(userCreatedAt.value).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
})

// Watch para sincronizar nome editável com o store - SSR safe
watch(userName, (newValue: string) => {
  if (process.client && newValue && !isEditingName.value) {
    editableUserName.value = newValue
  }
}, { immediate: true })

// Função para alternar edição de nome - SSR safe
async function toggleEditName() {
  if (!process.client) return
  
  if (isEditingName.value) {
    // Salvar nome
    const novoNome = editableUserName.value.trim()
    
    if (novoNome !== userName.value && novoNome.length >= 2) {
      updatingName.value = true
      
      try {
        const resultado = await atualizarInfosUsuario(novoNome)
        
        if (resultado.success) {
          toast.success(resultado.message || 'Nome atualizado com sucesso!')
          
          // Recarregar os dados do perfil para refletir a mudança
          await loadUserProfile()
          
          nameUpdateMessage.value = 'Nome atualizado!'
          setTimeout(() => {
            nameUpdateMessage.value = ''
          }, 3000)
        } else {
          toast.error(resultado.error || 'Erro ao atualizar nome')
          // Reverter para o nome original
          editableUserName.value = userName.value
        }
      } catch (error) {
        toast.error('Erro inesperado ao atualizar nome')
        
        // Reverter para o nome original
        editableUserName.value = userName.value
      } finally {
        updatingName.value = false
      }
    } else if (novoNome.length < 2) {
      toast.error('Nome deve ter pelo menos 2 caracteres')
      return
    }
    
    isEditingName.value = false
  } else {
    // Entrar em modo de edição
    editableUserName.value = userName.value
    isEditingName.value = true
    
    // Focar no input
    nextTick(() => {
      const input = document.getElementById('displayName') as HTMLInputElement
      input?.focus()
      input?.select()
    })
  }
}

// Funções para lidar com eventos do componente ChangePassword
function handlePasswordChange(success: boolean) {
  if (success) {
  } else {
  }
}

function handlePasswordCancel() {
}

// Carregar dados do perfil ao montar o componente
onMounted(async () => {
  // TODO: Carregar dados mais detalhados do perfil se necessário
})
</script>