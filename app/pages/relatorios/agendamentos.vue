<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <!-- Cabeçalho -->
  <header class="bg-white border-b border-neutral-200 px-6 py-4 flex-shrink-0">
      <div class="flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-neutral-900">Relatório de Agendamentos</h1>
            <p class="text-xs text-neutral-600 mt-0.5">
              Visualize e analise os agendamentos realizados com dados detalhados
            </p>
          </div>

          <div class="flex gap-2">
            <BaseButton
              variant="secondary"
              class="hidden sm:inline-flex"
              @click="navegarParaAgendamentos"
            >
              <template #iconLeft>
                <CalendarDaysIcon class="w-4 h-4" />
              </template>
              Novo agendamento
            </BaseButton>

            <BaseButton
              variant="primary"
              class="hidden sm:inline-flex"
              @click="adicionarAtendimento"
              :disabled="carregandoDados"
            >
              <template #iconLeft>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </template>
              Adicionar Atendimento
            </BaseButton>
          </div>
        </div>

        <!-- Campo de busca principal -->
        <div class="flex justify-center">
          <div class="relative w-full max-w-lg">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              v-model="termoBuscaTabela"
              type="text"
              placeholder="Buscar atendimentos por nome do cliente ou por CPF"
              class="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              :class="{ 'border-blue-300 bg-blue-50': termoBuscaTabela && termoBuscaTabela.length >= 2 }"
              @input="handleBuscaInput"
            />

            <button
              v-if="termoBuscaTabela"
              @click="limparBusca"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex gap-2 sm:hidden">
          <BaseButton
            variant="secondary"
            class="flex-1"
            @click="navegarParaAgendamentos"
          >
            <template #iconLeft>
              <CalendarDaysIcon class="w-4 h-4" />
            </template>
            Novo agendamento
          </BaseButton>

          <BaseButton
            variant="primary"
            class="flex-1"
            @click="adicionarAtendimento"
            :disabled="carregandoDados"
          >
            <template #iconLeft>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </template>
            Adicionar
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 min-h-0 overflow-hidden px-4 py-3">
      <div class="bg-white border border-neutral-200 rounded-xl shadow-sm h-full min-h-0 overflow-hidden px-4 py-3">
        <ListaAtendimentos class="h-full" :termo-busca="termoBuscaTabela" />
      </div>
    </main>

    <!-- Modal de atendimentos -->
    <AtendimentosModal
      v-model="modalAberto"
      :is-edicao="modoEdicao"
      :atendimento-data="atendimentoSelecionado"
      :clientes="listaClientes"
      :profissionais="listaProfissionais"
      :plantas="listaPlantas"
      :carregando="carregandoDados"
      @atendimento-salvo="salvarAtendimento"
      @cancel="fecharModal"
      @close="fecharModal"
    />
  </div>
</template>

<script setup lang="ts">
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/BaseButton.vue'
import ListaAtendimentos from '~/components/atendimentos/ListaAtendimentos.vue'
import AtendimentosModal from '~/components/AtendimentosModal.vue'
import type { AtendimentoCompleto } from '~/types/database.types'

// Meta da página
definePageMeta({
  title: 'Agendamentos',
  description: 'Relatório de agendamentos',
  layout: 'default',
  middleware: ['auth'],
  name: 'relatorios-agendamentos-nested'
})

useHead({
  title: 'Relatório de Agendamentos - AFAAS Atendimento'
})

const router = useRouter()

// Composables
const { buscarClientes, buscarProfissionais } = useProfissionais()
const { buscarPlantas } = usePlantas()

// Estados reativos
const termoBuscaTabela = ref('')
let timeoutBusca: ReturnType<typeof setTimeout> | null = null

// Estados do modal
const modalAberto = ref(false)
const modoEdicao = ref(false)
const atendimentoSelecionado = ref<AtendimentoCompleto | null>(null)

// Dados para os dropdowns do modal
const listaClientes = ref<any[]>([])
const listaProfissionais = ref<any[]>([])
const listaPlantas = ref<any[]>([])
const carregandoDados = ref(false)

// Buscar dados ao montar a página
onMounted(async () => {
  await carregarDadosParaModal()
})

// Função para carregar todos os dados necessários para o modal
const carregarDadosParaModal = async () => {
  carregandoDados.value = true
  try {
    // Buscar clientes, profissionais e plantas em paralelo
    const [resultClientes, resultProfissionais, resultPlantas] = await Promise.all([
      buscarClientes(),
      buscarProfissionais(),
      buscarPlantas()
    ])

    listaClientes.value = resultClientes?.data || []
    listaProfissionais.value = resultProfissionais?.data || []
    listaPlantas.value = resultPlantas?.data || []
  } catch (error: any) {
    console.error('Erro ao carregar dados para modal:', error)
  } finally {
    carregandoDados.value = false
  }
}

// Funções de manipulação do modal
const adicionarAtendimento = () => {
  modoEdicao.value = false
  atendimentoSelecionado.value = null
  modalAberto.value = true
}

const editarAtendimento = (atendimento: AtendimentoCompleto) => {
  modoEdicao.value = true
  atendimentoSelecionado.value = { ...atendimento }
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
  setTimeout(() => {
    modoEdicao.value = false
    atendimentoSelecionado.value = null
  }, 200)
}

const salvarAtendimento = async (atendimento: any) => {
  try {
    // TODO: Implementar salvamento
    console.log('Salvar atendimento:', atendimento)
    
    // Fechar modal
    fecharModal()
    
    // Recarregar lista de atendimentos
    // await recarregarLista()
  } catch (error: any) {
    console.error('Erro ao salvar atendimento:', error)
  }
}

// Funções de busca
const handleBuscaInput = () => {
  if (timeoutBusca) {
    clearTimeout(timeoutBusca)
  }

  timeoutBusca = setTimeout(() => {
    // filtragem ocorre no componente via prop
  }, 300)
}

const limparBusca = () => {
  termoBuscaTabela.value = ''
}

const navegarParaAgendamentos = () => {
  router.push('/admin')
}
</script>