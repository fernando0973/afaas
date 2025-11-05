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

      <!-- Seção de busca -->
      <div class="mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input
              v-model="termoBuscaTabela"
              type="text"
              placeholder="Buscar cliente por nome ou CPF..."
              class="block w-full pl-12 pr-12 py-3 text-base border border-gray-300 rounded-lg leading-6 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              :class="{ 'border-blue-300 bg-blue-50': termoBuscaTabela && termoBuscaTabela.length >= 2 }"
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

      <!-- Tabela de clientes -->
      <TabelaClientes 
        ref="tabelaRef"
        :auto-load="true"
        :is-admin="isAdmin"
        :termo-busca="termoBuscaTabela"
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
import { useToastNotification as useToast } from '~/composables/useToastNotification'
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

// Estado da busca
const termoBuscaTabela = ref('')

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
  termoBuscaTabela.value = ''
}
</script>