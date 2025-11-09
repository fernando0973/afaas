<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    size="xl"
    :confirm-button-text="confirmButtonText"
    :loading="loading"
    :confirm-disabled="!isFormValid"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <!-- Conteúdo do modal -->
    <form @submit.prevent="handleConfirm" class="space-y-6">
      <!-- Seção 1: Informações Básicas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Nome Popular (obrigatório) -->
        <BaseInput
          :model-value="form.nome_popular"
          @update:model-value="form.nome_popular = $event"
          label="Nome Popular"
          placeholder="Ex: Camomila, Boldo..."
          required
          :error="errors.nome_popular"
          @blur="validateField('nome_popular')"
          @input="clearFieldError('nome_popular')"
        >
          <template #prefix>
            <BeakerIcon class="w-5 h-5 text-neutral-400" />
          </template>
        </BaseInput>

        <!-- Nome Científico -->
        <BaseInput
          :model-value="form.nome_cientifico"
          @update:model-value="form.nome_cientifico = $event"
          label="Nome Científico"
          placeholder="Ex: Matricaria chamomilla..."
          :error="errors.nome_cientifico"
          @blur="validateField('nome_cientifico')"
          @input="clearFieldError('nome_cientifico')"
        >
          <template #prefix>
            <AcademicCapIcon class="w-5 h-5 text-neutral-400" />
          </template>
        </BaseInput>
      </div>

      <!-- Seção RENISUS -->
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div class="flex items-center space-x-3">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.renisus"
              class="w-4 h-4 text-blue-600 bg-white border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="text-sm font-medium text-blue-900">
              Planta da RENISUS
            </span>
          </label>
          <div class="flex-1">
            <p class="text-xs text-blue-700">
              Relação Nacional de Plantas Medicinais de Interesse do SUS
            </p>
          </div>
        </div>
      </div>

      <!-- Seção 2: Características em Colunas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Partes Usadas -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-neutral-700">
            Partes Usadas
          </label>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="parte in partesDisponiveis"
              :key="parte"
              type="button"
              :class="[
                'px-2 py-1 rounded text-xs font-medium border transition-colors',
                form.partes_usadas.includes(parte)
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              ]"
              @click="toggleParteUsada(parte)"
            >
              {{ parte }}
            </button>
          </div>
        </div>

        <!-- Sabor/Propriedade -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-neutral-700">
            Sabor/Propriedade
          </label>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="sabor in saboresDisponiveis"
              :key="sabor"
              type="button"
              :class="[
                'px-2 py-1 rounded text-xs font-medium border transition-colors',
                form.sabor_propriedade.includes(sabor)
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              ]"
              @click="toggleSaborPropriedade(sabor)"
            >
              {{ sabor }}
            </button>
          </div>
        </div>

        <!-- Meridianos -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-neutral-700">
            Meridianos
          </label>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="meridiano in meridianosDisponiveis"
              :key="meridiano"
              type="button"
              :class="[
                'px-2 py-1 rounded text-xs font-medium border transition-colors',
                form.meridianos.includes(meridiano)
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              ]"
              @click="toggleMeridiano(meridiano)"
            >
              {{ meridiano }}
            </button>
          </div>
        </div>
      </div>

      <!-- Seção 3: Descrições Detalhadas -->
      <div class="space-y-4">
        <!-- Ação Terapêutica - Campo completo -->
        <BaseTextarea
          :model-value="form.acao_terapeutica"
          @update:model-value="form.acao_terapeutica = $event"
          label="Ação Terapêutica"
          placeholder="Descreva detalhadamente as ações terapêuticas da planta medicinal..."
          :rows="4"
          :error="errors.acao_terapeutica"
          @blur="validateField('acao_terapeutica')"
          @input="clearFieldError('acao_terapeutica')"
        />

        <!-- Indicações e Contraindicações - 2 colunas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Indicações -->
          <BaseTextarea
            :model-value="form.indicacoes"
            @update:model-value="form.indicacoes = $event"
            label="Indicações"
            placeholder="Liste as principais indicações de uso, sintomas tratados, condições terapêuticas..."
            :rows="5"
            :error="errors.indicacoes"
            @blur="validateField('indicacoes')"
            @input="clearFieldError('indicacoes')"
          />

          <!-- Contraindicações -->
          <BaseTextarea
            :model-value="form.contraindicacoes"
            @update:model-value="form.contraindicacoes = $event"
            label="Contraindicações"
            placeholder="Liste as contraindicações, cuidados especiais, efeitos adversos, interações medicamentosas..."
            :rows="5"
            :error="errors.contraindicacoes"
            @blur="validateField('contraindicacoes')"
            @input="clearFieldError('contraindicacoes')"
          />
        </div>
      </div>

      <!-- Informações adicionais se for edição -->
      <div v-if="isEdicao && plantaId" class="bg-neutral-50 rounded-lg p-3">
        <div class="flex items-center space-x-2 text-sm text-neutral-600">
          <InformationCircleIcon class="w-4 h-4" />
          <span>Editando planta medicinal ID: {{ plantaId }}</span>
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { 
  BeakerIcon, 
  AcademicCapIcon, 
  InformationCircleIcon
// @ts-ignore
} from '@heroicons/vue/24/outline'
import type { PlantaMedicinal } from '~/types/planta'

