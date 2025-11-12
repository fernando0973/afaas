<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Cabeçalho da página -->
    <header class="bg-white border-b border-neutral-200 px-6 py-6">
      <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-neutral-900">Clientes</h1>
            <p class="text-sm text-neutral-600 mt-1">
              Gerencie os clientes cadastrados no sistema
            </p>
          </div>

          <BaseButton 
            variant="primary"
            :disabled="!isAdmin"
            @click="adicionarCliente"
          >
            <template #iconLeft>
              <PlusIcon class="w-4 h-4" />
            </template>
            Adicionar Cliente
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
              v-model="termoBuscaTabela"
              type="text"
              placeholder="Buscar cliente por nome ou CPF..."
              class="block w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              :class="{ 'border-blue-300 bg-blue-50': termoBuscaTabela && termoBuscaTabela.length >= 2 }"
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
      <div class="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <TabelaClientes 
          ref="tabelaRef"
          :auto-load="true"
          :is-admin="isAdmin"
          :termo-busca="termoBuscaTabela"
          @editar="editarCliente"
          @recarregar="recarregarTabela"
          @adicionar="adicionarCliente"
        />
      </div>
    </main>

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
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useToastNotification as useToast } from '~/composables/useToastNotification'
const toast = useToast()
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