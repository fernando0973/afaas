<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Cabeçalho da página -->
    <header class="bg-white border-b border-neutral-200 px-6 py-6">
      <div class="flex flex-col space-y-4">
        <!-- Título e descrição -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-neutral-900">Plantas Medicinais</h1>
            <p class="text-sm text-neutral-600 mt-1">
              Explore nossa base de conhecimento sobre plantas medicinais
            </p>
          </div>
          
          <!-- Botão Nova Planta -->
          <BaseButton 
            variant="primary"
            :disabled="!isAdmin"
            @click="adicionarPlanta"
          >
            <template #iconLeft>
              <PlusIcon class="w-4 h-4" />
            </template>
            Nova Planta
          </BaseButton>
        </div>
        
        <!-- Campo de busca centralizado -->
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
              placeholder="Buscar plantas por nome popular, científico..."
              class="block w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              @input="handleBuscaInput"
            />
            <!-- Botão limpar -->
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
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="p-6">
      <!-- Tabela de plantas -->
      <TabelaPlantas 
        ref="tabelaRef"
        :auto-load="true"
        :is-admin="isAdmin"
        :termo-busca="termoBuscaTabela"
        @visualizar="visualizarPlanta"
        @recarregar="recarregarTabela"
        @adicionar="adicionarPlanta"
      />
    </main>

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
      @editar="editarPlantaDoModal"
    />
  </div>
</template>

<script setup lang="ts">
import PlusIcon from '@heroicons/vue/24/outline/PlusIcon'
import { useToastNotification as useToast } from '~/composables/useToastNotification'
import type { PlantaMedicinal } from '~/types/planta'

// Meta da página
definePageMeta({
  title: 'Plantas Medicinais',
  description: 'Gerencie informações sobre plantas medicinais'
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
  modoEdicao.value = true
  
  // Deep clone para garantir que arrays são copiados corretamente
  plantaSelecionada.value = {
    ...planta,
    partes_usadas: planta.partes_usadas ? [...planta.partes_usadas] : null,
    sabor_propriedade: planta.sabor_propriedade ? [...planta.sabor_propriedade] : null,
    meridianos: planta.meridianos ? [...planta.meridianos] : null,
    renisus: planta.renisus || false
  }
  
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
      toast.error(`Erro ao remover planta: ${resultado.error}`)
    }
  } catch (error: any) {
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
    
    let resultado
    
    if (modoEdicao.value && dadosPlanta.id) {
      // Editar planta existente
      resultado = await editarPlantaAPI(dadosPlanta.id, dadosPlanta)
    } else {
      // Inserir nova planta
      resultado = await inserirPlanta(dadosPlanta)
    }
    
    if (resultado.success) {
      
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
      toast.error(`Erro ao ${modoEdicao.value ? 'editar' : 'criar'} planta: ${resultado.error}`)
    }
    
  } catch (error: any) {
    toast.error(`Erro inesperado: ${error.message || error}`)
  }
}

const recarregarTabela = () => {
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
  plantaVisualizacao.value = planta
  modalVisualizacaoAberto.value = true
}

const fecharModalVisualizacao = () => {
  modalVisualizacaoAberto.value = false
  setTimeout(() => {
    plantaVisualizacao.value = null
  }, 300)
}

const editarPlantaDoModal = (planta: PlantaMedicinal) => {
  // Fechar modal de visualização
  fecharModalVisualizacao()
  
  // Abrir modal de edição
  editarPlanta(planta)
}
</script>