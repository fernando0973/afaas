<template>
  <BaseModal
    :model-value="modelValue"
    title="Selecionar profissional"
    subtitle="Escolha o profissional para visualizar os agendamentos"
  size="sm"
    :show-footer="false"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="space-y-4 max-w-sm mx-auto">
      <div v-if="loading" class="text-center text-neutral-500">
        Carregando profissionais...
      </div>

      <div v-else-if="profissionais.length === 0" class="text-center text-neutral-500">
        Nenhum profissional disponível.
      </div>

      <ul v-else class="space-y-2 max-h-80 overflow-y-auto pr-1">
        <li
          v-for="profissional in profissionais"
          :key="profissional.profissional_id || profissional.id"
        >
          <button
            type="button"
            :class="[
              'w-full rounded-lg border px-4 py-3 text-left shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2',
              estaSelecionado(profissional)
                ? 'border-green-500 bg-green-50 hover:border-green-500 hover:bg-green-100 focus-visible:ring-green-600'
                : 'border-neutral-200 bg-white hover:border-green-200 hover:bg-green-50 focus-visible:ring-green-500'
            ]"
            @click="selecionar(profissional)"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-neutral-900">
                  {{ profissional.nome_profissional || profissional.nome_completo }}
                </p>
                <p class="mt-1 text-xs text-neutral-500">
                  {{ profissional.especialidade || 'Especialidade não informada' }}
                </p>
              </div>

              <span
                v-if="estaSelecionado(profissional)"
                class="inline-flex items-center rounded-full bg-green-100 p-1 text-green-700"
                aria-hidden="true"
              >
                <CheckIcon class="h-4 w-4" />
              </span>
            </div>
          </button>
        </li>
      </ul>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '~/components/BaseModal.vue'
import type { Profissional } from '~/types/profissional'
// @ts-ignore
import { CheckIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  profissionais: Profissional[]
  loading?: boolean
  profissionalSelecionadoId: number | null
}

const props = withDefaults(defineProps<Props>(), {
  profissionais: () => [],
  loading: false,
  profissionalSelecionadoId: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  selecionar: [profissional: Profissional]
}>()

const selecionar = (profissional: Profissional) => {
  emit('selecionar', profissional)
  emit('update:modelValue', false)
}

const estaSelecionado = (profissional: Profissional) => {
  const idAtual = profissional.profissional_id ?? profissional.id ?? null
  return idAtual !== null && idAtual === props.profissionalSelecionadoId
}
</script>
