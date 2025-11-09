<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="modalTitle"
    size="md"
    :confirm-button-text="confirmButtonText"
    :loading="loading"
    :confirm-disabled="!isFormValid || !hasChanges"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <!-- Conteúdo do modal -->
    <form @submit.prevent="handleConfirm" class="space-y-6">
      <!-- Informações do agendamento (readonly) -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 space-y-4">
        <!-- Data e horário -->
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-lg font-semibold text-blue-900">
              {{ formatarDataSemHora(agendamento?.dataInicio) }}
            </h4>
            <div class="flex items-center space-x-2 mt-1">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium text-blue-800">
                {{ formatarHorario(agendamento?.dataInicio) }} - {{ formatarHorario(agendamento?.dataFim) }}
              </span>
              <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {{ calcularDuracao(agendamento?.dataInicio, agendamento?.dataFim) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Profissional -->
        <div v-if="profissionalInfo" class="flex items-center space-x-3 p-3 bg-white/70 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">
                {{ obterIniciais(profissionalInfo.nome_profissional) }}
              </span>
            </div>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900">
              {{ profissionalInfo.nome_profissional }}
            </p>
            <p class="text-xs text-gray-600">
              {{ profissionalInfo.especialidade || 'Profissional' }}
            </p>
          </div>
        </div>

        <!-- Cliente -->
        <div v-if="clienteInfo" class="flex items-center space-x-3 p-3 bg-white/70 rounded-lg">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">
                {{ obterIniciais(clienteInfo.nome_completo) }}
              </span>
            </div>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900">
              {{ clienteInfo.nome_completo }}
            </p>
            <p class="text-xs text-gray-600">
              {{ clienteInfo.telefone || 'Cliente' }}
            </p>
          </div>
        </div>

        <!-- Aviso sobre alterações -->
        <div class="flex items-center space-x-2 text-xs text-blue-600 bg-blue-100 px-3 py-2 rounded-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Data, horário, cliente e profissional não podem ser alterados</span>
        </div>
      </div>

      <!-- Título -->
      <BaseInput
        :model-value="form.titulo"
        @update:model-value="form.titulo = $event"
        label="Título do Agendamento"
        placeholder="Digite o título..."
        required
        :error="errors.titulo"
        @blur="validateField('titulo')"
        @input="clearFieldError('titulo')"
      >
        <template #prefix>
          <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </template>
      </BaseInput>

      <!-- Descrição -->
      <BaseTextarea
        :model-value="form.descricao"
        @update:model-value="form.descricao = $event"
        label="Descrição"
        placeholder="Digite uma descrição para o agendamento..."
        rows="3"
        :error="errors.descricao"
        @blur="validateField('descricao')"
        @input="clearFieldError('descricao')"
      />

      <!-- Seletor de Cor -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Cor do Agendamento
        </label>
        <div class="space-y-3">
          <!-- Primeira linha -->
          <div class="flex gap-3 justify-between">
            <button
              v-for="cor in coresDisponiveis.slice(0, 6)"
              :key="cor.valor"
              type="button"
              :class="[
                'w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                form.cor === cor.valor ? 'border-neutral-900 shadow-lg ring-2 ring-blue-500' : 'border-neutral-300'
              ]"
              :style="{ backgroundColor: cor.valor }"
              @click="form.cor = cor.valor"
              :title="cor.nome"
            />
          </div>
          <!-- Segunda linha -->
          <div class="flex gap-3 justify-between">
            <button
              v-for="cor in coresDisponiveis.slice(6)"
              :key="cor.valor"
              type="button"
              :class="[
                'w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                form.cor === cor.valor ? 'border-neutral-900 shadow-lg ring-2 ring-blue-500' : 'border-neutral-300'
              ]"
              :style="{ backgroundColor: cor.valor }"
              @click="form.cor = cor.valor"
              :title="cor.nome"
            />
          </div>
        </div>
      </div>

      <!-- Status do agendamento -->
      <div v-if="agendamento && !agendamento.cancelado" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-red-900">
                Cancelar Agendamento
              </h4>
              <p class="text-xs text-red-700">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>
          <BaseButton
            type="button"
            variant="danger"
            size="sm"
            @click="mostrarConfirmacaoCancelamento = true"
            :loading="cancelando"
          >
            Cancelar
          </BaseButton>
        </div>
      </div>

      <!-- Status cancelado -->
      <div v-else-if="agendamento?.cancelado" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900">
              Agendamento Cancelado
            </h4>
            <p class="text-xs text-gray-600">
              Cancelado em: {{ formatarData(agendamento.dataCancelamento) }}
            </p>
          </div>
        </div>
      </div>
    </form>
  </BaseModal>

  <!-- Modal de Confirmação de Cancelamento -->
  <BaseConfirmModal
    v-model="mostrarConfirmacaoCancelamento"
    title="Cancelar Agendamento"
    message="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita e o agendamento será marcado como cancelado permanentemente. Confirma o cancelamento?"
    confirm-text="Sim, Cancelar"
    cancel-text="Não, Manter"
    type="danger"
    :loading="cancelando"
    @confirm="cancelarAgendamento"
  />
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { AgendamentoFormatado } from '~/composables/useAgendamentos'
import { useToastNotification } from '~/composables/useToastNotification'

