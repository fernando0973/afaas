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
          
          <!-- Card 1: Relatório de Agendamentos -->
          <div 
            class="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="navegarParaRelatorio('agendamentos')"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <ClipboardDocumentListIcon class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 ml-4">Agendamentos</h3>
            </div>
            
            <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
              Visualize estatísticas completas dos atendimentos realizados, incluindo dados de clientes, profissionais e plantas medicinais utilizadas.
            </p>
            
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span class="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                Ver relatório
              </span>
              <ArrowRightIcon class="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          <!-- Card 2: Relatório de Clientes -->
          <div 
            class="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="navegarParaRelatorio('clientes')"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <UsersIcon class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 ml-4">Clientes</h3>
            </div>
            
            <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
              Análise detalhada da base de clientes, histórico de atendimentos, dados demográficos e estatísticas de frequência.
            </p>
            
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span class="text-xs font-medium text-green-600 group-hover:text-green-700">
                Ver relatório
              </span>
              <ArrowRightIcon class="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          <!-- Card 3: Relatório de Profissionais -->
          <div 
            class="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="navegarParaRelatorio('profissionais')"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 ml-4">Profissionais</h3>
            </div>
            
            <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
              Desempenho e estatísticas dos profissionais, quantidade de atendimentos realizados e especialidades mais procuradas.
            </p>
            
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span class="text-xs font-medium text-purple-600 group-hover:text-purple-700">
                Ver relatório
              </span>
              <ArrowRightIcon class="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          <!-- Card 4: Relatório de Plantas Medicinais -->
          <div 
            class="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="navegarParaRelatorio('plantas')"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <BeakerIcon class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 ml-4">Plantas Medicinais</h3>
            </div>
            
            <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
              Estatísticas de uso das plantas medicinais, eficácia dos tratamentos e plantas mais prescritas nos atendimentos.
            </p>
            
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span class="text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
                Ver relatório
              </span>
              <ArrowRightIcon class="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          <!-- Card 5: Relatório de Especialidades -->
          <div 
            class="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="navegarParaRelatorio('especialidades')"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 ml-4">Especialidades</h3>
            </div>
            
            <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
              Análise das especialidades oferecidas, demanda por tipo de atendimento e distribuição de profissionais por área.
            </p>
            
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span class="text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                Ver relatório
              </span>
              <ArrowRightIcon class="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          <!-- Card 6: Relatório Financeiro -->
          <div 
            class="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg hover:border-amber-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="navegarParaRelatorio('financeiro')"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <CurrencyDollarIcon class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 ml-4">Financeiro</h3>
            </div>
            
            <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
              Visão geral financeira, receitas, despesas, faturamento por período e análise de crescimento da instituição.
            </p>
            
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span class="text-xs font-medium text-amber-600 group-hover:text-amber-700">
                Ver relatório
              </span>
              <ArrowRightIcon class="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

        </div>

        <!-- Seção de Resumo Rápido -->
        <div class="mt-8">
          <h2 class="text-xl font-semibold text-neutral-900 mb-4">Resumo Rápido</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <!-- Estatística 1 -->
            <div class="bg-white rounded-lg border border-neutral-200 p-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-neutral-600">Total de Atendimentos</span>
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p class="text-2xl font-bold text-neutral-900">
                <span v-if="carregandoAtendimentos" class="inline-block animate-pulse">...</span>
                <span v-else>{{ quantidadeAtendimentos }}</span>
              </p>
              <p class="text-xs text-neutral-500 mt-1">atendimentos realizados</p>
            </div>

            <!-- Estatística 2 -->
            <div class="bg-white rounded-lg border border-neutral-200 p-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-neutral-600">Clientes Ativos</span>
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UsersIcon class="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p class="text-2xl font-bold text-neutral-900">
                <span v-if="carregandoClientes" class="inline-block animate-pulse">...</span>
                <span v-else>{{ quantidadeClientes }}</span>
              </p>
              <p class="text-xs text-neutral-500 mt-1">clientes cadastrados</p>
            </div>

            <!-- Estatística 3 -->
            <div class="bg-white rounded-lg border border-neutral-200 p-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-neutral-600">Profissionais</span>
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon class="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p class="text-2xl font-bold text-neutral-900">
                <span v-if="carregandoProfissionais" class="inline-block animate-pulse">...</span>
                <span v-else>{{ quantidadeProfissionais }}</span>
              </p>
              <p class="text-xs text-neutral-500 mt-1">profissionais ativos</p>
            </div>

            <!-- Estatística 4 -->
            <div class="bg-white rounded-lg border border-neutral-200 p-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-neutral-600">Plantas Cadastradas</span>
                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <BeakerIcon class="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p class="text-2xl font-bold text-neutral-900">
                <span v-if="carregandoPlantas" class="inline-block animate-pulse">...</span>
                <span v-else>{{ quantidadePlantas }}</span>
              </p>
              <p class="text-xs text-neutral-500 mt-1">plantas medicinais no sistema</p>
            </div>

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
  CurrencyDollarIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/vue/24/solid'

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

