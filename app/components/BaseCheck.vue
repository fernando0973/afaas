<template>
  <div :class="containerClasses">
    <label :for="inputId" :class="labelClasses">
      <input
        ref="inputRef"
        :id="inputId"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[inputClasses, inputClass]"
        v-bind="inputAttrs"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <div class="flex flex-col gap-1">
        <span v-if="hasLabel" :class="labelTextClasses">
          <slot>
            {{ props.label }}
          </slot>
          <span v-if="required" aria-hidden="true" class="ml-1 text-danger">*</span>
        </span>

        <span v-if="hint && !error" class="text-xs text-text-muted">
          {{ hint }}
        </span>
        <span v-if="error" class="text-xs text-danger">
          {{ error }}
        </span>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import { useUniqueId } from '~/composables/useUniqueId'

interface Props {
  modelValue?: boolean
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  containerClass?: string
  labelClass?: string
  labelTextClass?: string
  inputClass?: string
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  required: false,
  containerClass: '',
  labelClass: '',
  label: '',
  labelTextClass: 'text-sm font-medium text-text',
  inputClass: '',
  indeterminate: false
})

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()
const slots = useSlots()
const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const generatedId = useUniqueId('checkbox')
const inputId = computed(() => props.id || generatedId.value)

const containerClasses = computed(() =>
  ['w-full', props.containerClass].filter(Boolean).join(' ')
)

const labelClasses = computed(() => {
  const classes = ['inline-flex w-full items-start gap-3', 'cursor-pointer select-none']

  if (props.labelClass) {
    classes.push(props.labelClass)
  }

  if (props.disabled) {
    classes.push('opacity-60 cursor-not-allowed')
  }

  return classes.join(' ')
})

const labelTextClasses = computed(() => props.labelTextClass)

const hasLabel = computed(() => Boolean(slots.default || props.label))

const inputClasses = computed(() => {
  const base = [
    'h-4 w-4 rounded border border-border',
    'text-brand focus:ring-2 focus:ring-brand focus:ring-offset-0 focus:outline-none',
    'transition-colors duration-200',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60'
  ]

  if (props.error) {
    base.push('border-danger text-danger focus:ring-danger/40')
  } else if (isFocused.value) {
    base.push('border-brand')
  } else {
    base.push('hover:border-border-strong focus:border-brand')
  }

  return base.join(' ')
})

const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>
  return rest
})

const setIndeterminateState = (value: boolean) => {
  if (inputRef.value) {
    inputRef.value.indeterminate = value
  }
}

watch(
  () => props.indeterminate,
  (value) => {
    setIndeterminateState(value)
  },
  { immediate: true }
)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.checked
  emit('update:modelValue', value)
  emit('change', value, event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

onMounted(() => {
  setIndeterminateState(props.indeterminate)
})
</script>
