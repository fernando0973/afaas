<template>
  <div class="flex flex-col h-full border-r border-neutral-100 last:border-r-0">
    <!-- Área dos slots de agendamento com posicionamento absoluto -->
    <div class="relative flex-1 overflow-hidden">
      <AgendamentoSlot
        v-for="agendamento in agendamentosDoDia"
        :key="agendamento.id"
        :data-inicio="agendamento.dataInicio"
        :data-fim="agendamento.dataFim"
        :titulo="agendamento.titulo"
        :descricao="agendamento.descricao"
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
  
  // Criar agendamentos mocados simples baseados no dia da semana
  const diaDaSemana = props.data.getDay() // 0=domingo, 1=segunda...
  const ano = props.data.getFullYear()
  const mes = props.data.getMonth()
  const dia = props.data.getDate()
  
  // Dados diferentes para cada dia da semana - agora com horários e durações variadas
  const mockData = [
    // Domingo (0)
    [
      { titulo: 'João Silva', descricao: 'Consulta de rotina', horaInicio: 9, duracaoHoras: 1 },
      { titulo: 'Maria Santos', descricao: 'Revisão de tratamento', horaInicio: 14, duracaoHoras: 2 }
    ],
    // Segunda (1) 
    [
      { titulo: 'Pedro Costa', descricao: 'Primeira consulta', horaInicio: 8, duracaoHoras: 1.5 },
      { titulo: 'Ana Paula', descricao: 'Acompanhamento mensal', horaInicio: 16, duracaoHoras: 1 }
    ],
    // Terça (2)
    [
      { titulo: 'Carlos Oliveira', descricao: 'Consulta de urgência', horaInicio: 10, duracaoHoras: 2 }
    ],
    // Quarta (3)
    [
      { titulo: 'Lucia Ferreira', descricao: 'Exame de rotina', horaInicio: 11, duracaoHoras: 1 },
      { titulo: 'Roberto Lima', descricao: 'Consulta de retorno', horaInicio: 15, duracaoHoras: 1.5 }
    ],
    // Quinta (4)
    [
      { titulo: 'Sandra Alves', descricao: 'Acompanhamento semanal', horaInicio: 9, duracaoHoras: 2 }
    ],
    // Sexta (5)
    [
      { titulo: 'Miguel Souza', descricao: 'Consulta preventiva', horaInicio: 13, duracaoHoras: 1 },
      { titulo: 'Fernanda Cruz', descricao: 'Avaliação especializada', horaInicio: 18, duracaoHoras: 2.5 }
    ],
    // Sábado (6)
    [
      { titulo: 'José Martins', descricao: 'Consulta de rotina', horaInicio: 8.5, duracaoHoras: 1 },
      { titulo: 'Ana Costa', descricao: 'Check-up geral', horaInicio: 15, duracaoHoras: 3 }
    ]
  ]
  
  const agendamentosDoDia = mockData[diaDaSemana] || []
  
  const resultado = agendamentosDoDia.map((agendamento, index) => {
    const horaInicioDecimal = agendamento.horaInicio
    const horaFimDecimal = agendamento.horaInicio + agendamento.duracaoHoras
    
    // Converter horas decimais para Date objects
    const horas = Math.floor(horaInicioDecimal)
    const minutos = (horaInicioDecimal % 1) * 60
    const horasFim = Math.floor(horaFimDecimal)
    const minutosFim = (horaFimDecimal % 1) * 60
    
    return {
      id: `${dia}-${diaDaSemana}-${index}`,
      dataInicio: new Date(ano, mes, dia, horas, minutos),
      dataFim: new Date(ano, mes, dia, horasFim, minutosFim),
      titulo: agendamento.titulo,
      descricao: agendamento.descricao
    }
  })
  
  // Debug
  console.log(`Dia ${formatarDataCompleta(props.data)} (${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][diaDaSemana]}):`, resultado.length, 'agendamentos')
  
  return resultado
})
</script>