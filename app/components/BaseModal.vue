<template>
  <!-- Overlay do modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 overflow-y-auto"
        :style="`z-index: ${zIndex};`"
        @click="handleOverlayClick"
      >
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        <!-- Container do modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="modelValue"
              :class="[
                'relative w-full bg-white rounded-lg shadow-xl transform transition-all',
                sizeClasses
              ]"
              @click.stop
            >
              <!-- Header -->
              <header v-if="showHeader" class="px-6 py-4 border-b border-neutral-200">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 v-if="title" class="text-lg font-semibold text-neutral-900">
                      {{ title }}
                    </h3>
                    <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">
                      {{ subtitle }}
                    </p>
                    <!-- Slot para header customizado -->
                    <slot name="header" />
                  </div>
                  
                  <button
                    v-if="showCloseButton"
                    @click="closeModal"
                    class="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    :aria-label="closeButtonLabel"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </header>

              <!-- Content -->
              <main 
                :class="[
                  'px-6',
                  showHeader && showFooter ? 'py-6' : 
                  showHeader ? 'py-6 pb-6' :
                  showFooter ? 'pt-6 pb-0' : 'py-6'
                ]"
              >
                <slot />
              </main>

              <!-- Footer -->
              <footer v-if="showFooter" class="px-6 py-4 bg-neutral-50 border-t border-neutral-200 rounded-b-lg">
                <div class="flex items-center justify-end space-x-3">
                  <!-- Slot para footer customizado -->
                  <slot name="footer">
                    <!-- Botões padrão se não houver slot customizado -->
                    <BaseButton
                      v-if="showCancelButton"
                      variant="outline"
                      @click="handleCancel"
                      :disabled="loading"
                    >
                      {{ cancelButtonText }}
                    </BaseButton>
                    
                    <BaseButton
                      v-if="showConfirmButton"
                      :variant="confirmButtonVariant"
                      @click="handleConfirm"
                      :loading="loading"
                      :disabled="confirmDisabled"
                    >
                      {{ confirmButtonText }}
                    </BaseButton>
                  </slot>
                </div>
              </footer>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// Prop para z-index customizado
const zIndex = computed(() => props.zIndex ?? 50)
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showHeader?: boolean
  showFooter?: boolean
  showCloseButton?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  confirmButtonVariant?: 'primary' | 'secondary' | 'danger' | 'outline'
  closeButtonLabel?: string
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  loading?: boolean
  confirmDisabled?: boolean
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showHeader: true,
  showFooter: true,
  showCloseButton: true,
  showCancelButton: true,
  showConfirmButton: true,
  cancelButtonText: 'Cancelar',
  confirmButtonText: 'Confirmar',
  confirmButtonVariant: 'primary',
  closeButtonLabel: 'Fechar modal',
  closeOnOverlayClick: true,
  closeOnEsc: true,
  loading: false,
  confirmDisabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
  close: []
}>()

// Classes de tamanho do modal
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }
  return sizes[props.size]
})

// Fechar modal
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Handle overlay click
const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlayClick && event.target === event.currentTarget) {
    closeModal()
  }
}

// Handle ESC key
const handleEscKey = (event: KeyboardEvent) => {
  if (props.closeOnEsc && event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

// Handle confirm
const handleConfirm = () => {
  emit('confirm')
}

// Handle cancel
const handleCancel = () => {
  emit('cancel')
  closeModal()
}

// Adicionar/remover event listener para ESC
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey)
})

// Prevenir scroll do body quando modal está aberto
watch(() => props.modelValue, (isOpen) => {
  if (!process.client) return
  
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Limpar estilo quando componente é desmontado
onBeforeUnmount(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>