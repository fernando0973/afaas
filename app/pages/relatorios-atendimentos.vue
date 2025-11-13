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
const supabase = useSupabaseClient()

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
  total: 1234,
  esteMes: 87,
  crescimento: 12,
  mediaDiaria: 8,
  clientesUnicos: 456
})

// Computed
const atendimentosFiltrados = computed(() => {
  let resultado = atendimentos.value

  // Filtro por busca
  if (termoBusca.value) {
    const termo = termoBusca.value.toLowerCase()
    resultado = resultado.filter((a: any) => 
      a.cliente?.nome_completo?.toLowerCase().includes(termo) ||
      a.profissional?.nome?.toLowerCase().includes(termo) ||
      a.id.toString().includes(termo)
    )
  }

  // Filtro por mês
  if (filtroMes.value) {
    resultado = resultado.filter((a: any) => {
      const mes = new Date(a.created_at).getMonth() + 1
      return mes.toString().padStart(2, '0') === filtroMes.value
    })
  }

  // Filtro por ano
  if (filtroAno.value) {
    resultado = resultado.filter((a: any) => {
      const ano = new Date(a.created_at).getFullYear()
      return ano.toString() === filtroAno.value
    })
  }

  return resultado
})

// Funções
const voltarParaRelatorios = () => {
  router.push('/relatorios')
}

const formatarData = (data: string) => {
  const date = new Date(data)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const visualizarDetalhes = (id: number) => {
  console.log('Visualizar detalhes do atendimento:', id)
  // Implementar navegação ou modal de detalhes
}

const exportarRelatorio = () => {
  console.log('Exportar relatório')
  // Implementar exportação para PDF/Excel
}

// Função para obter profissional principal
const obterProfissionalPrincipal = (atendimento: any) => {
  // Se houver array de profissionais, pegar o primeiro (principal)
  if (atendimento.profissionais && atendimento.profissionais.length > 0) {
    return atendimento.profissionais[0].nome || 'N/A'
  }
  // Fallback para estrutura antiga
  return atendimento.profissional?.nome || 'N/A'
}

// Função para obter especialidade principal
const obterEspecialidadePrincipal = (atendimento: any) => {
  // Se houver array de profissionais, pegar a especialidade do primeiro
  if (atendimento.profissionais && atendimento.profissionais.length > 0) {
    return atendimento.profissionais[0].especialidade || 'N/A'
  }
  // Fallback para estrutura antiga
  return atendimento.profissional?.especialidade || 'N/A'
}

// Buscar atendimentos do banco
const buscarAtendimentos = async () => {
  carregando.value = true
  try {
    // Buscar atendimentos básicos com clientes
    const { data, error } = await supabase
      .from('afaas_atendimentos')
      .select(`
        *,
        cliente:afaas_clientes(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar atendimentos:', error)
      return
    }

    if (!data || data.length === 0) {
      atendimentos.value = []
      return
    }

    // Para cada atendimento, buscar profissionais e plantas
    const atendimentosCompletos = await Promise.all(
      data.map(async (atendimento: any) => {
        // Buscar profissionais
        const { data: profissionaisData } = await supabase
          .from('afaas_atendimento_profissionais')
          .select(`
            id,
            funcao,
            afaas_profissionais(
              id,
              afaas_profiles(nome),
              afaas_especialidades(especialidade)
            )
          `)
          .eq('atendimento_id', atendimento.id)
          .order('funcao', { ascending: true }) // Principal primeiro

        // Buscar plantas
        const { data: plantasData } = await supabase
          .from('afaas_atendimento_plantas')
          .select(`
            id,
            afaas_plantas_medicinais(
              id,
              nome_popular
            )
          `)
          .eq('atendimento_id', atendimento.id)

        return {
          ...atendimento,
          profissionais: (profissionaisData || []).map((ap: any) => ({
            id: ap.afaas_profissionais?.id,
            nome: ap.afaas_profissionais?.afaas_profiles?.nome || 'Nome não disponível',
            especialidade: ap.afaas_profissionais?.afaas_especialidades?.especialidade || 'Especialidade não disponível',
            funcao: ap.funcao
          })),
          plantas: (plantasData || []).map((ap: any) => ({
            id: ap.afaas_plantas_medicinais?.id,
            nome_popular: ap.afaas_plantas_medicinais?.nome_popular || ''
          }))
        }
      })
    )

    atendimentos.value = atendimentosCompletos
    
    // Atualizar estatísticas
    calcularEstatisticas()
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error)
  } finally {
    carregando.value = false
  }
}

// Calcular estatísticas
const calcularEstatisticas = () => {
  estatisticas.total = atendimentos.value.length
  
  const hoje = new Date()
  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()
  
  const atendimentosMesAtual = atendimentos.value.filter((a: any) => {
    const data = new Date(a.created_at)
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
  })
  
  estatisticas.esteMes = atendimentosMesAtual.length
  
  // Calcular média diária (últimos 30 dias)
  const trintaDiasAtras = new Date()
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)
  
  const atendimentosUltimos30Dias = atendimentos.value.filter((a: any) => {
    const data = new Date(a.created_at)
    return data >= trintaDiasAtras
  })
  
  estatisticas.mediaDiaria = Math.round(atendimentosUltimos30Dias.length / 30)
  
  // Clientes únicos
  const clientesUnicos = new Set(atendimentos.value.map((a: any) => a.cliente_id))
  estatisticas.clientesUnicos = clientesUnicos.size
  
  // Calcular crescimento (simplificado)
  estatisticas.crescimento = 12
}

// Buscar dados ao montar
onMounted(() => {
  buscarAtendimentos()
})
</script>
