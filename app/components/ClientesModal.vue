<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    size="full"
    :confirm-button-text="confirmButtonText"
    :loading="loading"
    :confirm-disabled="!clienteForm.isFormValid || (props.isEdicao && !clienteForm.dadosForamAlterados)"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <!-- Sistema de Abas -->
    <div class="border-b border-neutral-200">
      <nav class="-mb-px flex flex-wrap">
        <button
          v-for="aba in abas"
          :key="aba.id"
          type="button"
          @click="abaAtiva = aba.id"
          :class="[
            'py-3 px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-1 min-w-0',
            abaAtiva === aba.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
          ]"
        >
          <div class="flex flex-col items-center space-y-1">
            <component :is="aba.icon" class="w-4 h-4" />
            <span class="text-center leading-tight">{{ aba.nome }}</span>
          </div>
        </button>
      </nav>
    </div>

    <!-- Conteúdo das Abas -->
    <div class="min-h-[500px] mt-6">
      <ClienteFormPessoais
        v-if="abaAtiva === 'pessoais'"
        :model-value="clienteForm.form"
        :errors="validation.errors"
  @update:model-value="clienteForm.form = $event"
  @blur="handleFieldBlur"
  @clearError="validation.clearFieldError"
      />

      <ClienteFormEndereco
        v-if="abaAtiva === 'endereco'"
        :model-value="clienteForm.form"
        :errors="validation.errors"
  @update:model-value="clienteForm.form = $event"
  @blur="handleFieldBlur"
  @clearError="validation.clearFieldError"
      />

      <ClienteFormAmbiente
        v-if="abaAtiva === 'ambiente'"
        :model-value="clienteForm.form"
        :errors="validation.errors"
        @update:model-value="clienteForm.form = $event"
      />

      <ClienteFormMedico
        v-if="abaAtiva === 'medico'"
        :model-value="clienteForm.form"
        :errors="validation.errors"
        @update:model-value="clienteForm.form = $event"
      />

      <ClienteFormHabitos
        v-if="abaAtiva === 'habitos'"
        :model-value="clienteForm.form"
        :errors="validation.errors"
        @update:model-value="clienteForm.form = $event"
      />
    </div>

    <!-- Debug - apenas para desenvolvimento -->
    <div v-if="props.isEdicao && props.clienteData?.id" class="text-xs text-neutral-400 bg-neutral-50 p-2 rounded mt-4">
      <span>Editando cliente ID: {{ props.clienteData.id }}</span>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { 
  UserIcon, 
  MapPinIcon, 
  HomeIcon, 
  HeartIcon, 
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'
import type { Cliente } from '~/types/cliente'
import { useToastNotification as useToast } from '~/composables/useToastNotification'
import { useClienteForm } from '~/composables/useClienteForm'
import type { ClienteFormData } from '~/composables/useClienteForm'
import { useClienteValidation } from '~/composables/useClienteValidation'
import { useProfissionais } from '~/composables/useProfissionais'

// Componentes de formulário
import ClienteFormPessoais from '~/components/clientes/ClienteFormPessoais.vue'
import ClienteFormEndereco from '~/components/clientes/ClienteFormEndereco.vue'
import ClienteFormAmbiente from '~/components/clientes/ClienteFormAmbiente.vue'
import ClienteFormMedico from '~/components/clientes/ClienteFormMedico.vue'
import ClienteFormHabitos from '~/components/clientes/ClienteFormHabitos.vue'

// Props
interface Props {
  modelValue: boolean
  clienteData?: Cliente | null
  isEdicao?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  clienteData: null
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'cliente-salvo': [cliente: Cliente]
  'cancel': []
  'close': []
}>()

// Composables
const toast = useToast()
const { inserirCliente, editarCliente } = useProfissionais()
const clienteForm = useClienteForm()
const validation = useClienteValidation()

// Estado
const loading = ref(false)
const abaAtiva = ref('pessoais')

// Definir abas
const abas = [
  { id: 'pessoais', nome: 'Dados\nPessoais', icon: UserIcon },
  { id: 'endereco', nome: 'Endereço', icon: MapPinIcon },
  { id: 'ambiente', nome: 'Família &\nAmbiente', icon: HomeIcon },
  { id: 'medico', nome: 'Histórico\nMédico', icon: HeartIcon },
  { id: 'habitos', nome: 'Hábitos &\nCondições', icon: ClipboardDocumentCheckIcon }
]

// Computed
const modalTitle = computed(() => props.isEdicao ? 'Editar Cliente' : 'Novo Cliente')
const modalSubtitle = computed(() => props.isEdicao ? 'Altere as informações do cliente' : 'Preencha as informações do cliente')
const confirmButtonText = computed(() => props.isEdicao ? 'Salvar Alterações' : 'Salvar Cliente')

const handleFieldBlur = (field: keyof ClienteFormData) => {
  validation.validateField(field as string, clienteForm.form[field])
}

// Métodos
const handleConfirm = async () => {
  if (!validation.validateForm(clienteForm.form)) {
    // Ir para a primeira aba que tem erro
    const errosOrdenados = {
      pessoais: ['nome_completo', 'cpf', 'data_nascimento', 'sexo', 'email', 'altura', 'peso'],
      endereco: ['cep', 'endereco', 'cidade', 'estado'],
      ambiente: ['como_se_sente_em_casa', 'quantas_pessoas_moram_com_voce'],
      medico: ['acompanhamento_medico', 'patologia'],
      habitos: ['dorme_bem']
    }
    
    for (const [aba, campos] of Object.entries(errosOrdenados)) {
      if (campos.some(campo => validation.errors[campo as keyof typeof validation.errors])) {
        abaAtiva.value = aba
        break
      }
    }
    return
  }

  loading.value = true

  try {
    const clienteData = clienteForm.prepareDataForSubmit()

    let resultado
    if (props.isEdicao && props.clienteData?.id) {
      resultado = await editarCliente(props.clienteData.id, clienteData)
      if (resultado.success && resultado.data) {
        toast.success('Dados do cliente atualizados com sucesso!')
        emit('cliente-salvo', resultado.data)
        clienteForm.resetForm()
      } else {
        toast.error(resultado.message || 'Erro ao atualizar cliente!')
      }
    } else {
      resultado = await inserirCliente(clienteData)
      if (resultado.success && resultado.data) {
        toast.success('Novo cliente criado com sucesso!')
        emit('cliente-salvo', resultado.data)
        clienteForm.resetForm()
      } else {
        toast.error(resultado.message || 'Erro ao criar cliente!')
      }
    }

    if (resultado.success && resultado.data) {
      emit('update:modelValue', false)
      validation.clearAllErrors()
      abaAtiva.value = 'pessoais'
    }
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    toast.error('Erro inesperado ao salvar cliente')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
  clienteForm.resetForm()
  validation.clearAllErrors()
  abaAtiva.value = 'pessoais'
}

const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
  clienteForm.resetForm()
  validation.clearAllErrors()
  abaAtiva.value = 'pessoais'
}

// Watchers
watch(() => props.modelValue, (newValue: boolean) => {
  if (newValue) {
    if (props.isEdicao && props.clienteData) {
      clienteForm.loadClienteData(props.clienteData)
    } else {
      clienteForm.resetForm()
    }
    validation.clearAllErrors()
    abaAtiva.value = 'pessoais'
  }
})

watch(() => props.clienteData, () => {
  if (props.modelValue && props.isEdicao && props.clienteData) {
    clienteForm.loadClienteData(props.clienteData)
  }
})
</script>
