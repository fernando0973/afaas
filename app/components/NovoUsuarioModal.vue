<template>
  <BaseModal
    v-model="modalAberto"
    title="Novo Usuário"
    subtitle="Criar uma nova conta de usuário no sistema"
    size="md"
    :show-footer="true"
    :show-confirm-button="true"
    :show-cancel-button="true"
    confirm-button-text="Criar Conta"
    cancel-button-text="Cancelar"
    :loading="carregandoCriacao"
    :confirm-disabled="!formularioValido"
    @confirm="criarUsuario"
    @cancel="fecharModal"
    @close="fecharModal"
  >
    <!-- Mensagem de erro geral -->
    <div v-if="errors.geral" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h4 class="text-sm font-medium text-red-800">Erro</h4>
          <p class="mt-1 text-sm text-red-700">{{ errors.geral }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="criarUsuario" class="space-y-6">
      <!-- Campo Nome -->
      <div>
        <label for="nome" class="block text-sm font-medium text-neutral-700 mb-2">
          Nome Completo
        </label>
        <BaseInput
          id="nome"
          v-model="form.nome"
          type="text"
          placeholder="Digite o nome completo"
          :error="errors.nome"
          required
        />
      </div>

      <!-- Campo Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">
          E-mail
        </label>
        <BaseInput
          id="email"
          v-model="form.email"
          type="email"
          placeholder="usuario@exemplo.com"
          :error="errors.email"
          required
        />
      </div>

      <!-- Campo Senha -->
      <div>
        <label for="senha" class="block text-sm font-medium text-neutral-700 mb-2">
          Senha
        </label>
        <BaseInput
          id="senha"
          v-model="form.senha"
          type="password"
          placeholder="Digite uma senha segura (mín. 6 caracteres)"
          :error="errors.senha"
          required
        />
      </div>

      <!-- Campo Confirmar Senha -->
      <div>
        <label for="confirmarSenha" class="block text-sm font-medium text-neutral-700 mb-2">
          Confirmar Senha
        </label>
        <div class="relative">
          <BaseInput
            id="confirmarSenha"
            v-model="form.confirmarSenha"
            type="password"
            placeholder="Digite a senha novamente"
            :error="errors.confirmarSenha"
            required
          />
          <!-- Ícone de sucesso quando senhas coincidem -->
          <div 
            v-if="form.confirmarSenha && form.senha && form.confirmarSenha === form.senha && !errors.confirmarSenha"
            class="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <!-- Mensagem de confirmação -->
        <p 
          v-if="form.confirmarSenha && form.senha && form.confirmarSenha === form.senha && !errors.confirmarSenha"
          class="mt-1 text-sm text-green-600"
        >
          ✓ As senhas coincidem
        </p>
      </div>

      <!-- Campo Role -->
      <div>
        <label for="role" class="block text-sm font-medium text-neutral-700 mb-2">
          Tipo de Usuário
        </label>
        <select
          id="role"
          v-model="form.role"
          class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
          <option value="atendente">Atendente</option>
        </select>
        <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
      </div>

      <!-- Informações adicionais -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-blue-800">Informação</h4>
            <p class="mt-1 text-sm text-blue-700">
              O usuário receberá um e-mail com as credenciais de acesso após a criação da conta.
            </p>
          </div>
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { useToastNotification as useToast, POSITION } from '~/composables/useToastNotification'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'usuario-criado': []
}>()

// Composables
const toast = useToast()

// Estado reativo do modal
const modalAberto = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Estado do formulário
const form = ref({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  role: ''
})

// Estado de carregamento
const carregandoCriacao = ref(false)

// Erros de validação
const errors = ref<Record<string, string>>({})

// Computed para validar formulário
const formularioValido = computed(() => {
  return form.value.nome.trim() !== '' &&
         form.value.email.trim() !== '' &&
         form.value.senha.trim() !== '' &&
         form.value.confirmarSenha.trim() !== '' &&
         form.value.role !== '' &&
         Object.keys(errors.value).length === 0
})

