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
  throw new Error('AgendamentoItemAgendamento deve ser usado dentro de AgendamentoManager')
}

// ===== LÓGICA SIMPLIFICADA =====
// Não precisamos mais buscar dados - eles vêm do componente pai via inject

/**
 * Constantes para cálculo de posicionamento
 */
const HORA_INICIO = 8   // 8:00h - primeira hora da régua
const HORA_FIM = 22     // 22:00h - última hora da régua
const TOTAL_MINUTOS = (HORA_FIM - HORA_INICIO) * 60
const DURACAO_MINIMA_MINUTOS = 15

/**
 * Calcular posição e tamanho do agendamento baseado na régua de horários
 * A régua tem 15 slots (8:00-22:00), cada um com height: 1/15 = 6.667%
 * Cada slot da régua usa flex-1, então distribui igualmente o espaço
 */
const normalizarMinutos = (data: Date) => {
  const horas = data.getHours()
  const minutos = data.getMinutes()
  const total = ((horas - HORA_INICIO) * 60) + minutos
  return Math.min(Math.max(total, 0), TOTAL_MINUTOS)
}

const calcularPosicaoAgendamento = (agendamento: AgendamentoFormatado) => {
  const inicioNormalizado = normalizarMinutos(agendamento.dataInicio)
  const fimNormalizado = Math.max(normalizarMinutos(agendamento.dataFim), inicioNormalizado + DURACAO_MINIMA_MINUTOS)

  const duracao = Math.min(fimNormalizado - inicioNormalizado, TOTAL_MINUTOS)

  const posicaoTopo = (inicioNormalizado / TOTAL_MINUTOS) * 100
  const altura = (duracao / TOTAL_MINUTOS) * 100

  return {
    top: `${posicaoTopo}%`,
    height: `${altura}%`
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