<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho da página -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900">Plantas Medicinais</h1>
            <p class="mt-2 text-neutral-600">
              Gerencie as plantas medicinais cadastradas no sistema
            </p>
          </div>
          
          <BaseButton 
            variant="primary"
            :disabled="!isAdmin"
            @click="adicionarPlanta"
          >
            <template #iconLeft>
              <PlusIcon class="w-5 h-5" />
            </template>
            Adicionar Planta
          </BaseButton>
        </div>
      </div>

      <!-- Tabela de plantas -->
      <TabelaPlantas 
        ref="tabelaRef"
        :auto-load="true"
        :is-admin="isAdmin"
        @editar="editarPlanta"
        @remover="confirmarRemoverPlanta"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { PlantaMedicinal } from '~/types/planta'

// Título da página
useHead({
  title: 'Plantas Medicinais - AFAAS Atendimento'
})

// Composables
const { buscarPlantas, inserirPlanta, editarPlanta: editarPlantaAPI, deletarPlanta } = usePlantas()

// Estados reativos
const isAdmin = ref(true) // TODO: Implementar verificação de admin real
const tabelaRef = ref<any>(null)

// Estados do modal
const modalAberto = ref(false)
const modoEdicao = ref(false)
const plantaSelecionada = ref<PlantaMedicinal | null>(null)

// Estados do modal de confirmação
const modalConfirmacaoAberto = ref(false)
const plantaParaDeletar = ref<PlantaMedicinal | null>(null)
const deletandoPlanta = ref(false)

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
      
      // Fechar modal de confirmação
      cancelarDelecao()
      
      // Recarregar tabela
      if (tabelaRef.value?.recarregarDados) {
        await tabelaRef.value.recarregarDados()
      }
      
      // TODO: Adicionar toast de sucesso
      console.log('Planta removida com sucesso!')
      
    } else {
      // Exibir erro
      console.error('Erro ao deletar planta:', resultado.error)
      // TODO: Adicionar toast de erro
      alert(`Erro ao remover planta: ${resultado.error}`)
    }
  } catch (error: any) {
    console.error('Erro inesperado ao deletar planta:', error)
    // TODO: Adicionar toast de erro
    alert(`Erro inesperado: ${error.message || error}`)
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
      
      // Fechar modal
      fecharModal()
      
      // Recarregar tabela
      if (tabelaRef.value?.recarregarDados) {
        await tabelaRef.value.recarregarDados()
      }
      
      // TODO: Adicionar toast de sucesso
      console.log(`Planta ${modoEdicao.value ? 'editada' : 'criada'} com sucesso!`)
      
    } else {
      // Exibir erro
      console.error('Erro ao salvar planta:', resultado.error)
      // TODO: Adicionar toast de erro
      alert(`Erro ao ${modoEdicao.value ? 'editar' : 'criar'} planta: ${resultado.error}`)
    }
    
  } catch (error: any) {
    console.error('Erro inesperado ao salvar planta:', error)
    // TODO: Adicionar toast de erro
    alert(`Erro inesperado: ${error.message || error}`)
  }
}

const recarregarTabela = () => {
  console.log('Tabela recarregada')
  // Lógica adicional se necessário após recarregar
}
</script>