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
        <label class="block text-sm font-medium text-neutral-700">
          Profissional
        </label>
        <div class="bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2">
          <div v-if="profissionalAtual" class="flex items-center space-x-2">
            <div class="flex-1">
              <p class="text-sm font-medium text-neutral-900">
                {{ profissionalAtual.nome_completo }}
              </p>
              <p class="text-xs text-neutral-500">
                {{ profissionalAtual.especialidade }}
              </p>
            </div>
          </div>
          <div v-else class="text-sm text-neutral-500">
            Nenhum profissional selecionado
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

      <!-- Data -->
      <div>
        <label for="data" class="block text-sm font-medium text-gray-700 mb-1">
          Data *
        </label>
        <input
          id="data"
          v-model="form.data"
          type="date"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.data ? 'border-red-300' : 'border-gray-300'
          ]"
        />
        <p v-if="errors.data" class="mt-1 text-sm text-red-600">
          {{ errors.data }}
        </p>
      </div>

      <!-- Horários -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="horaInicio" class="block text-sm font-medium text-gray-700 mb-1">
            Hora de Início *
          </label>
          <input
            id="horaInicio"
            v-model="form.horaInicio"
            type="time"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.horaInicio ? 'border-red-300' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.horaInicio" class="mt-1 text-sm text-red-600">
            {{ errors.horaInicio }}
          </p>
        </div>

        <div>
          <label for="horaFim" class="block text-sm font-medium text-gray-700 mb-1">
            Hora de Fim *
          </label>
          <input
            id="horaFim"
            v-model="form.horaFim"
            type="time"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.horaFim ? 'border-red-300' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.horaFim" class="mt-1 text-sm text-red-600">
            {{ errors.horaFim }}
          </p>
        </div>
      </div>

      <!-- Seletor de Cor -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Cor do Agendamento
        </label>
        <div class="grid grid-cols-6 gap-3">
          <button
            v-for="cor in coresPredefinidas"
            :key="cor.valor"
            type="button"
            :style="{ backgroundColor: cor.valor }"
            :class="[
              'w-10 h-10 rounded-lg border-2 transition-all duration-200',
              form.cor === cor.valor 
                ? 'border-gray-800 ring-2 ring-gray-800 ring-offset-2 scale-105' 
                : 'border-gray-300 hover:border-gray-400 hover:scale-105'
            ]"
            :title="cor.nome"
            @click="form.cor = cor.valor"
          />
        </div>
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
          :loading="carregandoSalvar"
          :disabled="!isFormValid"
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
  'confirm': [data: any]
}>()

// ===== ESTADO REATIVO =====
const form = ref({
  clienteId: '',
  titulo: 'Consulta',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: '',
  cor: '#DBE9FE'
})

const errors = ref({
  clienteId: '',
  titulo: '',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: ''
})

const carregandoSalvar = ref(false)



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

const isFormValid = computed(() => {
  return form.value.clienteId && 
         form.value.titulo.trim() && 
         form.value.data && 
         form.value.horaInicio && 
         form.value.horaFim
})

const validarFormulario = () => {
  errors.value = {
    clienteId: '',
    titulo: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: ''
  }
  
  let valido = true

  if (!form.value.clienteId) {
    errors.value.clienteId = 'Cliente é obrigatório'
    valido = false
  }

  if (!form.value.titulo.trim()) {
    errors.value.titulo = 'Título é obrigatório'
    valido = false
  }

  if (!form.value.data) {
    errors.value.data = 'Data é obrigatória'
    valido = false
  }

  if (!form.value.horaInicio) {
    errors.value.horaInicio = 'Hora de início é obrigatória'
    valido = false
  }

  if (!form.value.horaFim) {
    errors.value.horaFim = 'Hora de fim é obrigatória'
    valido = false
  }

  return valido
}

const resetarFormulario = () => {
  form.value = {
    clienteId: '',
    titulo: 'Consulta',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    cor: '#DBE9FE'
  }
  
  errors.value = {
    clienteId: '',
    titulo: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: ''
  }
}

// ===== COMPUTED =====
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// ===== FUNÇÕES =====

// Função para salvar agendamento
const salvar = async () => {
  if (!validarFormulario()) return

  try {
    carregandoSalvar.value = true

    const dadosAgendamento = {
      clienteId: Number(form.value.clienteId),
      titulo: form.value.titulo.trim(),
      descricao: form.value.descricao.trim(),
      dataInicio: new Date(`${form.value.data}T${form.value.horaInicio}:00`).toISOString(),
      dataFim: new Date(`${form.value.data}T${form.value.horaFim}:00`).toISOString(),
      cor: form.value.cor,
      profissionalId: props.profissionalAtual?.id || null
    }

    emit('confirm', dadosAgendamento)
    resetarFormulario()
    isOpen.value = false
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error)
  } finally {
    carregandoSalvar.value = false
  }
}

// Função para cancelar
const cancelar = () => {
  resetarFormulario()
  isOpen.value = false
}



// ===== WATCHERS =====

// Watcher para resetar formulário quando modal fecha
watch(() => props.modelValue, (isOpenValue) => {
  if (!isOpenValue) {
    nextTick(() => {
      resetarFormulario()
    })
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