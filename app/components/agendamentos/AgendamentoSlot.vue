<template>
  <div 
    :style="estilosSlot"
    class="rounded-md p-1.5 cursor-pointer transition-all duration-200 h-full flex flex-col overflow-hidden hover:shadow-md"
  >
    <!-- Horário do agendamento -->
    <div class="text-xs font-medium mb-0.5 flex-shrink-0" style="color: rgba(0, 0, 0, 0.7)">
      {{ formatarHorario(agendamento.dataInicio) }} - {{ formatarHorario(agendamento.dataFim) }}
    </div>
    
    <!-- Título do agendamento -->
    <div class="text-xs font-semibold text-neutral-800 mb-0.5 flex-shrink-0 overflow-hidden">
      <div class="truncate">{{ agendamento.titulo }}</div>
    </div>
    
    <!-- Descrição -->
    <div class="text-xs text-neutral-600 flex-1 overflow-hidden">
      <div class="line-clamp-2 leading-tight">
        {{ agendamento.descricao }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AgendamentoFormatado } from '~/composables/useAgendamentos'

interface Props {
  agendamento: AgendamentoFormatado
}

const props = defineProps<Props>()

/**
 * Estilos do slot baseados na cor hexadecimal
 */
const estilosSlot = computed(() => {
  const cor = props.agendamento.cor || '#DBE9FE'
  
  return {
    backgroundColor: cor,
    border: `1px solid ${cor}`
  }
})

/**
 * Formatar horário no formato HH:MM
 * @param data - Objeto Date
 * @returns String formatada (ex: "08:00")
 */
const formatarHorario = (data: Date): string => {
  if (!data) return '--:--'
  const horas = data.getHours().toString().padStart(2, '0')
  const minutos = data.getMinutes().toString().padStart(2, '0')
  return `${horas}:${minutos}`
}
</script>