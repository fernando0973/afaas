<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <!-- Como se sente em casa -->
      <BaseTextarea
        :model-value="modelValue.como_se_sente_em_casa"
        @update:model-value="updateField('como_se_sente_em_casa', $event)"
        label="Como se sente em casa?"
        placeholder="Descreva como você se sente no ambiente de casa..."
        :rows="3"
      />

      <!-- Quantas pessoas moram com você -->
      <BaseInput
        :model-value="modelValue.quantas_pessoas_moram_com_voce"
        @update:model-value="updateField('quantas_pessoas_moram_com_voce', $event)"
        label="Quantas pessoas moram com você?"
        type="number"
        placeholder="0"
      />

      <!-- Aspecto genético familiar -->
      <BaseTextarea
        :model-value="modelValue.aspecto_genetico_familiar"
        @update:model-value="updateField('aspecto_genetico_familiar', $event)"
        label="Aspecto genético de cada pessoa"
        placeholder="Descreva características genéticas relevantes da família..."
        :rows="3"
      />

      <!-- Histórico de doenças na família -->
      <BaseTextarea
        :model-value="modelValue.historico_doencas_familia"
        @update:model-value="updateField('historico_doencas_familia', $event)"
        label="Histórico de doenças na família"
        placeholder="Descreva o histórico de doenças familiares..."
        :rows="3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClienteFormData } from '~/composables/useClienteForm'
import type { ClienteFormErrors } from '~/composables/useClienteValidation'

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
</script>
