<template>
  <div :class="['w-full', containerClass]">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-text mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>

    <div class="relative">
      <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
  v-bind="inputAttrs"
  :class="[inputClasses, $attrs.class]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="type === 'password'" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="text-text-muted hover:text-text focus:outline-none transition-colors"
          :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
        >
          <EyeIcon v-if="!showPassword" class="w-5 h-5" />
          <EyeSlashIcon v-else class="w-5 h-5" />
        </button>
      </div>

      <div v-else-if="$slots.suffix" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-sm text-danger">
      {{ error }}
    </p>
    
    <p v-else-if="hint" class="mt-1.5 text-sm text-text-muted">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useUniqueId } from '~/composables/useUniqueId'

interface Props {
  modelValue?: string | number | null
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  id?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false
})

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const slots = useSlots()
const isFocused = ref(false)
const showPassword = ref(false)

const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>
  return rest
})

// Use SSR-safe ID generation
const generatedId = useUniqueId('input')
const inputId = computed(() => props.id || generatedId.value)

const computedType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const inputClasses = computed(() => {
  const base = [
    'w-full py-2',
    'text-base text-text',
    'bg-surface border rounded-lg',
    'placeholder:text-text-light',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60'
  ]

  // Padding baseado em slots
  const paddingLeft = slots.prefix ? 'pl-10' : 'px-3'
  const paddingRight = (props.type === 'password' || slots.suffix) ? 'pr-10' : 'px-3'
  
  base.push(paddingLeft)
  if (paddingLeft !== 'px-3') {
    base.push(paddingRight)
  }

  // Estados
  if (props.error) {
    return [...base, 'border-danger focus:border-danger focus:ring-danger/20'].join(' ')
  }

  if (isFocused.value) {
    return [...base, 'border-brand focus:border-brand focus:ring-brand/20'].join(' ')
  }

  return [...base, 'border-border hover:border-border-strong focus:border-brand focus:ring-brand/20'].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}
</script>
