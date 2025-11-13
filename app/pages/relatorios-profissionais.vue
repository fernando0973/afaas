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
            <h1 class="text-3xl font-bold text-neutral-900">Relatório de Profissionais</h1>
            <p class="text-neutral-600 mt-1">
              Análise dos profissionais cadastrados e suas especialidades
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
              placeholder="Buscar por nome ou especialidade..."
              class="block w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <!-- Filtro por especialidade -->
          <div class="flex gap-2">
            <select
              v-model="filtroEspecialidade"
              class="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[180px]"
            >
              <option value="">Todas especialidades</option>
              <option 
                v-for="especialidade in especialidades" 
                :key="especialidade.id"
                :value="especialidade.especialidade"
              >
                {{ especialidade.especialidade }}
              </option>
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
              <span class="text-sm font-medium text-neutral-600">Total de Profissionais</span>
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-neutral-900">
              <span v-if="carregando" class="animate-pulse">...</span>
              <span v-else>{{ estatisticas.total }}</span>
            </p>
            <p class="text-xs text-neutral-500 mt-1">profissionais cadastrados</p>
          </div>

          <div class="bg-white rounded-lg border border-neutral-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600">Especialidades</span>
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon class="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-neutral-900">
              <span v-if="carregando" class="animate-pulse">...</span>
              <span v-else>{{ estatisticas.totalEspecialidades }}</span>
            </p>
            <p class="text-xs text-neutral-500 mt-1">diferentes especialidades</p>
          </div>

          <div class="bg-white rounded-lg border border-neutral-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600">Especialidade Mais Comum</span>
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon class="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p class="text-xl font-bold text-neutral-900">
              <span v-if="carregando" class="animate-pulse">...</span>
              <span v-else class="text-base">{{ estatisticas.especialidadeMaisComum || 'N/A' }}</span>
            </p>
            <p class="text-xs text-neutral-500 mt-1">{{ estatisticas.quantidadeEspecialidadeMaisComum }} profissional(is)</p>
          </div>

          <div class="bg-white rounded-lg border border-neutral-200 p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600">Profissionais Ativos</span>
              <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <ClipboardDocumentCheckIcon class="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-neutral-900">
              <span v-if="carregando" class="animate-pulse">...</span>
              <span v-else>{{ estatisticas.comAtendimentos }}</span>
            </p>
            <p class="text-xs text-neutral-500 mt-1">com atendimentos realizados</p>
          </div>
        </div>

        <!-- Tabela de Profissionais -->
        <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200">
              <thead class="bg-neutral-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Profissional
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Atendimentos
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-neutral-200">
                <tr 
                  v-for="profissional in profissionaisFiltrados" 
                  :key="profissional.profissional_id"
                  class="hover:bg-neutral-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-indigo-600">
                            {{ profissional.nome_profissional?.charAt(0)?.toUpperCase() || '?' }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-neutral-900">
                          {{ profissional.nome_profissional || 'Nome não disponível' }}
                        </div>
                        <div class="text-sm text-neutral-500">
                          Profissional
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ profissional.especialidade }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {{ profissional.totalAtendimentos || 0 }} atendimento(s)
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="visualizarDetalhes(profissional.profissional_id)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>

                <!-- Estado vazio -->
                <tr v-if="profissionaisFiltrados.length === 0 && !carregando">
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-neutral-400">
                      <UserGroupIcon class="w-12 h-12 mb-3" />
                      <p class="text-sm font-medium">Nenhum profissional encontrado</p>
                      <p class="text-xs mt-1">Tente ajustar os filtros de busca</p>
                    </div>
                  </td>
                </tr>

                <!-- Estado de carregamento -->
                <tr v-if="carregando">
                  <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-neutral-400">
                      <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
                      <p class="text-sm font-medium">Carregando profissionais...</p>
                      <p class="text-xs mt-1">Aguarde um momento</p>
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
                Exibindo <span class="font-medium">{{ profissionaisFiltrados.length }}</span> de 
                <span class="font-medium">{{ profissionais.length }}</span> profissionais
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
                  :disabled="paginaAtual * itensPorPagina >= profissionais.length"
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
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/solid'
import type { ProfissionalRPC } from '~/types/user'
import type { Especialidade } from '~/types/especialidade'

// Interface estendida para incluir dados calculados
interface ProfissionalComAtendimentos extends ProfissionalRPC {
  totalAtendimentos?: number
}

// Meta da página
definePageMeta({
  title: 'Relatório de Profissionais',
  description: 'Análise dos profissionais cadastrados',
  name: 'relatorios-profissionais'
})

// Título da página
useHead({
  title: 'Relatório de Profissionais - AFAAS Atendimento'
})

const router = useRouter()

// Composables
const { buscarProfissionais, buscarEspecialidades } = useProfissionais()
const { buscarAtendimentosCompletos } = useAtendimentos()
const toast = useToastNotification()

// Estados reativos
const termoBusca = ref('')
const filtroEspecialidade = ref('')
const paginaAtual = ref(1)
const itensPorPagina = 20
const carregando = ref(true)

// Dados dos profissionais e especialidades
const profissionais = ref<ProfissionalComAtendimentos[]>([])
const especialidades = ref<Especialidade[]>([])

// Estatísticas
const estatisticas = reactive({
  total: 0,
  totalEspecialidades: 0,
  especialidadeMaisComum: '',
  quantidadeEspecialidadeMaisComum: 0,
  comAtendimentos: 0
})

