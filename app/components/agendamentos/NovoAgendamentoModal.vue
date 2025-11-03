<template>
  <BaseModal
    :model-value="isOpen"
    @update:model-value="isOpen = $event"
    title="Novo Agendamento"
    size="lg"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="space-y-6">
      <!-- Profissional (Read-only) -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Profissional Responsável
        </label>
        <div class="bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
          <div v-if="profissionalAtual" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">
                {{ iniciaisProfissional }}
              </span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-900">
                {{ nomeProfissional }}
              </p>
              <p class="text-xs text-gray-600">
                {{ profissionalAtual.especialidade }}
              </p>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>Nenhum profissional selecionado</span>
          </div>
        </div>
      </div>

      <!-- Seletor de Cliente -->
      <ClienteSelector 
        v-model="form.clienteId"
        :clients="clientes"
        :loading="carregandoClientes"
        :error="errors.clienteId"
      />

      <!-- Título -->
      <div>
        <label for="titulo" class="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <BaseInput
          id="titulo"
          v-model="form.titulo"
          placeholder="Ex: Consulta, Atendimento..."
          :error="errors.titulo"
          required
        />
      </div>

      <!-- Descrição -->
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <BaseTextarea
          id="descricao"
          v-model="form.descricao"
          placeholder="Detalhes do agendamento (opcional)"
          :error="errors.descricao"
          :rows="3"
        />
      </div>

      <!-- Data e Horário -->
      <DateTimeSelector 
        v-model:selectedDate="form.data"
        v-model:startTime="form.horaInicio"
        v-model:endTime="form.horaFim"
        :weekDays="props.diasSemanaAtual"
        :appointments="props.agendamentos"
        :dateError="errors.data"
        :startTimeError="errors.horaInicio"
        :endTimeError="errors.horaFim"
      />
      


      <!-- Seletor de Cor -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Cor do Agendamento
        </label>
        <div class="relative">
          <button
            type="button"
            @click="dropdownCoresAberto = !dropdownCoresAberto"
            class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
          >
            <!-- Badge da cor selecionada -->
            <div class="flex items-center space-x-2">
              <div 
                class="w-4 h-4 rounded-full border border-gray-300"
                :style="{ backgroundColor: form.cor }"
              ></div>
              <span class="text-sm text-gray-700">{{ corSelecionadaNome }}</span>
            </div>
            
            <!-- Ícone dropdown -->
            <svg 
              class="w-4 h-4 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': dropdownCoresAberto }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <!-- Dropdown das cores -->
          <div 
            v-if="dropdownCoresAberto"
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            <button
              v-for="cor in coresPredefinidas"
              :key="cor.valor"
              type="button"
              @click="selecionarCor(cor)"
              class="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center space-x-3 transition-colors duration-150"
              :class="{ 'bg-blue-50': form.cor === cor.valor }"
            >
              <div 
                class="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                :style="{ backgroundColor: cor.valor }"
              ></div>
              <span class="text-sm text-gray-700 truncate">{{ cor.nome }}</span>
              <svg 
                v-if="form.cor === cor.valor"
                class="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Overlay para fechar dropdown ao clicar fora -->
        <div 
          v-if="dropdownCoresAberto"
          @click="dropdownCoresAberto = false"
          class="fixed inset-0 z-40"
        ></div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton
          variant="secondary"
          @click="handleCancel"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="loadingForm || carregandoProfissional"
          :disabled="!isFormValid || !profissionalLogado || carregandoProfissional"
          @click="handleConfirm"
        >
          Salvar Agendamento
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
// ===== IMPORTS =====
import { computed, watch, nextTick, ref, onMounted } from 'vue'
import DateTimeSelector from '~/components/agendamentos/DateTimeSelector.vue'
import { useAgendamentoForm } from '~/composables/useAgendamentoForm'
import { useToastNotification as useToast } from '~/composables/useToastNotification'
import type { Cliente } from '~/types/cliente'
import type { Profissional } from '~/types/profissional'

// ===== DEFINIR PROPS E EMITS =====
interface Props {
  modelValue: boolean
  profissionalAtual: Profissional | null
  diasSemanaAtual: Date[]
  clientes: Cliente[]
  carregandoClientes: boolean
  agendamentos: any[]
  carregandoAgendamentos: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  profissionalAtual: null,
  diasSemanaAtual: () => [],
  clientes: () => [],
  carregandoClientes: false,
  agendamentos: () => [],
  carregandoAgendamentos: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'agendamento-criado': []
}>()

// ===== COMPOSABLES =====
const { useToastNotification } = await import('~/composables/useToastNotification')
const toast = useToastNotification()

const { profile } = useUserData()
const { buscarProfissionais } = useProfissionais()
const { form, errors, loading: loadingForm, isFormValid, validateForm, resetForm, criarAgendamento } = useAgendamentoForm()

