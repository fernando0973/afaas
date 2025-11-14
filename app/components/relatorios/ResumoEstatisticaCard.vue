<template>
  <div class="bg-white rounded-lg border border-neutral-200 p-5">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-neutral-600">{{ title }}</span>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="iconBgClass">
        <component :is="icon" class="w-5 h-5" :class="iconColorClass" />
      </div>
    </div>
    <p class="text-2xl font-bold text-neutral-900">
      <span v-if="loadingState" class="inline-block animate-pulse">...</span>
      <span v-else>{{ value }}</span>
    </p>
    <p class="text-xs text-neutral-500 mt-1">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  icon: Component
  iconBgClass: string
  iconColorClass: string
  value: string | number
  description: string
  loading?: boolean
}>(), {
  loading: false
})

const loadingState = computed(() => props.loading)
</script>
