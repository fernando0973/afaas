<template>
  <div class="bg-blue-100 border border-blue-300 rounded-md p-2 cursor-pointer hover:bg-blue-200 transition-colors h-full flex flex-col justify-center">
    <!-- Horário do agendamento -->
    <div class="text-xs font-medium text-blue-800 mb-1">
      {{ formatarHorario(dataInicio) }} - {{ formatarHorario(dataFim) }}
    </div>
    
    <!-- Título do agendamento -->
    <div class="text-sm font-semibold text-neutral-800 mb-1 line-clamp-1">
      {{ titulo }}
    </div>
    
    <!-- Descrição -->
    <div class="text-xs text-neutral-600 line-clamp-2">
      {{ descricao }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  dataInicio: Date
  dataFim: Date
  titulo: string
  descricao: string
}

const props = defineProps<Props>()

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