interface Props {
  modelValue: boolean
  agendamento: AgendamentoFormatado | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  agendamento: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'agendamento-atualizado': [agendamento?: any]
  'agendamento-cancelado': []
}>()

// Composables
const supabase = useSupabaseClient()
const toast = useToastNotification()

// Estados
const loading = ref(false)
const cancelando = ref(false)
const mostrarConfirmacaoCancelamento = ref(false)
const profissionalInfo = ref<any>(null)
const clienteInfo = ref<any>(null)

// Cores disponíveis para agendamentos (iguais ao modal de criação)
const coresDisponiveis = [
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

// Formulário
const form = reactive({
  titulo: '',
  descricao: '',
  cor: '#DBE9FE'
})

// Estado original para detectar mudanças
const originalData = reactive({
  titulo: '',
  descricao: '',
  cor: '#DBE9FE'
})

// Erros de validação
const errors = reactive({
  titulo: '',
  descricao: ''
})

// Computed properties
const modalTitle = computed(() => {
  if (props.agendamento?.cancelado) {
    return 'Visualizar Agendamento (Cancelado)'
  }
  return 'Editar Agendamento'
})

const confirmButtonText = computed(() => {
  if (props.agendamento?.cancelado) {
    return 'Fechar'
  }
  return 'Salvar Alterações'
})

// Detectar mudanças
const hasChanges = computed(() => {
  return form.titulo !== originalData.titulo ||
         form.descricao !== originalData.descricao ||
         form.cor !== originalData.cor
})

const isFormValid = computed(() => {
  return form.titulo.trim().length > 0 && 
         !Object.values(errors).some(error => error)
})

// Funções utilitárias
const formatarHorario = (data?: Date): string => {
  if (!data) return '--:--'
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const formatarDataCompleta = (data: string | Date | undefined) => {
  if (!data) return ''
  const date = data instanceof Date ? data : new Date(data)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatarDataSemHora = (data: string | Date | undefined) => {
  if (!data) return ''
  const date = data instanceof Date ? data : new Date(data)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const calcularDuracao = (dataInicio: string | Date | undefined, dataFim: string | Date | undefined) => {
  if (!dataInicio || !dataFim) return ''
  const inicio = dataInicio instanceof Date ? dataInicio : new Date(dataInicio)
  const fim = dataFim instanceof Date ? dataFim : new Date(dataFim)
  const diffMs = fim.getTime() - inicio.getTime()
  const diffMinutos = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutos < 60) {
    return `${diffMinutos}min`
  } else {
    const horas = Math.floor(diffMinutos / 60)
    const minutosRestantes = diffMinutos % 60
    return minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`
  }
}

const obterIniciais = (nome: string | undefined) => {
  if (!nome) return ''
  return nome
    .split(' ')
    .filter(palavra => palavra.length > 0)
    .slice(0, 2)
    .map(palavra => palavra[0]?.toUpperCase() || '')
    .join('')
}

const formatarDataHorario = (data?: Date): string => {
  if (!data) return '--/--/----'
  return data.toLocaleString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatarData = (data?: Date | string | null): string => {
  if (!data) return '--/--/----'
  const date = typeof data === 'string' ? new Date(data) : data
  return date.toLocaleDateString('pt-BR')
}

// Funções de validação
const validateField = (field: keyof typeof form) => {
  switch (field) {
    case 'titulo':
      if (!form.titulo.trim()) {
        errors.titulo = 'Título é obrigatório'
      } else if (form.titulo.trim().length < 3) {
        errors.titulo = 'Título deve ter pelo menos 3 caracteres'
      } else if (form.titulo.trim().length > 100) {
        errors.titulo = 'Título deve ter no máximo 100 caracteres'
      } else {
        errors.titulo = ''
      }
      break
    case 'descricao':
      if (form.descricao && form.descricao.trim().length > 500) {
        errors.descricao = 'Descrição deve ter no máximo 500 caracteres'
      } else {
        errors.descricao = ''
      }
      break
  }
}

const clearFieldError = (field: keyof typeof errors) => {
  errors[field] = ''
}

// Carregar dados do agendamento
const loadAgendamentoData = () => {
  if (props.agendamento) {
    form.titulo = props.agendamento.titulo || ''
    form.descricao = props.agendamento.descricao || ''
    form.cor = props.agendamento.cor || '#DBE9FE'
    
    // Salvar dados originais
    originalData.titulo = form.titulo
    originalData.descricao = form.descricao
    originalData.cor = form.cor
    
    // Carregar informações do cliente e profissional
    carregarInformacoesExtras()
  }
}

// Carregar informações do cliente e profissional
const carregarInformacoesExtras = async () => {
  if (!props.agendamento) return

  const agendamento = props.agendamento

  // Buscar informações do profissional usando o composable
  if (agendamento.profissionalId) {
    try {
      const { buscarProfissionais } = useProfissionais()
      const result = await buscarProfissionais()
      
      if (result.success) {
        const profissional = result.data.find(p => p.profissional_id === agendamento.profissionalId)
        if (profissional) {
          profissionalInfo.value = profissional
        }
      }
    } catch (error) {
    }
  }

  // Buscar informações do cliente  
  if (agendamento.clienteId) {
    try {
      const { data: cliente } = await supabase
        .from('afaas_clientes')
        .select('id, nome_completo, telefone, cpf')
        .eq('id', agendamento.clienteId)
        .single()

      if (cliente) {
        clienteInfo.value = cliente
      }
    } catch (error) {
    }
  }
}

// Resetar formulário
const resetForm = () => {
  form.titulo = ''
  form.descricao = ''
  form.cor = '#DBE9FE'
  
  originalData.titulo = ''
  originalData.descricao = ''
  originalData.cor = '#DBE9FE'
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  loading.value = false
  cancelando.value = false
}

// Handlers do modal
const handleConfirm = async () => {
  if (props.agendamento?.cancelado) {
    handleClose()
    return
  }

  if (!isFormValid.value || !hasChanges.value) {
    return
  }

  loading.value = true

  try {
    const { error } = await supabase
      .from('afaas_agendamentos')
      .update({
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        cor: form.cor
      })
      .eq('id', props.agendamento!.id)

    if (error) throw error

    // Criar objeto com dados atualizados
    const agendamentoAtualizado = {
      ...props.agendamento!,
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      cor: form.cor
    }

    toast.success('Agendamento atualizado com sucesso!')
    emit('agendamento-atualizado', agendamentoAtualizado)
    handleClose()
  } catch (error: any) {
    toast.error(`Erro ao atualizar agendamento: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const cancelarAgendamento = async () => {
  if (!props.agendamento) {
    return
  }

  cancelando.value = true

  try {
    // Verificar o usuário atual
    const { data: { user } } = await supabase.auth.getUser()

    // Criar timestamp no formato brasileiro com timezone
    const now = new Date()
    const timestampLocal = now.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1 $4-03')
    
    // Tentar com client normal primeiro
    let { data, error } = await supabase
      .from('afaas_agendamentos')
      .update({
        cancelado: true,
        cancelado_as: timestampLocal
      })
      .eq('id', props.agendamento.id)
      .select()


    // Se falhou por permissões, tentar via API server
    if (error || !data || data.length === 0) {
      
      try {
        const response = await $fetch('/api/agendamentos/cancelar', {
          method: 'POST',
          body: {
            id: props.agendamento.id,
            cancelado_as: timestampLocal
          }
        }) as any
        
        
        if (response.success) {
          data = response.data ? [response.data] : []
        } else {
          throw new Error(response.error || 'Erro na API server')
        }
      } catch (apiError: any) {
        throw new Error(`Erro ao cancelar via API: ${apiError.message}`)
      }
    }

    if (!data || data.length === 0) {
      throw new Error('Nenhum registro foi atualizado. Contate o administrador.')
    }

    
    // Fechar modal de confirmação
    mostrarConfirmacaoCancelamento.value = false
    
    toast.success('Agendamento cancelado com sucesso!')
    emit('agendamento-cancelado')
    handleClose()
    
  } catch (error: any) {
    toast.error(`Erro ao cancelar: ${error.message || 'Erro desconhecido'}`)
  } finally {
    cancelando.value = false
  }
}

const handleCancel = () => {
  handleClose()
}

const handleClose = () => {
  emit('update:modelValue', false)
  setTimeout(resetForm, 300)
}

// Watchers
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.agendamento) {
    loadAgendamentoData()
  } else {
    setTimeout(resetForm, 300)
  }
})

watch(() => props.agendamento, () => {
  if (props.modelValue && props.agendamento) {
    loadAgendamentoData()
  }
}, { deep: true })
</script>