// Composables
const { buscarPlantas } = usePlantas()
const { buscarProfissionais, buscarClientes } = useProfissionais()
const { buscarAtendimentosCompletos } = useAtendimentos()

// Estados reativos
const quantidadePlantas = ref(0)
const carregandoPlantas = ref(false)
const quantidadeProfissionais = ref(0)
const carregandoProfissionais = ref(false)
const quantidadeClientes = ref(0)
const carregandoClientes = ref(false)
const quantidadeAtendimentos = ref(0)
const carregandoAtendimentos = ref(false)

// Função para navegar para relatórios específicos
const navegarParaRelatorio = (tipo: string) => {
  // Navegação para páginas de relatórios específicas
  router.push(`/relatorios-${tipo}`)
}

// Buscar quantidade de plantas
const buscarQuantidadePlantas = async () => {
  carregandoPlantas.value = true
  try {
    const resultado = await buscarPlantas()
    if (resultado.success && resultado.data) {
      quantidadePlantas.value = resultado.data.length
    }
  } catch (error) {
    console.error('Erro ao buscar quantidade de plantas:', error)
  } finally {
    carregandoPlantas.value = false
  }
}

// Buscar quantidade de profissionais
const buscarQuantidadeProfissionais = async () => {
  carregandoProfissionais.value = true
  try {
    const resultado = await buscarProfissionais()
    if (resultado.success && resultado.data) {
      quantidadeProfissionais.value = resultado.data.length
    }
  } catch (error) {
    console.error('Erro ao buscar quantidade de profissionais:', error)
  } finally {
    carregandoProfissionais.value = false
  }
}

// Buscar quantidade de clientes
const buscarQuantidadeClientes = async () => {
  carregandoClientes.value = true
  try {
    const resultado = await buscarClientes()
    if (resultado.success && resultado.data) {
      quantidadeClientes.value = resultado.data.length
    }
  } catch (error) {
    console.error('Erro ao buscar quantidade de clientes:', error)
  } finally {
    carregandoClientes.value = false
  }
}

// Buscar quantidade de atendimentos
const buscarQuantidadeAtendimentos = async () => {
  carregandoAtendimentos.value = true
  try {
    const atendimentos = await buscarAtendimentosCompletos()
    if (atendimentos && Array.isArray(atendimentos)) {
      quantidadeAtendimentos.value = atendimentos.length
    }
  } catch (error) {
    console.error('Erro ao buscar quantidade de atendimentos:', error)
  } finally {
    carregandoAtendimentos.value = false
  }
}

// Buscar dados ao montar o componente
onMounted(() => {
  buscarQuantidadePlantas()
  buscarQuantidadeProfissionais()
  buscarQuantidadeClientes()
  buscarQuantidadeAtendimentos()
})
</script>