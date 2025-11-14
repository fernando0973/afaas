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
            <h1 class="text-3xl font-bold text-neutral-900">Relatório de Especialidades</h1>
            <p class="text-neutral-600 mt-1">
              Análise das especialidades oferecidas, demanda por tipo de atendimento e distribuição de profissionais
            </p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-6">
          <div class="col-span-2 xl:col-span-2 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
            </div>
            <input
              v-model="termoBusca"
              type="text"
              placeholder="Buscar por nome da especialidade..."
              class="block w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-4 xl:col-span-2">
            <select
              v-model="filtroStatus"
              class="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              disabled
            >
              <option value="todas">Todas as especialidades</option>
            </select>

            <button
              @click="exportarRelatorio"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowDownTrayIcon class="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 min-h-0 overflow-y-auto p-6">
      <div class="w-full max-w-[1600px] mx-auto space-y-6">
        
        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <RelatorioEstatisticaCard
            title="Total de Especialidades"
            :value="estatisticas.totalEspecialidades || 0"
            description="cadastradas no sistema"
            :icon="AcademicCapIcon"
            icon-bg-class="bg-indigo-100"
            icon-color-class="text-indigo-600"
            :loading="carregando"
          />
          
          <RelatorioEstatisticaCard
            title="Especialidades Ativas"
            :value="estatisticas.especialidadesAtivas || 0"
            description="em funcionamento"
            :icon="CheckCircleIcon"
            icon-bg-class="bg-green-100"
            icon-color-class="text-green-600"
            :loading="carregando"
          />
          
          <RelatorioEstatisticaCard
            title="Profissionais Alocados"
            :value="estatisticas.totalProfissionaisAlocados || 0"
            description="distribuídos nas especialidades"
            :icon="UserGroupIcon"
            icon-bg-class="bg-purple-100"
            icon-color-class="text-purple-600"
            :loading="carregando"
          />

          <RelatorioEstatisticaCard
            title="Especialidade Mais Procurada"
            :value="estatisticas.especialidadeMaisProcurada || 'N/A'"
            description="por número de atendimentos"
            :icon="FireIcon"
            icon-bg-class="bg-orange-100"
            icon-color-class="text-orange-600"
            :loading="carregando"
            is-text
          />
        </div>

        <!-- Aviso se não houver dados -->
        <div v-if="!carregando && estatisticas.totalEspecialidades === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div class="text-yellow-600 mb-2">
            <AcademicCapIcon class="w-12 h-12 mx-auto" />
          </div>
          <h3 class="text-lg font-semibold text-yellow-900 mb-2">Nenhuma especialidade encontrada</h3>
          <p class="text-yellow-700 mb-4">
            Não há especialidades cadastradas no sistema. Para ver dados neste relatório, é necessário cadastrar especialidades primeiro.
          </p>
          <button
            @click="voltarParaRelatorios"
            class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Voltar aos Relatórios
          </button>
        </div>

        <!-- Seção da Tabela -->
        <div v-if="!carregando && estatisticas.totalEspecialidades > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-neutral-900">Especialidades por Demanda</h2>
            <p class="text-sm text-neutral-500">
              Ranking baseado no número de profissionais e atendimentos realizados
            </p>
          </div>

          <TabelaEspecialidadesRelatorio
            :especialidades="especialidadesFiltradas"
            :carregando="carregando"
            @abrir-detalhes="abrirDetalhes"
          />

          <!-- Rodapé com informações -->
          <div class="bg-white px-6 py-4 border-t border-neutral-200 rounded-b-lg">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p class="text-sm text-neutral-600">
                Exibindo {{ especialidadesFiltradas.length }} especialidade(s) de {{ especialidades.length }} total(ais)
              </p>
              <p class="text-xs text-neutral-400">
                Dados atualizados em tempo real
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal de Detalhes -->
  <BaseModal
    v-model="modalDetalhesAberto"
    :title="especialidadeDetalhes?.especialidade || 'Detalhes da Especialidade'"
    size="xl"
    :show-footer="false"
    :show-cancel-button="false"
    :show-confirm-button="false"
    :close-on-overlay-click="true"
  >
    <div v-if="especialidadeDetalhes" class="space-y-6">
      <!-- Informações básicas -->
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-xs text-neutral-500">
          Cadastrada em {{ formatarData(especialidadeDetalhes.created_at) }}
        </span>
      </div>

      <!-- Estatísticas da especialidade -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-purple-900 mb-2">Profissionais</h3>
          <p class="text-2xl font-bold text-purple-700">{{ especialidadeDetalhes.totalProfissionais || 0 }}</p>
          <p class="text-xs text-purple-600 mt-1">profissionais alocados</p>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-blue-900 mb-2">Atendimentos</h3>
          <p class="text-2xl font-bold text-blue-700">{{ especialidadeDetalhes.totalAtendimentos || 0 }}</p>
          <p class="text-xs text-blue-600 mt-1">atendimentos realizados</p>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-emerald-900 mb-2">Média Mensal</h3>
          <p class="text-2xl font-bold text-emerald-700">{{ calcularMediaMensal(especialidadeDetalhes.totalAtendimentos) }}</p>
          <p class="text-xs text-emerald-600 mt-1">atendimentos/mês</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-neutral-500">
      <p>Não foi possível carregar os detalhes da especialidade selecionada.</p>
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
  AcademicCapIcon,
  CheckCircleIcon,
  UserGroupIcon,
  FireIcon
} from '@heroicons/vue/24/solid'
import RelatorioEstatisticaCard from '~/components/relatorios/RelatorioEstatisticaCard.vue'
import BaseModal from '~/components/BaseModal.vue'
import { useRelatorios } from '~/composables/useRelatorios'

