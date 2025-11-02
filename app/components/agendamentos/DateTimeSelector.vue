<template>
  <div class="space-y-4">
    <!-- Data -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-700">
        Data <span class="text-danger">*</span>
      </label>
      <select
        :modelValue="selectedDate"
        @update:modelValue="handleDateChange"
        @change="(event) => handleDateChange((event.target as HTMLSelectElement)?.value || '')"
        :disabled="availableDays.length === 0"
        class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
        :class="{
          'border-danger focus:ring-danger focus:border-danger': dateError
        }"
      >
        <option value="" v-if="availableDays.length === 0">Nenhum dia disponível esta semana</option>
        <option value="" v-else>Selecione uma data</option>
        <option 
          v-for="dia in availableDays" 
          :key="dia.toISOString()" 
          :value="formatDateForInput(dia)"
        >
          {{ formatDateForDisplay(dia) }}
        </option>
      </select>
      
      <p v-if="dateError" class="text-sm text-danger">{{ dateError }}</p>
      <p v-else-if="availableDays.length === 0" class="text-sm text-amber-600">
        ⚠️ Todos os dias desta semana já passaram. Navegue para a próxima semana.
      </p>
      
      <!-- Agendamentos existentes no dia selecionado -->
      <div v-if="existingAppointments.length > 0" class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <p class="text-sm font-medium text-amber-800 mb-2">
          ⚠️ Agendamentos já existentes neste dia:
        </p>
        <div class="space-y-1">
          <div 
            v-for="agendamento in existingAppointments" 
            :key="`${agendamento.horaInicio}-${agendamento.horaFim}`"
            class="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded"
          >
            <strong>{{ agendamento.horaInicio }} - {{ agendamento.horaFim }}</strong>
            | {{ agendamento.titulo }}
          </div>
        </div>
      </div>
    </div>

    <!-- Horários -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Hora Início -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Hora Início <span class="text-danger">*</span>
        </label>
        <select
          :modelValue="startTime"
          @update:modelValue="handleStartTimeChange"
          @change="(event) => handleStartTimeChange((event.target as HTMLSelectElement)?.value || '')"
          :disabled="!selectedDate || availableStartTimes.length === 0"
          class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
          :class="{
            'border-danger focus:ring-danger focus:border-danger': startTimeError
          }"
        >
        <option value="" v-if="!selectedDate">Selecione uma data primeiro</option>
        <option value="" v-else-if="availableStartTimes.length === 0">Nenhum horário disponível</option>
        <option value="" v-else>Selecione um horário (8:00 - 21:30)</option>
          <option 
            v-for="hora in availableStartTimes" 
            :key="hora" 
            :value="hora"
          >
            {{ hora }}
          </option>
        </select>
        <p v-if="startTimeError" class="text-sm text-danger">{{ startTimeError }}</p>
        <p v-else class="text-xs text-neutral-500">Horários de :00 e :30 minutos</p>
      </div>

      <!-- Hora Fim -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Hora Fim <span class="text-danger">*</span>
        </label>
        <select
          :modelValue="endTime"
          @update:modelValue="handleEndTimeChange"
          @change="(event) => handleEndTimeChange((event.target as HTMLSelectElement)?.value || '')"
          :disabled="!startTime"
          class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
          :class="{
            'border-danger focus:ring-danger focus:border-danger': endTimeError
          }"
        >
          <option value="">Selecione horário de fim (até 22:00)</option>
          <option 
            v-for="hora in availableEndTimes" 
            :key="hora" 
            :value="hora"
          >
            {{ hora }}
          </option>
        </select>
        <p v-if="endTimeError" class="text-sm text-danger">{{ endTimeError }}</p>
        <p v-else class="text-xs text-neutral-500">Última consulta até 22:00</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  selectedDate: string
  startTime: string
  endTime: string
  weekDays: Date[]
  appointments: any[]
  dateError?: string
  startTimeError?: string
  endTimeError?: string
}

