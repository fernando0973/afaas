<template>
  <div class="relative w-full max-w-md">
    <!-- Campo de busca -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        v-model="termoBusca"
        type="text"
        placeholder="Buscar plantas por nome..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        @input="handleInput"
        @focus="focarInput"
        @blur="desfocaInput"
        @keydown.arrow-down.prevent="navegarAbaixo"
        @keydown.arrow-up.prevent="navegarAcima"
        @keydown.enter.prevent="selecionarAtual"
        @keydown.escape="fecharDropdown"
      />

      <!-- Indicador de loading -->
      <div 
        v-if="carregando"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <svg class="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Dropdown de resultados -->
    <div 
      v-if="mostrarDropdown && (resultados.length > 0 || semResultados)"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <!-- Mensagem de sem resultados -->
      <div 
        v-if="semResultados"
        class="px-4 py-3 text-sm text-gray-500 text-center"
      >
        Nenhuma planta encontrada para "{{ termoBusca }}"
      </div>

      <!-- Lista de resultados -->
      <button
        v-for="(planta, index) in resultados"
        :key="planta.id"
        type="button"
        @click="selecionarPlanta(planta)"
        class="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 border-b border-gray-100 last:border-b-0"
        :class="{ 'bg-blue-50': index === indiceSelecionado }"
      >
        <div class="flex items-start space-x-3">
          <!-- Ícone da planta -->
          <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a4 4 0 004 4h4V5z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <!-- Nome popular -->
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ planta.nome_popular }}
            </p>
            
            <!-- Nome científico -->
            <p 
              v-if="planta.nome_cientifico"
              class="text-xs text-gray-500 italic truncate mt-1"
            >
              {{ planta.nome_cientifico }}
            </p>

            <!-- Indicação de RENISUS -->
            <div v-if="planta.renisus" class="mt-1">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                RENISUS
              </span>
            </div>
          </div>

          <!-- Seta para indicar que é clicável -->
          <div class="flex-shrink-0">
            <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </button>
    </div>

    <!-- Overlay para fechar dropdown ao clicar fora -->
    <div 
      v-if="mostrarDropdown"
      @click="fecharDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { PlantaMedicinal } from '~/types/planta'

// ===== PROPS E EMITS =====
const emit = defineEmits<{
  'planta-selecionada': [planta: PlantaMedicinal]
}>()

// ===== COMPOSABLES =====
const { buscarPlantasPorNome } = usePlantas()

// ===== ESTADO REATIVO =====
const termoBusca = ref('')
const resultados = ref<PlantaMedicinal[]>([])
const carregando = ref(false)
const mostrarDropdown = ref(false)
const inputFocado = ref(false)
const indiceSelecionado = ref(-1)

// Timer para debounce da busca
let timeoutBusca: NodeJS.Timeout | null = null

// ===== COMPUTED =====
const semResultados = computed(() => {
  return termoBusca.value.trim().length >= 2 && 
         resultados.value.length === 0 && 
         !carregando.value &&
         mostrarDropdown.value
})

// ===== FUNÇÕES =====
const realizarBusca = async () => {
  const termo = termoBusca.value.trim()
  
  if (termo.length < 2) {
    resultados.value = []
    mostrarDropdown.value = false
    return
  }

  carregando.value = true
  indiceSelecionado.value = -1

  try {
    const resultado = await buscarPlantasPorNome(termo, 8)
    
    if (resultado.success) {
      resultados.value = resultado.data
      mostrarDropdown.value = inputFocado.value
    } else {
      console.error('Erro ao buscar plantas:', resultado.error)
      resultados.value = []
    }
  } catch (error) {
    console.error('Erro inesperado na busca:', error)
    resultados.value = []
  } finally {
    carregando.value = false
  }
}

const handleInput = () => {
  // Limpar timeout anterior
  if (timeoutBusca) {
    clearTimeout(timeoutBusca)
  }

  // Definir novo timeout (debounce de 300ms)
  timeoutBusca = setTimeout(() => {
    realizarBusca()
  }, 300)
}

const focarInput = () => {
  inputFocado.value = true
  
  // Se já tem resultados, mostrar dropdown
  if (resultados.value.length > 0) {
    mostrarDropdown.value = true
  }
}

const desfocaInput = () => {
  // Delay para permitir que o clique no item funcione
  setTimeout(() => {
    inputFocado.value = false
    mostrarDropdown.value = false
    indiceSelecionado.value = -1
  }, 150)
}

const navegarAbaixo = () => {
  if (!mostrarDropdown.value || resultados.value.length === 0) return
  
  indiceSelecionado.value = Math.min(
    indiceSelecionado.value + 1, 
    resultados.value.length - 1
  )
}

const navegarAcima = () => {
  if (!mostrarDropdown.value || resultados.value.length === 0) return
  
  indiceSelecionado.value = Math.max(indiceSelecionado.value - 1, -1)
}

const selecionarAtual = () => {
  if (indiceSelecionado.value >= 0 && indiceSelecionado.value < resultados.value.length) {
    const planta = resultados.value[indiceSelecionado.value]
    if (planta) {
      selecionarPlanta(planta)
    }
  }
}

const selecionarPlanta = (planta: PlantaMedicinal) => {
  emit('planta-selecionada', planta)
  
  // Fechar dropdown e limpar busca
  mostrarDropdown.value = false
  termoBusca.value = ''
  resultados.value = []
  indiceSelecionado.value = -1
}

const fecharDropdown = () => {
  mostrarDropdown.value = false
  indiceSelecionado.value = -1
}

// ===== WATCHERS =====
watch(termoBusca, (novoTermo) => {
  if (!novoTermo.trim()) {
    resultados.value = []
    mostrarDropdown.value = false
    indiceSelecionado.value = -1
  }
})

// ===== CLEANUP =====
onUnmounted(() => {
  if (timeoutBusca) {
    clearTimeout(timeoutBusca)
  }
})
</script>