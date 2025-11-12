<template>
  <div class="mt-2">
    <div class="flex">
      <!-- Espaçador para alinhar com a régua de horários (mesma largura w-20) -->
      <div class="w-20 flex-shrink-0"></div>
      
      <!-- Grid dos dias da semana -->
      <div class="flex-1 grid grid-cols-7 gap-2">
        <AgendamentoItemDia 
          v-for="(dia, index) in dias" 
          :key="index"
          :data="dia"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import do componente filho
import AgendamentoItemDia from './AgendamentoItemDia.vue'

interface Props {
  dias: Date[]
}

const props = defineProps<Props>()
</script>