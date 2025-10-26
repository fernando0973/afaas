<template>
  <div class="flex flex-col h-screen max-h-screen overflow-hidden">
    <!-- Header - altura ajustável -->
    <div class="pt-3 pb-3 px-6 flex-shrink-0">
      <!-- Primeira linha: 3 componentes principais -->
      <div class="h-[80px] grid grid-cols-3 items-center mb-6">
        <!-- Lado esquerdo: Controlador de navegação -->
        <div class="flex justify-start">
          <AgendamentoControlador />
        </div>
        
        <!-- Centro: Informações do profissional -->
        <div class="flex justify-center">
          <AgendamentoProfissionalInfo />
        </div>
        
        <!-- Lado direito: Botão para novo agendamento -->
        <div class="flex justify-end pr-4">
          <BaseButton 
            variant="primary"
            @click="novoAgendamento"
          >
            <template #iconLeft>
              <PlusIcon class="w-4 h-4" />
            </template>
            Novo
          </BaseButton>
        </div>
      </div>
      
      <!-- Segunda linha: Visualizador de dias -->
      <AgendamentoListaDias :dias="diasSemana" />
    </div>

    <!-- Corpo - ocupa todo o restante do espaço -->
    <div class="flex-1 flex overflow-hidden px-6 pb-2 min-h-0">
      <!-- Lado esquerdo: Régua de horários -->
      <div class="w-20 flex-shrink-0 border-r border-neutral-200">
        <AgendamentoReguaHorarios />
      </div>
      
      <!-- Lado direito: Área principal dos agendamentos -->
      <div class="flex-1 grid grid-cols-7 gap-2 overflow-hidden">
        <AgendamentoItemSlot 
          v-for="(dia, index) in diasSemana" 
          :key="index"
          :data="dia"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

// Import explícito dos componentes
import AgendamentoControlador from './AgendamentoControlador.vue'
import AgendamentoProfissionalInfo from './AgendamentoProfissionalInfo.vue'
import AgendamentoListaDias from './AgendamentoListaDias.vue'
import AgendamentoReguaHorarios from './AgendamentoReguaHorarios.vue'
import AgendamentoItemSlot from './AgendamentoItemSlot.vue'

// Acessar o store de agendamento
const agendamentoStore = useAgendamentoStore()
const { diasSemana } = storeToRefs(agendamentoStore)

// Função para criar novo agendamento
const novoAgendamento = () => {
  console.log('Novo agendamento clicado')
  // TODO: Implementar modal de novo agendamento
}

// Componente principal para gerenciar agendamentos
// Será expandido conforme necessário
</script>