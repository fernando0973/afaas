<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <!-- Uso de substâncias químicas -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Faz uso de substância química contínua?
        </label>
        <div class="flex flex-wrap gap-3">
          <label v-for="substancia in SUBSTANCIAS_QUIMICAS" :key="substancia" class="flex items-center">
            <input
              :checked="modelValue.uso_substancias_quimicas.includes(substancia)"
              @change="toggleArrayItem('uso_substancias_quimicas', substancia)"
              type="checkbox"
              class="mr-2 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span class="text-sm text-neutral-700">{{ substancia }}</span>
          </label>
        </div>
      </div>

      <!-- Histórico de doenças -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Você já teve?
        </label>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
          <label v-for="doenca in DOENCAS_PASSADAS" :key="doenca" class="flex items-center">
            <input
              :checked="modelValue.historico_doencas_passadas.includes(doenca)"
              @change="toggleArrayItem('historico_doencas_passadas', doenca)"
              type="checkbox"
              class="mr-2 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span class="text-sm text-neutral-700">{{ doenca }}</span>
          </label>
        </div>
      </div>

      <!-- Outras condições -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Outras condições:
        </label>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <label v-for="condicao in OUTRAS_CONDICOES" :key="condicao" class="flex items-center">
            <input
              :checked="modelValue.outras_condicoes.includes(condicao)"
              @change="toggleArrayItem('outras_condicoes', condicao)"
              type="checkbox"
              class="mr-2 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span class="text-sm text-neutral-700">{{ condicao }}</span>
          </label>
        </div>
      </div>

      <!-- Dorme bem -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Dorme bem à noite?
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              :checked="modelValue.dorme_bem === true"
              @change="updateField('dorme_bem', true)"
              type="radio"
              class="mr-2 text-green-600 focus:ring-green-500"
            />
            <span class="text-sm text-neutral-700">Sim, dorme bem</span>
          </label>
          <label class="flex items-center">
            <input
              :checked="modelValue.dorme_bem === false"
              @change="updateField('dorme_bem', false)"
              type="radio"
              class="mr-2 text-red-600 focus:ring-red-500"
            />
            <span class="text-sm text-neutral-700">Não dorme bem</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClienteFormData } from '~/composables/useClienteForm'
import type { ClienteFormErrors } from '~/composables/useClienteValidation'

const SUBSTANCIAS_QUIMICAS = ['Álcool', 'Tabaco', 'Drogas ilícitas', 'Medicamentos não prescritos'] as const
const DOENCAS_PASSADAS = ['Diabetes', 'Hipertensão', 'Cardiopatia', 'Hepatite', 'Tuberculose', 'HIV/AIDS'] as const
const OUTRAS_CONDICOES = ['Alergia alimentar', 'Intolerância à lactose', 'Celíaco', 'Vegetariano/Vegano'] as const

interface Props {
  modelValue: ClienteFormData
  errors: ClienteFormErrors
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: ClienteFormData]
}>()

const updateField = (field: keyof ClienteFormData, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value } as ClienteFormData)
}

const toggleArrayItem = (field: 'uso_substancias_quimicas' | 'historico_doencas_passadas' | 'outras_condicoes', item: string) => {
  const currentArray = [...props.modelValue[field]]
  const index = currentArray.indexOf(item)
  
  if (index > -1) {
    currentArray.splice(index, 1)
  } else {
    currentArray.push(item)
  }
  
  updateField(field, currentArray)
}
</script>
