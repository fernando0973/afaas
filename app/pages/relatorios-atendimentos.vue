<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <!-- Cabeçalho -->
    <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="max-w-7xl mx-auto">
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
      <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-neutral-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600">Total</span>
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardDocumentListIcon class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-neutral-900">{{ estatisticas.total }}</p>
            <p class="text-xs text-neutral-500 mt-1">atendimentos realizados</p>
          </div>

          <div class="bg-white rounded-lg border border-neutral-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600">Este Mês</span>
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarIcon class="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-neutral-900">{{ estatisticas.esteMes }}</p>
            <p class="text-xs text-green-600 mt-1">↑ {{ estatisticas.crescimento }}% vs mês anterior</p>
          </div>

          <div class="bg-white rounded-lg border border-neutral-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600">Média Diária</span>
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon class="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-neutral-900">{{ estatisticas.mediaDiaria }}</p>
            <p class="text-xs text-neutral-500 mt-1">atendimentos por dia</p>
          </div>

          <div class="bg-white rounded-lg border border-neutral-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600">Clientes Únicos</span>
              <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <UsersIcon class="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-neutral-900">{{ estatisticas.clientesUnicos }}</p>
            <p class="text-xs text-neutral-500 mt-1">clientes atendidos</p>
          </div>
        </div>

        <!-- Tabela de Atendimentos -->
        <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200">
              <thead class="bg-neutral-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Profissional
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Plantas
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-neutral-200">
                <tr 
                  v-for="atendimento in atendimentosFiltrados" 
                  :key="atendimento.id"
                  class="hover:bg-neutral-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {{ formatarData(atendimento.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {{ atendimento.cliente?.nome_completo || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {{ obterProfissionalPrincipal(atendimento) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {{ obterEspecialidadePrincipal(atendimento) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {{ atendimento.plantas?.length || 0 }} planta(s)
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="visualizarDetalhes(atendimento.id)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>

                <!-- Estado vazio -->
                <tr v-if="atendimentosFiltrados.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-neutral-400">
                      <ClipboardDocumentListIcon class="w-12 h-12 mb-3" />
                      <p class="text-sm font-medium">Nenhum atendimento encontrado</p>
                      <p class="text-xs mt-1">Tente ajustar os filtros de busca</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginação -->
          <div class="bg-white px-6 py-4 border-t border-neutral-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-neutral-600">
                Exibindo <span class="font-medium">{{ atendimentosFiltrados.length }}</span> de 
                <span class="font-medium">{{ atendimentos.length }}</span> atendimentos
              </div>
              <div class="flex gap-2">
                <button
                  @click="paginaAtual--"
                  :disabled="paginaAtual === 1"
                  class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  @click="paginaAtual++"
                  :disabled="paginaAtual * itensPorPagina >= atendimentos.length"
                  class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>

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
  obterEspecialidadePrincipal,
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
