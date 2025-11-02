<template>
  <div 
    :style="estilosSlot"
    class="rounded-lg p-2 cursor-pointer transition-all duration-200 h-full flex flex-col overflow-hidden hover:shadow-lg hover:scale-[1.02] border-l-4"
    :class="classesSlot"
  >
    <!-- Horário do agendamento -->
    <div class="text-xs font-bold mb-1 flex-shrink-0 text-neutral-700 tracking-wide">
      {{ formatarHorario(agendamento.dataInicio) }} - {{ formatarHorario(agendamento.dataFim) }}
    </div>
    
    <!-- Título do agendamento -->
    <div class="text-sm font-bold text-neutral-900 mb-1 flex-shrink-0 overflow-hidden leading-snug">
      <div class="truncate">{{ agendamento.titulo }}</div>
    </div>
    
    <!-- Descrição -->
    <div class="text-xs text-neutral-700 flex-1 overflow-hidden font-medium">
      <div class="line-clamp-3 leading-relaxed">
        {{ agendamento.descricao || 'Sem descrição' }}
      </div>
    </div>

    <!-- Indicador visual adicional (futuro: status, profissional, etc.) -->
    <div class="mt-auto pt-1 flex-shrink-0">
      <div class="w-full h-0.5 bg-white/30 rounded-full"></div>
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
    borderLeftColor: darkenColor(cor, 0.3)
  }
})

/**
 * Classes CSS dinâmicas para o slot
 */
const classesSlot = computed(() => {
  const cor = props.agendamento.cor || '#DBE9FE'
  const isLightColor = isColorLight(cor)
  
  return {
    'text-neutral-900': isLightColor,
    'text-neutral-100': !isLightColor,
    'shadow-sm': true
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

/**
 * Formatar status do agendamento (se existir)
 * @param status - Status do agendamento
 * @returns String formatada
 */
const formatarStatus = (status: string | undefined): string => {
  if (!status) return ''
  
  const statusMap: Record<string, string> = {
    'agendado': 'Agendado',
    'confirmado': 'Confirmado',
    'realizado': 'Realizado',
    'cancelado': 'Cancelado',
    'reagendado': 'Reagendado'
  }
  
  return statusMap[status.toLowerCase()] || status
}

/**
 * Verificar se uma cor é clara (para escolher cor do texto)
 * @param hex - Cor em hexadecimal (#RRGGBB)
 * @returns true se a cor for clara
 */
const isColorLight = (hex: string): boolean => {
  const color = hex.charAt(0) === '#' ? hex.substring(1, 7) : hex
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return brightness > 155
}

/**
 * Escurecer uma cor hexadecimal
 * @param hex - Cor em hexadecimal (#RRGGBB)
 * @param factor - Fator de escurecimento (0-1)
 * @returns Nova cor escurecida
 */
const darkenColor = (hex: string, factor: number): string => {
  const color = hex.charAt(0) === '#' ? hex.substring(1, 7) : hex
  const r = Math.floor(parseInt(color.substring(0, 2), 16) * (1 - factor))
  const g = Math.floor(parseInt(color.substring(2, 4), 16) * (1 - factor))
  const b = Math.floor(parseInt(color.substring(4, 6), 16) * (1 - factor))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
</script>