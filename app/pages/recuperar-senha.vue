<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon class="w-8 h-8 text-primary-600" />
          </div>
          <h1 class="text-2xl font-bold text-neutral-900 mb-2">
            Recuperar senha
          </h1>
          <p class="text-sm text-neutral-600 leading-relaxed">
            Digite sua nova senha para recuperar o acesso à sua conta
          </p>
        </div>

        <!-- Conteúdo do formulário -->
        <div class="px-8 pb-8">
          <!-- Estado de carregamento da sessão -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <ArrowPathIcon class="w-6 h-6 animate-spin text-primary-600" />
            <span class="ml-2 text-sm text-neutral-600">Verificando sessão...</span>
          </div>

          <!-- Estado de erro -->
          <div v-else-if="error" class="text-center py-8">
            <component 
              :is="errorIcon" 
              :class="['w-12 h-12 mx-auto mb-4', errorIconColor]" 
            />
            <h3 :class="['text-lg font-medium mb-2', errorTitleColor]">{{ errorTitle }}</h3>
            <p :class="['text-sm mb-6 leading-relaxed', errorMessageColor]">{{ error }}</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <NuxtLink
                to="/esqueci-senha"
                class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                <ArrowLeftIcon class="w-4 h-4 mr-2" />
                Solicitar novo link
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="inline-flex items-center px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-md hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeftIcon class="w-4 h-4 mr-2" />
                Voltar ao login
              </NuxtLink>
            </div>
          </div>

          <!-- Formulário de mudança de senha -->
          <div v-else>
            <div class="space-y-6">
              <!-- Nova Senha -->
              <BaseInput
                id="newPassword"
                v-model="newPassword"
                label="Nova senha"
                type="password"
                placeholder="Digite sua nova senha"
                :error="errors.newPassword"
                required
              />

              <!-- Confirmar Nova Senha -->
              <BaseInput
                id="confirmPassword"
                v-model="confirmPassword"
                label="Confirmar nova senha"
                type="password"
                placeholder="Confirme sua nova senha"
                :error="errors.confirmPassword"
                required
              />

              <!-- Indicador de força da senha -->
              <div v-if="newPassword" class="space-y-2">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      :class="[
                        'h-2 rounded-full transition-all duration-300',
                        passwordStrength.color
                      ]"
                      :style="{ width: passwordStrength.percentage + '%' }"
                    />
                  </div>
                  <span :class="['text-sm font-medium', passwordStrength.textColor]">
                    {{ passwordStrength.text }}
                  </span>
                </div>
              </div>

              <!-- Indicador de senhas correspondentes -->
              <div v-if="newPassword && confirmPassword" class="flex items-center space-x-2">
                <div
                  :class="[
                    'w-4 h-4 rounded-full',
                    passwordsMatch ? 'bg-green-500' : 'bg-red-500'
                  ]"
                />
                <span
                  :class="[
                    'text-sm',
                    passwordsMatch ? 'text-green-700' : 'text-red-700'
                  ]"
                >
                  {{ passwordsMatch ? 'Senhas correspondem' : 'Senhas não correspondem' }}
                </span>
              </div>

              <!-- Botão de atualizar senha -->
              <BaseButton
                @click="updatePassword"
                variant="primary"
                class="w-full"
                size="lg"
                :loading="updating"
                :disabled="!isFormValid"
              >
                <template #iconLeft>
                  <CheckIcon class="w-5 h-5" />
                </template>
                Atualizar senha
              </BaseButton>
            </div>
          </div>

          <!-- Botões de teste para desenvolvimento -->
          <div v-if="isDevelopment" class="mt-8 border-t pt-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Teste de Estados de Erro:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                @click="simulateError('session_not_found')"
                class="px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Link Usado
              </button>
              <button
                @click="simulateError('Token has expired')"
                class="px-3 py-2 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                Link Expirado
              </button>
              <button
                @click="simulateError('invalid_request')"
                class="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Link Inválido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LockClosedIcon from '@heroicons/vue/24/outline/LockClosedIcon'
import ArrowLeftIcon from '@heroicons/vue/24/outline/ArrowLeftIcon'
import ArrowPathIcon from '@heroicons/vue/24/outline/ArrowPathIcon'
import ExclamationTriangleIcon from '@heroicons/vue/24/outline/ExclamationTriangleIcon'
import CheckIcon from '@heroicons/vue/24/outline/CheckIcon'
import ClockIcon from '@heroicons/vue/24/outline/ClockIcon'
import XCircleIcon from '@heroicons/vue/24/outline/XCircleIcon'
import { useToastNotification as useToast, POSITION } from '~/composables/useToastNotification'