interface Props {
  modelValue: boolean
  isEdicao?: boolean
  plantaId?: number | null
  plantaData?: PlantaMedicinal | null
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  plantaId: null,
  plantaData: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: Omit<PlantaMedicinal, 'id' | 'created_at' | 'deleted_at'> & { id?: number }]
  cancel: []
  close: []
}>()

// Opções predefinidas para seleção
const partesDisponiveis = [
  'Folhas', 'Flores', 'Raízes', 'Caule', 'Frutos', 'Sementes', 
  'Casca', 'Bulbo', 'Tubérculo', 'Planta inteira'
]

const saboresDisponiveis = [
  'Doce', 'Amargo', 'Ácido', 'Picante', 'Salgado', 'Adstringente',
  'Quente', 'Frio', 'Neutro', 'Aromático'
]

const meridianosDisponiveis = [
  'Pulmão', 
  'Intestino Grosso',
  'Estômago', 
  'Baço/Pâncreas', 
  'Coração', 
  'Intestino Delgado',
  'Bexiga', 
  'Rim',
  'Pericárdio ou Circulação Sexo',
  'Triplo Aquecedor',
  'Vesícula Biliar',
  'Fígado',
  'Complementares',
  'Vaso Concepção', 
  'Vaso Governador'
]

// Estado do formulário
const form = reactive({
  nome_popular: '',
  nome_cientifico: '',
  partes_usadas: [] as string[],
  sabor_propriedade: [] as string[],
  meridianos: [] as string[],
  acao_terapeutica: '',
  indicacoes: '',
  contraindicacoes: '',
  renisus: false
})

// Estado para armazenar dados originais (para detectar mudanças)
const originalData = reactive({
  nome_popular: '',
  nome_cientifico: '',
  partes_usadas: [] as string[],
  sabor_propriedade: [] as string[],
  meridianos: [] as string[],
  acao_terapeutica: '',
  indicacoes: '',
  contraindicacoes: '',
  renisus: false
})

// Estados para novos itens (removidos)

// Estado de loading e erros
const loading = ref(false)
const errors = reactive({
  nome_popular: '',
  nome_cientifico: '',
  acao_terapeutica: '',
  indicacoes: '',
  contraindicacoes: ''
})

// Computed properties
const modalTitle = computed(() => 
  props.isEdicao ? 'Editar Planta Medicinal' : 'Nova Planta Medicinal'
)

const modalSubtitle = computed(() => 
  props.isEdicao 
    ? 'Modifique os dados da planta medicinal existente'
    : 'Adicione uma nova planta medicinal ao sistema'
)

const confirmButtonText = computed(() => 
  props.isEdicao ? 'Salvar Alterações' : 'Criar Planta'
)

