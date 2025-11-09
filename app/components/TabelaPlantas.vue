<template>
  <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <!-- Cabeçalho da tabela -->
    <div class="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-neutral-900">Plantas Medicinais Cadastradas</h3>
          <p class="text-sm text-neutral-600 mt-1">
            <template v-if="props.termoBusca && props.termoBusca.trim().length >= 2">
              {{ totalItens }} {{ totalItens === 1 ? 'planta encontrada' : 'plantas encontradas' }}
              para "{{ props.termoBusca }}"
              <span class="text-neutral-400">
                ({{ plantas.length }} total)
              </span>
            </template>
            <template v-else>
              {{ totalItens }} {{ totalItens === 1 ? 'planta encontrada' : 'plantas encontradas' }}
            </template>
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton 
            variant="outline"
            size="sm"
            :disabled="carregando"
            @click="recarregarDados"
          >
            <template #iconLeft>
              <ArrowPathIcon :class="['w-4 h-4', carregando ? 'animate-spin' : '']" />
            </template>
            Atualizar
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Estado de carregamento -->
    <div v-if="carregando" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ArrowPathIcon class="w-8 h-8 text-neutral-400 animate-spin mb-3" />
        <p class="text-neutral-600">Carregando plantas medicinais...</p>
      </div>
    </div>

    <!-- Estado de erro -->
    <div v-else-if="erro" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ExclamationTriangleIcon class="w-8 h-8 text-red-400 mb-3" />
        <p class="text-red-600 mb-2">Erro ao carregar plantas medicinais</p>
        <p class="text-sm text-neutral-600 mb-4">{{ erro }}</p>
        <BaseButton 
          variant="primary"
          @click="recarregarDados"
        >
          <template #iconLeft>
            <ArrowPathIcon class="w-4 h-4" />
          </template>
          Tentar Novamente
        </BaseButton>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="totalItens === 0" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <BeakerIcon class="w-12 h-12 text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Nenhuma planta medicinal encontrada</h3>
        <p class="text-neutral-600 mb-4">Comece adicionando a primeira planta medicinal do sistema.</p>
        <BaseButton 
          variant="primary"
          :disabled="!props.isAdmin"
          @click="$emit('adicionar')"
        >
          <template #iconLeft>
            <PlusIcon class="w-4 h-4" />
          </template>
          Adicionar Planta
        </BaseButton>
      </div>
    </div>

    <!-- Tabela de dados -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Nome Popular
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Nome Científico
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Partes Usadas
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Indicações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr 
            v-for="planta in plantasPaginadas" 
            :key="planta.id"
            class="hover:bg-neutral-50 transition-colors cursor-pointer"
            @click="visualizarPlanta(planta)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <BeakerIcon class="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-medium text-neutral-900">
                    {{ planta.nome_popular }}
                  </div>
                  <!-- Badge RENISUS -->
                  <span 
                    v-if="planta.renisus === true"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    title="Planta da RENISUS (Relação Nacional de Plantas Medicinais de Interesse do SUS)"
                  >
                    SUS
                  </span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-neutral-600 italic">
                {{ planta.nome_cientifico || '-' }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="parte in (planta.partes_usadas || [])" 
                  :key="parte"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {{ parte }}
                </span>
                <span v-if="!planta.partes_usadas || planta.partes_usadas.length === 0" class="text-sm text-neutral-400">
                  -
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-neutral-600 max-w-md">
                {{ planta.indicacoes || '-' }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div v-if="totalItens > 0 && totalPaginas > 1" class="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
      <BasePagination
        :current-page="paginaAtual"
        :total-pages="totalPaginas"
        :total-items="totalItens"
        :items-per-page="itensPorPagina"
        @page-changed="mudarPagina"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  BeakerIcon,
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import type { PlantaMedicinal } from '~/types/planta'

// Props e emits
interface Props {
  autoLoad?: boolean
  isAdmin?: boolean
  termoBusca?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true,
  isAdmin: false,
  termoBusca: ''
})

const emit = defineEmits<{
  visualizar: [planta: PlantaMedicinal]
  recarregar: []
  adicionar: []
}>()

// Composables
const { buscarPlantas } = usePlantas()

// Estados reativos
const plantas = ref<PlantaMedicinal[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)

// Estados de paginação
const paginaAtual = ref(1)
const itensPorPagina = ref(10)

// Computeds para paginação e busca
const plantasFiltradas = computed(() => {
  if (!props.termoBusca || props.termoBusca.trim().length < 2) {
    return plantas.value
  }

  const termo = props.termoBusca.toLowerCase().trim()
  return plantas.value.filter(planta => 
    planta.nome_popular?.toLowerCase().includes(termo) ||
    planta.nome_cientifico?.toLowerCase().includes(termo)
  )
})

const totalItens = computed(() => plantasFiltradas.value.length)
const totalPaginas = computed(() => Math.ceil(totalItens.value / itensPorPagina.value))
const plantasPaginadas = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value
  const fim = inicio + itensPorPagina.value
  return plantasFiltradas.value.slice(inicio, fim)
})

// Função para carregar dados
const carregarDados = async () => {
  carregando.value = true
  erro.value = null
  
  try {
    const resultado = await buscarPlantas()
    
    if (resultado.success) {
      plantas.value = resultado.data
    } else {
      erro.value = resultado.error || 'Erro desconhecido ao carregar plantas medicinais'
    }
  } catch (error: any) {
    erro.value = error.message || 'Erro interno do sistema'
  } finally {
    carregando.value = false
  }
}

// Função para recarregar dados
const recarregarDados = async () => {
  await carregarDados()
  emit('recarregar')
}

// Função para visualizar planta
const visualizarPlanta = (planta: PlantaMedicinal) => {
  emit('visualizar', planta)
}

// Função para mudar página
const mudarPagina = (novaPagina: number) => {
  if (novaPagina >= 1 && novaPagina <= totalPaginas.value) {
    paginaAtual.value = novaPagina
  }
}

// Watcher para resetar página quando busca mudar
watch(() => props.termoBusca, () => {
  paginaAtual.value = 1 // Resetar para primeira página quando busca mudar
})

// Carregar dados automaticamente na montagem
onMounted(async () => {
  if (props.autoLoad) {
    await carregarDados()
  }
})

// Exposição de funções para componente pai
defineExpose({
  carregarDados,
  recarregarDados
})
</script>