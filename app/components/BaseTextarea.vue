<template>
  <div class="space-y-1">
    <!-- Label -->
    <label 
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-neutral-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Wrapper do textarea -->
    <div class="relative">
      <textarea
        :id="inputId"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="placeholder"
        :rows="rows"
        :cols="cols"
        :disabled="disabled"
        :readonly="readOnly"
        :required="required"
        :maxlength="maxlength"
        :minlength="minlength"
        :class="[
          'block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none',
          {
            // Estados normais
            'border-neutral-300 focus:border-primary-500 focus:ring-primary-500': !error && !disabled,
            // Estado de erro
            'border-red-300 focus:border-red-500 focus:ring-red-500': error,
            // Estado desabilitado
            'border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed': disabled,
            // Padding baseado em tamanho
            'px-3 py-2 text-sm': size === 'sm',
            'px-3 py-2.5 text-sm': size === 'md',
            'px-4 py-3 text-base': size === 'lg'
          }
        ]"
      />
    </div>

    <!-- Contador de caracteres -->
    <div 
      v-if="showCharCount && maxlength" 
      class="flex justify-end text-xs text-neutral-500"
    >
      {{ characterCount }}/{{ maxlength }}
    </div>

    <!-- Mensagem de erro -->
    <p 
      v-if="error" 
      class="text-sm text-red-600"
      role="alert"
    >
      {{ error }}
    </p>

    <!-- Texto de ajuda -->
    <p 
      v-else-if="help" 
      class="text-sm text-neutral-600"
    >
      {{ help }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | null
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  rows?: number
  cols?: number
  maxlength?: number
  minlength?: number
  size?: 'sm' | 'md' | 'lg'
  showCharCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 4,
  size: 'md',
  showCharCount: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [event: Event]
}>()

// ID único para associar label com textarea
const inputId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)

// Contador de caracteres
const characterCount = computed(() => {
  return props.modelValue ? props.modelValue.length : 0
})

// Handlers de eventos
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>