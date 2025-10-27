<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex-shrink-0 px-6 pt-4 pb-3">
      <!-- Primeira linha: 3 componentes principais -->
      <div class="h-20 grid grid-cols-3 items-center mb-4">
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

    <!-- Corpo -->
    <div class="flex-1 flex overflow-hidden px-6 pb-2 min-h-0">
      <!-- Lado esquerdo: Régua de horários -->
      <div class="w-20 flex-shrink-0 border-r border-neutral-200">
        <AgendamentoReguaHorarios />
      </div>
      
      <!-- Lado direito: Área principal dos agendamentos -->
      <div class="flex-1 overflow-hidden" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
        <AgendamentoItemSlot 
          v-for="(dia, index) in diasSemana" 
          :key="index"
          :data="dia"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-shrink-0 px-6 py-2 border-t border-neutral-200 bg-neutral-50">
      <div class="flex items-center justify-center text-xs text-neutral-600">
        <!-- Informações do sistema -->
        <div class="flex items-center space-x-4">
          <span class="font-medium">AFAAS Atendimento v1.0</span>
          <span>Sistema de Agendamentos</span>
        </div>
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