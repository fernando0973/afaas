<template>
  <div class="relative flex flex-col h-full">
    <div
      v-for="(hora, index) in blocosHorarios"
      :key="hora"
      :class="[
        'relative flex-1 border-neutral-200',
        index !== blocosHorarios.length - 1 ? 'border-b' : ''
      ]"
    >
      <div class="absolute inset-x-0 top-0 flex justify-center pt-1">
        <span class="text-xs font-medium text-neutral-600">
          {{ formatarHora(hora) }}
        </span>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
      <span class="text-xs font-medium text-neutral-600">
        {{ horarioFinal }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const HORA_INICIO = 8
const HORA_FIM = 22

const blocosHorarios = computed(() => Array.from({ length: HORA_FIM - HORA_INICIO }, (_, index) => HORA_INICIO + index))
const horarioFinal = `${HORA_FIM.toString().padStart(2, '0')}:00`

const formatarHora = (hora: number) => `${hora.toString().padStart(2, '0')}:00`
</script>