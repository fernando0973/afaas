<template>
  <div class="flex flex-col bg-neutral-200 rounded-b-lg" style="height: 100%;">
    <!-- Área dos slots de agendamento com posicionamento absoluto -->
    <div class="relative" style="height: 100%; overflow: hidden;">
      <AgendamentoSlot
        v-for="(agendamento, index) in agendamentosDoDia"
        :key="agendamento.id"
        :agendamento="agendamento"
        :style="calcularPosicaoAgendamento(agendamento)"
        class="absolute left-1 right-1"
        @click="$emit('agendamento-click', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AgendamentoSlot from './AgendamentoSlot.vue'
import type { AgendamentoFormatado } from '~/composables/useAgendamentos'

interface Props {
  data: Date
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'agendamento-click': [agendamento: AgendamentoFormatado]
}>()

// ===== INJECT DOS DADOS DO COMPONENTE PAI =====

/**
 * Função injetada do AgendamentoManager para obter agendamentos do dia
 * Evita busca desnecessária no banco - dados já estão carregados no pai
 */
const obterAgendamentosDoDia = inject<(data: Date) => AgendamentoFormatado[]>('agendamentosDoDia')
const carregandoAgendamentos = inject<any>('carregandoAgendamentos')
const erroAgendamentos = inject<any>('erroAgendamentos')

// Validação se os dados foram injetados corretamente
if (!obterAgendamentosDoDia) {
  throw new Error('AgendamentoItemSlot deve ser usado dentro de AgendamentoManager')
}

// ===== LÓGICA SIMPLIFICADA =====
// Não precisamos mais buscar dados - eles vêm do componente pai via inject

/**
 * Constantes para cálculo de posicionamento
 */
const HORA_INICIO = 8   // 8:00h - primeira hora da régua
const HORA_FIM = 22     // 22:00h - última hora da régua
const TOTAL_SLOTS = 15  // 15 slots de horário (8:00 até 22:00)

/**
 * Calcular posição e tamanho do agendamento baseado na régua de horários
 * Cada slot na régua representa 1 hora (1/15 da altura total)
 * 8:00 = posição 0%, 9:00 = posição 6.67%, etc.
 */
const calcularPosicaoAgendamento = (agendamento: AgendamentoFormatado) => {
  const horaInicio = agendamento.dataInicio.getHours() + (agendamento.dataInicio.getMinutes() / 60)
  const horaFim = agendamento.dataFim.getHours() + (agendamento.dataFim.getMinutes() / 60)
  
  // Calcular posição baseada em slots de 1 hora
  // Cada slot ocupa (100% / 15 slots) = 6.67% da altura
  const slotInicio = horaInicio - HORA_INICIO  // Ex: 9:00 = slot 1, 10:30 = slot 2.5
  const duracao = horaFim - horaInicio         // Ex: 1.5 horas
  
  const posicaoTopo = (slotInicio / TOTAL_SLOTS) * 100
  const altura = (duracao / TOTAL_SLOTS) * 100
  
  return {
    top: `${Math.max(0, posicaoTopo)}%`,
    height: `${Math.max(1, altura)}%`
  }
}

/**
 * Computed para obter agendamentos do dia específico
 * Usa a função injetada do componente pai - dados já filtrados e otimizados
 */
const agendamentosDoDia = computed(() => {
  if (!props.data || !obterAgendamentosDoDia) return []
  
  return obterAgendamentosDoDia(props.data)
})
</script>