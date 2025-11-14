<template>
  <div
    class="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
    :class="borderHoverClass"
    role="button"
    tabindex="0"
    @click="emit('click')"
    @keyup="handleKeyup"
  >
    <div class="flex items-center mb-4">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
        :class="iconBgClass"
      >
        <component :is="icon" class="w-7 h-7 text-white" />
      </div>
      <h3 class="text-lg font-semibold text-neutral-900 ml-4">{{ title }}</h3>
    </div>

    <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
      {{ description }}
    </p>

    <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
      <span class="text-xs font-medium transition-colors duration-300" :class="[ctaColorClass, ctaHoverClass]">
        Ver relatório
      </span>
      <ArrowRightIcon
        class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
        :class="arrowColor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/solid'

const props = withDefaults(defineProps<{
  title: string
  description: string
  icon: Component
  iconBgClass: string
  borderHoverClass: string
  ctaColorClass: string
  ctaHoverClass: string
  arrowColorClass?: string
}>(), {
  arrowColorClass: ''
})

const emit = defineEmits<{
  (event: 'click'): void
}>()

const arrowColor = computed(() => props.arrowColorClass || props.ctaColorClass)

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}
</script>