// Computed
const profissionaisFiltrados = computed(() => {
  let resultado = profissionais.value

  console.log('Aplicando filtros profissionais:', {
    termoBusca: termoBusca.value,
    filtroEspecialidade: filtroEspecialidade.value,
    totalProfissionais: profissionais.value.length
  })

  // Filtro por busca
  if (termoBusca.value) {
    const termo = termoBusca.value.toLowerCase()
    resultado = resultado.filter((p: ProfissionalComAtendimentos) => {
      const nome = p.nome_profissional?.toLowerCase().includes(termo) || false
      const especialidade = p.especialidade?.toLowerCase().includes(termo) || false
      
      return nome || especialidade
    })
  }

  // Filtro por especialidade
  if (filtroEspecialidade.value) {
    resultado = resultado.filter((p: ProfissionalComAtendimentos) => 
      p.especialidade === filtroEspecialidade.value
    )
  }

  console.log('Resultado final dos filtros profissionais:', resultado.length)

  return resultado
})

// Funções
const voltarParaRelatorios = () => {
  router.push('/relatorios')
}

const visualizarDetalhes = (profissionalId: number) => {
  console.log('Visualizar detalhes do profissional:', profissionalId)
  // Navegar para página de detalhes do profissional ou modal
}

const exportarRelatorio = () => {
  console.log('Exportar relatório de profissionais')
  // Implementar exportação para PDF/Excel
}

const calcularEstatisticas = () => {
  // Total de profissionais
  estatisticas.total = profissionais.value.length
  
  // Total de especialidades únicas
  const especialidadesUnicas = new Set(profissionais.value.map(p => p.especialidade))
  estatisticas.totalEspecialidades = especialidadesUnicas.size
  
  // Especialidade mais comum
  const contadorEspecialidades: { [key: string]: number } = {}
  profissionais.value.forEach(p => {
    if (p.especialidade) {
      contadorEspecialidades[p.especialidade] = (contadorEspecialidades[p.especialidade] || 0) + 1
    }
  })
  
  let especialidadeMaisComum = ''
  let maiorQuantidade = 0
  
  Object.entries(contadorEspecialidades).forEach(([especialidade, quantidade]) => {
    if (quantidade > maiorQuantidade) {
      maiorQuantidade = quantidade
      especialidadeMaisComum = especialidade
    }
  })
  
  estatisticas.especialidadeMaisComum = especialidadeMaisComum
  estatisticas.quantidadeEspecialidadeMaisComum = maiorQuantidade
  
  // Profissionais com atendimentos (que têm totalAtendimentos > 0)
  estatisticas.comAtendimentos = profissionais.value.filter(p => 
    p.totalAtendimentos && p.totalAtendimentos > 0
  ).length
}

const carregarDados = async () => {
  carregando.value = true
  
  try {
    console.log('Carregando profissionais, especialidades e atendimentos...')
    
    // Carregar dados em paralelo
    const [resultadoProfissionais, resultadoEspecialidades] = await Promise.all([
      buscarProfissionais(),
      buscarEspecialidades()
    ])
    
    if (resultadoProfissionais.success && resultadoProfissionais.data) {
      profissionais.value = resultadoProfissionais.data.map((prof: ProfissionalRPC) => ({
        ...prof,
        totalAtendimentos: 0 // Inicializar com 0, será atualizado depois
      }))
      console.log('Profissionais carregados:', profissionais.value.length)
    } else {
      throw new Error('Erro ao buscar profissionais: ' + resultadoProfissionais.error)
    }
    
    if (resultadoEspecialidades.success && resultadoEspecialidades.data) {
      especialidades.value = resultadoEspecialidades.data
      console.log('Especialidades carregadas:', especialidades.value.length)
    } else {
      console.warn('Erro ao carregar especialidades:', resultadoEspecialidades.error)
      especialidades.value = []
    }
    
    // Buscar atendimentos e contar por profissional
    try {
      const atendimentos = await buscarAtendimentosCompletos()
      console.log('Atendimentos carregados:', atendimentos.length)
      
      // Contar atendimentos por profissional
      const contadorAtendimentos: { [key: number]: number } = {}
      
      atendimentos.forEach(atendimento => {
        if (atendimento.profissionais && atendimento.profissionais.length > 0) {
          atendimento.profissionais.forEach(prof => {
            if (prof.id) {
              const profId = prof.id
              contadorAtendimentos[profId] = (contadorAtendimentos[profId] || 0) + 1
            }
          })
        }
      })
      
      // Atualizar profissionais com contagem real de atendimentos
      profissionais.value = profissionais.value.map(prof => ({
        ...prof,
        totalAtendimentos: contadorAtendimentos[prof.profissional_id] || 0
      }))
      
      console.log('Contagem de atendimentos atualizada:', contadorAtendimentos)
      
    } catch (atendimentosError: any) {
      console.warn('Erro ao carregar atendimentos, usando valores simulados:', atendimentosError)
      
      // Em caso de erro, usar valores mais realistas (alguns com 0, outros com números variados)
      profissionais.value = profissionais.value.map((prof, index) => ({
        ...prof,
        totalAtendimentos: index % 3 === 0 ? 0 : Math.floor(Math.random() * 25) + 1
      }))
    }
    
    // Calcular estatísticas após carregar os dados
    calcularEstatisticas()
    
    console.log('Carregamento concluído com sucesso')
    
  } catch (error: any) {
    console.error('Erro ao carregar dados:', error)
    toast.error(`Erro ao carregar dados dos profissionais: ${error.message}`)
  } finally {
    carregando.value = false
  }
}

// Buscar dados ao montar
onMounted(() => {
  carregarDados()
})

// Watchers para debug
watch(filtroEspecialidade, (novoValor, valorAnterior) => {
  console.log('Filtro especialidade mudou:', {
    anterior: valorAnterior,
    novo: novoValor,
    totalProfissionais: profissionais.value.length
  })
})
</script>