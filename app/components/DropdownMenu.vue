<template>
  <ClientOnly>
    <div
      v-if="show"
      :class="[
        'absolute z-50 bg-white rounded-lg shadow-lg border border-neutral-200 py-2',
        positionClass,
        widthClass
      ]"
      :style="customPosition"
    >
      <template v-for="(item, index) in items" :key="index">
        <!-- Item do menu -->
        <button
          v-if="item.type === 'item'"
          @click="handleItemClick(item)"
          :class="[
            'w-full flex items-center px-4 py-3 text-left transition-colors',
            item.variant === 'danger' 
              ? 'hover:bg-red-50 group' 
              : 'hover:bg-neutral-50'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 mr-3 transition-colors',
              item.variant === 'danger'
                ? 'text-neutral-600 group-hover:text-red-600'
                : 'text-neutral-600'
            ]"
          />
          <span
            :class="[
              'text-sm font-medium transition-colors',
              item.variant === 'danger'
                ? 'text-neutral-900 group-hover:text-red-600'
                : 'text-neutral-900'
            ]"
          >
            {{ item.label }}
          </span>
        </button>
        
        <!-- Separador -->
        <div
          v-else-if="item.type === 'divider'"
          class="border-t border-neutral-100 my-1"
        />
      </template>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
interface DropdownItem {
  type: 'item' | 'divider'
  label?: string
  icon?: any
  action?: string | (() => void)
  variant?: 'default' | 'danger'
}

interface Props {
  show: boolean
  items: DropdownItem[]
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'custom'
  customPosition?: Record<string, string>
  width?: 'auto' | 'sm' | 'md' | 'lg'
  triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-left',
  width: 'auto',
  triggerClass: '.dropdown-trigger'
})

const emit = defineEmits<{
  close: []
  itemClick: [item: DropdownItem]
}>()

// Classes de posicionamento
const positionClass = computed(() => {
  switch (props.position) {
    case 'bottom-left':
      return 'bottom-20 left-4'
    case 'bottom-right':
      return 'bottom-20 right-4'
    case 'top-left':
      return 'top-20 left-4'
    case 'top-right':
      return 'top-20 right-4'
    default:
      return ''
  }
})

// Classes de largura
const widthClass = computed(() => {
  switch (props.width) {
    case 'sm':
      return 'w-40'
    case 'md':
      return 'w-56'
    case 'lg':
      return 'w-72'
    default:
      return 'min-w-40'
  }
})

// Handle click nos itens
const handleItemClick = (item: DropdownItem) => {
  if (item.action) {
    if (typeof item.action === 'function') {
      item.action()
    } else if (typeof item.action === 'string') {
      // Se for string, trata como rota para navegação
      navigateTo(item.action)
    }
  }
  
  emit('itemClick', item)
  emit('close')
}

// Click outside detection
onMounted(() => {
  if (!process.client) return

  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    
    if (props.show && 
        !target.closest('.dropdown-menu') && 
        !target.closest(props.triggerClass)) {
      emit('close')
    }
  }

  document.addEventListener('click', handleClickOutside)

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

