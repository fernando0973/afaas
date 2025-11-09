<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    size="md"
    :confirm-button-text="confirmButtonText"
    :loading="loading"
    :confirm-disabled="!isFormValid"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <!-- Conteúdo do modal -->
    <form @submit.prevent="handleConfirm" class="space-y-6">
      <!-- Campo Especialidade -->
      <BaseInput
        :model-value="form.especialidade"
        @update:model-value="form.especialidade = $event"
        label="Nome da Especialidade"
        placeholder="Digite o nome da especialidade"
        required
        :error="errors.especialidade"
        @blur="validateField('especialidade')"
        @input="clearFieldError('especialidade')"
      >
        <template #prefix>
          <AcademicCapIcon class="w-5 h-5 text-neutral-400" />
        </template>
      </BaseInput>

      <!-- Informações adicionais se for edição -->
      <div v-if="isEdicao && especialidadeId" class="bg-neutral-50 rounded-lg p-4">
        <div class="flex items-center space-x-2 text-sm text-neutral-600">
          <InformationCircleIcon class="w-4 h-4" />
          <span>Editando especialidade ID: {{ especialidadeId }}</span>
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { AcademicCapIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import type { Especialidade } from '~/types/especialidade'

interface Props {
  modelValue: boolean
  isEdicao?: boolean
  especialidadeId?: number | null
  especialidadeData?: Especialidade | null
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  especialidadeId: null,
  especialidadeData: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: { especialidade: string; id?: number }]
  cancel: []
  close: []
}>()

// Estado do formulário
const form = reactive({
  especialidade: ''
})

// Estado de loading e erros
const loading = ref(false)
const errors = reactive({
  especialidade: ''
})

// Computed properties
const modalTitle = computed(() => 
  props.isEdicao ? 'Editar Especialidade' : 'Nova Especialidade'
)

const modalSubtitle = computed(() => 
  props.isEdicao 
    ? 'Modifique os dados da especialidade existente'
    : 'Adicione uma nova especialidade ao sistema'
)

const confirmButtonText = computed(() => 
  props.isEdicao ? 'Salvar Alterações' : 'Criar Especialidade'
)

const isFormValid = computed(() => {
  return form.especialidade.trim().length > 0 && !errors.especialidade
})

// Funções de validação
const validateField = (field: keyof typeof form) => {
  switch (field) {
    case 'especialidade':
      if (!form.especialidade.trim()) {
        errors.especialidade = 'Nome da especialidade é obrigatório'
      } else if (form.especialidade.trim().length < 2) {
        errors.especialidade = 'Nome deve ter pelo menos 2 caracteres'
      } else if (form.especialidade.trim().length > 100) {
        errors.especialidade = 'Nome deve ter no máximo 100 caracteres'
      } else {
        errors.especialidade = ''
      }
      break
  }
}

const clearFieldError = (field: keyof typeof errors) => {
  errors[field] = ''
}

const validateForm = () => {
  validateField('especialidade')
  return isFormValid.value
}

// Handlers do modal
const handleConfirm = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  try {
    const saveData = {
      especialidade: form.especialidade.trim(),
      ...(props.isEdicao && props.especialidadeId && { id: props.especialidadeId })
    }
    
    emit('save', saveData)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('close')
}

// Resetar formulário quando modal abre/fecha
const resetForm = () => {
  form.especialidade = ''
  errors.especialidade = ''
  loading.value = false
}

// Carregar dados para edição
const loadEspecialidadeData = () => {
  if (props.isEdicao && props.especialidadeData) {
    form.especialidade = props.especialidadeData.especialidade || ''
  }
}

// Watchers
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.isEdicao) {
      loadEspecialidadeData()
    } else {
      resetForm()
    }
  } else {
    // Pequeno delay para evitar flash durante a transição
    setTimeout(resetForm, 200)
  }
})

watch(() => props.especialidadeData, () => {
  if (props.modelValue && props.isEdicao) {
    loadEspecialidadeData()
  }
})

// Inicialização
onMounted(() => {
  if (props.modelValue && props.isEdicao) {
    loadEspecialidadeData()
  }
})
</script>