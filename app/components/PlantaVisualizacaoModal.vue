<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('update:modelValue', false)"
    :title="tituloModal"
    size="xl"
    :show-footer="false"
  >
    <div v-if="carregando" class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-500">Carregando informações da planta...</p>
      </div>
    </div>

    <div v-else-if="erro" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <ExclamationTriangleIcon class="h-16 w-16 mx-auto" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Erro ao carregar planta</h3>
      <p class="text-sm text-gray-600">{{ erro }}</p>
    </div>

    <div v-else-if="planta" class="space-y-6">
      <!-- Cabeçalho da planta -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
        <div class="flex items-start space-x-4">
          <!-- Ícone da planta -->
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a4 4 0 004 4h4V5z" />
              </svg>
            </div>
          </div>

          <!-- Informações principais -->
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ planta.nome_popular }}
            </h2>
            
            <p 
              v-if="planta.nome_cientifico"
              class="text-lg italic text-gray-600 mb-3"
            >
              {{ planta.nome_cientifico }}
            </p>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2">
              <span 
                v-if="planta.renisus"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                title="Planta da RENISUS (Relação Nacional de Plantas Medicinais de Interesse do SUS)"
              >
                <CheckBadgeIcon class="w-4 h-4 mr-1" />
                SUS
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de informações -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Partes Utilizadas -->
        <div 
          v-if="planta.partes_usadas && planta.partes_usadas.length > 0"
          class="bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0">
              <CubeIcon class="h-5 w-5 text-purple-600" />
            </div>
            <h3 class="ml-2 text-base font-medium text-gray-900">
              Partes Utilizadas
            </h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="parte in planta.partes_usadas"
              :key="parte"
              class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800"
            >
              {{ parte }}
            </span>
          </div>
        </div>

        <!-- Sabor e Propriedades -->
        <div 
          v-if="planta.sabor_propriedade && planta.sabor_propriedade.length > 0"
          class="bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0">
              <SparklesIcon class="h-5 w-5 text-amber-600" />
            </div>
            <h3 class="ml-2 text-base font-medium text-gray-900">
              Sabor e Propriedades
            </h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="sabor in planta.sabor_propriedade"
              :key="sabor"
              class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-amber-100 text-amber-800"
            >
              {{ sabor }}
            </span>
          </div>
        </div>

        <!-- Meridianos -->
        <div 
          v-if="planta.meridianos && planta.meridianos.length > 0"
          class="bg-indigo-50 border border-indigo-200 rounded-lg p-4"
        >
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0">
              <MapIcon class="h-5 w-5 text-indigo-600" />
            </div>
            <h3 class="ml-2 text-base font-medium text-gray-900">
              Meridianos
            </h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="meridiano in planta.meridianos"
              :key="meridiano"
              class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              {{ meridiano }}
            </span>
          </div>
        </div>

        <!-- Ação Terapêutica -->
        <div 
          v-if="planta.acao_terapeutica"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0">
              <HeartIcon class="h-5 w-5 text-red-600" />
            </div>
            <h3 class="ml-2 text-base font-medium text-gray-900">
              Ação Terapêutica
            </h3>
          </div>
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ planta.acao_terapeutica }}
          </p>
        </div>
      </div>

      <!-- Indicações e Contraindicações -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Indicações -->
        <div 
          v-if="planta.indicacoes"
          class="bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
            <h3 class="ml-2 text-lg font-medium text-gray-900">
              Indicações
            </h3>
          </div>
          <div class="prose prose-sm prose-green max-w-none">
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ planta.indicacoes }}</p>
          </div>
        </div>

        <!-- Contraindicações -->
        <div 
          v-if="planta.contraindicacoes"
          class="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
            </div>
            <h3 class="ml-2 text-lg font-medium text-gray-900">
              Contraindicações
            </h3>
          </div>
          <div class="prose prose-sm prose-red max-w-none">
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ planta.contraindicacoes }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer customizado -->
    <template #footer>
      <div class="flex justify-end">
        <BaseButton
          variant="secondary"
          @click="$emit('update:modelValue', false)"
        >
          Fechar
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { 
  CheckBadgeIcon, 
  CubeIcon,
  SparklesIcon,
  MapIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { PlantaMedicinal } from '~/types/planta'



// ===== PROPS E EMITS =====
interface Props {
  modelValue: boolean
  plantaId?: number | null
  plantaData?: PlantaMedicinal | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  plantaId: null,
  plantaData: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// ===== COMPOSABLES =====
const { buscarPlantaPorId } = usePlantas()

// ===== ESTADO REATIVO =====
const planta = ref<PlantaMedicinal | null>(null)
const carregando = ref(false)
const erro = ref<string | null>(null)

// ===== COMPUTED =====
const tituloModal = computed(() => {
  if (planta.value?.nome_popular) {
    return planta.value.nome_popular
  }
  return 'Detalhes da Planta'
})

// ===== FUNÇÕES =====
const carregarPlanta = async () => {
  // Se recebeu dados da planta diretamente, usar eles
  if (props.plantaData) {
    planta.value = props.plantaData
    return
  }

  // Se tem ID, buscar no banco
  if (props.plantaId) {
    carregando.value = true
    erro.value = null

    try {
      const resultado = await buscarPlantaPorId(props.plantaId)
      
      if (resultado.success && resultado.data) {
        planta.value = resultado.data
      } else {
        erro.value = resultado.error || 'Planta não encontrada'
      }
    } catch (error: any) {
      console.error('Erro ao carregar planta:', error)
      erro.value = 'Erro inesperado ao carregar planta'
    } finally {
      carregando.value = false
    }
  }
}

const limparEstado = () => {
  planta.value = null
  carregando.value = false
  erro.value = null
}

// ===== WATCHERS =====
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    carregarPlanta()
  } else {
    // Limpar estado quando fechar
    setTimeout(limparEstado, 300)
  }
})

watch(() => props.plantaId, () => {
  if (props.modelValue) {
    carregarPlanta()
  }
})

watch(() => props.plantaData, () => {
  if (props.modelValue) {
    carregarPlanta()
  }
})
</script>