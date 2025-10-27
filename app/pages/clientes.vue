<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho da página -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900">Clientes</h1>
            <p class="mt-2 text-neutral-600">
              Gerencie os clientes cadastrados no sistema
            </p>
          </div>
          
          <BaseButton 
            variant="primary"
            :disabled="!isAdmin"
            @click="adicionarCliente"
          >
            <template #iconLeft>
              <PlusIcon class="w-5 h-5" />
            </template>
            Adicionar Cliente
          </BaseButton>
        </div>
      </div>

      <!-- Tabela de clientes -->
      <TabelaClientes 
        ref="tabelaRef"
        :auto-load="true"
        :is-admin="isAdmin"
        @editar="editarCliente"
        @remover="confirmarRemoverCliente"
        @recarregar="recarregarTabela"
        @adicionar="adicionarCliente"
      />

      <!-- Modal de clientes -->
      <ClientesModal
        v-model="modalAberto"
        :is-edicao="modoEdicao"
        :cliente-data="clienteSelecionado"
        @cliente-salvo="salvarCliente"
        @cancel="fecharModal"
        @close="fecharModal"
      />

      <!-- Modal de confirmação para deleção -->
      <BaseConfirmModal
        v-model="modalConfirmacaoAberto"
        type="danger"
        title="Confirmar Exclusão"
        :message="`Tem certeza que deseja remover o cliente '${clienteParaDeletar?.nome_completo}'? Esta ação não pode ser desfeita.`"
        confirm-text="Sim, Remover"
        cancel-text="Cancelar"
        :loading="deletandoCliente"
        @confirm="confirmarDelecao"
        @cancel="cancelarDelecao"
        @close="cancelarDelecao"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
const toast = useToast()
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { Cliente } from '~/types/cliente'

// Título da página
useHead({
  title: 'Clientes - AFAAS Atendimento'
})

// Composables
const { buscarClientes, removerCliente } = useProfissionais()

// Estados reativos
const isAdmin = ref(true) // TODO: Implementar verificação de admin real
const tabelaRef = ref<any>(null)

// Estados do modal (para implementação futura)
const modalAberto = ref(false)
const modoEdicao = ref(false)
const clienteSelecionado = ref<Cliente | null>(null)

// Estados do modal de confirmação
const modalConfirmacaoAberto = ref(false)
const clienteParaDeletar = ref<Cliente | null>(null)
const deletandoCliente = ref(false)

// Funções para manipulação dos clientes
const adicionarCliente = () => {
  modoEdicao.value = false
  clienteSelecionado.value = null
  modalAberto.value = true
}

const editarCliente = (cliente: Cliente) => {
  console.log('Editando cliente:', cliente)
  modoEdicao.value = true
  
  // Deep clone para garantir que não há referências compartilhadas
  clienteSelecionado.value = { ...cliente }
  
  console.log('Cliente selecionado:', clienteSelecionado.value)
  modalAberto.value = true
}

const confirmarRemoverCliente = (cliente: Cliente) => {
  clienteParaDeletar.value = cliente
  modalConfirmacaoAberto.value = true
}

const cancelarDelecao = () => {
  modalConfirmacaoAberto.value = false
  clienteParaDeletar.value = null
  deletandoCliente.value = false
}

const confirmarDelecao = async () => {
  if (!clienteParaDeletar.value?.id) {
    return
  }

  deletandoCliente.value = true

  try {
    const resultado = await removerCliente(clienteParaDeletar.value.id)
    if (resultado.success) {
      toast.success('Cliente removido com sucesso!')
      cancelarDelecao()
      if (tabelaRef.value?.recarregarDados) {
        await tabelaRef.value.recarregarDados()
      }
    } else {
      toast.error(resultado.message || 'Erro ao remover cliente!')
    }
  } catch (error: any) {
    toast.error(`Erro inesperado: ${error.message || error}`)
  } finally {
    deletandoCliente.value = false
  }
}

const fecharModal = () => {
  modalAberto.value = false
  setTimeout(() => {
    modoEdicao.value = false
    clienteSelecionado.value = null
  }, 200)
}

const salvarCliente = async (cliente: Cliente) => {
  try {
    console.log('Cliente salvo com sucesso:', cliente)
    
    // Fechar modal
    fecharModal()
    
    // Recarregar tabela
    if (tabelaRef.value?.recarregarDados) {
      await tabelaRef.value.recarregarDados()
    }
    
    console.log(`Cliente ${modoEdicao.value ? 'editado' : 'criado'} com sucesso!`)
    
  } catch (error: any) {
    console.error('Erro inesperado ao salvar cliente:', error)
    alert(`Erro inesperado: ${error.message || error}`)
  }
}

const recarregarTabela = () => {
  console.log('Tabela recarregada')
  // Lógica adicional se necessário após recarregar
}
</script>