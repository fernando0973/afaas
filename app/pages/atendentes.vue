<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <!-- Cabeçalho da página -->
    <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-neutral-900">Profissionais</h1>
            <p class="text-sm text-neutral-600 mt-1">
              Gerencie os profissionais cadastrados no sistema
            </p>
          </div>

          <BaseButton 
            variant="primary"
            @click="abrirModalCriar"
          >
            <template #iconLeft>
              <PlusIcon class="w-4 h-4" />
            </template>
            Adicionar Profissional
          </BaseButton>
        </div>

        <div class="flex justify-center">
          <div class="relative w-full max-w-lg">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              v-model="termoBusca"
              type="text"
              placeholder="Buscar profissional por nome ou especialidade..."
              class="block w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              :class="{ 'border-blue-300 bg-blue-50': termoBusca && termoBusca.length >= 2 }"
              @input="handleBuscaInput"
            />

            <!-- Botão limpar -->
            <button
              v-if="termoBusca"
              @click="limparBusca"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 min-h-0 overflow-hidden p-6">
      <div class="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden h-full">
        <TabelaProfissionais
          :profissionais="profissionaisFiltrados"
          :carregando="carregandoProfissionais"
          @visualizar="handleVisualizar"
          @recarregar="recarregarDados"
          @adicionar="abrirModalCriar"
        />
      </div>
    </main>

    <!-- Modal de Profissional -->
    <ProfissionalModal
      v-model="showModal"
      :is-edicao="modalIsEdicao"
      :profissional="profissionalParaEditar"
      :especialidades="especialidades"
      :perfis="perfis"
      @salvar="aoSalvarProfissional"
      @cancelar="fecharModal"
      @fechar="fecharModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

// Tipos
interface ProfissionalTabela {
  profissional_id: string
  nome_profissional: string
  especialidade: string
  totalAtendimentos?: number
}

// Meta da página
definePageMeta({
  title: 'Profissionais',
  description: 'Gerencie os profissionais cadastrados no sistema'
})

// Título da página
useHead({
  title: 'Profissionais - AFAAS'
})

// Estado reativo
const profissionais = ref<ProfissionalTabela[]>([])
const carregandoProfissionais = ref(false)
const showModal = ref(false)
const modalIsEdicao = ref(false)
const profissionalParaEditar = ref<any>(null)
const especialidades = ref<any[]>([])
const perfis = ref<any[]>([])

// Estado da busca
const termoBusca = ref('')

// Composables
const { buscarProfissionais, buscarEspecialidades, buscarPerfis, inserirProfissional } = useProfissionais()
const toast = useToastNotification()

// Computed para profissionais filtrados
const profissionaisFiltrados = computed(() => {
  if (!termoBusca.value || termoBusca.value.trim().length < 2) {
    return profissionais.value
  }

  const termo = termoBusca.value.toLowerCase().trim()
  
  return profissionais.value.filter((profissional: ProfissionalTabela) => {
    // Busca por nome
    const nomeMatch = profissional.nome_profissional?.toLowerCase().includes(termo)
    
    // Busca por especialidade
    const especialidadeMatch = profissional.especialidade?.toLowerCase().includes(termo)

    return nomeMatch || especialidadeMatch
  })
})

// Função para carregar profissionais
const carregarProfissionais = async () => {
  carregandoProfissionais.value = true
  try {
    const resultado = await buscarProfissionais()

    if (resultado.success && resultado.data) {
      // Converter de ProfissionalRPC para ProfissionalTabela
      const profissionaisConvertidos: ProfissionalTabela[] = resultado.data.map((prof: any) => ({
        profissional_id: String(prof.id),
        nome_profissional: prof.nome_profissional || 'Sem nome',
        especialidade: prof.especialidade || 'Sem especialidade'
      }))

      profissionais.value = profissionaisConvertidos
    } else {
      console.error('Erro ao carregar profissionais:', resultado.error)
    }
  } catch (error) {
    console.error('Erro inesperado ao carregar profissionais:', error)
  } finally {
    carregandoProfissionais.value = false
  }
}

// Funções do modal
const abrirModalCriar = async () => {
  modalIsEdicao.value = false
  profissionalParaEditar.value = null
  await carregarDadosModal()
  showModal.value = true
}

const fecharModal = () => {
  showModal.value = false
  modalIsEdicao.value = false
  profissionalParaEditar.value = null
}

const carregarDadosModal = async () => {
  // Carregar especialidades e perfis para o modal
  try {
    const [resultEsp, resultPerfis] = await Promise.all([
      buscarEspecialidades(),
      buscarPerfis()
    ])
    
    if (resultEsp.success) especialidades.value = resultEsp.data
    if (resultPerfis.success) perfis.value = resultPerfis.data
  } catch (error) {
    console.error('Erro ao carregar dados do modal:', error)
  }
}

// Handlers da tabela
const handleVisualizar = (profissional: any) => {
  toast.info('Funcionalidade de visualização em desenvolvimento')
}

// Funções de busca
let timeoutBusca: NodeJS.Timeout | null = null

const handleBuscaInput = () => {
  // Debounce da busca para evitar muitas requisições
  if (timeoutBusca) {
    clearTimeout(timeoutBusca)
  }
  
  timeoutBusca = setTimeout(() => {
    // A tabela será atualizada automaticamente via computed do termo de busca
  }, 300)
}

const limparBusca = () => {
  termoBusca.value = ''
}

// Função para recarregar dados
const recarregarDados = async () => {
  await carregarProfissionais()
}

// Salvar profissional
const aoSalvarProfissional = async (dadosProfissional: any) => {
  console.log('aoSalvarProfissional chamada com:', dadosProfissional)
  try {
    const resultado = await inserirProfissional(dadosProfissional.profile_id, dadosProfissional.especialidade_id)
    console.log('Resultado inserirProfissional:', resultado)
    
    if (resultado.success) {
      toast.success(resultado.message)
      fecharModal()
      await carregarProfissionais()
    } else {
      console.log('Erro - success é false:', resultado)
      toast.error(resultado.message || 'Erro ao adicionar profissional')
    }
  } catch (error: any) {
    console.log('Erro capturado no catch:', error)
    toast.error('Erro interno ao adicionar profissional')
  }
}

// Carregar dados ao montar
onMounted(() => {
  carregarProfissionais()
})
</script>