const props = withDefaults(defineProps<Props>(), {
  dateError: '',
  startTimeError: '',
  endTimeError: ''
})

const emit = defineEmits<{
  'update:selectedDate': [value: string]
  'update:startTime': [value: string]
  'update:endTime': [value: string]
}>()

// Dias disponíveis (filtra dias que já passaram)
const availableDays = computed(() => {
  if (!props.weekDays || props.weekDays.length === 0) {
    return []
  }
  
  const hoje = new Date()
  const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  
  return props.weekDays.filter(dia => {
    const diaInicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate())
    return diaInicio >= hojeInicio
  })
})

// Horários disponíveis (intervalos de 30 minutos, 8:00h às 21:30h para início)
const availableStartTimes = computed(() => {
  // Gerar todos os horários possíveis (8:00 às 21:30 para permitir consultas até 22:00)
  const todosHorarios = []
  for (let h = 8; h <= 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = h.toString().padStart(2, '0')
      const minuto = m.toString().padStart(2, '0')
      todosHorarios.push(`${hora}:${minuto}`)
    }
  }
  
  if (!props.selectedDate || props.selectedDate === '') {
    return todosHorarios
  }
  
  const dataSelecionada = new Date(props.selectedDate + 'T00:00:00')
  const hoje = new Date()
  
  // Filtrar horários que já passaram (se for hoje)
  let horariosValidos = todosHorarios
  if (dataSelecionada.toDateString() === hoje.toDateString()) {
    const horaAtual = hoje.getHours()
    const minutoAtual = hoje.getMinutes()
    
    horariosValidos = todosHorarios.filter(horario => {
      const partes = horario.split(':').map(Number)
      const h = partes[0]
      const m = partes[1]
      
      if (h === undefined || m === undefined) return false
      
      const horarioMinutos = h * 60 + m
      const agora = horaAtual * 60 + minutoAtual
      
      // Permitir apenas horários que sejam pelo menos 1 hora no futuro
      return horarioMinutos >= agora + 60
    })
  }
  
  // Filtrar horários ocupados
  if (props.appointments && props.appointments.length > 0) {
    const agendamentosDoDia = props.appointments.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.dataInicio)
      return dataAgendamento.toDateString() === dataSelecionada.toDateString()
    })
    
    agendamentosDoDia.forEach(agendamento => {
      const inicioAgendamento = new Date(agendamento.dataInicio)
      const fimAgendamento = new Date(agendamento.dataFim)
      
      horariosValidos = horariosValidos.filter(horario => {
        const partes = horario.split(':').map(Number)
        const h = partes[0]
        const m = partes[1]
        
        if (h === undefined || m === undefined) return false
        
        const horarioMinutos = h * 60 + m
        const inicioMinutos = inicioAgendamento.getHours() * 60 + inicioAgendamento.getMinutes()
        const fimMinutos = fimAgendamento.getHours() * 60 + fimAgendamento.getMinutes()
        
        return horarioMinutos < inicioMinutos || horarioMinutos >= fimMinutos
      })
    })
  }
  
  return horariosValidos
})

