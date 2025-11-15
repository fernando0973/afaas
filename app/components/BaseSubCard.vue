<template>
  <div :class="cardClasses">
    <!-- Header Checkbox (se fornecido) -->
    <div v-if="hasCheckboxHeader" class="flex items-center space-x-3 pb-4 border-b border-neutral-200 mb-4">
      <input
        :id="checkboxId"
        v-model="isChecked"
        type="checkbox"
        :class="checkboxClasses"
        @change="handleCheckboxChange"
      />
      <label :for="checkboxId" :class="checkboxLabelClasses">
        {{ checkboxLabel }}
      </label>
    </div>

    <!-- Header simples (se não for checkbox) -->
    <div v-else-if="title" class="pb-4 border-b border-neutral-200 mb-4">
      <h3 :class="titleClasses">{{ title }}</h3>
      <p v-if="description" :class="descriptionClasses">{{ description }}</p>
    </div>

    <!-- Conteúdo -->
    <div v-show="!hasCheckboxHeader || isChecked" :class="contentClasses">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  checkboxLabel?: string
  checkboxId?: string
  modelValue?: boolean
  variant?: 'primary' | 'secondary' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  collapsible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  collapsible: false,
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const hasCheckboxHeader = computed(() => {
  return props.checkboxLabel && props.checkboxId
})

const cardClasses = computed(() => {
  const base = ['border rounded-lg']
  
  const variants = {
    primary: 'bg-blue-50 border-blue-200',
    secondary: 'bg-gray-50 border-gray-200', 
    neutral: 'bg-neutral-50 border-neutral-200'
  }
  
  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  base.push(variants[props.variant])
  base.push(sizes[props.size])
  
  return base.join(' ')
})

const checkboxClasses = computed(() => {
  return 'w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500'
})

const checkboxLabelClasses = computed(() => {
  return 'text-base font-medium text-neutral-800 cursor-pointer flex-1'
})

const titleClasses = computed(() => {
  return 'text-base font-medium text-neutral-800'
})

const descriptionClasses = computed(() => {
  return 'text-sm text-neutral-600 mt-1'
})

const contentClasses = computed(() => {
  return 'space-y-4'
})

const handleCheckboxChange = () => {
  // Emite o evento para atualizar o v-model
  emit('update:modelValue', isChecked.value)
}
</script>