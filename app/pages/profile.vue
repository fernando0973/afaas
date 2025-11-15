<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <!-- Header da página -->
    <header class="flex-shrink-0 bg-white border-b border-neutral-200">
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
    <main class="flex-1 min-h-0 overflow-y-auto max-w-6xl mx-auto px-6 py-8 w-full">
      <!-- Card de Apresentação -->
      <BaseSubCard
        variant="neutral"
        size="md"
        class="mb-8"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <!-- Avatar -->
          <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon class="w-10 h-10 text-primary-600" />
          </div>
          
          <!-- Informações básicas -->
          <div class="flex-1">
            <ClientOnly>
              <h2 class="text-2xl font-bold text-neutral-900">{{ userName }}</h2>
              <p class="text-lg text-neutral-600 mb-2">{{ userRole }}</p>
              <p class="text-sm text-neutral-500">{{ userEmail }}</p>
              <p class="text-xs text-neutral-400 mt-1">Membro desde {{ formattedCreatedAt }}</p>
              <template #fallback>
                <h2 class="text-2xl font-bold text-neutral-900">Carregando...</h2>
                <p class="text-lg text-neutral-600 mb-2">Carregando...</p>
                <p class="text-sm text-neutral-500">Carregando...</p>
              </template>
            </ClientOnly>
          </div>
          
          <!-- Badge do cargo (se admin) -->
          <div v-if="isAdmin" class="flex-shrink-0">
            <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              <ShieldCheckIcon class="w-3 h-3 mr-1" />
              Administrador
            </div>
          </div>
        </div>
      </BaseSubCard>

      <!-- Grid de seções -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <!-- Coluna esquerda: Informações pessoais -->
        <div class="xl:col-span-2 space-y-8">
          
          <!-- Informações Pessoais -->
          <BaseSubCard
            title="Informações Pessoais"
            variant="neutral"
            size="md"
          >
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
            </div>
          </BaseSubCard>

          <!-- Segurança -->
          <BaseSubCard
            title="Segurança"
            variant="neutral"
            size="md"
          >
            <ChangePassword 
              @password-changed="handlePasswordChange"
              @cancel="handlePasswordCancel"
            />
          </BaseSubCard>

        </div>

        <!-- Coluna direita: Informações do sistema -->
        <div class="space-y-8">
          
          <!-- Configurações rápidas -->
          <BaseSubCard
            title="Configurações"
            variant="neutral"
            size="md"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-700">Foto do perfil</span>
                <button 
                  class="text-sm text-neutral-500 hover:text-neutral-700 transition-colors cursor-not-allowed"
                  disabled
                >
                  Em breve
                </button>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-700">Notificações</span>
                <button 
                  class="text-sm text-neutral-500 hover:text-neutral-700 transition-colors cursor-not-allowed"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>
          </BaseSubCard>

          <!-- Informações de Build (somente administradores) -->
          <BaseSubCard
            v-if="isAdmin"
            title="Build Info"
            variant="neutral"
            size="md"
          >
            <div class="flex items-center justify-end mb-4">
              <button
                type="button"
                class="text-xs font-medium text-primary-600 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                :disabled="buildInfoPending"
                @click="handleRefreshBuildInfo"
              >
                {{ buildInfoPending ? 'Atualizando...' : 'Atualizar' }}
              </button>
            </div>

            <div v-if="buildInfoPending && !hasBuildInfo" class="text-sm text-neutral-500">
              Carregando informações de compilação...
            </div>
            <div v-else-if="buildInfoError" class="text-sm text-red-600">
              {{ buildInfoError?.message || 'Não foi possível carregar os dados da build.' }}
            </div>
            <div v-else class="space-y-4 text-sm">
              <div>
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Compilação</p>
                <div class="mt-1 flex items-center gap-2 text-neutral-700">
                  <ClockIcon class="w-4 h-4 text-neutral-500" />
                  <span>{{ formattedBuildTimestamp }}</span>
                </div>
              </div>

              <div>
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Branch</p>
                <p class="mt-1 text-neutral-700">{{ branchDisplay }}</p>
              </div>

              <div>
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Último commit</p>
                <div class="mt-1 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <IdentificationIcon class="w-4 h-4 text-neutral-500" />
                    <span class="font-mono text-sm text-neutral-800">{{ commitHashDisplay }}</span>
                  </div>
                  <span class="text-xs text-neutral-500">{{ formattedCommitDate }}</span>
                </div>
              </div>

              <div>
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Mensagem</p>
                <div class="mt-1 flex items-start gap-2 text-neutral-700">
                  <DocumentTextIcon class="w-4 h-4 text-neutral-500 mt-0.5" />
                  <span>{{ commitMessageDisplay }}</span>
                </div>
              </div>

              <div>
                <p class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Autor</p>
                <p class="mt-1 text-neutral-700">{{ commitAuthorDisplay }}</p>
              </div>
            </div>
          </BaseSubCard>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ArrowPathIcon, UserIcon, EnvelopeIcon, ShieldCheckIcon, CalendarIcon, PhotoIcon, PencilIcon, CheckIcon, ServerIcon, ClockIcon, DocumentTextIcon, IdentificationIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useToastNotification as useToast } from '~/composables/useToastNotification'
import { useUserData } from '~/composables/useUserData'
import { useAuth } from '~/composables/useAuth'
import BaseSubCard from '~/components/BaseSubCard.vue'

interface BuildInfoResponse {
  commitDate?: string | null
  buildTimestamp?: string | null
  commitShort?: string | null
  commitAuthor?: string | null
  commitMessage?: string | null
  branch?: string | null
}

// Usar dados do usuário do store
const { userName, userRole, profile, loadUserProfile, isAdmin } = useUserData()
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

const { data: buildInfo, pending: buildInfoPending, error: buildInfoError, refresh: refreshBuildInfo } = await useAsyncData<BuildInfoResponse, Error>(
  'build-info',
  () => $fetch<BuildInfoResponse>('/api/build-info' as '/api/build-info'),
  {
    immediate: false,
    server: false
  }
)

const buildInfoFetched = ref(false)

const formatDateTime = (value: string | null | undefined) => {
  if (!value || value === 'indisponível') {
    return 'Não disponível'
  }

  try {
    return new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}

const formattedCommitDate = computed(() => formatDateTime(buildInfo.value?.commitDate))
const formattedBuildTimestamp = computed(() => formatDateTime(buildInfo.value?.buildTimestamp))
const commitHashDisplay = computed(() => buildInfo.value?.commitShort || '—')
const commitAuthorDisplay = computed(() => buildInfo.value?.commitAuthor || '—')
const commitMessageDisplay = computed(() => buildInfo.value?.commitMessage || '—')
const branchDisplay = computed(() => buildInfo.value?.branch || '—')
const hasBuildInfo = computed(() => Boolean(buildInfo.value && buildInfo.value.commitShort && buildInfo.value.commitShort !== 'indisponível'))

async function handleRefreshBuildInfo() {
  if (!process.client) return
  try {
    await refreshBuildInfo()
  } catch (error) {
    toast.error('Não foi possível atualizar as informações da build')
  }
}

if (process.client) {
  watch(isAdmin, (value: boolean) => {
    if (value && !buildInfoFetched.value) {
      buildInfoFetched.value = true
      refreshBuildInfo()
    }
  }, { immediate: true })
}

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