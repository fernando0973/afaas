<template>
  <div class="flex items-center justify-between">
    <!-- Informações da paginação -->
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        v-if="currentPage > 1"
        @click="$emit('page-changed', currentPage - 1)"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        Anterior
      </button>
      <button
        v-if="currentPage < totalPages"
        @click="$emit('page-changed', currentPage + 1)"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        Próximo
      </button>
    </div>

    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <!-- Informações de resultados -->
      <div>
        <p class="text-sm text-gray-700">
          Mostrando 
          <span class="font-medium">{{ startItem }}</span>
          até
          <span class="font-medium">{{ endItem }}</span>
          de
          <span class="font-medium">{{ totalItems }}</span>
          {{ totalItems === 1 ? 'resultado' : 'resultados' }}
        </p>
      </div>

      <!-- Navegação de páginas -->
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginação">
          <!-- Botão Anterior -->
          <button
            v-if="currentPage > 1"
            @click="$emit('page-changed', currentPage - 1)"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            :class="{ 'cursor-not-allowed opacity-50': currentPage === 1 }"
          >
            <span class="sr-only">Anterior</span>
            <ChevronLeftIcon class="h-5 w-5" />
          </button>

          <!-- Números das páginas -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...' && typeof page === 'number'"
              @click="$emit('page-changed', page)"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors"
              :class="[
                page === currentPage
                  ? 'z-10 bg-green-50 border-green-500 text-green-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              ...
            </span>
          </template>

          <!-- Botão Próximo -->
          <button
            v-if="currentPage < totalPages"
            @click="$emit('page-changed', currentPage + 1)"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            :class="{ 'cursor-not-allowed opacity-50': currentPage === totalPages }"
          >
            <span class="sr-only">Próximo</span>
            <ChevronRightIcon class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChevronLeftIcon from '@heroicons/vue/24/outline/ChevronLeftIcon'
import ChevronRightIcon from '@heroicons/vue/24/outline/ChevronRightIcon'

// ===== PROPS =====
interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10
})

// ===== EMITS =====
const emit = defineEmits<{
  'page-changed': [page: number]
}>()

// ===== COMPUTED =====
const startItem = computed(() => {
  return Math.min((props.currentPage - 1) * props.itemsPerPage + 1, props.totalItems)
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const totalPages = props.totalPages
  const currentPage = props.currentPage

  if (totalPages <= 7) {
    // Se temos 7 ou menos páginas, mostra todas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Lógica mais complexa para muitas páginas
    if (currentPage <= 3) {
      // Início: [1, 2, 3, 4, ..., total]
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Fim: [1, ..., total-3, total-2, total-1, total]
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Meio: [1, ..., current-1, current, current+1, ..., total]
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }
  }

  return pages
})
</script>