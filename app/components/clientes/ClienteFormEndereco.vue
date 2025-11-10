<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- CEP -->
      <BaseInput
        :model-value="modelValue.cep"
        @update:model-value="handleCEPInput"
        label="CEP"
        placeholder="00.000-000"
        :error="errors.cep"
        @blur="emit('blur', 'cep')"
        @input="emit('clearError', 'cep')"
        maxlength="10"
      >
        <template #prefix>
          <MapPinIcon class="w-5 h-5 text-neutral-400" />
        </template>
      </BaseInput>

      <!-- Cidade -->
      <BaseInput
        :model-value="modelValue.cidade"
        @update:model-value="updateField('cidade', $event)"
        label="Cidade"
        placeholder="Digite a cidade..."
        :error="errors.cidade"
        @blur="emit('blur', 'cidade')"
        @input="emit('clearError', 'cidade')"
      />

      <!-- Estado -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Estado
        </label>
        <select
          :value="modelValue.estado"
          @change="updateField('estado', ($event.target as HTMLSelectElement).value)"
          @blur="emit('blur', 'estado')"
          class="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.estado }"
        >
          <option value="">Selecione o estado...</option>
          <option v-for="estado in ESTADOS_BRASIL" :key="estado" :value="estado">
            {{ estado }}
          </option>
        </select>
        <p v-if="errors.estado" class="text-sm text-red-600">{{ errors.estado }}</p>
      </div>

      <!-- Endereço -->
      <div class="lg:col-span-2">
        <BaseInput
          :model-value="modelValue.endereco"
          @update:model-value="updateField('endereco', $event)"
          label="Endereço (Rua, Av., Rodovia...)"
          placeholder="Digite o endereço completo..."
          :error="errors.endereco"
          @blur="emit('blur', 'endereco')"
          @input="emit('clearError', 'endereco')"
        />
      </div>

      <!-- Número -->
      <BaseInput
        :model-value="modelValue.numero"
        @update:model-value="updateField('numero', $event)"
        label="Número"
        placeholder="123"
        :error="errors.numero"
        @blur="emit('blur', 'numero')"
        @input="emit('clearError', 'numero')"
      />

      <!-- Complemento -->
      <BaseInput
        :model-value="modelValue.complemento"
        @update:model-value="updateField('complemento', $event)"
        label="Complemento"
        placeholder="Apto, Casa, Bloco..."
      />

      <!-- Bairro -->
      <BaseInput
        :model-value="modelValue.bairro"
        @update:model-value="updateField('bairro', $event)"
        label="Bairro"
        placeholder="Digite o bairro..."
      />

      <!-- País -->
      <BaseInput
        :model-value="modelValue.pais"
        @update:model-value="updateField('pais', $event)"
        label="País"
        placeholder="Brasil"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon } from '@heroicons/vue/24/outline'
import { formatCEP } from '~/composables/useFormMasks'
import type { ClienteFormData } from '~/composables/useClienteForm'
import type { ClienteFormErrors } from '~/composables/useClienteValidation'

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const

interface Props {
  modelValue: ClienteFormData
  errors: ClienteFormErrors
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: ClienteFormData]
  'blur': [field: string]
  'clearError': [field: string]
}>()

const updateField = (field: keyof ClienteFormData, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value } as ClienteFormData)
}

const handleCEPInput = (value: string) => {
  updateField('cep', formatCEP(value))
}
</script>
