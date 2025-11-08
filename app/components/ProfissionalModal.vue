<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="modalTitle"
    size="md"
    @confirm="handleSave"
    @cancel="handleCancel"
    @close="handleClose"
    :confirm-disabled="!isFormValid"
    :loading="props.carregando"
  >
    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Dropdown para Perfil/Usuário -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Usuário/Perfil <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.perfil_id"
          class="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.perfil_id }"
          @change="clearError('perfil_id')"
        >
          <option value="">Selecione um usuário...</option>
          <option 
            v-for="perfil in perfis" 
            :key="perfil.id" 
            :value="perfil.id"
          >
            {{ perfil.nome }}
          </option>
        </select>
        <p v-if="errors.perfil_id" class="text-sm text-red-600">{{ errors.perfil_id }}</p>
      </div>

      <!-- Dropdown para Especialidade -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Especialidade <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.especialidade_id"
          class="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.especialidade_id }"
          @change="clearError('especialidade_id')"
        >
          <option value="">Selecione uma especialidade...</option>
          <option 
            v-for="especialidade in especialidades" 
            :key="especialidade.id" 
            :value="especialidade.id"
          >
            {{ especialidade.especialidade }}
          </option>
        </select>
        <p v-if="errors.especialidade_id" class="text-sm text-red-600">{{ errors.especialidade_id }}</p>
      </div>

      <!-- Informações sobre o cadastro -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <InformationCircleIcon class="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
          <div class="text-sm text-blue-700">
            <p class="font-medium mb-1">Sobre o cadastro de profissionais:</p>
            <p>Selecione um usuário/perfil existente e associe a uma especialidade para criar um novo profissional no sistema.</p>
          </div>
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useToastNotification as useToast } from '~/composables/useToastNotification'
import type { Especialidade } from '~/types/especialidade'
import type { PerfilRPC } from '~/types/database.types'
import type { ProfissionalRPC } from '~/types/user'

// Props
interface Props {
  modelValue: boolean
  perfis: PerfilRPC[]
  especialidades: Especialidade[]
  isEdicao?: boolean
  profissional?: ProfissionalRPC | null
  carregando?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  profissional: null,
  carregando: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  salvar: [data: { profile_id: number; especialidade_id: number }]
  cancelar: []
  fechar: []
}>()

// Composables
const { editarProfissional } = useProfissionais()
const toast = useToast()

// Estado do formulário
const form = ref({
  perfil_id: '',
  especialidade_id: ''
})

// Erros de validação
const errors = ref({
  perfil_id: '',
  especialidade_id: ''
})

// Computed
const modalTitle = computed(() => {
  return props.isEdicao ? 'Editar Profissional' : 'Novo Profissional'
})

const isFormValid = computed(() => {
  return form.value.perfil_id && form.value.especialidade_id && !hasErrors.value
})

const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '')
})

// Métodos
const clearError = (field: keyof typeof errors.value) => {
  errors.value[field] = ''
}

const validateForm = () => {
  // Reset errors
  errors.value.perfil_id = ''
  errors.value.especialidade_id = ''

  let isValid = true

  if (!form.value.perfil_id) {
    errors.value.perfil_id = 'Selecione um usuário/perfil'
    isValid = false
  }

  if (!form.value.especialidade_id) {
    errors.value.especialidade_id = 'Selecione uma especialidade'
    isValid = false
  }

  return isValid
}

const resetForm = () => {
  form.value.perfil_id = ''
  form.value.especialidade_id = ''
  errors.value.perfil_id = ''
  errors.value.especialidade_id = ''
}

const handleSave = async () => {
  if (!validateForm()) return

  const perfil_id = parseInt(form.value.perfil_id)
  const especialidade_id = parseInt(form.value.especialidade_id)

  try {
    // Para criação de novo profissional
    if (!props.isEdicao) {
      // Apenas emite o evento para o componente pai tratar a inserção
      emit('salvar', { profile_id: perfil_id, especialidade_id })
    } else {
      // Para edição de profissional existente
      if (!props.profissional?.profissional_id) {
        toast.error('ID do profissional não encontrado para edição')
        return
      }

      const resultado = await editarProfissional(props.profissional.profissional_id, perfil_id, especialidade_id)
      console.log('Resultado ao editar profissional:', resultado)
      
      if (resultado.success) {
        console.log('Exibindo toast de sucesso:', resultado.message)
        toast.success(resultado.message)
        // Aguardar um pouco para garantir que o toast seja exibido
        setTimeout(() => {
          emit('salvar', { profile_id: perfil_id, especialidade_id })
        }, 300)
      } else {
        console.log('Exibindo toast de erro:', resultado.message)
        toast.error(resultado.message)
      }
    }
  } catch (error) {
    console.error('Erro ao salvar profissional:', error)
    toast.error('Erro inesperado ao salvar profissional')
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancelar')
}

const handleClose = () => {
  resetForm()
  emit('fechar')
}

// Watch para resetar o formulário quando o modal abrir/fechar
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})

// Carregar dados para edição (implementação futura)
watch(() => props.profissional, (newData) => {
  if (newData && props.isEdicao) {
    // TODO: Implementar carregamento de dados para edição
    form.value.perfil_id = newData.perfil_id?.toString() || ''
    form.value.especialidade_id = newData.especialidade_id?.toString() || ''
  }
})
</script>