<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <!-- Cabeçalho -->
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
            <h1 class="text-3xl font-bold text-neutral-900">Relatório de Atendimentos</h1>
            <p class="text-neutral-600 mt-1">
              Visualize e analise os atendimentos realizados no sistema
            </p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="flex flex-col sm:flex-row gap-4 mt-6">
          <!-- Campo de busca -->
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
            </div>
            <input
              v-model="termoBusca"
              type="text"
              placeholder="Buscar por cliente, profissional ou ID..."
              class="block w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <!-- Filtro por período -->
          <div class="flex gap-2">
            <select
              v-model="filtroMes"
              class="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">Todos os meses</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>

            <select
              v-model="filtroAno"
              class="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">Todos os anos</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <!-- Botão de exportar -->
          <button
            @click="exportarRelatorio"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ArrowDownTrayIcon class="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 min-h-0 overflow-y-auto p-6">
      <div class="w-full max-w-[1600px] mx-auto space-y-6">
        
        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BaseCard
            title="Total"
            :value="estatisticas.total"
            caption="atendimentos realizados"
            icon-wrapper-class="bg-blue-100"
          >
            <template #icon>
              <ClipboardDocumentListIcon class="w-5 h-5 text-blue-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Este Mês"
            :value="estatisticas.esteMes"
            :caption="`↑ ${estatisticas.crescimento}% vs mês anterior`"
            caption-class="text-green-600"
            icon-wrapper-class="bg-green-100"
          >
            <template #icon>
              <CalendarIcon class="w-5 h-5 text-green-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Média Diária"
            :value="estatisticas.mediaDiaria"
            caption="atendimentos por dia"
            icon-wrapper-class="bg-purple-100"
          >
            <template #icon>
              <ChartBarIcon class="w-5 h-5 text-purple-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Clientes Únicos"
            :value="estatisticas.clientesUnicos"
            caption="clientes atendidos"
            icon-wrapper-class="bg-amber-100"
          >
            <template #icon>
              <UsersIcon class="w-5 h-5 text-amber-600" />
            </template>
          </BaseCard>
        </div>

        <!-- Tabela de Atendimentos -->
        <TabelaAtendimentos
          :atendimentos="atendimentosFiltrados"
          :total-atendimentos="atendimentos.length"
          :pagina-atual="paginaAtual"
          :itens-por-pagina="itensPorPagina"
          :formatar-data="formatarData"
          :obter-profissional-principal="obterProfissionalPrincipal"
          :obter-especialidade-principal="obterEspecialidadePrincipal"
          :obter-profissional-auxiliar="obterProfissionalAuxiliar"
          :obter-especialidade-auxiliar="obterEspecialidadeAuxiliar"
          @ver-detalhes="visualizarDetalhes"
          @pagina-anterior="paginaAnterior"
          @pagina-proxima="paginaProxima"
        />

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/vue/24/solid'
import BaseCard from '~/components/BaseCard.vue'
import TabelaAtendimentos from '~/components/TabelaAtendimentos.vue'

// Meta da página
definePageMeta({
  title: 'Relatório de Atendimentos',
  description: 'Relatório detalhado dos atendimentos realizados'
})

// Título da página
useHead({
  title: 'Relatório de Atendimentos - AFAAS Atendimento'
})

const router = useRouter()

// Composables
const { 
  buscarAtendimentosCompletos,
  calcularEstatisticasAtendimentos,
  obterProfissionalPrincipal,
  obterProfissionalAuxiliar,
  obterEspecialidadePrincipal,
  obterEspecialidadeAuxiliar,
  formatarData,
  filtrarAtendimentos
} = useRelatorios()

// Estados reativos
const termoBusca = ref('')
const filtroMes = ref('')
const filtroAno = ref('')
const paginaAtual = ref(1)
const itensPorPagina = 10
const carregando = ref(false)

// Dados dos atendimentos
const atendimentos = ref<any[]>([])

// Estatísticas
const estatisticas = reactive({
  total: 0,
  esteMes: 0,
  crescimento: 0,
  mediaDiaria: 0,
  clientesUnicos: 0
})

// Computed
const atendimentosFiltrados = computed(() => {
  return filtrarAtendimentos(atendimentos.value, {
    busca: termoBusca.value,
    mes: filtroMes.value,
    ano: filtroAno.value
  })
})

const paginaAnterior = () => {
  if (paginaAtual.value > 1) {
    paginaAtual.value--
  }
}

const paginaProxima = () => {
  if (paginaAtual.value * itensPorPagina < atendimentos.value.length) {
    paginaAtual.value++
  }
}

// Funções
const voltarParaRelatorios = () => {
  router.push('/relatorios')
}

const visualizarDetalhes = (id: number) => {
  console.log('Visualizar detalhes do atendimento:', id)
  // Implementar navegação ou modal de detalhes
}

const exportarRelatorio = () => {
  console.log('Exportar relatório')
  // Implementar exportação para PDF/Excel
}

// Buscar atendimentos do banco
const buscarAtendimentos = async () => {
  carregando.value = true
  try {
    const dados = await buscarAtendimentosCompletos()
    atendimentos.value = dados
    
    // Atualizar estatísticas
    const stats = calcularEstatisticasAtendimentos(dados)
    Object.assign(estatisticas, stats)
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error)
  } finally {
    carregando.value = false
  }
}

// Buscar dados ao montar
onMounted(() => {
  buscarAtendimentos()
})
</script>
