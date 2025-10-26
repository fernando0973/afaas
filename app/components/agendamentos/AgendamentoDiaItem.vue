<template>
  <div class="overflow-hidden transition-all cursor-pointer hover:shadow-md bg-neutral-200 rounded-t-lg">
    <!-- Cabeçalho com número do dia -->
    <div class="px-3 py-1.5">
      <!-- Número do dia -->
      <div class="text-lg font-bold text-center text-neutral-700">
        {{ formatarNumeroDia(data) }}
      </div>
    </div>
    
    <!-- Corpo com dia da semana -->
    <div class="px-3 pb-2">
      <div class="text-xs text-neutral-600 text-center font-medium">
        {{ formatarDiaSemana(data).toUpperCase() }}
      </div>
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