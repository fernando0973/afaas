<template>
  <div class="text-center p-2 rounded border border-neutral-200 hover:border-blue-300 transition-colors cursor-pointer">
    <!-- Número do dia -->
    <div class="text-lg font-semibold text-neutral-800">
      {{ formatarNumeroDia(data) }}
    </div>
    <!-- Dia da semana abreviado -->
    <div class="text-xs text-neutral-500 mt-1">
      {{ formatarDiaSemana(data) }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Date
}

const props = defineProps<Props>()

/**
 * Formatar número do dia
 * @param data - Objeto Date
 * @returns Número do dia (ex: "12")
 */
const formatarNumeroDia = (data: Date): string => {
  if (!data) return '--'
  return data.getDate().toString()
}

/**
 * Formatar dia da semana abreviado
 * @param data - Objeto Date
 * @returns Nome do dia abreviado (ex: "qua")
 */
const formatarDiaSemana = (data: Date): string => {
  if (!data) return '---'
  const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
  return dias[data.getDay()] || '---'
}
</script>