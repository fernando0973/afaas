import { computed } from 'vue'
import type { AgendamentoFormatado } from '~/composables/useAgendamentos'

export const useDateTimeSelector = (
  weekDays: Date[], 
  appointments: AgendamentoFormatado[], 
  selectedDate: string, 
  startTime: string
) => {
  // Dias disponíveis (filtra dias que já passaram)
  const availableDays = computed(() => {
    if (!weekDays || weekDays.length === 0) return []
    
    const hoje = new Date()
    const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    
    return weekDays.filter(dia => {
      const diaInicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate())
      return diaInicio >= hojeInicio
    })
  })

  // Horários disponíveis (intervalos de 30 minutos, 8:00h às 22:00h)
  const availableStartTimes = computed(() => {
    // Gerar todos os horários possíveis (8:00 às 22:00)
    const todosHorarios = []
    for (let h = 8; h <= 22; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 22 && m > 0) break // Para 22h, só adicionar 22:00
        
        const hora = h.toString().padStart(2, '0')
        const minuto = m.toString().padStart(2, '0')
        todosHorarios.push(`${hora}:${minuto}`)
      }
    }
    
    if (!selectedDate) return todosHorarios
    
    const dataSelecionada = new Date(selectedDate + 'T00:00:00')
    const hoje = new Date()
    
    // Filtrar horários que já passaram (se for hoje)
    let horariosValidos = todosHorarios
    if (dataSelecionada.toDateString() === hoje.toDateString()) {
      const horaAtual = hoje.getHours()
      const minutoAtual = hoje.getMinutes()
      
      horariosValidos = todosHorarios.filter(horario => {
        const [h, m] = horario.split(':').map(Number)
        if (h === undefined || m === undefined) return false
        
        if (h > horaAtual) return true
        if (h === horaAtual) return m > minutoAtual + 30
        return false
      })
    }
    
    // Filtrar horários ocupados por agendamentos existentes
    if (appointments && appointments.length > 0) {
      const agendamentosDoDia = appointments.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.dataInicio)
        return dataAgendamento.toDateString() === dataSelecionada.toDateString()
      })
      
      agendamentosDoDia.forEach(agendamento => {
        const inicioAgendamento = new Date(agendamento.dataInicio)
        const fimAgendamento = new Date(agendamento.dataFim)
        
        horariosValidos = horariosValidos.filter(horario => {
          const [h, m] = horario.split(':').map(Number)
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
    if (!startTime || !selectedDate) return []
    
    const [horaInicio, minutoInicio] = startTime.split(':').map(Number)
    if (horaInicio === undefined || minutoInicio === undefined) return []
    
    const inicioMinutos = horaInicio * 60 + minutoInicio
    const dataSelecionada = new Date(selectedDate + 'T00:00:00')
    
    // Gerar todos os horários possíveis após o início
    const todosHorarios = []
    for (let h = 8; h <= 22; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 22 && m > 0) break
        
        const hora = h.toString().padStart(2, '0')
        const minuto = m.toString().padStart(2, '0')
        const totalMinutos = h * 60 + m
        
        if (totalMinutos > inicioMinutos) {
          todosHorarios.push(`${hora}:${minuto}`)
        }
      }
    }
    
    // Filtrar baseado em agendamentos existentes
    if (appointments && appointments.length > 0) {
      const agendamentosDoDia = appointments.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.dataInicio)
        return dataAgendamento.toDateString() === dataSelecionada.toDateString()
      })
      
      let limiteMaximo: number | null = null
      
      agendamentosDoDia.forEach(agendamento => {
        const inicioAgendamento = new Date(agendamento.dataInicio)
        const inicioMinutosAgendamento = inicioAgendamento.getHours() * 60 + inicioAgendamento.getMinutes()
        
        if (inicioMinutos >= inicioMinutosAgendamento) {
          limiteMaximo = inicioMinutos
          return
        }
        
        if (inicioMinutosAgendamento > inicioMinutos) {
          if (limiteMaximo === null || inicioMinutosAgendamento < limiteMaximo) {
            limiteMaximo = inicioMinutosAgendamento
          }
        }
      })
      
      if (limiteMaximo !== null) {
        return todosHorarios.filter(hora => {
          const [h, m] = hora.split(':').map(Number)
          if (h === undefined || m === undefined) return false
          
          const totalMinutos = h * 60 + m
          return totalMinutos <= limiteMaximo!
        })
      }
    }
    
    return todosHorarios
  })

  // Agendamentos existentes no dia selecionado
  const existingAppointments = computed(() => {
    if (!selectedDate || !appointments) return []
    
    const dataSelecionada = new Date(selectedDate + 'T00:00:00')
    
    return appointments.filter(agendamento => {
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

  // Função para formatar data para input (YYYY-MM-DD)
  const formatDateForInput = (data: Date): string => {
    return data.toISOString().split('T')[0] || ''
  }

  // Função para formatar data para exibição
  const formatDateForDisplay = (data: Date): string => {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const diaSemana = diasSemana[data.getDay()]
    const dataFormatada = data.toLocaleDateString('pt-BR')
    return `${diaSemana}, ${dataFormatada}`
  }

  return {
    availableDays,
    availableStartTimes,
    availableEndTimes,
    existingAppointments,
    formatDateForInput,
    formatDateForDisplay
  }
}