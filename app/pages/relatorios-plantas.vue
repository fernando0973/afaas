<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="w-full max-w-[1600px] mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <button
            @click="voltarParaRelatorios"
            class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeftIcon class="w-5 h-5 text-neutral-600" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-neutral-900">Relatório de Plantas Medicinais</h1>
            <p class="text-neutral-600 mt-1">
              Panorama das plantas cadastradas, níveis de indicação e distribuição de partes utilizadas
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-6">
          <div class="col-span-2 xl:col-span-2 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
            </div>
            <input
              v-model="termoBusca"
              type="text"
              placeholder="Buscar por nome popular, científico ou indicações..."
              class="block w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-4 xl:col-span-2">
            <select
              v-model="filtroRenisus"
              class="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todas">Todas as plantas</option>
              <option value="renisus">Somente RENISUS</option>
              <option value="nao-renisus">Sem selo RENISUS</option>
            </select>

            <select
              v-model="filtroParte"
              class="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">Todas as partes utilizadas</option>
              <option
                v-for="parte in partesDisponiveis"
                :key="parte"
                :value="parte"
              >
                {{ parte }}
              </option>
            </select>

            <button
              @click="exportarRelatorio"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowDownTrayIcon class="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 min-h-0 overflow-y-auto p-6">
      <div class="w-full max-w-[1600px] mx-auto space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <BaseCard
            title="Total de Plantas"
            :value="estatisticas.totalPlantas"
            caption="cadastros ativos"
            icon-wrapper-class="bg-green-100"
          >
            <template #icon>
              <CircleStackIcon class="w-5 h-5 text-green-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="RENISUS"
            :value="estatisticas.plantasRenisus"
            caption="plantas reconhecidas pelo SUS"
            icon-wrapper-class="bg-blue-100"
          >
            <template #icon>
              <CheckBadgeIcon class="w-5 h-5 text-blue-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Com Indicações"
            :value="estatisticas.plantasComIndicacoes"
            caption="plantas com indicações cadastradas"
            icon-wrapper-class="bg-emerald-100"
          >
            <template #icon>
              <SparklesIcon class="w-5 h-5 text-emerald-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Contraindicações"
            :value="estatisticas.plantasComContraindicacoes"
            caption="plantas com alertas registrados"
            icon-wrapper-class="bg-rose-100"
          >
            <template #icon>
              <ShieldExclamationIcon class="w-5 h-5 text-rose-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Partes Catalogadas"
            :value="estatisticas.totalPartesCatalogadas"
            caption="variações de partes utilizadas"
            icon-wrapper-class="bg-amber-100"
          >
            <template #icon>
              <Squares2X2Icon class="w-5 h-5 text-amber-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Novas (30 dias)"
            :value="estatisticas.plantasNovasUltimos30Dias"
            caption="cadastros recentes"
            icon-wrapper-class="bg-purple-100"
          >
            <template #icon>
              <ClockIcon class="w-5 h-5 text-purple-600" />
            </template>
          </BaseCard>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-neutral-900">10 plantas mais indicadas</h2>
            <p class="text-sm text-neutral-500">
              Ranking baseado na quantidade de registros de indicações e ações terapêuticas
            </p>
          </div>

          <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <TabelaPlantasRelatorio
              :plantas="plantasTop10"
              :carregando="carregando"
              @abrir-detalhes="abrirDetalhes"
            />

            <div class="bg-white px-6 py-4 border-t border-neutral-200">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <p class="text-sm text-neutral-600">
                  Exibindo as {{ Math.min(10, plantasTop10.length) }} plantas com maior número de indicações dentre {{ plantasFiltradas.length }} resultados filtrados ({{ plantas.length }} cadastros totais)
                </p>
                <p class="text-xs text-neutral-400">
                  Critério de desempate: ordem alfabética por nome popular
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <BaseModal
    v-model="modalDetalhesAberto"
    :title="plantaDetalhes?.nome_popular || 'Detalhes da Planta'"
    :subtitle="plantaDetalhes?.nome_cientifico || undefined"
    size="xl"
    :show-footer="false"
    :show-cancel-button="false"
    :show-confirm-button="false"
    :close-on-overlay-click="true"
  >
    <div v-if="plantaDetalhes" class="space-y-6">
      <div class="flex flex-wrap items-center gap-3">
        <span
          v-if="plantaDetalhes.renisus"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200"
        >
          Integrante da RENISUS
        </span>
        <span class="text-xs text-neutral-500">
          Cadastro em {{ formatarDataCurta(plantaDetalhes.created_at) }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="plantaDetalhes.partes_usadas?.length" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-green-900 mb-2">Partes utilizadas</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="parte in plantaDetalhes.partes_usadas"
              :key="parte"
              class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700"
            >
              {{ parte }}
            </span>
          </div>
        </div>

        <div v-if="plantaDetalhes.sabor_propriedade?.length" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-amber-900 mb-2">Sabores e propriedades</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="sabor in plantaDetalhes.sabor_propriedade"
              :key="sabor"
              class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700"
            >
              {{ sabor }}
            </span>
          </div>
        </div>

        <div v-if="plantaDetalhes.meridianos?.length" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 md:col-span-2">
          <h3 class="text-sm font-semibold text-indigo-900 mb-2">Meridianos associados</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="meridiano in plantaDetalhes.meridianos"
              :key="meridiano"
              class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700"
            >
              {{ meridiano }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="plantaDetalhes.acao_terapeutica" class="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-neutral-900 mb-2">Ação terapêutica</h3>
        <p class="text-sm text-neutral-700 whitespace-pre-wrap">{{ plantaDetalhes.acao_terapeutica }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="plantaDetalhes.indicacoes" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-emerald-900 mb-2">Indicações</h3>
          <p class="text-sm text-neutral-700 whitespace-pre-wrap">{{ plantaDetalhes.indicacoes }}</p>
        </div>
        <div v-if="plantaDetalhes.contraindicacoes" class="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-rose-900 mb-2">Contraindicações</h3>
          <p class="text-sm text-neutral-700 whitespace-pre-wrap">{{ plantaDetalhes.contraindicacoes }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-neutral-500">
      <p>Não foi possível carregar os detalhes da planta selecionada.</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CircleStackIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ShieldExclamationIcon,
  Squares2X2Icon,
  ClockIcon
} from '@heroicons/vue/24/solid'
import BaseCard from '~/components/BaseCard.vue'
import BaseModal from '~/components/BaseModal.vue'
import TabelaPlantasRelatorio from '~/components/relatorios/TabelaPlantasRelatorio.vue'
import { useRelatorios } from '~/composables/useRelatorios'

definePageMeta({
  title: 'Relatório de Plantas',
  description: 'Indicadores e dados detalhados das plantas medicinais',
  name: 'relatorios-plantas'
})

useHead({ title: 'Relatório de Plantas - AFAAS Atendimento' })

const router = useRouter()

const {
  buscarPlantasRelatorio,
  calcularEstatisticasPlantas,
  formatarData
} = useRelatorios()

type PlantaRelatorio = {
  id: number
  nome_popular: string
  nome_cientifico?: string | null
  partes_usadas?: string[] | null
  indicacoes?: string | null
  acao_terapeutica?: string | null
  created_at: string | null
  renisus?: boolean | null
  deleted_at?: string | null
  sabor_propriedade?: string[] | null
  meridianos?: string[] | null
  contraindicacoes?: string | null
}
type FiltroRenisus = 'todas' | 'renisus' | 'nao-renisus'

const plantas = ref<PlantaRelatorio[]>([])
const carregando = ref(false)
const termoBusca = ref('')
const filtroRenisus = ref<FiltroRenisus>('todas')
const filtroParte = ref('')

const estatisticas = reactive({
  totalPlantas: 0,
  plantasRenisus: 0,
  plantasComIndicacoes: 0,
  plantasComContraindicacoes: 0,
  totalPartesCatalogadas: 0,
  plantasNovasUltimos30Dias: 0
})

const modalDetalhesAberto = ref(false)
const plantaDetalhes = ref<PlantaRelatorio | null>(null)

const normalizarTexto = (valor: string | null | undefined) => {
  return (valor ?? '').toString().trim().toLowerCase()
}

const partesDisponiveis = computed(() => {
  const conjunto = new Set<string>()
  plantas.value.forEach(planta => {
    if (Array.isArray(planta.partes_usadas)) {
      planta.partes_usadas.forEach(parte => {
        if (parte) {
          conjunto.add(parte)
        }
      })
    }
  })
  return Array.from(conjunto).sort((a, b) => a.localeCompare(b))
})

const plantasFiltradas = computed(() => {
  const termo = normalizarTexto(termoBusca.value)
  const parteFiltro = filtroParte.value

  return plantas.value.filter(planta => {
    const correspondeBusca = termo
      ? [
          planta.nome_popular,
          planta.nome_cientifico,
          planta.indicacoes,
          planta.acao_terapeutica,
          planta.contraindicacoes
        ]
          .map(normalizarTexto)
          .some(texto => texto.includes(termo))
      : true

    const correspondeRenisus =
      filtroRenisus.value === 'todas' ||
      (filtroRenisus.value === 'renisus' && planta.renisus === true) ||
      (filtroRenisus.value === 'nao-renisus' && planta.renisus !== true)

    const correspondeParte = parteFiltro
      ? Array.isArray(planta.partes_usadas) && planta.partes_usadas.includes(parteFiltro)
      : true

    return correspondeBusca && correspondeRenisus && correspondeParte
  })
})

const contarIndicacoes = (texto: string | null | undefined) => {
  if (!texto) {
    return 0
  }

  const segmentos = texto
    .split(/\r?\n|;|•|-|\u2022/)
    .map(item => item.replace(/^[\s•\-–]+/, '').trim())
    .filter(Boolean)

  if (segmentos.length === 0 && texto.trim().length > 0) {
    return 1
  }

  return segmentos.length
}

const obterPontuacaoIndicacoes = (planta: PlantaRelatorio) => {
  const totalIndicacoes = contarIndicacoes(planta.indicacoes)
  const totalAcoes = contarIndicacoes(planta.acao_terapeutica)
  return Math.max(totalIndicacoes, totalAcoes)
}

const plantasOrdenadasPorIndicacoes = computed(() => {
  return [...plantasFiltradas.value]
    .sort((a, b) => {
      const scoreA = obterPontuacaoIndicacoes(a)
      const scoreB = obterPontuacaoIndicacoes(b)

      if (scoreA === scoreB) {
        const nomeA = (a.nome_popular || '').toLowerCase()
        const nomeB = (b.nome_popular || '').toLowerCase()
        return nomeA.localeCompare(nomeB, 'pt-BR')
      }

      return scoreB - scoreA
    })
})

const plantasTop10 = computed(() => {
  return plantasOrdenadasPorIndicacoes.value.slice(0, 10)
})

watch(modalDetalhesAberto, isOpen => {
  if (!isOpen) {
    setTimeout(() => {
      plantaDetalhes.value = null
    }, 200)
  }
})

const voltarParaRelatorios = () => {
  router.push('/relatorios')
}

const exportarRelatorio = () => {
  console.log('Exportar relatório de plantas')
}

const resumirTexto = (texto: string | null | undefined, limite = 80) => {
  if (!texto) {
    return 'Sem informações cadastradas'
  }
  const textoLimpo = texto.trim()
  if (textoLimpo.length <= limite) {
    return textoLimpo
  }
  return `${textoLimpo.slice(0, limite).trim()}...`
}

const formatarPartesUsadas = (partes: string[] | null | undefined) => {
  if (!Array.isArray(partes) || partes.length === 0) {
    return 'Não informado'
  }
  if (partes.length <= 2) {
    return partes.join(', ')
  }
  const [primeira, segunda, ...resto] = partes
  return `${primeira}, ${segunda} +${resto.length}`
}

const formatarDataCurta = (data: string | null | undefined) => {
  if (!data) {
    return 'Data não informada'
  }
  try {
    return formatarData(data)
  } catch (error) {
    const parsed = new Date(data)
    if (Number.isNaN(parsed.getTime())) {
      return 'Data não informada'
    }
    return parsed.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

const abrirDetalhes = (planta: PlantaRelatorio) => {
  plantaDetalhes.value = planta
  modalDetalhesAberto.value = true
}

const carregarPlantas = async () => {
  carregando.value = true
  try {
    const dados = await buscarPlantasRelatorio()
    plantas.value = dados

    const stats = calcularEstatisticasPlantas(dados)
    Object.assign(estatisticas, stats)
  } catch (error) {
    console.error('Erro ao carregar plantas para relatório:', error)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarPlantas()
})
</script>
