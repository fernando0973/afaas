<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- CPF -->
      <BaseInput
        :model-value="modelValue.cpf"
        @update:model-value="handleCPFInput"
        label="CPF"
        placeholder="000.000.000-00"
        required
        :error="errors.cpf"
        @blur="emit('blur', 'cpf')"
        @input="emit('clearError', 'cpf')"
        maxlength="14"
      >
        <template #prefix>
          <IdentificationIcon class="w-5 h-5 text-neutral-400" />
        </template>
      </BaseInput>

      <!-- Data de Nascimento -->
      <BaseInput
        :model-value="modelValue.data_nascimento"
        @update:model-value="updateField('data_nascimento', $event)"
        label="Data de Nascimento"
        type="date"
        required
        :error="errors.data_nascimento"
        @blur="emit('blur', 'data_nascimento')"
        @input="emit('clearError', 'data_nascimento')"
      >
        <template #prefix>
          <CalendarDaysIcon class="w-5 h-5 text-neutral-400" />
        </template>
      </BaseInput>

      <!-- Nome Completo -->
      <div class="lg:col-span-2">
        <BaseInput
          :model-value="modelValue.nome_completo"
          @update:model-value="updateField('nome_completo', $event)"
          label="Nome Completo"
          placeholder="Digite o nome completo..."
          required
          :error="errors.nome_completo"
          @blur="emit('blur', 'nome_completo')"
          @input="emit('clearError', 'nome_completo')"
        >
          <template #prefix>
            <UserIcon class="w-5 h-5 text-neutral-400" />
          </template>
        </BaseInput>
      </div>

      <!-- E-mail -->
      <div class="lg:col-span-2">
        <BaseInput
          :model-value="modelValue.email"
          @update:model-value="updateField('email', $event)"
          label="E-mail"
          placeholder="email@exemplo.com"
          :error="errors.email"
          @blur="emit('blur', 'email')"
          @input="emit('clearError', 'email')"
          maxlength="120"
          type="email"
        >
          <template #prefix>
            <BriefcaseIcon class="w-5 h-5 text-neutral-400" />
          </template>
        </BaseInput>
      </div>

      <!-- Altura -->
      <BaseInput
        :model-value="modelValue.altura"
        @update:model-value="updateField('altura', $event)"
        label="Altura (m)"
        placeholder="1.70"
        type="number"
        step="0.01"
        :error="errors.altura"
        @blur="emit('blur', 'altura')"
        @input="emit('clearError', 'altura')"
      />

      <!-- Peso -->
      <BaseInput
        :model-value="modelValue.peso"
        @update:model-value="updateField('peso', $event)"
        label="Peso (kg)"
        placeholder="70.5"
        type="number"
        step="0.1"
        :error="errors.peso"
        @blur="emit('blur', 'peso')"
        @input="emit('clearError', 'peso')"
      />

      <!-- Tipo Sanguíneo -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Tipo Sanguíneo
        </label>
        <select
          :value="modelValue.tipo_sanguineo"
          @change="updateField('tipo_sanguineo', ($event.target as HTMLSelectElement).value)"
          class="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Selecione...</option>
          <option v-for="tipo in TIPOS_SANGUINEOS" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
      </div>

      <!-- Sexo -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Sexo <span class="text-red-500">*</span>
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              :checked="modelValue.sexo === 'masculino'"
              @change="updateField('sexo', 'masculino')"
              type="radio"
              value="masculino"
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-neutral-700">Masculino</span>
          </label>
          <label class="flex items-center">
            <input
              :checked="modelValue.sexo === 'feminino'"
              @change="updateField('sexo', 'feminino')"
              type="radio"
              value="feminino"
              class="mr-2 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-sm text-neutral-700">Feminino</span>
          </label>
        </div>
        <p v-if="errors.sexo" class="text-sm text-red-600">{{ errors.sexo }}</p>
      </div>

      <!-- Naturalidade -->
      <BaseInput
        :model-value="modelValue.naturalidade"
        @update:model-value="updateField('naturalidade', $event)"
        label="Naturalidade"
        placeholder="Cidade de nascimento..."
      />

      <!-- Estado da Naturalidade -->
      <BaseInput
        :model-value="modelValue.estado_naturalidade"
        @update:model-value="updateField('estado_naturalidade', $event)"
        label="Estado da Naturalidade"
        placeholder="Estado de nascimento..."
      />

      <!-- Telefone -->
      <BaseInput
        :model-value="modelValue.telefone"
        @update:model-value="handleTelefoneInput"
        label="Telefone com DDD"
        placeholder="(00) 00000-0000"
        :error="errors.telefone"
        @blur="emit('blur', 'telefone')"
        @input="emit('clearError', 'telefone')"
        maxlength="15"
      >
        <template #prefix>
          <PhoneIcon class="w-5 h-5 text-neutral-400" />
        </template>
      </BaseInput>

      <!-- Profissão -->
      <BaseInput
        :model-value="modelValue.profissao"
        @update:model-value="updateField('profissao', $event)"
        label="Profissão"
        placeholder="Digite a profissão..."
      >
        <template #prefix>
          <BriefcaseIcon class="w-5 h-5 text-neutral-400" />
        </template>
      </BaseInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UserIcon, 
  IdentificationIcon, 
  CalendarDaysIcon, 
  PhoneIcon, 
  BriefcaseIcon 
} from '@heroicons/vue/24/outline'
import { formatCPF, formatTelefone } from '~/composables/useFormMasks'
import type { ClienteFormData } from '~/composables/useClienteForm'
import type { ClienteFormErrors } from '~/composables/useClienteValidation'

const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

interface Props {
  modelValue: ClienteFormData
  errors: ClienteFormErrors
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: ClienteFormData]
  'blur': [field: string]
  'clearError': [field: string]
}>()

const updateField = (field: keyof ClienteFormData, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value } as ClienteFormData)
}

const handleCPFInput = (value: string) => {
  updateField('cpf', formatCPF(value))
}

const handleTelefoneInput = (value: string) => {
  updateField('telefone', formatTelefone(value))
}

const props = defineProps<Props>()
</script>
