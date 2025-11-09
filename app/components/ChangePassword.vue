<template>
  <div class="bg-white rounded-lg border border-neutral-200 p-6 h-fit">
    <div class="flex items-center mb-6">
      <LockClosedIcon class="w-5 h-5 text-neutral-600 mr-3" />
      <h3 class="text-lg font-medium text-neutral-900">Alterar Senha</h3>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4" autocomplete="off">
      <!-- Campos dummy para confundir autocomplete -->
      <div style="display: none;">
        <input type="text" name="fake-username" autocomplete="username" />
        <input type="password" name="fake-password" autocomplete="current-password" />
      </div>
      
      <!-- Nova Senha -->
      <div>
        <label for="newPassword" class="block text-sm font-medium text-neutral-700 mb-2">
          Nova Senha
        </label>
        <div class="relative">
          <input
            id="newPassword"
            ref="newPasswordInput"
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Digite sua nova senha"
            required
            minlength="6"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            data-form-type="other"
            :value="newPassword"
            @input="newPassword = ($event.target as HTMLInputElement).value"
          />
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <EyeIcon v-if="!showNewPassword" class="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
            <EyeSlashIcon v-else class="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
          </button>
        </div>
        <p class="mt-1 text-xs text-neutral-500">
          A senha deve ter pelo menos 6 caracteres
        </p>
      </div>

      <!-- Confirmar Nova Senha -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-neutral-700 mb-2">
          Confirmar Nova Senha
        </label>
        <div class="relative">
          <input
            id="confirmPassword"
            ref="confirmPasswordInput"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Confirme sua nova senha"
            required
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            data-form-type="other"
            :value="confirmPassword"
            @input="confirmPassword = ($event.target as HTMLInputElement).value"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <EyeIcon v-if="!showConfirmPassword" class="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
            <EyeSlashIcon v-else class="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
          </button>
        </div>
        <!-- Validação de confirmação -->
        <p v-if="newPassword && confirmPassword && newPassword !== confirmPassword" class="mt-1 text-xs text-red-500">
          As senhas não coincidem
        </p>
      </div>

      <!-- Botões -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="!isFormValid || isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Alterando...</span>
          <span v-else>Alterar Senha</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'
import { useToastNotification as useToast } from '~/composables/useToastNotification'

// Composables
const { alterarSenha } = useAuth()
const toast = useToast()

// Refs para os inputs
const newPasswordInput = ref<HTMLInputElement>()
const confirmPasswordInput = ref<HTMLInputElement>()

// Estados dos campos - garantir que sempre iniciem vazios
const newPassword = ref('')
const confirmPassword = ref('')

// Estados de visibilidade das senhas
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Estado de loading
const isLoading = ref(false)

// Função para garantir que os campos estejam sempre limpos na inicialização
const initializeFields = () => {
  newPassword.value = ''
  confirmPassword.value = ''
  showNewPassword.value = false
  showConfirmPassword.value = false
  
  // Forçar limpeza dos inputs DOM também
  nextTick(() => {
    if (newPasswordInput.value) {
      newPasswordInput.value.value = ''
      newPasswordInput.value.defaultValue = ''
    }
    if (confirmPasswordInput.value) {
      confirmPasswordInput.value.value = ''
      confirmPasswordInput.value.defaultValue = ''
    }
  })
}

// Inicializar campos ao montar o componente
onMounted(() => {
  initializeFields()
  
  // Aguardar um pouco e forçar limpeza novamente para garantir
  setTimeout(() => {
    initializeFields()
  }, 100)
})

// Computed para validação do formulário
const isFormValid = computed(() => {
  return newPassword.value.length >= 6 &&
         confirmPassword.value.length >= 6 &&
         newPassword.value === confirmPassword.value
})

// Emits (manter para compatibilidade com componente pai)
const emit = defineEmits<{
  'password-changed': [success: boolean]
  'cancel': []
}>()

// Função para enviar o formulário
async function handleSubmit() {
  if (!isFormValid.value) {
    toast.warning('Por favor, verifique os dados do formulário')
    return
  }

  isLoading.value = true
  
  try {
    const result = await alterarSenha(newPassword.value)

    if (result.success) {
      toast.success('Senha alterada com sucesso!')
      
      // Limpar campos após sucesso usando a função de inicialização
      initializeFields()
      
      // Emitir evento de sucesso
      emit('password-changed', true)
    } else {
      toast.error(result.error || 'Erro ao alterar senha')
      emit('password-changed', false)
    }
  } catch (error: any) {
    toast.error('Erro inesperado ao alterar senha')
    emit('password-changed', false)
  } finally {
    isLoading.value = false
  }
}

// Função para cancelar
function handleCancel() {
  // Garantir limpeza completa dos campos
  initializeFields()
  
  // Emitir evento de cancelamento
  emit('cancel')
}
</script>