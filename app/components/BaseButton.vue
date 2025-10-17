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
import { computed } from 'vue'

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
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  // Variantes
  const variants = {
    primary: [
      'bg-brand text-brand-foreground',
      'hover:bg-brand-dark',
      'focus:ring-brand',
      'shadow-sm'
    ],
    secondary: [
      'bg-secondary-500 text-white',
      'hover:bg-secondary-600',
      'focus:ring-secondary-500',
      'shadow-sm'
    ],
    outline: [
      'bg-transparent border-2 border-border',
      'text-text hover:bg-surface-muted',
      'focus:ring-brand'
    ],
    ghost: [
      'bg-transparent text-text',
      'hover:bg-surface-muted',
      'focus:ring-brand'
    ],
    danger: [
      'bg-danger text-white',
      'hover:bg-danger-dark',
      'focus:ring-danger',
      'shadow-sm'
    ]
  }

  // Tamanhos
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // Width
  const width = props.fullWidth ? 'w-full' : ''

  return [
    ...base,
    ...variants[props.variant],
    sizes[props.size],
    width
  ].filter(Boolean).join(' ')
})
</script>
