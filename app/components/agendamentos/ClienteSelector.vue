<template>
  <div class="space-y-2 relative">
    <label class="block text-sm font-medium text-neutral-700">
      Cliente <span class="text-danger">*</span>
    </label>
    
      <!-- Input pesquisável -->
    <div class="relative">
      <input
        v-model="searchTerm"
        @focus="openDropdown"
        @blur="closeDropdown"
        @input="handleInput"
        :disabled="loading"
        :placeholder="loading ? 'Carregando clientes...' : 'Digite o nome ou CPF do cliente'"
        class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{
          'border-red-300 focus:ring-red-500 focus:border-red-500': error,
          'bg-gray-100 cursor-not-allowed': loading
        }"
      />
      
      <!-- Ícone dropdown -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <!-- Dropdown com clientes filtrados -->
      <div
        v-if="isDropdownOpen && filteredClients.length > 0"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-for="cliente in filteredClients"
          :key="cliente.id"
          @mousedown="selectClient(cliente)"
          class="px-3 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          :class="{
            'bg-blue-50 text-blue-700': modelValue === cliente.id.toString()
          }"
        >
          <div class="font-medium text-gray-900">{{ cliente.nome_completo }}</div>
          <div v-if="cliente.cpf" class="text-sm text-gray-500 mt-1">
            CPF: {{ formatCPF(cliente.cpf) }}
          </div>
          <div v-if="cliente.telefone" class="text-sm text-gray-500">
            Tel: {{ cliente.telefone }}
          </div>
        </div>
        
        <!-- Link para cadastrar novo cliente -->
        <div class="border-t border-gray-100 p-2">
          <button
            @mousedown="addNewClient"
            type="button"
            class="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Cadastrar novo cliente</span>
          </button>
        </div>
      </div>
      
      <!-- Mensagem quando não há resultados -->
      <div
        v-if="isDropdownOpen && filteredClients.length === 0 && searchTerm.length > 2"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
      >
        <div class="px-3 py-4 text-gray-500 text-center">
          <div class="mb-2">
            <svg class="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p class="font-medium">Nenhum cliente encontrado</p>
          <p class="text-sm">para "{{ searchTerm }}"</p>
        </div>
        <div class="border-t border-gray-100 px-3 py-2">
          <button
            @mousedown="addNewClient"
            type="button"
            class="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Cadastrar novo cliente</span>
          </button>
        </div>
      </div>
    </div>    <p v-if="error" class="text-sm text-danger">
      {{ error }}
    </p>
    
    <!-- Dica de pesquisa -->
    <p class="text-xs text-gray-500">
      💡 Dica: Digite o nome ou CPF do cliente. A seleção é automática. Não encontra? 
      <button 
        @click="addNewClient" 
        type="button"
        class="text-blue-600 hover:text-blue-700 underline font-medium"
      >
        Cadastre um novo cliente
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Cliente } from '~/types/cliente'

