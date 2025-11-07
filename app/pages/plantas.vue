<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Hero Section / Cabeçalho da página -->
      <div class="pt-6 pb-8">
        <div class="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-6 relative overflow-hidden">
          <!-- Decoração de fundo -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>
          
          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div class="flex-1">
                <!-- Breadcrumb/Categoria -->
                <div class="flex items-center gap-2 mb-2">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🌿 Base de Conhecimento
                  </span>
                </div>
                
                <h1 class="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
                  Plantas 
                  <span class="text-green-600">Medicinais</span>
                </h1>
                
                <p class="text-base text-neutral-600 max-w-xl">
                  Explore nossa base de dados completa com informações detalhadas sobre plantas medicinais.
                </p>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <BaseButton 
                  variant="primary"
                  :disabled="!isAdmin"
                  @click="adicionarPlanta"
                  class="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <template #iconLeft>
                    <PlusIcon class="w-5 h-5" />
                  </template>
                  Adicionar Planta
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de busca melhorada -->
        <div class="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
          <div class="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
            <div class="flex-1 w-full">
              <div class="w-full max-w-2xl">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <input
                    v-model="termoBuscaTabela"
                    type="text"
                    placeholder="Buscar plantas por nome popular ou científico..."
                    class="block w-full pl-12 pr-12 py-3 text-base border border-gray-300 rounded-lg leading-6 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    :class="{ 'border-green-300 bg-green-50': termoBuscaTabela && termoBuscaTabela.length >= 2 }"
                    @input="handleBuscaInput"
                  />

                  <!-- Botão limpar -->
                  <button
                    v-if="termoBuscaTabela"
                    @click="limparBusca"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 xl:max-w-sm">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <span class="text-green-600 text-xs">💡</span>
                </div>
                <div>
                  <h4 class="text-xs font-semibold text-green-900 mb-1">Dica</h4>
                  <p class="text-xs text-green-700 leading-relaxed">
                    Digite o nome popular ou científico para buscar. Os resultados aparecerão na tabela abaixo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela de plantas -->
      <TabelaPlantas 
        ref="tabelaRef"
        :auto-load="true"
        :is-admin="isAdmin"
        :termo-busca="termoBuscaTabela"
        @editar="editarPlanta"
        @remover="confirmarRemoverPlanta"
        @visualizar="visualizarPlanta"
        @recarregar="recarregarTabela"
        @adicionar="adicionarPlanta"
      />

      <!-- Modal de plantas -->
      <PlantasModal
        v-model="modalAberto"
        :is-edicao="modoEdicao"
        :planta-id="plantaSelecionada?.id || null"
        :planta-data="plantaSelecionada"
        @save="salvarPlanta"
        @cancel="fecharModal"
        @close="fecharModal"
      />

      <!-- Modal de confirmação para deleção -->
      <BaseConfirmModal
        v-model="modalConfirmacaoAberto"
        type="danger"
        title="Confirmar Exclusão"
        :message="`Tem certeza que deseja remover a planta medicinal '${plantaParaDeletar?.nome_popular}'? Esta ação não pode ser desfeita.`"
        confirm-text="Sim, Remover"
        cancel-text="Cancelar"
        :loading="deletandoPlanta"
        @confirm="confirmarDelecao"
        @cancel="cancelarDelecao"
        @close="cancelarDelecao"
      />

      <!-- Modal de visualização de planta -->
      <PlantaVisualizacaoModal
        v-model="modalVisualizacaoAberto"
        :planta-data="plantaVisualizacao"
        @close="fecharModalVisualizacao"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useToastNotification as useToast } from '~/composables/useToastNotification'
import type { PlantaMedicinal } from '~/types/planta'

// Meta da página
definePageMeta({
  title: 'Plantas Medicinais',
  description: 'Gerencie informações sobre plantas medicinais',
  middleware: 'auth'
})

// Título da página
useHead({
  title: 'Plantas Medicinais - AFAAS Atendimento'
})

// Composables
const { buscarPlantas, inserirPlanta, editarPlanta: editarPlantaAPI, deletarPlanta } = usePlantas()
const toast = useToast()

// Estados reativos
const isAdmin = ref(true) // TODO: Implementar verificação de admin real
const tabelaRef = ref<any>(null)

// Estado da busca
const termoBuscaTabela = ref('')

// Estados do modal
const modalAberto = ref(false)
const modoEdicao = ref(false)
const plantaSelecionada = ref<PlantaMedicinal | null>(null)

// Estados do modal de confirmação
const modalConfirmacaoAberto = ref(false)
const plantaParaDeletar = ref<PlantaMedicinal | null>(null)
const deletandoPlanta = ref(false)

// Estados do modal de visualização
const modalVisualizacaoAberto = ref(false)
const plantaVisualizacao = ref<PlantaMedicinal | null>(null)

