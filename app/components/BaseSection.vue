<template>
  <section :class="sectionClasses">
    <!-- Header da Seção -->
    <div v-if="hasHeader" class="flex items-center gap-3 mb-6">
      <div v-if="number || $slots.icon" :class="iconClasses">
        <slot name="icon">
          <span v-if="number" :class="numberClasses">{{ number }}</span>
        </slot>
      </div>
      <div v-if="title || description || $slots.header">
        <slot name="header">
          <h2 v-if="title" :class="titleClasses">{{ title }}</h2>
          <p v-if="description" :class="descriptionClasses">{{ description }}</p>
        </slot>
      </div>
    </div>

    <!-- Conteúdo -->
    <div :class="contentClasses">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  number?: string | number
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  shadow?: boolean
  border?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  shadow: false,
  border: true
})

const slots = useSlots()

const hasHeader = computed(() => {
  return props.title || props.description || props.number || slots.icon || slots.header
})

const sectionClasses = computed(() => {
  const base = ['bg-white rounded-xl']
  
  if (props.border) {
    base.push('border border-neutral-200')
  }
  
  if (props.shadow) {
    base.push('shadow-sm')
  }
  
  // Padding baseado no tamanho
  const sizePadding = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  base.push(sizePadding[props.size])
  
  return base.join(' ')
})

const iconClasses = computed(() => {
  const base = ['w-8 h-8 rounded-full flex items-center justify-center']
  
  const variants = {
    primary: 'bg-blue-100',
    secondary: 'bg-gray-100',
    success: 'bg-green-100',
    warning: 'bg-orange-100',
    danger: 'bg-red-100',
    info: 'bg-purple-100'
  }
  
  base.push(variants[props.variant])
  
  return base.join(' ')
})

const numberClasses = computed(() => {
  const base = ['text-sm font-semibold']
  
  const variants = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    danger: 'text-red-600',
    info: 'text-purple-600'
  }
  
  base.push(variants[props.variant])
  
  return base.join(' ')
})

const titleClasses = computed(() => {
  return 'text-lg font-semibold text-neutral-900'
})

const descriptionClasses = computed(() => {
  return 'text-sm text-neutral-600'
})

const contentClasses = computed(() => {
  return props.contentClass || ''
})
</script>