// Função para validar campos
const validarFormulario = () => {
  errors.value = {}

  // Validar nome
  if (!form.value.nome.trim()) {
    errors.value.nome = 'Nome é obrigatório'
  } else if (form.value.nome.trim().length < 2) {
    errors.value.nome = 'Nome deve ter pelo menos 2 caracteres'
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = 'E-mail é obrigatório'
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'E-mail deve ter um formato válido'
  }

  // Validar senha
  if (!form.value.senha.trim()) {
    errors.value.senha = 'Senha é obrigatória'
  } else if (form.value.senha.length < 6) {
    errors.value.senha = 'Senha deve ter pelo menos 6 caracteres'
  }

  // Validar confirmação de senha
  if (!form.value.confirmarSenha.trim()) {
    errors.value.confirmarSenha = 'Confirmação de senha é obrigatória'
  } else if (form.value.senha !== form.value.confirmarSenha) {
    errors.value.confirmarSenha = 'As senhas não coincidem'
  }

  // Validar role
  if (!form.value.role) {
    errors.value.role = 'Tipo de usuário é obrigatório'
  }
}

// Função para criar usuário
const criarUsuario = async () => {
  validarFormulario()
  
  if (!formularioValido.value) {
    return
  }

  carregandoCriacao.value = true
  
  // Mostrar toast informativo de início do processo
  toast.info('Criando usuário...')
  
  try {
    // Chamar API diretamente usando $fetch
    const resultado = await $fetch<{
      success: boolean
      message: string
      user?: {
        id: string
        email: string
      }
      profile?: {
        id: number
        user_id: string | null
        nome: string | null
        email: string | null
        role: string | null
      }
    }>('/api/usuarios', {
      method: 'POST',
      body: {
        nome: form.value.nome.trim(),
        email: form.value.email.toLowerCase().trim(),
        senha: form.value.senha,
        role: form.value.role
      }
    })

    if (resultado.success) {
      // Sucesso - mostrar toast de sucesso
      toast.success('Usuário criado com sucesso!')
      
      // Emitir evento e fechar modal
      emit('usuario-criado')
      fecharModal()
      
    } else {
      // Erro da API - mostrar toast de erro e mensagem no modal
      toast.error(resultado.message || 'Erro ao criar usuário')
      
      errors.value.geral = resultado.message || 'Erro ao criar usuário'
    }
    
  } catch (error: any) {
    
    let mensagemErro = 'Erro interno. Tente novamente.'
    
    // Se for um erro da API, mostrar a mensagem específica
    if (error.data?.statusMessage) {
      mensagemErro = error.data.statusMessage
    } else if (error.data?.message) {
      mensagemErro = error.data.message
    }
    
    // Mostrar toast de erro
    toast.error(mensagemErro)
    
    // Mostrar erro no modal também
    errors.value.geral = mensagemErro
  } finally {
    carregandoCriacao.value = false
  }
}

// Função para fechar modal
const fecharModal = () => {
  modalAberto.value = false
  
  // Resetar formulário após um pequeno delay para não interferir com a animação
  setTimeout(() => {
    form.value = {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      role: ''
    }
    errors.value = {}
  }, 300)
}

// Watchers para validação em tempo real
watch(() => form.value.nome, () => {
  if (errors.value.nome) {
    validarFormulario()
  }
})

watch(() => form.value.email, () => {
  if (errors.value.email) {
    validarFormulario()
  }
})

watch(() => form.value.senha, () => {
  if (errors.value.senha) {
    validarFormulario()
  }
})

watch(() => form.value.confirmarSenha, () => {
  if (errors.value.confirmarSenha) {
    validarFormulario()
  }
})

watch(() => form.value.role, () => {
  if (errors.value.role) {
    validarFormulario()
  }
})

// Watcher especial para revalidar confirmação quando senha principal muda
watch(() => form.value.senha, () => {
  if (errors.value.senha) {
    validarFormulario()
  }
  
  // Se já tem confirmação digitada, revalidar também
  if (form.value.confirmarSenha && errors.value.confirmarSenha) {
    validarFormulario()
  }
})
</script>