// Estado para o profissional logado
const profissionalLogado = ref<number | null>(null)
const carregandoProfissional = ref(true)
const dropdownCoresAberto = ref(false)

// Cores predefinidas
const coresPredefinidas = [
  { nome: 'Azul Claro (Padrão)', valor: '#DBE9FE' },
  { nome: 'Verde Água', valor: '#71E3AD' },
  { nome: 'Azul Céu', valor: '#72C1EE' },
  { nome: 'Lavanda', valor: '#E3D5FF' },
  { nome: 'Rosa Claro', valor: '#FFD5E3' },
  { nome: 'Amarelo Pastel', valor: '#FFF3C7' },
  { nome: 'Salmão', valor: '#FFB5A0' },
  { nome: 'Verde Menta', valor: '#B5F0D1' },
  { nome: 'Lilás', valor: '#E5C9FF' },
  { nome: 'Pêssego', valor: '#FFD6B8' },
  { nome: 'Azul Bebê', valor: '#B8E3FF' },
  { nome: 'Verde Lima', valor: '#D4FF8C' }
]

// Nome da cor selecionada
const corSelecionadaNome = computed(() => {
  const corEncontrada = coresPredefinidas.find(cor => cor.valor === form.value.cor)
  return corEncontrada?.nome || 'Selecione uma cor'
})

// Nome do profissional (compatibilidade com diferentes formatos)
const nomeProfissional = computed(() => {
  if (!props.profissionalAtual) return 'Nome não informado'
  return props.profissionalAtual.nome_completo || props.profissionalAtual.nome_profissional || 'Nome não informado'
})

// Iniciais do profissional
const iniciaisProfissional = computed(() => {
  if (!nomeProfissional.value || nomeProfissional.value === 'Nome não informado') return 'N/A'
  return nomeProfissional.value.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
})

// isFormValid já vem do composable useAgendamentoForm

// ===== COMPUTED =====
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// ===== FUNÇÕES =====

// Função para selecionar cor
const selecionarCor = (cor: { nome: string; valor: string }) => {
  form.value.cor = cor.valor
  dropdownCoresAberto.value = false
}

// Buscar o ID do profissional logado
const buscarProfissionalLogado = async () => {
  try {
    carregandoProfissional.value = true
    
    if (!profile.value?.id) {
      console.warn('⚠️ Perfil do usuário não está disponível ainda')
      return
    }

    const { success, data } = await buscarProfissionais()
    
    if (!success || !data) {
      console.error('❌ Erro ao buscar profissionais')
      return
    }

    // Encontrar o profissional baseado no perfil_id
    const profissional = data.find(p => p.perfil_id === profile.value?.id)
    
    if (!profissional) {
      console.error('❌ Usuário atual não é um profissional cadastrado')
      return
    }

    profissionalLogado.value = profissional.profissional_id
    console.log('✅ Profissional logado identificado:', profissionalLogado.value)
    
  } catch (error) {
    console.error('❌ Erro ao buscar profissional logado:', error)
  } finally {
    carregandoProfissional.value = false
  }
}

// Função para salvar agendamento
const salvar = async () => {
  // Verificar se o profissional foi identificado
  if (!profissionalLogado.value) {
    toast.error('Profissional não identificado. Aguarde ou tente novamente.')
    return
  }

  console.log('🔄 Iniciando criação do agendamento para profissional:', profissionalLogado.value)

  const resultado = await criarAgendamento(profissionalLogado.value)
  
  if (resultado.success) {
    console.log('✅ Agendamento criado com sucesso!')
    toast.success(resultado.message || 'Agendamento criado com sucesso!')
    
    // Emitir evento para forçar atualização dos agendamentos
    emit('agendamento-criado')
    
    // Fechar modal
    isOpen.value = false
  } else {
    console.error('❌ Erro ao criar agendamento:', resultado.error)
    toast.error(resultado.error || 'Erro ao criar agendamento')
  }
}

// Função para cancelar
const cancelar = () => {
  resetForm()
  isOpen.value = false
}



// ===== WATCHERS =====

// Watcher para resetar formulário quando modal fecha e carregar profissional quando abre
watch(() => props.modelValue, (isOpenValue) => {
  if (isOpenValue) {
    // Modal abriu - buscar profissional logado
    buscarProfissionalLogado()
  } else {
    // Modal fechou - resetar formulário
    nextTick(() => {
      resetForm()
    })
  }
})

// Watcher para monitorar mudanças no profile
watch(() => profile.value, (newProfile) => {
  if (newProfile?.id && !profissionalLogado.value) {
    buscarProfissionalLogado()
  }
}, { immediate: true })



// Carregar profissional na montagem do componente
onMounted(() => {
  if (profile.value?.id) {
    buscarProfissionalLogado()
  }
})



// ===== HANDLERS PARA TEMPLATE =====
const handleConfirm = () => {
  salvar()
}

const handleCancel = () => {
  cancelar()
}
</script>