// Definir meta da página (sem layout e middleware específico)
definePageMeta({
  layout: false,
  middleware: 'recovery'
})

// Composables
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const router = useRouter()
const route = useRoute()

// Estados reativos
const loading = ref(true)
const updating = ref(false)
const error = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Desenvolvimento
const isDevelopment = ref(false)

// Erros de validação
const errors = reactive({
  newPassword: '',
  confirmPassword: ''
})

// Watcher para detectar mudanças no estado do usuário (caso necessário para debug)
// watch(user, (newUser, oldUser) => {
// }, { immediate: true })

// Computed para verificar se as senhas correspondem
const passwordsMatch = computed(() => {
  if (!newPassword.value || !confirmPassword.value) return true
  return newPassword.value === confirmPassword.value
})

// Computed para força da senha
const passwordStrength = computed(() => {
  const password = newPassword.value
  if (!password) return { percentage: 0, color: 'bg-gray-300', textColor: 'text-gray-500', text: '' }

  let score = 0
  
  if (password.length >= 8) score += 25
  if (/[a-z]/.test(password)) score += 25
  if (/[A-Z]/.test(password)) score += 25
  if (/\d/.test(password)) score += 12.5
  if (/[^a-zA-Z\d]/.test(password)) score += 12.5

  if (score < 25) {
    return { percentage: score, color: 'bg-red-500', textColor: 'text-red-700', text: 'Fraca' }
  } else if (score < 50) {
    return { percentage: score, color: 'bg-yellow-500', textColor: 'text-yellow-700', text: 'Razoável' }
  } else if (score < 75) {
    return { percentage: score, color: 'bg-blue-500', textColor: 'text-blue-700', text: 'Boa' }
  } else {
    return { percentage: score, color: 'bg-green-500', textColor: 'text-green-700', text: 'Forte' }
  }
})

// Computed para validar formulário
const isFormValid = computed(() => {
  return newPassword.value.length >= 6 && 
         confirmPassword.value.length >= 6 && 
         passwordsMatch.value
})

// Função para determinar o tipo de erro e a mensagem apropriada
function getRecoveryErrorMessage(errorMessage: string): string {
  const lowerMessage = errorMessage.toLowerCase()
  
  if (lowerMessage.includes('session_not_found') || 
      lowerMessage.includes('invalid_token') ||
      lowerMessage.includes('refresh_token_not_found')) {
    return 'Este link de recuperação já foi utilizado. Solicite um novo link de recuperação.'
  }
  
  if (lowerMessage.includes('token has expired') ||
      lowerMessage.includes('session has expired') ||
      lowerMessage.includes('expired')) {
    return 'Este link de recuperação expirou. Links de recuperação são válidos por apenas 1 hora. Solicite um novo link.'
  }
  
  if (lowerMessage.includes('access_denied')) {
    return 'Acesso negado. Este link pode ter sido utilizado anteriormente ou é inválido.'
  }
  
  return 'Link de recuperação inválido ou já utilizado. Solicite um novo link de recuperação.'
}

// Função para determinar o tipo de erro baseado na mensagem
function getErrorType(errorMessage: string): 'used' | 'expired' | 'invalid' {
  const lowerMessage = errorMessage.toLowerCase()
  
  if (lowerMessage.includes('session_not_found') || 
      lowerMessage.includes('invalid_token') ||
      lowerMessage.includes('refresh_token_not_found') ||
      lowerMessage.includes('já foi utilizado') ||
      lowerMessage.includes('access_denied')) {
    return 'used'
  }
  
  if (lowerMessage.includes('expired') || 
      lowerMessage.includes('expirou') ||
      lowerMessage.includes('token has expired') ||
      lowerMessage.includes('session has expired')) {
    return 'expired'
  }
  
  return 'invalid'
}

// Computed properties para o display de erro
const errorIcon = computed(() => {
  if (!error.value) return ExclamationTriangleIcon
  
  const type = getErrorType(error.value)
  switch (type) {
    case 'used':
      return XCircleIcon
    case 'expired':
      return ClockIcon
    default:
      return ExclamationTriangleIcon
  }
})

