<template>
  <div class="bg-white rounded-lg border border-neutral-200 p-5">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-neutral-600">{{ title }}</span>
      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', iconWrapperClass]">
        <slot name="icon" />
      </div>
    </div>
    <p class="text-3xl font-bold text-neutral-900">{{ value }}</p>
    <p
      v-if="caption"
      class="text-xs mt-1"
      :class="captionClass"
    >
      {{ caption }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: '--'
  },
  caption: {
    type: String,
    default: ''
  },
  captionClass: {
    type: String,
    default: 'text-neutral-500'
  },
  iconWrapperClass: {
    type: String,
    default: 'bg-neutral-100'
  }
})
</script>
