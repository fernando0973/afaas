<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <!-- Cabeçalho -->
    <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Relatórios</h1>
        <p class="text-neutral-600">
          Visualize e analise os dados do sistema através de relatórios detalhados
        </p>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 min-h-0 overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Grid de Cards de Relatórios -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RelatorioCard
            v-for="card in relatoriosCards"
            :key="card.route"
            :title="card.title"
            :description="card.description"
            :icon="card.icon"
            :icon-bg-class="card.iconBgClass"
            :border-hover-class="card.borderHoverClass"
            :cta-color-class="card.ctaColorClass"
            :cta-hover-class="card.ctaHoverClass"
            :arrow-color-class="card.arrowColorClass"
            @click="navegarParaRelatorio(card.route)"
          />
        </div>

        <!-- Seção de Resumo Rápido -->
        <div class="mt-8">
          <h2 class="text-xl font-semibold text-neutral-900 mb-4">Resumo Rápido</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResumoEstatisticaCard
              v-for="card in resumoRapidoCards"
              :key="card.title"
              :title="card.title"
              :icon="card.icon"
              :icon-bg-class="card.iconBgClass"
              :icon-color-class="card.iconColorClass"
              :value="card.value"
              :description="card.description"
              :loading="carregando"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
  ClipboardDocumentListIcon,
  UsersIcon,
  UserGroupIcon,
  BeakerIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/vue/24/solid'
import { computed, type Component } from 'vue'
import RelatorioCard from '~/components/relatorios/RelatorioCard.vue'
import ResumoEstatisticaCard from '~/components/relatorios/ResumoEstatisticaCard.vue'

// Meta da página
definePageMeta({
  title: 'Relatórios',
  description: 'Relatórios e estatísticas do sistema'
})

// Título da página
useHead({
  title: 'Relatórios - AFAAS Atendimento'
})

const router = useRouter()

type RelatorioCardConfig = {
  title: string
  description: string
  icon: Component
  iconBgClass: string
  borderHoverClass: string
  ctaColorClass: string
  ctaHoverClass: string
  route: string
  arrowColorClass?: string
}

type ResumoRapidoCardConfig = {
  title: string
  description: string
  icon: Component
  iconBgClass: string
  iconColorClass: string
  value: number
}

const relatoriosCards: RelatorioCardConfig[] = [
  {
    title: 'Agendamentos',
    description: 'Visualize estatísticas completas dos agendamentos realizados, incluindo dados de clientes, profissionais e plantas medicinais utilizadas.',
    icon: ClipboardDocumentListIcon,
    iconBgClass: 'bg-gradient-to-br from-blue-500 to-blue-600',
    borderHoverClass: 'hover:border-blue-300',
    ctaColorClass: 'text-blue-600',
    ctaHoverClass: 'group-hover:text-blue-700',
    route: 'agendamentos'
  },
  {
    title: 'Atendimentos',
    description: 'Análise completa dos atendimentos concluídos, histórico de consultas, evolução de pacientes e resultados dos tratamentos.',
    icon: ClipboardDocumentListIcon,
    iconBgClass: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    borderHoverClass: 'hover:border-cyan-300',
    ctaColorClass: 'text-cyan-600',
    ctaHoverClass: 'group-hover:text-cyan-700',
    route: 'atendimentos'
  },
  {
    title: 'Clientes',
    description: 'Análise detalhada da base de clientes, histórico de atendimentos, dados demográficos e estatísticas de frequência.',
    icon: UsersIcon,
    iconBgClass: 'bg-gradient-to-br from-green-500 to-green-600',
    borderHoverClass: 'hover:border-green-300',
    ctaColorClass: 'text-green-600',
    ctaHoverClass: 'group-hover:text-green-700',
    route: 'clientes'
  },
  {
    title: 'Profissionais',
    description: 'Desempenho e estatísticas dos profissionais, quantidade de atendimentos realizados e especialidades mais procuradas.',
    icon: UserGroupIcon,
    iconBgClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
    borderHoverClass: 'hover:border-purple-300',
    ctaColorClass: 'text-purple-600',
    ctaHoverClass: 'group-hover:text-purple-700',
    route: 'profissionais'
  },
  {
    title: 'Plantas Medicinais',
    description: 'Estatísticas de uso das plantas medicinais, eficácia dos tratamentos e plantas mais prescritas nos atendimentos.',
    icon: BeakerIcon,
    iconBgClass: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    borderHoverClass: 'hover:border-emerald-300',
    ctaColorClass: 'text-emerald-600',
    ctaHoverClass: 'group-hover:text-emerald-700',
    route: 'plantas'
  },
  {
    title: 'Especialidades',
    description: 'Análise das especialidades oferecidas, demanda por tipo de atendimento e distribuição de profissionais por área.',
    icon: AcademicCapIcon,
    iconBgClass: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    borderHoverClass: 'hover:border-indigo-300',
    ctaColorClass: 'text-indigo-600',
    ctaHoverClass: 'group-hover:text-indigo-700',
    route: 'especialidades'
  }
]


// Composables
const { buscarEstatisticasGerais } = useRelatorios()

// Estados reativos
const carregando = ref(false)
const quantidadePlantas = ref(0)
const quantidadeProfissionais = ref(0)
const quantidadeClientes = ref(0)
const quantidadeAtendimentos = ref(0)

const resumoRapidoCards = computed<ResumoRapidoCardConfig[]>(() => [
  {
    title: 'Total de Atendimentos',
    description: 'atendimentos realizados',
    icon: ChartBarIcon,
    iconBgClass: 'bg-blue-100',
    iconColorClass: 'text-blue-600',
    value: quantidadeAtendimentos.value
  },
  {
    title: 'Clientes Ativos',
    description: 'clientes cadastrados',
    icon: UsersIcon,
    iconBgClass: 'bg-green-100',
    iconColorClass: 'text-green-600',
    value: quantidadeClientes.value
  },
  {
    title: 'Profissionais',
    description: 'profissionais ativos',
    icon: UserGroupIcon,
    iconBgClass: 'bg-purple-100',
    iconColorClass: 'text-purple-600',
    value: quantidadeProfissionais.value
  },
  {
    title: 'Plantas Cadastradas',
    description: 'plantas medicinais no sistema',
    icon: BeakerIcon,
    iconBgClass: 'bg-emerald-100',
    iconColorClass: 'text-emerald-600',
    value: quantidadePlantas.value
  }
])

// Função para navegar para relatórios específicos
const navegarParaRelatorio = (tipo: string) => {
  router.push(`/relatorios-${tipo}`)
}

// Buscar todas as estatísticas de uma vez
const buscarEstatisticas = async () => {
  carregando.value = true
  try {
    const stats = await buscarEstatisticasGerais()
    quantidadeAtendimentos.value = stats.totalAtendimentos
    quantidadeClientes.value = stats.totalClientes
    quantidadeProfissionais.value = stats.totalProfissionais
    quantidadePlantas.value = stats.totalPlantas
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
  } finally {
    carregando.value = false
  }
}

// Buscar dados ao montar o componente
onMounted(() => {
  buscarEstatisticas()
})
</script>