// Funções para manipulação das plantas
const adicionarPlanta = () => {
  modoEdicao.value = false
  plantaSelecionada.value = null
  modalAberto.value = true
}

const editarPlanta = (planta: PlantaMedicinal) => {
  console.log('Editando planta:', planta)
  modoEdicao.value = true
  
  // Deep clone para garantir que arrays são copiados corretamente
  plantaSelecionada.value = {
    ...planta,
    partes_usadas: planta.partes_usadas ? [...planta.partes_usadas] : null,
    sabor_propriedade: planta.sabor_propriedade ? [...planta.sabor_propriedade] : null,
    meridianos: planta.meridianos ? [...planta.meridianos] : null,
    renisus: planta.renisus || false
  }
  
  console.log('Planta selecionada:', plantaSelecionada.value)
  modalAberto.value = true
}

const confirmarRemoverPlanta = (planta: PlantaMedicinal) => {
  plantaParaDeletar.value = planta
  modalConfirmacaoAberto.value = true
}

const cancelarDelecao = () => {
  modalConfirmacaoAberto.value = false
  plantaParaDeletar.value = null
  deletandoPlanta.value = false
}

const confirmarDelecao = async () => {
  if (!plantaParaDeletar.value?.id) {
    return
  }

  deletandoPlanta.value = true

  try {
    const resultado = await deletarPlanta(plantaParaDeletar.value.id)

    if (resultado.success) {
      console.log('Planta deletada com sucesso:', resultado.data)
      
      // Exibir toast de sucesso
      toast.success('Planta removida com sucesso!')
      
      // Aguardar um pouco para garantir que o toast seja exibido
      setTimeout(() => {
        // Fechar modal de confirmação
        cancelarDelecao()
        
        // Recarregar tabela
        if (tabelaRef.value?.recarregarDados) {
          tabelaRef.value.recarregarDados()
        }
      }, 300)
      
    } else {
      // Exibir erro
      console.error('Erro ao deletar planta:', resultado.error)
      toast.error(`Erro ao remover planta: ${resultado.error}`)
    }
  } catch (error: any) {
    console.error('Erro inesperado ao deletar planta:', error)
    toast.error(`Erro inesperado: ${error.message || error}`)
  } finally {
    deletandoPlanta.value = false
  }
}

const fecharModal = () => {
  modalAberto.value = false
  setTimeout(() => {
    modoEdicao.value = false
    plantaSelecionada.value = null
  }, 200)
}

const salvarPlanta = async (dadosPlanta: Omit<PlantaMedicinal, 'id' | 'created_at' | 'deleted_at'> & { id?: number }) => {
  try {
    console.log('Salvando planta:', dadosPlanta)
    
    let resultado
    
    if (modoEdicao.value && dadosPlanta.id) {
      // Editar planta existente
      resultado = await editarPlantaAPI(dadosPlanta.id, dadosPlanta)
    } else {
      // Inserir nova planta
      resultado = await inserirPlanta(dadosPlanta)
    }
    
    if (resultado.success) {
      console.log('Planta salva com sucesso:', resultado.data)
      
      // Exibir toast de sucesso primeiro
      toast.success(`Planta ${modoEdicao.value ? 'editada' : 'criada'} com sucesso!`)
      
      // Aguardar um pouco para garantir que o toast seja exibido antes de fechar o modal
      setTimeout(async () => {
        // Fechar modal
        fecharModal()
        
        // Recarregar tabela
        if (tabelaRef.value?.recarregarDados) {
          await tabelaRef.value.recarregarDados()
        }
      }, 500)
      
    } else {
      // Exibir erro
      console.error('Erro ao salvar planta:', resultado.error)
      toast.error(`Erro ao ${modoEdicao.value ? 'editar' : 'criar'} planta: ${resultado.error}`)
    }
    
  } catch (error: any) {
    console.error('Erro inesperado ao salvar planta:', error)
    toast.error(`Erro inesperado: ${error.message || error}`)
  }
}

const recarregarTabela = () => {
  console.log('Tabela recarregada')
  // Lógica adicional se necessário após recarregar
}

// Funções de busca
let timeoutBusca: NodeJS.Timeout | null = null

const handleBuscaInput = () => {
  // Debounce da busca para evitar muitas requisições
  if (timeoutBusca) {
    clearTimeout(timeoutBusca)
  }
  
  timeoutBusca = setTimeout(() => {
    // A tabela será atualizada automaticamente via watch do termo de busca
  }, 300)
}

const limparBusca = () => {
  termoBuscaTabela.value = ''
}

// Funções do modal de visualização
const visualizarPlanta = (planta: PlantaMedicinal) => {
  console.log('Visualizando planta:', planta)
  plantaVisualizacao.value = planta
  modalVisualizacaoAberto.value = true
}

const fecharModalVisualizacao = () => {
  modalVisualizacaoAberto.value = false
  setTimeout(() => {
    plantaVisualizacao.value = null
  }, 300)
}
</script>