// Detectar se houve mudanças no formulário (para modo edição)
const hasChanges = computed(() => {
  if (!props.isEdicao) return true // No modo criação, sempre permitir salvar se válido
  
  // Comparar cada campo
  const fieldsChanged = 
    form.nome_popular !== originalData.nome_popular ||
    form.nome_cientifico !== originalData.nome_cientifico ||
    form.acao_terapeutica !== originalData.acao_terapeutica ||
    form.indicacoes !== originalData.indicacoes ||
    form.contraindicacoes !== originalData.contraindicacoes ||
    form.renisus !== originalData.renisus
  
  // Comparar arrays (verificar se têm o mesmo conteúdo)
  const arraysChanged = 
    JSON.stringify([...form.partes_usadas].sort()) !== JSON.stringify([...originalData.partes_usadas].sort()) ||
    JSON.stringify([...form.sabor_propriedade].sort()) !== JSON.stringify([...originalData.sabor_propriedade].sort()) ||
    JSON.stringify([...form.meridianos].sort()) !== JSON.stringify([...originalData.meridianos].sort())
  
  return fieldsChanged || arraysChanged
})

const isFormValid = computed(() => {
  const isValid = form.nome_popular.trim().length > 0 && !Object.values(errors).some(error => error)
  
  // No modo edição, também verificar se há mudanças
  if (props.isEdicao) {
    return isValid && hasChanges.value
  }
  
  return isValid
})

// Funções para toggle de arrays
const toggleParteUsada = (parte: string) => {
  const index = form.partes_usadas.indexOf(parte)
  if (index > -1) {
    form.partes_usadas.splice(index, 1)
  } else {
    form.partes_usadas.push(parte)
  }
}

const toggleSaborPropriedade = (sabor: string) => {
  const index = form.sabor_propriedade.indexOf(sabor)
  if (index > -1) {
    form.sabor_propriedade.splice(index, 1)
  } else {
    form.sabor_propriedade.push(sabor)
  }
}

const toggleMeridiano = (meridiano: string) => {
  const index = form.meridianos.indexOf(meridiano)
  if (index > -1) {
    form.meridianos.splice(index, 1)
  } else {
    form.meridianos.push(meridiano)
  }
}

// Funções para adicionar novos itens (removidas - agora usa apenas listas fixas)

// Funções de validação
const validateField = (field: keyof typeof form) => {
  switch (field) {
    case 'nome_popular':
      if (!form.nome_popular.trim()) {
        errors.nome_popular = 'Nome popular é obrigatório'
      } else if (form.nome_popular.trim().length < 2) {
        errors.nome_popular = 'Nome deve ter pelo menos 2 caracteres'
      } else if (form.nome_popular.trim().length > 100) {
        errors.nome_popular = 'Nome deve ter no máximo 100 caracteres'
      } else {
        errors.nome_popular = ''
      }
      break
    case 'nome_cientifico':
      if (form.nome_cientifico && form.nome_cientifico.trim().length > 200) {
        errors.nome_cientifico = 'Nome científico deve ter no máximo 200 caracteres'
      } else {
        errors.nome_cientifico = ''
      }
      break
    case 'acao_terapeutica':
      if (form.acao_terapeutica && form.acao_terapeutica.trim().length > 1000) {
        errors.acao_terapeutica = 'Ação terapêutica deve ter no máximo 1000 caracteres'
      } else {
        errors.acao_terapeutica = ''
      }
      break
    case 'indicacoes':
      if (form.indicacoes && form.indicacoes.trim().length > 1000) {
        errors.indicacoes = 'Indicações devem ter no máximo 1000 caracteres'
      } else {
        errors.indicacoes = ''
      }
      break
    case 'contraindicacoes':
      if (form.contraindicacoes && form.contraindicacoes.trim().length > 1000) {
        errors.contraindicacoes = 'Contraindicações devem ter no máximo 1000 caracteres'
      } else {
        errors.contraindicacoes = ''
      }
      break
  }
}

const clearFieldError = (field: keyof typeof errors) => {
  errors[field] = ''
}