const errorIconColor = computed(() => {
  if (!error.value) return 'text-red-400'
  
  const type = getErrorType(error.value)
  switch (type) {
    case 'used':
      return 'text-red-500'
    case 'expired':
      return 'text-yellow-500'
    default:
      return 'text-red-400'
  }
})

const errorTitle = computed(() => {
  if (!error.value) return 'Erro de autenticação'
  
  const type = getErrorType(error.value)
  switch (type) {
    case 'used':
      return 'Link já utilizado'
    case 'expired':
      return 'Link expirado'
    default:
      return 'Link inválido'
  }
})

const errorTitleColor = computed(() => {
  if (!error.value) return 'text-red-900'
  
  const type = getErrorType(error.value)
  switch (type) {
    case 'used':
      return 'text-red-900'
    case 'expired':
      return 'text-yellow-900'
    default:
      return 'text-red-900'
  }
})

const errorMessageColor = computed(() => {
  if (!error.value) return 'text-red-600'
  
  const type = getErrorType(error.value)
  switch (type) {
    case 'used':
      return 'text-red-700'
    case 'expired':
      return 'text-yellow-700'
    default:
      return 'text-red-600'
  }
})

// Função para validar o formulário
function validateForm(): boolean {
  errors.newPassword = ''
  errors.confirmPassword = ''

  if (!newPassword.value) {
    errors.newPassword = 'Nova senha é obrigatória'
    return false
  }

  if (newPassword.value.length < 6) {
    errors.newPassword = 'A senha deve ter pelo menos 6 caracteres'
    return false
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória'
    return false
  }

  if (newPassword.value !== confirmPassword.value) {
    errors.confirmPassword = 'Senhas não coincidem'
    return false
  }

  return true
}

// Função para atualizar a senha
async function updatePassword() {
  if (!validateForm()) {
    toast.error('Por favor, corrija os erros no formulário')
    return
  }

  updating.value = true

  try {
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (authError) {
      
      // Verificar se é erro de link já utilizado ou sessão inválida
      if (authError.message?.includes('session_not_found') || 
          authError.message?.includes('invalid_token') ||
          authError.message?.includes('Token has expired') ||
          authError.message?.includes('session has expired') ||
          authError.message?.includes('refresh_token_not_found')) {
        updating.value = false
        error.value = getRecoveryErrorMessage(authError.message)
        return
      }
      
      toast.error('Erro ao atualizar senha: ' + authError.message)
      return
    }

    toast.success('Senha atualizada com sucesso!')

    setTimeout(() => {
      router.push('/')
    }, 2000)

  } catch (err: any) {
    toast.error('Erro inesperado ao atualizar senha')
  } finally {
    updating.value = false
  }
}

// Função para simular diferentes tipos de erro (apenas para teste)
function simulateError(errorMessage: string) {
  loading.value = false
  error.value = getRecoveryErrorMessage(errorMessage)
}

// Verificar sessão ao montar o componente
onMounted(async () => {
  // Aguardar um pouco para garantir que tudo está carregado
  await nextTick()
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      
      if (sessionError.message?.includes('session_not_found') ||
          sessionError.message?.includes('invalid_token') ||
          sessionError.message?.includes('Token has expired') ||
          sessionError.message?.includes('refresh_token_not_found')) {
        error.value = getRecoveryErrorMessage(sessionError.message)
      } else {
        error.value = 'Erro ao verificar sessão de recuperação'
      }
      return
    }

    if (!session) {
      // Verificar se há parâmetros na URL que indiquem erro
      const urlParams = new URLSearchParams(window.location.search)
      const errorType = urlParams.get('error')
      const errorDescription = urlParams.get('error_description')
      
      if (errorType || errorDescription) {
        const errorMessage = errorDescription || errorType || 'Erro desconhecido'
        error.value = getRecoveryErrorMessage(errorMessage)
      } else {
        error.value = 'Sessão de recuperação inválida ou expirada'
      }
      return
    }

    try {
      const { error: testError } = await supabase.auth.getUser()
      
      if (testError && (testError.message?.includes('session_not_found') || 
                       testError.message?.includes('invalid_token'))) {
        error.value = getRecoveryErrorMessage(testError.message)
        return
      }
    } catch (testErr) {
    }

    loading.value = false
  } catch (err: any) {
    error.value = 'Erro inesperado ao verificar sessão'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>