// Meta da página
definePageMeta({
  title: 'Relatório de Especialidades',
  description: 'Análise das especialidades oferecidas e demanda por atendimento',
  name: 'relatorios-especialidades'
})

// Título da página
useHead({ title: 'Relatório de Especialidades - AFAAS Atendimento' })

const router = useRouter()

// Composables
const { buscarEspecialidadesRelatorio, buscarEstatisticasEspecialidades, formatarData } = useRelatorios()

// Tipos
type EspecialidadeRelatorio = {
  id: number
  especialidade: string
  created_at: string
  totalProfissionais?: number
  totalAtendimentos?: number
}

type FiltroStatus = 'todas' | 'ativas' | 'inativas'

// Estados reativos
const especialidades = ref<EspecialidadeRelatorio[]>([])
const carregando = ref(false)
const termoBusca = ref('')
const filtroStatus = ref<FiltroStatus>('todas')

const estatisticas = reactive({
  totalEspecialidades: 0,
  especialidadesAtivas: 0,
  totalProfissionaisAlocados: 0,
  especialidadeMaisProcurada: 'N/A'
})

// Modal de detalhes
const modalDetalhesAberto = ref(false)
const especialidadeDetalhes = ref<EspecialidadeRelatorio | null>(null)

// Função de busca
const normalizarTexto = (valor: string | null | undefined) => {
  return (valor ?? '').toString().trim().toLowerCase()
}

// Especialidades filtradas
const especialidadesFiltradas = computed(() => {
  const termo = normalizarTexto(termoBusca.value)
  
  return especialidades.value.filter(especialidade => {
    const correspondeBusca = termo
      ? [
          especialidade.especialidade
        ]
          .map(normalizarTexto)
          .some(texto => texto.includes(termo))
      : true

    // Como não temos campo 'ativo' na tabela, vamos mostrar todas por enquanto
    // Podemos implementar filtro por status mais tarde se necessário
    return correspondeBusca
  }).sort((a, b) => {
    // Ordenar por número de atendimentos (decrescente)
    const atendimentosA = a.totalAtendimentos || 0
    const atendimentosB = b.totalAtendimentos || 0
    
    if (atendimentosA === atendimentosB) {
      // Se empate, ordenar alfabeticamente
      return a.especialidade.localeCompare(b.especialidade, 'pt-BR')
    }
    
    return atendimentosB - atendimentosA
  })
})

// Watchers
watch(modalDetalhesAberto, isOpen => {
  if (!isOpen) {
    setTimeout(() => {
      especialidadeDetalhes.value = null
    }, 200)
  }
})

// Funções
const voltarParaRelatorios = () => {
  router.push('/relatorios')
}

const exportarRelatorio = () => {
  console.log('Exportar relatório de especialidades')
}

const abrirDetalhes = (especialidade: EspecialidadeRelatorio) => {
  especialidadeDetalhes.value = especialidade
  modalDetalhesAberto.value = true
}

const calcularMediaMensal = (totalAtendimentos?: number) => {
  if (!totalAtendimentos) return 0
  // Supondo que os dados são dos últimos 12 meses
  return Math.round(totalAtendimentos / 12)
}

// Função para calcular estatísticas
const calcularEstatisticas = (dados: EspecialidadeRelatorio[]) => {
  // As estatísticas básicas já foram calculadas na função carregarEspecialidades
  // Aqui só calculamos a especialidade mais procurada
  
  if (dados.length > 0) {
    const maisAtendimentos = dados.reduce((prev, current) => {
      return (prev.totalAtendimentos || 0) > (current.totalAtendimentos || 0) ? prev : current
    })
    
    estatisticas.especialidadeMaisProcurada = maisAtendimentos?.especialidade || 'N/A'
  } else {
    estatisticas.especialidadeMaisProcurada = 'N/A'
  }
}

// Carregar dados
const carregarEspecialidades = async () => {
  carregando.value = true
  console.log('Iniciando carregamento de especialidades...')
  try {
    console.log('Estado inicial das estatísticas:', estatisticas)
    
    // Buscar estatísticas básicas primeiro
    const estatisticasBasicas = await buscarEstatisticasEspecialidades()
    console.log('Estatísticas básicas retornadas:', estatisticasBasicas)
    
    // Atualizar estatísticas de forma reativa
    Object.assign(estatisticas, {
      totalEspecialidades: estatisticasBasicas.totalEspecialidades,
      especialidadesAtivas: estatisticasBasicas.totalEspecialidades,
      totalProfissionaisAlocados: estatisticasBasicas.totalProfissionais,
      especialidadeMaisProcurada: 'N/A'
    })
    
    console.log('Estado das estatísticas após atualização:', estatisticas)
    
    // Se temos especialidades, buscar dados detalhados
    if (estatisticasBasicas.totalEspecialidades > 0) {
      const dados = await buscarEspecialidadesRelatorio()
      console.log('Dados detalhados recebidos:', dados)
      especialidades.value = dados
      
      // Calcular especialidade mais procurada
      calcularEstatisticas(dados)
      console.log('Estatísticas finais:', estatisticas)
    }
  } catch (error) {
    console.error('Erro ao carregar especialidades para relatório:', error)
  } finally {
    carregando.value = false
    console.log('Carregamento finalizado. Estado final:', { 
      carregando: carregando.value, 
      estatisticas, 
      totalEspecialidades: especialidades.value.length 
    })
  }
}

onMounted(() => {
  carregarEspecialidades()
})
</script>