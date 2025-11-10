<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="title"
    size="sm"
    :confirm-button-text="confirmText"
    :cancel-button-text="cancelText"
    :confirm-button-variant="confirmVariant"
    :loading="loading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <!-- Conteúdo do modal -->
    <div class="flex items-start space-x-3">
      <!-- Ícone de aviso -->
      <div class="flex-shrink-0">
        <component 
          :is="icon" 
          :class="[
            'w-8 h-8',
            iconColor
          ]" 
        />
      </div>
      
      <!-- Conteúdo da mensagem -->
      <div class="flex-1">
        <p class="text-sm text-neutral-700 leading-relaxed">
          {{ message }}
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
// @ts-ignore
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

type ConfirmationType = 'danger' | 'warning' | 'info' | 'success'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  type?: ConfirmationType
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar ação',
  type: 'danger',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
  close: []
}>()

// Computed properties baseadas no tipo
const icon = computed(() => {
  const icons = {
    danger: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon
  } as const
  return icons[props.type as keyof typeof icons]
})

const iconColor = computed(() => {
  const colors = {
    danger: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    success: 'text-green-400'
  } as const
  return colors[props.type as keyof typeof colors]
})

const confirmVariant = computed(() => {
  const variants = {
    danger: 'danger',
    warning: 'danger', // usa danger para warning também
    info: 'primary',
    success: 'primary'
  } as const
  return variants[props.type as keyof typeof variants] as 'danger' | 'primary' | 'secondary' | 'outline'
})

// Handlers
const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('close')
}
</script>