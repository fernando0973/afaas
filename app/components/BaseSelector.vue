<template>
  <div :class="['w-full', containerClass]">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-text mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="normalizedValue"
        :disabled="disabled"
        :required="required"
        v-bind="selectAttrs"
        :class="[selectClasses, $attrs.class]"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" disabled value="">
          {{ placeholder }}
        </option>
        <template v-if="optionsList.length > 0">
          <option
            v-for="option in optionsList"
            :key="option.value"
            :value="String(option.value)"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </template>
        <slot />
      </select>
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
import { computed, ref, useAttrs } from 'vue'
import { useUniqueId } from '~/composables/useUniqueId'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  containerClass?: string
  options?: SelectOption[]
  valueType?: 'string' | 'number'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
  required: false,
  options: () => [],
  valueType: 'string'
})

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const isFocused = ref(false)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  change: [value: string | number | null, event: Event]
}>()

const generatedId = useUniqueId('select')
const selectId = computed(() => props.id || generatedId.value)

const optionsList = computed(() => props.options ?? [])

const normalizedValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) {
    return ''
  }
  return String(props.modelValue)
})

const selectAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>
  return rest
})

const selectClasses = computed(() => {
  const base = [
    'w-full px-3 py-2',
    'text-base text-text',
    'bg-surface border rounded-lg',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60'
  ]

  if (props.error) {
    base.push('border-danger focus:border-danger focus:ring-danger/20')
  } else if (isFocused.value) {
    base.push('border-brand focus:border-brand focus:ring-brand/20')
  } else {
    base.push('border-border hover:border-border-strong focus:border-brand focus:ring-brand/20')
  }

  return base.join(' ')
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const rawValue = target.value

  let value: string | number | null
  if (rawValue === '') {
    value = null
  } else if (props.valueType === 'number') {
    const numericValue = Number(rawValue)
    value = Number.isNaN(numericValue) ? null : numericValue
  } else {
    value = rawValue
  }

  emit('update:modelValue', value)
  emit('change', value, event)
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
