<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <!-- Acompanhamento médico -->
      <BaseTextarea
        :model-value="modelValue.acompanhamento_medico"
        @update:model-value="updateField('acompanhamento_medico', $event)"
        label="Acompanhamento médico, qual?"
        placeholder="Descreva o acompanhamento médico atual..."
        :rows="2"
      />

      <!-- Patologia -->
      <BaseTextarea
        :model-value="modelValue.patologia"
        @update:model-value="updateField('patologia', $event)"
        label="Patologia apresentada (doença)"
        placeholder="Descreva patologias ou doenças..."
        :rows="2"
      />

      <!-- Tratamento utilizado -->
      <BaseTextarea
        :model-value="modelValue.tratamento_utilizado"
        @update:model-value="updateField('tratamento_utilizado', $event)"
        label="Tratamento utilizado"
        placeholder="Descreva tratamentos em uso..."
        :rows="2"
      />

      <!-- Seção: Próteses e Transplantes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Bloco: Próteses -->
        <div class="space-y-3 p-4 bg-neutral-50 rounded-lg">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-neutral-700">
              Usa prótese?
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  :checked="modelValue.usa_protese === true"
                  @change="updateField('usa_protese', true)"
                  type="radio"
                  class="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-neutral-700">Sim</span>
              </label>
              <label class="flex items-center">
                <input
                  :checked="modelValue.usa_protese === false"
                  @change="updateField('usa_protese', false)"
                  type="radio"
                  class="mr-2 text-neutral-600 focus:ring-neutral-500"
                />
                <span class="text-sm text-neutral-700">Não</span>
              </label>
            </div>
          </div>
          
          <!-- Tipo de prótese -->
          <BaseInput
            v-if="modelValue.usa_protese"
            :model-value="modelValue.tipo_protese"
            @update:model-value="updateField('tipo_protese', $event)"
            label="Qual prótese?"
            placeholder="Descreva a prótese..."
          />
        </div>

        <!-- Bloco: Transplantes -->
        <div class="space-y-3 p-4 bg-neutral-50 rounded-lg">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-neutral-700">
              Fez transplante?
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  :checked="modelValue.fez_transplante === true"
                  @change="updateField('fez_transplante', true)"
                  type="radio"
                  class="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-neutral-700">Sim</span>
              </label>
              <label class="flex items-center">
                <input
                  :checked="modelValue.fez_transplante === false"
                  @change="updateField('fez_transplante', false)"
                  type="radio"
                  class="mr-2 text-neutral-600 focus:ring-neutral-500"
                />
                <span class="text-sm text-neutral-700">Não</span>
              </label>
            </div>
          </div>

          <!-- Tipo de transplante -->
          <BaseInput
            v-if="modelValue.fez_transplante"
            :model-value="modelValue.tipo_transplante"
            @update:model-value="updateField('tipo_transplante', $event)"
            label="Qual transplante?"
            placeholder="Descreva o transplante..."
          />
        </div>
      </div>

      <!-- Ferimentos graves -->
      <BaseTextarea
        :model-value="modelValue.ferimentos_graves"
        @update:model-value="updateField('ferimentos_graves', $event)"
        label="Já teve ferimentos graves?"
        placeholder="Descreva ferimentos graves que já teve..."
        :rows="2"
      />

      <!-- Medicamentos em uso -->
      <BaseTextarea
        :model-value="modelValue.medicamentos_em_uso"
        @update:model-value="updateField('medicamentos_em_uso', $event)"
        label="Está tomando algum medicamento (Alopático, Homeopático, Fitoterápico, Florais)?"
        placeholder="Descreva os medicamentos em uso..."
        :rows="3"
      />

      <!-- Procedimentos cirúrgicos -->
      <BaseTextarea
        :model-value="modelValue.procedimentos_cirurgicos"
        @update:model-value="updateField('procedimentos_cirurgicos', $event)"
        label="Já passou por algum procedimento cirúrgico?"
        placeholder="Descreva procedimentos cirúrgicos..."
        :rows="2"
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
