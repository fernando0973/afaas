<template>
  <BaseModal
    :model-value="isOpen"
    title="Editar Usuário"
    @update:model-value="fecharModal"
    :show-footer="false"
  >
    <form @submit.prevent="salvarUsuario" class="space-y-4">
      <BaseInput
        id="nome"
        v-model="formulario.nome"
        label="Nome completo"
        type="text"
        placeholder="Digite o nome completo"
        :error="erros.nome"
        required
      />

      <BaseInput
        id="email"
        v-model="formulario.email"
        label="E-mail"
        type="email"
        placeholder="Digite o e-mail"
        :error="erros.email"
        required
      />

      <BaseInput
        id="senha"
        v-model="formulario.senha"
        label="Nova senha (opcional)"
        type="password"
        placeholder="Digite a nova senha (deixe vazio para não alterar)"
        :error="erros.senha"
      />

      <BaseInput
        v-if="formulario.senha"
        id="confirmar-senha"
        v-model="formulario.confirmarSenha"
        label="Confirmar nova senha"
        type="password"
        placeholder="Digite a nova senha novamente"
        :error="erros.confirmarSenha"
      />

      <!-- Indicador visual de força da senha -->
      <div v-if="formulario.senha" class="space-y-2">
        <div class="flex items-center space-x-2">
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div
              :class="[
                'h-2 rounded-full transition-all duration-300',
                forcaSenha.cor
              ]"
              :style="{ width: forcaSenha.porcentagem + '%' }"
            />
          </div>
          <span :class="['text-sm font-medium', forcaSenha.corTexto]">
            {{ forcaSenha.texto }}
          </span>
        </div>
      </div>

      <!-- Indicador de senhas correspondentes -->
      <div v-if="formulario.senha && formulario.confirmarSenha" class="flex items-center space-x-2">
        <div
          :class="[
            'w-4 h-4 rounded-full',
            senhasCorrespondem ? 'bg-green-500' : 'bg-red-500'
          ]"
        />
        <span
          :class="[
            'text-sm',
            senhasCorrespondem ? 'text-green-700' : 'text-red-700'
          ]"
        >
          {{ senhasCorrespondem ? 'Senhas correspondem' : 'Senhas não correspondem' }}
        </span>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <BaseButton
          type="button"
          variant="secondary"
          @click="fecharModal"
          :disabled="carregando"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :loading="carregando"
          :disabled="!formularioValido"
        >
          Salvar alterações
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { useToastNotification as useToast, POSITION } from '~/composables/useToastNotification'
import type { PerfilRPC } from '~/types/database.types'

interface Props {
  isOpen: boolean
  usuario?: PerfilRPC | null
}

interface Emits {
  (e: 'close'): void
  (e: 'usuario-atualizado'): void
}

const props = withDefaults(defineProps<Props>(), {
  usuario: null
})

const emit = defineEmits<Emits>()
const toast = useToast()

// Estado do formulário
const formulario = reactive({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: ''
})

// Estado dos erros
const erros = reactive({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: ''
})

// Estado de carregamento
const carregando = ref(false)

// Watchers para popular o formulário quando o usuário mudar
watch(() => props.usuario, (novoUsuario) => {
  if (novoUsuario) {
    formulario.nome = novoUsuario.nome || ''
    formulario.email = novoUsuario.email || ''
    formulario.senha = ''
    formulario.confirmarSenha = ''
    limparErros()
  }
}, { immediate: true })

// Computed para força da senha
const forcaSenha = computed(() => {
  const senha = formulario.senha
  if (!senha) return { porcentagem: 0, cor: 'bg-gray-300', corTexto: 'text-gray-500', texto: '' }

  let pontuacao = 0
  
  // Critérios de força
  if (senha.length >= 8) pontuacao += 25
  if (/[a-z]/.test(senha)) pontuacao += 25
  if (/[A-Z]/.test(senha)) pontuacao += 25
  if (/\d/.test(senha)) pontuacao += 12.5
  if (/[^a-zA-Z\d]/.test(senha)) pontuacao += 12.5

  if (pontuacao < 25) {
    return { porcentagem: pontuacao, cor: 'bg-red-500', corTexto: 'text-red-700', texto: 'Fraca' }
  } else if (pontuacao < 50) {
    return { porcentagem: pontuacao, cor: 'bg-yellow-500', corTexto: 'text-yellow-700', texto: 'Razoável' }
  } else if (pontuacao < 75) {
    return { porcentagem: pontuacao, cor: 'bg-blue-500', corTexto: 'text-blue-700', texto: 'Boa' }
  } else {
    return { porcentagem: pontuacao, cor: 'bg-green-500', corTexto: 'text-green-700', texto: 'Forte' }
  }
})

// Computed para verificar se as senhas correspondem
const senhasCorrespondem = computed(() => {
  if (!formulario.senha || !formulario.confirmarSenha) return true
  return formulario.senha === formulario.confirmarSenha
})

// Computed para validar o formulário
const formularioValido = computed(() => {
  const nomeValido = formulario.nome.trim().length >= 2
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)
  const senhaValida = !formulario.senha || (formulario.senha.length >= 6 && senhasCorrespondem.value)
  
  return nomeValido && emailValido && senhaValida
})

// Função para limpar erros
function limparErros() {
  Object.keys(erros).forEach(key => {
    erros[key as keyof typeof erros] = ''
  })
}

// Função para validar formulário
function validarFormulario(): boolean {
  limparErros()
  let valido = true

  // Validar nome
  if (!formulario.nome.trim()) {
    erros.nome = 'Nome é obrigatório'
    valido = false
  } else if (formulario.nome.trim().length < 2) {
    erros.nome = 'Nome deve ter pelo menos 2 caracteres'
    valido = false
  }

  // Validar email
  if (!formulario.email.trim()) {
    erros.email = 'E-mail é obrigatório'
    valido = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
    erros.email = 'E-mail inválido'
    valido = false
  }

  // Validar senha (se fornecida)
  if (formulario.senha) {
    if (formulario.senha.length < 6) {
      erros.senha = 'A senha deve ter pelo menos 6 caracteres'
      valido = false
    }

    if (!formulario.confirmarSenha) {
      erros.confirmarSenha = 'Confirmação de senha é obrigatória'
      valido = false
    } else if (formulario.senha !== formulario.confirmarSenha) {
      erros.confirmarSenha = 'Senhas não coincidem'
      valido = false
    }
  }

  return valido
}

// Função para salvar usuário
async function salvarUsuario() {
  if (!props.usuario) return

  if (!validarFormulario()) {
    toast.error('Por favor, corrija os erros no formulário')
    return
  }

  carregando.value = true

  try {
    const dadosAtualizacao: any = {
      user_id: props.usuario.user_id,
      nome: formulario.nome.trim(),
      email: formulario.email.toLowerCase().trim()
    }

    // Adicionar senha apenas se foi fornecida
    if (formulario.senha) {
      dadosAtualizacao.senha = formulario.senha
    }

    const { data, error } = await $fetch('/api/usuarios', {
      method: 'PUT',
      body: dadosAtualizacao
    })

    if (error) {
      throw new Error(error)
    }

    toast.success('Usuário atualizado com sucesso!')

    emit('usuario-atualizado')
    fecharModal()

  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    
    const mensagemErro = error?.data?.message || error?.message || 'Erro ao atualizar usuário'
    
    toast.error(mensagemErro)
  } finally {
    carregando.value = false
  }
}

// Função para fechar modal
function fecharModal() {
  formulario.nome = ''
  formulario.email = ''
  formulario.senha = ''
  formulario.confirmarSenha = ''
  limparErros()
  emit('close')
}
</script>