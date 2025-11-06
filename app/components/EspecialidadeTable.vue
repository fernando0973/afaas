<template>
  <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <!-- Cabeçalho da tabela -->
    <div class="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-neutral-900">Especialidades Cadastradas</h3>
          <p class="text-sm text-neutral-600 mt-1">
            {{ especialidades.length }} {{ especialidades.length === 1 ? 'especialidade encontrada' : 'especialidades encontradas' }}
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
        <p class="text-neutral-600">Carregando especialidades...</p>
      </div>
    </div>

    <!-- Estado de erro -->
    <div v-else-if="erro" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ExclamationTriangleIcon class="w-8 h-8 text-red-400 mb-3" />
        <p class="text-red-600 mb-2">Erro ao carregar especialidades</p>
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
    <div v-else-if="especialidades.length === 0" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <AcademicCapIcon class="w-12 h-12 text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Nenhuma especialidade encontrada</h3>
        <p class="text-neutral-600 mb-4">Comece adicionando a primeira especialidade do sistema.</p>
        <BaseButton 
          variant="primary"
          :disabled="!props.isAdmin"
          @click="$emit('adicionar')"
        >
          <template #iconLeft>
            <PlusIcon class="w-4 h-4" />
          </template>
          Adicionar Especialidade
        </BaseButton>
      </div>
    </div>

    <!-- Tabela de dados -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Especialidade
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr 
            v-for="especialidade in especialidades" 
            :key="especialidade.id"
            class="hover:bg-neutral-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <AcademicCapIcon class="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                <div>
                  <div class="text-sm font-medium text-neutral-900">
                    {{ especialidade.especialidade }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <BaseButton 
                  variant="outline"
                  size="sm"
                  :disabled="!props.isAdmin"
                  @click="editarEspecialidade(especialidade)"
                >
                  <template #iconLeft>
                    <PencilIcon class="w-3 h-3" />
                  </template>
                  Editar
                </BaseButton>
                <BaseButton 
                  variant="danger"
                  size="sm"
                  :disabled="!props.isAdmin"
                  @click="confirmarRemocao(especialidade)"
                >
                  <template #iconLeft>
                    <TrashIcon class="w-3 h-3" />
                  </template>
                  Remover
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rodapé da tabela -->
    <div v-if="especialidades.length > 0" class="px-6 py-3 bg-neutral-50 border-t border-neutral-200">
      <div class="flex items-center justify-between text-sm text-neutral-600">
        <span>
          Mostrando {{ especialidades.length }} {{ especialidades.length === 1 ? 'resultado' : 'resultados' }}
        </span>
        <div class="flex items-center space-x-2">
          <span>Total: {{ especialidades.length }} {{ especialidades.length === 1 ? 'especialidade' : 'especialidades' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  AcademicCapIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import type { Especialidade } from '~/types/especialidade'

// Props e emits
interface Props {
  autoLoad?: boolean
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoLoad: true,
  isAdmin: false
})

const emit = defineEmits<{
  editar: [especialidade: Especialidade]
  remover: [especialidade: Especialidade]
  recarregar: []
  adicionar: []
}>()

// Composables
const { buscarEspecialidades } = useProfissionais()

// Estados reativos
const especialidades = ref<Especialidade[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)

// Função para carregar dados
const carregarDados = async () => {
  carregando.value = true
  erro.value = null
  
  try {
    const resultado = await buscarEspecialidades()
    
    if (resultado.success) {
      especialidades.value = resultado.data
    } else {
      erro.value = resultado.error || 'Erro desconhecido ao carregar especialidades'
    }
  } catch (error: any) {
    console.error('Erro ao carregar especialidades:', error)
    erro.value = error.message || 'Erro interno do sistema'
  } finally {
    carregando.value = false
  }
}

// Função para recarregar dados
const recarregarDados = async () => {
  await carregarDados()
  emit('recarregar')
}

// Função para editar especialidade
const editarEspecialidade = (especialidade: Especialidade) => {
  emit('editar', especialidade)
}

// Função para confirmar remoção
const confirmarRemocao = (especialidade: Especialidade) => {
  emit('remover', especialidade)
}

// Carregar dados automaticamente na montagem
onMounted(async () => {
  if (props.autoLoad) {
    await carregarDados()
  }
})

// Exposição de funções para componente pai
defineExpose({
  carregarDados,
  recarregarDados
})
</script>