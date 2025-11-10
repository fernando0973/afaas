<template>
  <div 
    :style="estilosSlot"
    class="rounded-lg border cursor-pointer transition-all duration-200 h-full flex flex-col overflow-hidden hover:shadow-lg hover:scale-[1.02]"
    :class="[classesSlot, slotPaddingClasses]"
    @click="$emit('click', agendamento)"
  >
    <!-- Horário do agendamento -->
    <div class="flex items-center justify-between text-[11px] font-semibold text-neutral-700 tracking-wide leading-tight">
      <span>{{ horarioInicio }}</span>
      <span>{{ horarioFim }}</span>
    </div>
    
    <!-- Conteúdo: para slots de 30 minutos mostramos apenas o horário -->
    <template v-if="duracaoMinutos <= 30">
      <div class="flex-1" />
    </template>
    <template v-else>
      <!-- Título do agendamento -->
      <div :class="['font-semibold text-neutral-900 leading-tight truncate', tituloClasses]">
        {{ agendamento.titulo || 'Sem título' }}
      </div>
      
      <!-- Descrição -->
      <div v-if="duracaoMinutos > 45" class="text-xs text-neutral-700 flex-1 overflow-hidden font-medium">
        <div class="line-clamp-3 leading-relaxed">
          {{ agendamento.descricao || 'Sem descrição' }}
        </div>
      </div>
      <div v-else class="text-[11px] text-neutral-600 font-medium leading-tight truncate">
        {{ descricaoCompacta }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AgendamentoFormatado } from '~/composables/useAgendamentos'

interface Props {
  agendamento: AgendamentoFormatado
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [agendamento: AgendamentoFormatado]
}>()

/**
 * Estilos do slot baseados na cor hexadecimal
 */
const estilosSlot = computed(() => {
  const cor = props.agendamento.cor || '#DBE9FE'
  
  return {
    backgroundColor: cor,
    borderColor: darkenColor(cor, 0.25)
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

const duracaoMinutos = computed(() => {
  const inicio = props.agendamento.dataInicio
  const fim = props.agendamento.dataFim
  const diff = (fim.getTime() - inicio.getTime()) / 60000
  return Math.max(diff, 0)
})

const slotPaddingClasses = computed(() => {
  if (duracaoMinutos.value <= 30) {
    return 'px-1.5 py-1'
  }
  if (duracaoMinutos.value <= 60) {
    return 'px-2 py-1.5'
  }
  return 'p-2.5'
})

const tituloClasses = computed(() => (duracaoMinutos.value <= 60 ? 'text-sm mt-1' : 'text-base mt-1'))

const horarioInicio = computed(() => formatarHorario(props.agendamento.dataInicio))
const horarioFim = computed(() => formatarHorario(props.agendamento.dataFim))

const descricaoCompacta = computed(() => props.agendamento.descricao || props.agendamento.titulo || 'Sem descrição')

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