// Horários de fim disponíveis
const availableEndTimes = computed(() => {
  if (!props.startTime || !props.selectedDate) return []
  
  const partesInicio = props.startTime.split(':').map(Number)
  if (partesInicio.length !== 2) return []
  
  const [horaInicio, minutoInicio] = partesInicio
  if (horaInicio === undefined || minutoInicio === undefined) return []
  
  const inicioMinutos = horaInicio * 60 + minutoInicio
  const dataSelecionada = new Date(props.selectedDate + 'T00:00:00')
  
  // Gerar todos os horários possíveis após o início (até 22:00)
  const horariosDisponiveis = []
  for (let h = 8; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      // Para 22:00, só permitir 22:00 (não 22:30)
      if (h === 22 && m > 0) break
      
      const totalMinutos = h * 60 + m
      
      // Só incluir horários que sejam pelo menos 30 min após o início
      if (totalMinutos > inicioMinutos) {
        const hora = h.toString().padStart(2, '0')
        const minuto = m.toString().padStart(2, '0')
        horariosDisponiveis.push(`${hora}:${minuto}`)
      }
    }
  }
  
  // Filtrar conflitos com agendamentos existentes
  if (!props.appointments || props.appointments.length === 0) {
    return horariosDisponiveis
  }
  
  // Buscar agendamentos do mesmo dia
  const agendamentosDoDia = props.appointments.filter(agendamento => {
    const dataAgendamento = new Date(agendamento.dataInicio)
    return dataAgendamento.toDateString() === dataSelecionada.toDateString()
  })
  
  if (agendamentosDoDia.length === 0) {
    return horariosDisponiveis
  }
  
  // Para cada horário de fim possível, verificar se geraria conflito
  return horariosDisponiveis.filter(horarioFim => {
    const partesFim = horarioFim.split(':').map(Number)
    const [horaFim, minutoFim] = partesFim
    if (horaFim === undefined || minutoFim === undefined) return false
    
    const fimMinutos = horaFim * 60 + minutoFim
    
    // Verificar se o novo agendamento (inicioMinutos até fimMinutos) conflita
    return !agendamentosDoDia.some(agendamento => {
      const inicioExistente = new Date(agendamento.dataInicio)
      const fimExistente = new Date(agendamento.dataFim)
      
      const inicioExistenteMinutos = inicioExistente.getHours() * 60 + inicioExistente.getMinutes()
      const fimExistenteMinutos = fimExistente.getHours() * 60 + fimExistente.getMinutes()
      
      // Há conflito se:
      // 1. O novo início está dentro de um agendamento existente: inicioMinutos < fimExistenteMinutos && inicioMinutos >= inicioExistenteMinutos
      // 2. O novo fim está dentro de um agendamento existente: fimMinutos > inicioExistenteMinutos && fimMinutos <= fimExistenteMinutos
      // 3. O novo agendamento engloba um existente: inicioMinutos <= inicioExistenteMinutos && fimMinutos >= fimExistenteMinutos
      
      const novoInicioConflita = inicioMinutos < fimExistenteMinutos && inicioMinutos >= inicioExistenteMinutos
      const novoFimConflita = fimMinutos > inicioExistenteMinutos && fimMinutos <= fimExistenteMinutos
      const novoEnglobaExistente = inicioMinutos <= inicioExistenteMinutos && fimMinutos >= fimExistenteMinutos
      
      return novoInicioConflita || novoFimConflita || novoEnglobaExistente
    })
  })
})

// Agendamentos existentes no dia
const existingAppointments = computed(() => {
  if (!props.selectedDate || !props.appointments) return []
  
  const dataSelecionada = new Date(props.selectedDate + 'T00:00:00')
  
  return props.appointments.filter(agendamento => {
    const dataAgendamento = new Date(agendamento.dataInicio)
    return dataAgendamento.toDateString() === dataSelecionada.toDateString()
  }).map(agendamento => {
    const inicio = new Date(agendamento.dataInicio)
    const fim = new Date(agendamento.dataFim)
    
    return {
      titulo: agendamento.titulo || 'Agendamento',
      horaInicio: inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      horaFim: fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
})

// Funções de formatação
const formatDateForInput = (data: Date): string => {
  const isoString = data.toISOString().split('T')[0]
  return isoString || ''
}

const formatDateForDisplay = (data: Date): string => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const diaSemana = diasSemana[data.getDay()]
  const dataFormatada = data.toLocaleDateString('pt-BR')
  return `${diaSemana}, ${dataFormatada}`
}

// Handlers
const handleDateChange = (date: string) => {
  emit('update:selectedDate', date)
  emit('update:startTime', '')
  emit('update:endTime', '')
}

const handleStartTimeChange = (time: string) => {
  emit('update:startTime', time)
  emit('update:endTime', '')
}

const handleEndTimeChange = (time: string) => {
  emit('update:endTime', time)
}
</script>