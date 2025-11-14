<template>
  <div class="bg-white rounded-lg border border-neutral-200 p-5">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-neutral-600">{{ title }}</span>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="iconBgClass">
        <component :is="icon" class="w-5 h-5" :class="iconColorClass" />
      </div>
    </div>
    <p :class="['font-bold text-neutral-900', valueClass]">
      <span v-if="loading" class="inline-block animate-pulse">...</span>
      <span v-else>{{ value }}</span>
    </p>
    <p v-if="description" class="text-xs text-neutral-500 mt-1">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Component, PropType } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: '--'
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, Function] as PropType<Component>,
    required: true
  },
  iconBgClass: {
    type: String,
    default: 'bg-neutral-100'
  },
  iconColorClass: {
    type: String,
    default: 'text-neutral-600'
  },
  valueClass: {
    type: String,
    default: 'text-3xl'
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