interface Props {
  modelValue: string
  clients: Cliente[]
  loading?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Estado reativo
const searchTerm = ref('')
const isDropdownOpen = ref(false)

// Cliente selecionado
const selectedClient = computed(() => {
  return props.clients?.find(c => c.id.toString() === props.modelValue)
})

// Clientes filtrados
const filteredClients = computed(() => {
  console.log('📊 Recalculando filteredClients:', {
    clients: props.clients?.length || 0,
    searchTerm: searchTerm.value,
    isDropdownOpen: isDropdownOpen.value
  })
  
  if (!props.clients || props.clients.length === 0) {
    console.log('❌ Sem clientes')
    return []
  }
  
  if (!searchTerm.value.trim()) {
    const inicial = props.clients.slice(0, 50)
    console.log('📝 Retornando lista inicial:', inicial.length)
    return inicial
  }
  
  const termo = searchTerm.value.toLowerCase().trim()
  
  const filtrados = props.clients.filter(cliente => {
    const nome = cliente.nome_completo?.toLowerCase() || ''
    const cpf = cliente.cpf?.replace(/\D/g, '') || ''
    const telefone = cliente.telefone?.replace(/\D/g, '') || ''
    
    const match = nome.includes(termo) || 
           cpf.includes(termo.replace(/\D/g, '')) ||
           telefone.includes(termo.replace(/\D/g, ''))
           
    return match
  }).slice(0, 50)
  
  console.log('🎯 Clientes filtrados:', filtrados.length, 'de', props.clients.length)
  return filtrados
})

// Função para formatar CPF
const formatCPF = (cpf: string | null | undefined): string => {
  if (!cpf) return ''
  
  const numerosApenas = cpf.replace(/\D/g, '')
  
  if (numerosApenas.length === 11) {
    return numerosApenas.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  return cpf
}

// Abrir dropdown
const openDropdown = () => {
  isDropdownOpen.value = true
  
  // Se não há busca, mostrar nome do cliente selecionado
  if (!searchTerm.value && selectedClient.value) {
    searchTerm.value = selectedClient.value.nome_completo
  }
}

// Fechar dropdown com delay para permitir clique nos itens
const closeDropdown = () => {
  setTimeout(() => {
    isDropdownOpen.value = false
    
    // Se não há cliente selecionado, limpar busca
    if (!props.modelValue) {
      searchTerm.value = ''
    } else if (selectedClient.value) {
      // Mostrar nome do cliente selecionado
      searchTerm.value = selectedClient.value.nome_completo
    }
  }, 150)
}

// Handler do input (acionado pelo @input)
const handleInput = () => {
  console.log('⌨️ Input event triggered:', searchTerm.value)
  // Abrir dropdown automaticamente ao digitar
  if (!isDropdownOpen.value) {
    isDropdownOpen.value = true
  }
  
  // Se o usuário digitou algo diferente do nome do cliente selecionado, limpar seleção
  if (selectedClient.value && searchTerm.value !== selectedClient.value.nome_completo) {
    emit('update:modelValue', '')
  }
}

// Watcher para seleção automática baseada no termo de busca
watch(searchTerm, (novoTermo) => {
  console.log('🔍 Search term changed:', novoTermo)
  const termo = novoTermo.toLowerCase().trim()
  
  // Seleção automática inteligente apenas se há termo e dropdown está aberto
  if (termo.length >= 2 && isDropdownOpen.value && props.clients) {
    const clientesEncontrados = props.clients.filter(cliente => {
      const nome = cliente.nome_completo?.toLowerCase() || ''
      const cpf = cliente.cpf?.replace(/\D/g, '') || ''
      const telefone = cliente.telefone?.replace(/\D/g, '') || ''
      
      return nome.includes(termo) || 
             cpf.includes(termo.replace(/\D/g, '')) ||
             telefone.includes(termo.replace(/\D/g, ''))
    })
    
    // Se encontrou exatamente um cliente
    if (clientesEncontrados.length === 1) {
      const cliente = clientesEncontrados[0]
      if (cliente && props.modelValue !== cliente.id.toString()) {
        emit('update:modelValue', cliente.id.toString())
      }
    } 
    // Se há múltiplos, verificar correspondência exata
    else if (clientesEncontrados.length > 1) {
      // Correspondência exata por nome
      const correspondenciaExata = clientesEncontrados.find(cliente => {
        const nome = cliente.nome_completo?.toLowerCase() || ''
        return nome === termo
      })
      
      if (correspondenciaExata && props.modelValue !== correspondenciaExata.id.toString()) {
        emit('update:modelValue', correspondenciaExata.id.toString())
        return
      }
      
      // Correspondência por CPF completo
      const correspondenciaCPF = clientesEncontrados.find(cliente => {
        const cpf = cliente.cpf?.replace(/\D/g, '') || ''
        return cpf === termo.replace(/\D/g, '') && termo.replace(/\D/g, '').length === 11
      })
      
      if (correspondenciaCPF && props.modelValue !== correspondenciaCPF.id.toString()) {
        emit('update:modelValue', correspondenciaCPF.id.toString())
        // Atualizar o campo com o nome do cliente
        nextTick(() => {
          searchTerm.value = correspondenciaCPF.nome_completo
        })
      }
    }
  }
}, { immediate: false })

// Selecionar cliente
const selectClient = (cliente: Cliente) => {
  emit('update:modelValue', cliente.id.toString())
  searchTerm.value = cliente.nome_completo
  isDropdownOpen.value = false
}

// Adicionar novo cliente
const addNewClient = () => {
  isDropdownOpen.value = false
  navigateTo('/clientes')
}

// Watcher para sincronizar busca com cliente selecionado
watch(() => props.modelValue, (novoClienteId) => {
  if (novoClienteId) {
    const cliente = props.clients?.find(c => c.id.toString() === novoClienteId)
    if (cliente && searchTerm.value !== cliente.nome_completo) {
      searchTerm.value = cliente.nome_completo
    }
  } else {
    if (!isDropdownOpen.value) {
      searchTerm.value = ''
    }
  }
})
</script>