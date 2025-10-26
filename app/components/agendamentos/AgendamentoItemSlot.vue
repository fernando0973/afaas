<template>
  <div class="flex flex-col h-full bg-neutral-200 rounded-b-lg">
    <!-- Área dos slots de agendamento com posicionamento absoluto -->
    <div class="relative flex-1 overflow-hidden">
      <AgendamentoSlot
        v-for="(agendamento, index) in agendamentosDoDia"
        :key="agendamento.id"
        :data-inicio="agendamento.dataInicio"
        :data-fim="agendamento.dataFim"
        :titulo="agendamento.titulo"
        :descricao="agendamento.descricao"
        :cor-index="index"
        :style="calcularPosicaoAgendamento(agendamento)"
        class="absolute left-1 right-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AgendamentoSlot from './AgendamentoSlot.vue'

interface Props {
  data: Date
}

interface AgendamentoMock {
  id: string
  dataInicio: Date
  dataFim: Date
  titulo: string
  descricao: string
}

const props = defineProps<Props>()

/**
 * Formatar data no formato dd/MM
 * @param data - Objeto Date
 * @returns String formatada (ex: "26/10")
 */
const formatarDataCompleta = (data: Date): string => {
  if (!data) return '--/--'
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  return `${dia}/${mes}`
}



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
const calcularPosicaoAgendamento = (agendamento: AgendamentoMock) => {
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
 * Computed para gerar agendamentos mocados simples para cada dia
 */
const agendamentosDoDia = computed(() => {
  if (!props.data) return []
  
  // Verificar se a data está no período específico de 26/10/2025 a 01/11/2025
  const dataAtual = props.data
  const inicioSemana = new Date(2025, 9, 26) // 26/10/2025 (mês é 0-indexado, outubro = 9)
  const fimSemana = new Date(2025, 10, 1)   // 01/11/2025 (novembro = 10)
  
  // Se a data não estiver no período específico, retornar array vazio
  if (dataAtual < inicioSemana || dataAtual > fimSemana) {
    return []
  }
  
  const ano = props.data.getFullYear()
  const mes = props.data.getMonth()
  const dia = props.data.getDate()
  
  // Agendamentos específicos para cada data no período 26/10 a 01/11/2025
  const agendamentosPorData: { [key: string]: any[] } = {
    // 26/10/2025 - Sábado
    '2025-9-26': [
      { titulo: 'José Martins', descricao: 'Consulta de rotina', horaInicio: 8.5, duracaoHoras: 1.5 },
      { titulo: 'Ana Costa', descricao: 'Check-up geral completo', horaInicio: 15, duracaoHoras: 2.5 }
    ],
    // 27/10/2025 - Domingo  
    '2025-9-27': [
      { titulo: 'João Silva', descricao: 'Consulta de rotina', horaInicio: 9, duracaoHoras: 1.5 },
      { titulo: 'Maria Santos', descricao: 'Revisão de tratamento', horaInicio: 14, duracaoHoras: 2 }
    ],
    // 28/10/2025 - Segunda
    '2025-9-28': [
      { titulo: 'Pedro Costa', descricao: 'Primeira consulta', horaInicio: 8, duracaoHoras: 1.5 },
      { titulo: 'Ana Paula', descricao: 'Acompanhamento mensal', horaInicio: 16, duracaoHoras: 1.5 }
    ],
    // 29/10/2025 - Terça
    '2025-9-29': [
      { titulo: 'Carlos Oliveira', descricao: 'Consulta de urgência', horaInicio: 10, duracaoHoras: 2 }
    ],
    // 30/10/2025 - Quarta
    '2025-9-30': [
      { titulo: 'Lucia Ferreira', descricao: 'Exame de rotina', horaInicio: 11, duracaoHoras: 1.5 },
      { titulo: 'Roberto Lima', descricao: 'Consulta de retorno', horaInicio: 15, duracaoHoras: 1.5 }
    ],
    // 31/10/2025 - Quinta
    '2025-9-31': [
      { titulo: 'Sandra Alves', descricao: 'Acompanhamento semanal', horaInicio: 9, duracaoHoras: 2 }
    ],
    // 01/11/2025 - Sexta
    '2025-10-1': [
      { titulo: 'Miguel Souza', descricao: 'Consulta preventiva', horaInicio: 13, duracaoHoras: 1.5 },
      { titulo: 'Fernanda Cruz', descricao: 'Avaliação especializada', horaInicio: 18, duracaoHoras: 2 }
    ]
  }
  
  const chaveData = `${ano}-${mes}-${dia}`
  const agendamentosDoDia = agendamentosPorData[chaveData] || []
  
  const resultado = agendamentosDoDia.map((agendamento, index) => {
    const horaInicioDecimal = agendamento.horaInicio
    const horaFimDecimal = agendamento.horaInicio + agendamento.duracaoHoras
    
    // Converter horas decimais para Date objects
    const horas = Math.floor(horaInicioDecimal)
    const minutos = (horaInicioDecimal % 1) * 60
    const horasFim = Math.floor(horaFimDecimal)
    const minutosFim = (horaFimDecimal % 1) * 60
    
    return {
      id: `${ano}-${mes}-${dia}-${index}`,
      dataInicio: new Date(ano, mes, dia, horas, minutos),
      dataFim: new Date(ano, mes, dia, horasFim, minutosFim),
      titulo: agendamento.titulo,
      descricao: agendamento.descricao
    }
  })
  
  // Debug
  console.log(`Dia ${formatarDataCompleta(props.data)}:`, resultado.length, 'agendamentos')
  
  return resultado
})
</script>