<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyIcon class="w-8 h-8 text-primary-600" />
          </div>
          <h1 class="text-2xl font-bold text-neutral-900 mb-2">
            Esqueci minha senha
          </h1>
          <p class="text-sm text-neutral-600 leading-relaxed">
            Digite seu e-mail e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <!-- Formulário -->
        <div class="px-8 pb-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Campo de e-mail -->
            <BaseInput
              id="email"
              v-model="email"
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              :error="emailError"
              required
            />

            <!-- Botão de enviar -->
            <BaseButton
              type="submit"
              variant="primary"
              class="w-full"
              size="lg"
              :loading="loading"
              :disabled="!email.trim()"
            >
              <template #iconLeft>
                <PaperAirplaneIcon class="w-5 h-5" />
              </template>
              Enviar e-mail de recuperação
            </BaseButton>
          </form>

          <!-- Divisor -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-neutral-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-neutral-500">ou</span>
            </div>
          </div>

          <!-- Link para voltar ao login -->
          <div class="text-center">
            <NuxtLink
              to="/login"
              class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              Voltar para o login
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Informação adicional -->
      <div class="mt-6 text-center">
        <p class="text-sm text-neutral-600">
          Não recebeu o e-mail? Verifique sua caixa de spam ou 
          <button 
            @click="handleRetryEmail"
            :disabled="loading"
            class="font-medium text-primary-600 hover:text-primary-700 transition-colors underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            tente novamente
          </button>
        </p>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <BaseConfirmModal
      v-model="showConfirmModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :type="modalConfig.type"
      :confirm-text="modalConfig.confirmText"
      :cancel-text="modalConfig.cancelText"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import {
  KeyIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

// Definir meta da página (sem layout)
definePageMeta({
  layout: false
})

// Tipo para configuração do modal
interface ModalConfig {
  title: string
  message: string
  type: 'danger' | 'warning' | 'info' | 'success'
  confirmText: string
  cancelText: string
}

// Composables
const { recuperarSenha } = useAuth()
const router = useRouter()

// Estados reativos para o formulário
const email = ref('')
const loading = ref(false)
const emailError = ref('')

// Estados para o modal de confirmação
const showConfirmModal = ref(false)
const modalConfig = ref<ModalConfig>({
  title: 'E-mail enviado!',
  message: 'Caso o e-mail informado exista em nosso sistema, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada e também a pasta de spam.',
  type: 'success',
  confirmText: 'Entendi',
  cancelText: 'Voltar ao login'
})

// Função para validar e-mail
function validateEmail(): boolean {
  emailError.value = ''
  
  if (!email.value.trim()) {
    emailError.value = 'E-mail é obrigatório'
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value.trim())) {
    emailError.value = 'Formato de e-mail inválido'
    return false
  }
  
  return true
}

// Função para processar recuperação de senha
async function processPasswordReset() {
  if (!validateEmail()) return false
  
  loading.value = true
  
  try {
    const result = await recuperarSenha(email.value)
    
    if (result.success) {
      // Sempre mostrar sucesso por segurança, mesmo se e-mail não existir
      return true
    } else {
      // Mostrar erro genérico para não revelar se e-mail existe
      emailError.value = 'Erro ao processar solicitação. Tente novamente.'
      return false
    }
  } catch (error) {
    console.error('Erro inesperado:', error)
    emailError.value = 'Erro inesperado. Tente novamente.'
    return false
  } finally {
    loading.value = false
  }
}

// Função para lidar com o envio do formulário
async function handleSubmit() {
  const success = await processPasswordReset()
  
  if (success) {
    // Mostrar modal de confirmação
    showConfirmModal.value = true
  }
}

// Função para tentar reenviar e-mail
async function handleRetryEmail() {
  if (!email.value.trim()) {
    emailError.value = 'Digite um e-mail antes de tentar novamente'
    return
  }
  
  await handleSubmit()
}

// Handlers do modal
function handleModalConfirm() {
  showConfirmModal.value = false
  // Redirecionar para login após confirmação
  router.push('/login')
}

function handleModalCancel() {
  showConfirmModal.value = false
  // Redirecionar para login
  router.push('/login')
}

function handleModalClose() {
  showConfirmModal.value = false
}
</script>

<style scoped>
/* Adicionar alguns estilos customizados se necessário */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>