const validateForm = () => {
  validateField('nome_popular')
  validateField('nome_cientifico')
  validateField('acao_terapeutica')
  validateField('indicacoes')
  validateField('contraindicacoes')
  return isFormValid.value
}

// Handlers do modal
const handleConfirm = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  try {
    const saveData = {
      nome_popular: form.nome_popular.trim(),
      nome_cientifico: form.nome_cientifico.trim() || null,
      partes_usadas: form.partes_usadas.length > 0 ? form.partes_usadas : null,
      sabor_propriedade: form.sabor_propriedade.length > 0 ? form.sabor_propriedade : null,
      meridianos: form.meridianos.length > 0 ? form.meridianos : null,
      acao_terapeutica: form.acao_terapeutica.trim() || null,
      indicacoes: form.indicacoes.trim() || null,
      contraindicacoes: form.contraindicacoes.trim() || null,
      renisus: form.renisus,
      ...(props.isEdicao && props.plantaId && { id: props.plantaId })
    }
    

    
    emit('save', saveData)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('close')
}

// Resetar formulário quando modal abre/fecha
const resetForm = () => {
  form.nome_popular = ''
  form.nome_cientifico = ''
  form.partes_usadas = []
  form.sabor_propriedade = []
  form.meridianos = []
  form.acao_terapeutica = ''
  form.indicacoes = ''
  form.contraindicacoes = ''
  form.renisus = false
  
  // Resetar dados originais também
  originalData.nome_popular = ''
  originalData.nome_cientifico = ''
  originalData.partes_usadas = []
  originalData.sabor_propriedade = []
  originalData.meridianos = []
  originalData.acao_terapeutica = ''
  originalData.indicacoes = ''
  originalData.contraindicacoes = ''
  originalData.renisus = false
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  loading.value = false
}

// Carregar dados para edição
const loadPlantaData = () => {
  if (props.isEdicao && props.plantaData) {
    
    const plantaData = props.plantaData
    
    // Carregando dados no formulário
    form.nome_popular = plantaData.nome_popular || ''
    form.nome_cientifico = plantaData.nome_cientifico || ''
    
    // Tratamento especial para arrays - garantir que são arrays válidos
    form.partes_usadas = Array.isArray(plantaData.partes_usadas) 
      ? [...plantaData.partes_usadas] 
      : []
      
    form.sabor_propriedade = Array.isArray(plantaData.sabor_propriedade) 
      ? [...plantaData.sabor_propriedade] 
      : []
      
    form.meridianos = Array.isArray(plantaData.meridianos) 
      ? [...plantaData.meridianos] 
      : []
    
    form.acao_terapeutica = plantaData.acao_terapeutica || ''
    form.indicacoes = plantaData.indicacoes || ''
    form.contraindicacoes = plantaData.contraindicacoes || ''
    form.renisus = plantaData.renisus || false
    
    // Salvar dados originais para detectar mudanças
    originalData.nome_popular = form.nome_popular
    originalData.nome_cientifico = form.nome_cientifico
    originalData.partes_usadas = [...form.partes_usadas]
    originalData.sabor_propriedade = [...form.sabor_propriedade]
    originalData.meridianos = [...form.meridianos]
    originalData.acao_terapeutica = form.acao_terapeutica
    originalData.indicacoes = form.indicacoes
    originalData.contraindicacoes = form.contraindicacoes
    originalData.renisus = form.renisus
  }
}

// Watchers
watch(() => props.modelValue, (isOpen: boolean) => {
  if (isOpen) {
    if (props.isEdicao) {
      loadPlantaData()
    } else {
      resetForm()
    }
  } else {
    // Pequeno delay para evitar flash durante a transição
    setTimeout(resetForm, 200)
  }
})

watch(() => props.plantaData, (newData: any) => {
  if (props.modelValue && props.isEdicao && newData) {
    loadPlantaData()
  }
}, { deep: true })

// Inicialização
onMounted(() => {
  if (props.modelValue && props.isEdicao) {
    loadPlantaData()
  }
})
</script>