<template>
  <button
    @click="!disabled && $emit('click')"
    :class="[
      'w-full flex items-center transition-colors duration-200',
      collapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-3 py-3',
      'rounded-lg text-left',
      disabled
        ? 'text-neutral-400 cursor-not-allowed'
        : active
          ? 'bg-primary-50 text-primary-700 border border-primary-200'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
    ]"
    :title="collapsed ? label : ''"
    :disabled="disabled"
  >
    <component 
      :is="iconComponent" 
      :class="[
        'w-6 h-6 flex-shrink-0',
        disabled
          ? 'text-neutral-300'
          : active 
            ? 'text-primary-600' 
            : 'text-neutral-400'
      ]" 
    />
    <span v-if="!collapsed" class="font-medium text-sm">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
// @ts-ignore
import { 
  HomeIcon, 
  UserGroupIcon, 
  UsersIcon, 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon, 
  ShieldCheckIcon, 
  AcademicCapIcon 
} from '@heroicons/vue/24/outline'
import { IconLeaf } from '@tabler/icons-vue'

interface Props {
  icon: string
  label: string
  active?: boolean
  collapsed?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  collapsed: false,
  disabled: false
})

defineEmits<{
  click: []
}>()

const iconMap = {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  IconLeaf,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  AcademicCapIcon
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap])
</script>