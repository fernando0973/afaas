<template>
  <div class="flex flex-col h-full">
    <!-- Lista de horários -->
    <div 
      v-for="(horario, index) in horarios" 
      :key="horario"
      :class="[
        'relative flex-1',
        index !== horarios.length - 1 ? 'border-b border-neutral-200' : ''
      ]"
    >
      <div class="absolute top-0 left-0 right-0 flex items-start justify-center pt-1">
        <span class="text-xs font-medium text-neutral-600">
          {{ horario }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Gerar lista de horários das 8:00 às 22:00
 * Cada horário marca o INÍCIO de uma janela de agendamento
 * 8:00 = início da primeira janela, 22:00 = início da última janela
 */
const horarios = computed(() => {
  const listaHorarios: string[] = []
  // Gerar horários de 8:00 até 22:00 (15 horários total)
  // 8:00, 9:00, 10:00, ..., 21:00, 22:00
  for (let hora = 8; hora <= 22; hora++) {
    const horarioFormatado = `${hora.toString().padStart(2, '0')}:00`
    listaHorarios.push(horarioFormatado)
  }
  return listaHorarios
})
</script>