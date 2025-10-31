<template>
  <div class="w-full max-w-md">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text mb-2">Bem-vindo de volta</h1>
      <p class="text-text-muted">Entre com suas credenciais para acessar o sistema</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <BaseInput
        v-model="email"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        :error="errors.email"
        required
      >
        <template #prefix>
          <EnvelopeIcon class="w-5 h-5" />
        </template>
      </BaseInput>

      <BaseInput
        v-model="password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        :error="errors.password"
        required
      >
        <template #prefix>
          <LockClosedIcon class="w-5 h-5" />
        </template>
      </BaseInput>

      <div class="pt-2">
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </BaseButton>
      </div>
    </form>

    <!-- Link para esqueci a senha -->
    <div class="mt-6 text-center">
      <NuxtLink
        to="/esqueci-senha"
        class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all duration-200"
      >
        Esqueci minha senha
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const errors = ref({
  email: '',
  password: ''
})

const toast = useToast()
const { login } = useAuth()

const loading = ref(false)

const validateForm = () => {
  errors.value = { email: '', password: '' }
  let isValid = true

  if (!email.value) {
    errors.value.email = 'E-mail é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'E-mail inválido'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter no mínimo 6 caracteres'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    toast.warning('Por favor, corrija os erros no formulário')
    return
  }

  // Evita múltiplos cliques
  if (loading.value) {
    return
  }

  loading.value = true
  
  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      toast.success('Login realizado com sucesso!')
      // O redirecionamento já é feito no composable useAuth
    } else {
      toast.error(result.error || 'Erro ao fazer login. Verifique suas credenciais.')
    }
  } catch (error) {
    console.error('Erro no login:', error)
    toast.error('Erro inesperado durante o login.')
  } finally {
    loading.value = false
  }
}
</script>
