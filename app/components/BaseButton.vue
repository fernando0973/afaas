<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="inline-block animate-spin mr-2">⏳</span>
    <span v-if="$slots.iconLeft" class="inline-flex -ml-0.5 mr-2">
      <slot name="iconLeft" />
    </span>
    <slot />
    <span v-if="$slots.iconRight" class="inline-flex -mr-0.5 ml-2">
      <slot name="iconRight" />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  const base = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-colors duration-200',
    'focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  // Variantes
  const variants: Record<string, string[]> = {
    primary: [
      'bg-primary-500 text-white',
      'hover:bg-primary-600',
    ],
    secondary: [
      'bg-secondary-500 text-white',
      'hover:bg-secondary-600',
    ],
    outline: [
      'bg-transparent border-2 border-primary-500',
      'text-primary-500 hover:bg-primary-50',
    ],
    ghost: [
      'bg-transparent text-primary-500',
      'hover:bg-primary-50',
    ],
    danger: [
      'bg-red-600 text-white',
      'hover:bg-red-700',
    ]
  }

  // Tamanhos
  const sizes: Record<string, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base'
  }

  // Width
  const width = props.fullWidth ? 'w-full' : ''

  const variantClasses = variants[props.variant] ?? variants.primary ?? []
  const sizeClass = sizes[props.size] ?? sizes.md ?? ''

  const allClasses = [
    ...base,
    ...variantClasses,
    sizeClass,
    width
  ].filter(Boolean)

  return allClasses.join(' ')
})
</script>
