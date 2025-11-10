<template>
  <div class="flex flex-col items-center space-y-2 p-3">
    <!-- Primeira linha: período da semana centralizado -->
    <div class="flex items-center justify-center space-x-2">
      <CalendarIcon class="w-4 h-4 text-blue-600" />
      <span class="text-base font-semibold text-neutral-800">
        {{ formatarData(diasSemana[0]) }} - {{ formatarData(diasSemana[6]) }}
      </span>
    </div>

    <!-- Segunda linha: botões de navegação -->
    <div class="flex items-center space-x-2">
      <!-- Botão voltar semana -->
      <button
        @click="agendamentoStore.voltarSemana()"
        class="flex items-center space-x-1 px-2 py-1 text-neutral-700 bg-neutral-200 hover:bg-neutral-300 rounded transition-all duration-200 border border-neutral-300 hover:border-neutral-400"
        title="Semana anterior"
      >
        <ChevronLeftIcon class="w-4 h-4" />
        <span class="text-sm font-medium">Anterior</span>
      </button>

      <!-- Botão avançar semana -->
      <button
        @click="agendamentoStore.avancarSemana()"
        class="flex items-center space-x-1 px-2 py-1 text-neutral-700 bg-neutral-200 hover:bg-neutral-300 rounded transition-all duration-200 border border-neutral-300 hover:border-neutral-400"
        title="Próxima semana"
      >
        <span class="text-sm font-medium">Próxima</span>
        <ChevronRightIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/vue/24/outline'

// Acessar o store de agendamento
const agendamentoStore = useAgendamentoStore()

// Computed para acessar os dias da semana do store
const { diasSemana } = storeToRefs(agendamentoStore)

/**
 * Formatar uma data para o formato dd/MM
 * @param data - Objeto Date a ser formatado
 * @returns String formatada (ex: "26/10")
 */
const formatarData = (data: Date | undefined): string => {
  if (!data) return '--/--'
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  return `${dia}/${mes}`
}


</script>