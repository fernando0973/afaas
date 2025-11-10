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

    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastNotification as useToast } from '~/composables/useToastNotification'
const toast = useToast()
import PlusIcon from '@heroicons/vue/24/outline/PlusIcon'
import type { Cliente } from '~/types/cliente'

// Meta da página
definePageMeta({
  title: 'Clientes',
  description: 'Gerencie os clientes cadastrados no sistema'
})

// Título da página
useHead({
  title: 'Clientes - AFAAS Atendimento'
})

// Composables
const { buscarClientes } = useProfissionais()

// Estados reativos
const isAdmin = ref(true) // TODO: Implementar verificação de admin real
const tabelaRef = ref<any>(null)

// Estado da busca
const termoBuscaTabela = ref('')

// Estados do modal
const modalAberto = ref(false)
const modoEdicao = ref(false)
const clienteSelecionado = ref<Cliente | null>(null)

// Funções para manipulação dos clientes
const adicionarCliente = () => {
  modoEdicao.value = false
  clienteSelecionado.value = null
  modalAberto.value = true
}

const editarCliente = (cliente: Cliente) => {
  modoEdicao.value = true
  
  // Deep clone para garantir que não há referências compartilhadas
  clienteSelecionado.value = { ...cliente }
  
  modalAberto.value = true
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
    
    // Fechar modal
    fecharModal()
    
    // Recarregar tabela
    if (tabelaRef.value?.recarregarDados) {
      await tabelaRef.value.recarregarDados()
    }
    
    
  } catch (error: any) {
    alert(`Erro inesperado: ${error.message || error}`)
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
    // A tabela será atualizada automaticamente via computed do termo de busca
  }, 300)
}

const limparBusca = () => {
  termoBuscaTabela.value = ''
}
</script>