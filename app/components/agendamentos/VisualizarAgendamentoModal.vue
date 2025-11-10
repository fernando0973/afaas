<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="handleModelUpdate"
    title="Detalhes do Agendamento"
    size="md"
    :show-confirm-button="false"
    :show-cancel-button="false"
    :loading="carregandoInfo"
    @close="handleClose"
    @cancel="handleClose"
  >
    <div class="space-y-6">
      <div class="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-lg font-semibold text-neutral-900">
              {{ dataCompleta }}
            </h4>
            <div class="flex items-center space-x-2 mt-1 text-sm text-neutral-700">
              <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ horarioInicio }}</span>
              <span>-</span>
              <span>{{ horarioFim }}</span>
              <span class="text-xs text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                {{ duracaoTotal }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="profissionalInfo" class="flex items-center space-x-3 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
          {{ obterIniciais(profissionalInfo.nome_profissional) }}
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-neutral-900">
            {{ profissionalInfo.nome_profissional }}
          </p>
          <p class="text-xs text-neutral-600">
            {{ profissionalInfo.especialidade || 'Profissional' }}
          </p>
        </div>
      </div>

      <div v-if="clienteInfo" class="flex items-center space-x-3 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
          {{ obterIniciais(clienteInfo.nome_completo) }}
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-neutral-900">
            {{ clienteInfo.nome_completo }}
          </p>
          <p class="text-xs text-neutral-600">
            {{ clienteInfo.telefone || 'Cliente' }}
          </p>
        </div>
      </div>

      <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <h5 class="text-sm font-semibold text-neutral-900 mb-2">Descrição</h5>
        <p class="text-sm text-neutral-700 whitespace-pre-line">
          {{ agendamento?.descricao || 'Sem descrição registrada.' }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="handleClose">
          Fechar
        </BaseButton>
        <BaseButton :disabled="!agendamento" @click="handleEditar">
          Editar
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { AgendamentoFormatado } from '~/composables/useAgendamentos'

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
  editar: []
  fechar: []
}>()

const supabase = useSupabaseClient()
const profissionalInfo = ref<any>(null)
const clienteInfo = ref<any>(null)
const carregandoInfo = ref(false)

const dataCompleta = computed(() => formatarDataCompleta(props.agendamento?.dataInicio))
const horarioInicio = computed(() => formatarHorario(props.agendamento?.dataInicio))
const horarioFim = computed(() => formatarHorario(props.agendamento?.dataFim))
const duracaoTotal = computed(() => calcularDuracao(props.agendamento?.dataInicio, props.agendamento?.dataFim))

watch(() => props.modelValue, async (isOpen: boolean) => {
  if (isOpen && props.agendamento) {
    await carregarInformacoesExtras()
  }
  if (!isOpen) {
    profissionalInfo.value = null
    clienteInfo.value = null
  }
})

watch(() => props.agendamento, async (novoAgendamento: AgendamentoFormatado | null) => {
  if (props.modelValue && novoAgendamento) {
    await carregarInformacoesExtras()
  }
}, { deep: true })

const handleModelUpdate = (value: boolean) => {
  if (!value) {
    handleClose()
  } else {
    emit('update:modelValue', value)
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('fechar')
}

const handleEditar = () => {
  emit('editar')
}

const carregarInformacoesExtras = async () => {
  if (!props.agendamento) return
  carregandoInfo.value = true

  try {
    await carregarProfissional()
    await carregarCliente()
  } finally {
    carregandoInfo.value = false
  }
}

const carregarProfissional = async () => {
  if (!props.agendamento?.profissionalId) {
    profissionalInfo.value = null
    return
  }

  try {
    const { buscarProfissionais } = useProfissionais()
    const resultado = await buscarProfissionais()

    if (resultado.success) {
      profissionalInfo.value = resultado.data.find((item: any) => item.profissional_id === props.agendamento?.profissionalId) || null
    }
  } catch (error) {
    profissionalInfo.value = null
  }
}

const carregarCliente = async () => {
  if (!props.agendamento?.clienteId) {
    clienteInfo.value = null
    return
  }

  try {
    const { data } = await supabase
      .from('afaas_clientes')
      .select('id, nome_completo, telefone')
      .eq('id', props.agendamento.clienteId)
      .single()

    clienteInfo.value = data || null
  } catch (error) {
    clienteInfo.value = null
  }
}

const formatarHorario = (data?: Date): string => {
  if (!data) return '--:--'
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const formatarDataCompleta = (data?: Date): string => {
  if (!data) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(data)
}

const calcularDuracao = (inicio?: Date, fim?: Date): string => {
  if (!inicio || !fim) return ''
  const diff = (fim.getTime() - inicio.getTime()) / 60000

  if (diff < 60) {
    return `${diff}min`
  }

  const horas = Math.floor(diff / 60)
  const minutos = diff % 60
  return minutos ? `${horas}h ${minutos}min` : `${horas}h`
}

const obterIniciais = (nome?: string) => {
  if (!nome) return ''
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
}
</script>
