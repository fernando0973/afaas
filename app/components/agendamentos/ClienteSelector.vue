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
const isAutoSelecting = ref(false) // Flag para evitar loops



// Cliente selecionado
const selectedClient = computed(() => {
  return props.clients?.find((c: Cliente) => c.id.toString() === props.modelValue)
})

// Clientes filtrados
const filteredClients = computed(() => {
  if (!props.clients || props.clients.length === 0) {
    return []
  }

  // Quando o usuário apenas focar no campo, mostrar os primeiros 50 clientes
  // Isto ajuda na seleção rápida, como já fazemos em PlantasBuscador
  if (!searchTerm.value.trim()) {
    return props.clients.slice(0, 50)
  }

  const termo = searchTerm.value.toLowerCase().trim()

  const filtrados = props.clients
    .filter((cliente: Cliente) => {
      const nome = cliente.nome_completo?.toLowerCase() || ''
      const cpf = cliente.cpf?.replace(/\D/g, '') || ''
      const telefone = cliente.telefone?.replace(/\D/g, '') || ''

      // Separar busca por nome e por números
      const termoNumeros = termo.replace(/\D/g, '')

      const matchNome = nome.includes(termo)
      const matchCPF = termoNumeros.length > 0 && cpf.includes(termoNumeros)
      const matchTelefone = termoNumeros.length > 0 && telefone.includes(termoNumeros)

      return matchNome || matchCPF || matchTelefone
    })
    .slice(0, 50)

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

// Handler do input - lógica simplificada
const handleInput = () => {
  // Se está em processo de auto-seleção, ignorar
  if (isAutoSelecting.value) {
    return
  }
  
  // Sempre abrir dropdown ao digitar
  if (!isDropdownOpen.value) {
    isDropdownOpen.value = true
  }
  
  // Limpar seleção se o texto mudou
  if (selectedClient.value && searchTerm.value !== selectedClient.value.nome_completo) {
    emit('update:modelValue', '')
  }
  
  // SELEÇÃO AUTOMÁTICA INLINE - executar diretamente aqui
  performAutoSelection()
}

// Função para seleção automática
const performAutoSelection = () => {
  // Se já está processando, não fazer nada
  if (isAutoSelecting.value) {
    return
  }

  const termo = searchTerm.value.toLowerCase().trim()
  
  if (!termo || !props.clients || termo.length < 2) {
    return
  }
  
  // Filtrar clientes que correspondem à busca
  const clientesEncontrados = props.clients.filter((cliente: Cliente) => {
    const nome = cliente.nome_completo?.toLowerCase() || ''
    const cpf = cliente.cpf?.replace(/\D/g, '') || ''
    const telefone = cliente.telefone?.replace(/\D/g, '') || ''
    
    // Separar busca por nome e por números
    const termoNumeros = termo.replace(/\D/g, '')
    
    return nome.includes(termo) || 
           (termoNumeros.length > 0 && cpf.includes(termoNumeros)) ||
           (termoNumeros.length > 0 && telefone.includes(termoNumeros))
  })

  
  // Auto-seleção APENAS para CPF completo - nunca para nomes
  if (clientesEncontrados.length >= 1) {
    
    // Auto-seleção APENAS por CPF completo (11 dígitos exatos)
    const termoNumeros = termo.replace(/\D/g, '')
    if (termoNumeros.length === 11) {
      const matchCPFCompleto = clientesEncontrados.find((cliente: Cliente) => {
        const cpf = cliente.cpf?.replace(/\D/g, '') || ''
        return cpf === termoNumeros
      })
      
      if (matchCPFCompleto && props.modelValue !== matchCPFCompleto.id.toString()) {
        isAutoSelecting.value = true
        
        emit('update:modelValue', matchCPFCompleto.id.toString())
        
        searchTerm.value = matchCPFCompleto.nome_completo
        isDropdownOpen.value = false
        
        setTimeout(() => {
          isAutoSelecting.value = false
        }, 200)
      }
    }
    
  }
}

// Selecionar cliente manualmente
const selectClient = (cliente: Cliente) => {
  if (isAutoSelecting.value) return
  
  isAutoSelecting.value = true
  
  emit('update:modelValue', cliente.id.toString())
  searchTerm.value = cliente.nome_completo
  isDropdownOpen.value = false
  
  setTimeout(() => {
    isAutoSelecting.value = false
  }, 100)
}

// Adicionar novo cliente
const addNewClient = () => {
  isDropdownOpen.value = false
  navigateTo('/clientes')
}



// Watcher para sincronizar busca com cliente selecionado
watch(() => props.modelValue, (novoClienteId: string) => {
  if (novoClienteId) {
    const cliente = props.clients?.find((c: Cliente) => c.id.toString() === novoClienteId)
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