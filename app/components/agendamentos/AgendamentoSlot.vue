<template>
  <div :class="[
    corAgendamento?.bg || 'bg-blue-100', 
    corAgendamento?.border || 'border-blue-300', 
    corAgendamento?.hover || 'hover:bg-blue-200',
    'border rounded-md p-1.5 cursor-pointer transition-colors h-full flex flex-col overflow-hidden'
  ]">
    <!-- Horário do agendamento -->
    <div :class="['text-xs font-medium mb-0.5 flex-shrink-0', corAgendamento?.texto || 'text-blue-800']">
      {{ formatarHorario(dataInicio) }} - {{ formatarHorario(dataFim) }}
    </div>
    
    <!-- Título do agendamento -->
    <div class="text-xs font-semibold text-neutral-800 mb-0.5 flex-shrink-0 overflow-hidden">
      <div class="truncate">{{ titulo }}</div>
    </div>
    
    <!-- Descrição -->
    <div class="text-xs text-neutral-600 flex-1 overflow-hidden">
      <div class="line-clamp-2 leading-tight">
        {{ descricao }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  dataInicio: Date
  dataFim: Date
  titulo: string
  descricao: string
  corIndex?: number
}

const props = defineProps<Props>()

/**
 * Cores suaves para os agendamentos
 * Cada cor tem fundo, borda e texto
 */
const coresSuaves = [
  { bg: 'bg-blue-100', border: 'border-blue-300', texto: 'text-blue-800', hover: 'hover:bg-blue-200' },
  { bg: 'bg-green-100', border: 'border-green-300', texto: 'text-green-800', hover: 'hover:bg-green-200' },
  { bg: 'bg-purple-100', border: 'border-purple-300', texto: 'text-purple-800', hover: 'hover:bg-purple-200' },
  { bg: 'bg-pink-100', border: 'border-pink-300', texto: 'text-pink-800', hover: 'hover:bg-pink-200' },
  { bg: 'bg-yellow-100', border: 'border-yellow-300', texto: 'text-yellow-800', hover: 'hover:bg-yellow-200' },
  { bg: 'bg-indigo-100', border: 'border-indigo-300', texto: 'text-indigo-800', hover: 'hover:bg-indigo-200' },
  { bg: 'bg-rose-100', border: 'border-rose-300', texto: 'text-rose-800', hover: 'hover:bg-rose-200' },
  { bg: 'bg-teal-100', border: 'border-teal-300', texto: 'text-teal-800', hover: 'hover:bg-teal-200' }
]

/**
 * Computed para obter a cor baseada no índice
 */
const corAgendamento = computed(() => {
  const index = props.corIndex ?? 0
  return coresSuaves[index % coresSuaves.length] || coresSuaves[0]
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