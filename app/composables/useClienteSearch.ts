import type { Cliente } from '~/types/cliente'

export const useClienteSearch = (clients: Cliente[], initialClientId: string) => {
  const searchTerm = ref('')
  const isDropdownOpen = ref(false)

  // Cliente selecionado
  const selectedClient = computed(() => {
    return clients.find(c => c.id.toString() === initialClientId)
  })

  // Clientes filtrados pela busca
  const filteredClients = computed(() => {
    if (!clients || clients.length === 0) return []
    
    if (!searchTerm.value.trim()) {
      return clients.slice(0, 50) // Limite inicial para performance
    }
    
    const termo = searchTerm.value.toLowerCase().trim()
    
    return clients.filter(cliente => {
      const nome = cliente.nome_completo?.toLowerCase() || ''
      const cpf = cliente.cpf?.replace(/\D/g, '') || ''
      
      return nome.includes(termo) || cpf.includes(termo.replace(/\D/g, ''))
    }).slice(0, 50) // Limite de 50 resultados
  })

  // Funções
  const openDropdown = () => {
    isDropdownOpen.value = true
    
    // Se não há busca, mostrar nome do cliente selecionado
    if (!searchTerm.value && selectedClient.value) {
      searchTerm.value = selectedClient.value.nome_completo
    }
  }

  const closeDropdown = () => {
    setTimeout(() => {
      isDropdownOpen.value = false
      
      // Se não há cliente selecionado, limpar busca
      if (!initialClientId) {
        searchTerm.value = ''
      } else if (selectedClient.value) {
        // Mostrar nome do cliente selecionado
        searchTerm.value = selectedClient.value.nome_completo
      }
    }, 150)
  }

  const filterClients = () => {
    // Se o usuário digitou algo diferente do nome do cliente selecionado,
    // limpar a seleção (será tratado pelo componente pai)
    if (selectedClient.value && searchTerm.value !== selectedClient.value.nome_completo) {
      // Emitir para o componente pai que o cliente foi desmarcado
    }
    
    // Abrir dropdown automaticamente ao digitar
    if (!isDropdownOpen.value) {
      isDropdownOpen.value = true
    }
  }

  const selectClient = (cliente: Cliente) => {
    searchTerm.value = cliente.nome_completo
    isDropdownOpen.value = false
  }

  const formatCPF = (cpf: string | null | undefined): string => {
    if (!cpf) return ''
    
    const numerosApenas = cpf.replace(/\D/g, '')
    
    if (numerosApenas.length === 11) {
      return numerosApenas.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    
    return cpf
  }

  // Watchers
  watch(() => selectedClient.value, (cliente: Cliente | undefined) => {
    if (cliente && searchTerm.value !== cliente.nome_completo) {
      searchTerm.value = cliente.nome_completo
    } else if (!cliente && !isDropdownOpen.value) {
      searchTerm.value = ''
    }
  })

  return {
    searchTerm,
    isDropdownOpen,
    filteredClients,
    selectedClient,
    openDropdown,
    closeDropdown,
    filterClients,
    selectClient,
    formatCPF
  }
}