<template>
  <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <!-- Cabeçalho da tabela -->
    <div class="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-neutral-900">Clientes Cadastrados</h3>
          <p class="text-sm text-neutral-600 mt-1">
            <template v-if="props.termoBusca && props.termoBusca.trim().length >= 2">
              {{ clientesFiltrados.length }} {{ clientesFiltrados.length === 1 ? 'cliente encontrado' : 'clientes encontrados' }}
              para "{{ props.termoBusca }}"
              <span class="text-neutral-400">
                ({{ clientes.length }} total)
              </span>
            </template>
            <template v-else>
              {{ clientesFiltrados.length }} {{ clientesFiltrados.length === 1 ? 'cliente encontrado' : 'clientes encontrados' }}
            </template>
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton 
            variant="outline"
            size="sm"
            :disabled="carregando"
            @click="recarregarDados"
          >
            <template #iconLeft>
              <ArrowPathIcon :class="['w-4 h-4', carregando ? 'animate-spin' : '']" />
            </template>
            Atualizar
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Estado de carregamento -->
    <div v-if="carregando" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ArrowPathIcon class="w-8 h-8 text-neutral-400 animate-spin mb-3" />
        <p class="text-neutral-600">Carregando clientes...</p>
      </div>
    </div>

    <!-- Estado de erro -->
    <div v-else-if="erro" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ExclamationTriangleIcon class="w-8 h-8 text-red-400 mb-3" />
        <p class="text-red-600 mb-2">Erro ao carregar clientes</p>
        <p class="text-sm text-neutral-600 mb-4">{{ erro }}</p>
        <BaseButton 
          variant="primary"
          @click="recarregarDados"
        >
          <template #iconLeft>
            <ArrowPathIcon class="w-4 h-4" />
          </template>
          Tentar Novamente
        </BaseButton>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="clientesFiltrados.length === 0" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <UserGroupIcon class="w-12 h-12 text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Nenhum cliente encontrado</h3>
        <p class="text-neutral-600 mb-4">Comece adicionando o primeiro cliente do sistema.</p>
        <BaseButton 
          variant="primary"
          :disabled="!props.isAdmin"
          @click="$emit('adicionar')"
        >
          <template #iconLeft>
            <PlusIcon class="w-4 h-4" />
          </template>
          Adicionar Cliente
        </BaseButton>
      </div>
    </div>

    <!-- Tabela de dados -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Nome Completo
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              CPF
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Telefone
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Cidade
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Data Nascimento
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr 
            v-for="cliente in clientesFiltrados" 
            :key="cliente.id"
            class="hover:bg-neutral-50 transition-colors cursor-pointer"
            @click="$emit('editar', cliente)"
            title="Clique para visualizar/editar cliente"
          >
            <!-- Nome Completo -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <!-- Ícone para Masculino -->
                  <div 
                    v-if="cliente.sexo === 'masculino'" 
                    class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center"
                    title="Masculino"
                  >
                    <UserIcon class="h-4 w-4 text-blue-600" />
                  </div>
                  <!-- Ícone para Feminino -->
                  <div 
                    v-else-if="cliente.sexo === 'feminino'" 
                    class="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center"
                    title="Feminino"
                  >
                    <UserIcon class="h-4 w-4 text-pink-600" />
                  </div>
                  <!-- Ícone padrão quando sexo não informado -->
                  <div 
                    v-else 
                    class="h-8 w-8 bg-neutral-100 rounded-full flex items-center justify-center"
                    title="Não informado"
                  >
                    <UserIcon class="h-4 w-4 text-neutral-600" />
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-neutral-900">
                    {{ cliente.nome_completo }}
                  </div>
                  <div v-if="cliente.sexo" class="text-xs text-neutral-500">
                    {{ cliente.sexo === 'masculino' ? 'Masculino' : 'Feminino' }}
                  </div>
                </div>
              </div>
            </td>

            <!-- CPF -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              {{ formatCPF(cliente.cpf) }}
            </td>

            <!-- Telefone -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              {{ formatTelefone(cliente.telefone) }}
            </td>

            <!-- Cidade -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              <div v-if="cliente.cidade">
                {{ cliente.cidade }}
                <span v-if="cliente.estado" class="text-neutral-500">
                  - {{ cliente.estado }}
                </span>
              </div>
              <span v-else class="text-neutral-400">-</span>
            </td>

            <!-- Data Nascimento -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              {{ formatData(cliente.data_nascimento) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon, 
  UserGroupIcon,
  PlusIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import type { Cliente } from '~/types/cliente'

interface Props {
  autoLoad?: boolean
  isAdmin?: boolean
  termoBusca?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: false,
  isAdmin: false,
  termoBusca: ''
})

// Emits
const emit = defineEmits<{
  editar: [cliente: Cliente]
  recarregar: []
  adicionar: []
}>()

// Composables
const { buscarClientes, removerCliente } = useProfissionais()

// Estados reativos
const clientes = ref<Cliente[]>([])
const carregando = ref(false)
const erro = ref('')

// Computed para filtrar clientes
const clientesFiltrados = computed(() => {
  if (!props.termoBusca || props.termoBusca.trim().length < 2) {
    return clientes.value
  }

  const termo = props.termoBusca.toLowerCase().trim()
  
  return clientes.value.filter(cliente => {
    // Busca por nome (garantindo que nome_completo não seja null/undefined)
    const nomeCliente = cliente.nome_completo || ''
    const matchNome = nomeCliente.toLowerCase().includes(termo)

    // Busca por CPF (removendo caracteres não numéricos)
    const cpfCliente = cliente.cpf || ''
    const termoNumerico = termo.replace(/\D/g, '')
    const cpfNumerico = cpfCliente.replace(/\D/g, '')
    const matchCPF = termoNumerico.length > 0 && cpfNumerico.includes(termoNumerico)

    return matchNome || matchCPF
  })
})

// Funções utilitárias
const formatCPF = (cpf: string | null) => {
  if (!cpf) return '-'
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatTelefone = (telefone: string | null) => {
  if (!telefone) return '-'
  // Formato básico para telefone
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return telefone
}

const formatData = (data: string | null) => {
  if (!data) return '-'
  
  try {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return data
  }
}

// Função para carregar dados
const carregarDados = async () => {
  carregando.value = true
  erro.value = ''
  
  try {
    const resultado = await buscarClientes()
    
    if (resultado.success) {
      clientes.value = resultado.data
    } else {
      erro.value = resultado.error || 'Erro desconhecido ao carregar clientes'
    }
  } catch (error: any) {
    erro.value = error.message || 'Erro inesperado ao carregar clientes'
  } finally {
    carregando.value = false
  }
}

// Função para recarregar dados
const recarregarDados = async () => {
  await carregarDados()
  emit('recarregar')
}

// Exposer função para uso externo
defineExpose({
  recarregarDados
})

// Auto carregamento se habilitado
onMounted(() => {
  if (props.autoLoad) {
    carregarDados()
  }
})
</script>