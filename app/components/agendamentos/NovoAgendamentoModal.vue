<template>
  <BaseModal
    v-model="isOpen"
    title="Novo Agendamento"
    subtitle="Preencha as informações para criar um novo agendamento"
    size="lg"
    :loading="loading"
    :confirm-disabled="!isFormValid"
    confirm-button-text="Criar Agendamento"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Profissional (Read-only) -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Profissional
        </label>
        <div class="bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2">
          <div v-if="profissionalAtual" class="flex items-center space-x-2">
            <div class="flex-1">
              <p class="text-sm font-medium text-neutral-900">
                {{ profissionalAtual.nome_profissional }}
              </p>
              <p class="text-xs text-neutral-500">
                {{ profissionalAtual.especialidade }}
              </p>
            </div>
            <span class="text-xs bg-neutral-100 px-2 py-1 rounded">
              ID: {{ profissionalAtual.profissional_id }}
            </span>
          </div>
          <div v-else class="text-sm text-neutral-500">
            Nenhum profissional selecionado
          </div>
        </div>
      </div>

      <!-- Cliente -->
      <div class="space-y-2 relative">
        <label class="block text-sm font-medium text-neutral-700">
          Cliente <span class="text-danger">*</span>
        </label>
        
        <!-- Input pesquisável -->
        <div class="relative">
          <input
            v-model="buscaCliente"
            @focus="abrirDropdownCliente"
            @blur="fecharDropdownCliente"
            @input="filtrarClientes"
            :disabled="carregandoClientes"
            :placeholder="carregandoClientes ? 'Carregando clientes...' : 'Digite para pesquisar ou selecionar cliente'"
            class="w-full px-3 py-2 pr-8 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            :class="{
              'border-danger focus:ring-danger focus:border-danger': errors.clienteId,
              'bg-neutral-100 cursor-not-allowed': carregandoClientes
            }"
          />
          
          <!-- Ícone dropdown -->
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <!-- Dropdown com clientes filtrados -->
          <div
            v-if="dropdownClienteAberto && clientesFiltrados.length > 0"
            class="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <!-- Lista de clientes -->
            <div
              v-for="cliente in clientesFiltrados"
              :key="cliente.id"
              @mousedown="selecionarCliente(cliente)"
              class="px-3 py-2 cursor-pointer hover:bg-neutral-50 border-b border-neutral-100"
              :class="{
                'bg-primary-50 text-primary-700': form.clienteId === cliente.id.toString()
              }"
            >
              <div class="font-medium">{{ cliente.nome_completo }}</div>
              <div v-if="cliente.cpf" class="text-xs text-neutral-500">
                CPF: {{ formatarCPF(cliente.cpf) }}
              </div>
            </div>
            
            <!-- Link para cadastrar novo cliente (sempre visível) -->
            <div class="border-t border-neutral-100 p-2">
              <button
                @mousedown="adicionarNovoCliente"
                type="button"
                class="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-md transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Cadastrar novo cliente</span>
              </button>
            </div>
          </div>
          
          <!-- Mensagem quando não há resultados + link para novo cliente -->
          <div
            v-if="dropdownClienteAberto && clientesFiltrados.length === 0 && buscaCliente.length > 0"
            class="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg"
          >
            <div class="px-3 py-2 text-neutral-500 text-center">
              Nenhum cliente encontrado para "{{ buscaCliente }}"
            </div>
            <div class="border-t border-neutral-100 px-3 py-2">
              <button
                @mousedown="adicionarNovoCliente"
                type="button"
                class="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Cadastrar novo cliente</span>
              </button>
            </div>
          </div>
        </div>
        
        <p v-if="errors.clienteId" class="text-sm text-danger">
          {{ errors.clienteId }}
        </p>
        
        <!-- Link discreto para cadastrar cliente (sempre visível) -->
        <p class="text-xs text-neutral-500">
          Não encontra o cliente? 
          <button 
            @click="adicionarNovoCliente" 
            type="button"
            class="text-primary-600 hover:text-primary-700 underline font-medium"
          >
            Cadastre um novo cliente
          </button>
        </p>
      </div>

      <!-- Título -->
      <BaseInput
        v-model="form.titulo"
        label="Título"
        placeholder="Ex: Consulta inicial, Retorno, etc."
        required
        :error="errors.titulo"
      />

      <!-- Descrição -->
      <BaseTextarea
        v-model="form.descricao"
        label="Descrição"
        placeholder="Descreva detalhes sobre o agendamento (opcional)"
        :rows="3"
        :error="errors.descricao"
      />

      <!-- Seletor de Cor -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Cor do Agendamento
        </label>
        <div class="space-y-3">
          <!-- Cores Predefinidas -->
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="cor in coresPredefinidas"
              :key="cor.valor"
              @click="selecionarCor(cor.valor)"
              :title="cor.nome"
              class="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
              :class="{
                'border-neutral-800 ring-2 ring-primary-500': form.cor === cor.valor,
                'border-neutral-300': form.cor !== cor.valor
              }"
              :style="{ backgroundColor: cor.valor }"
            />
          </div>
          
          <!-- Cor Personalizada -->
          <div class="flex items-center space-x-3">
            <label class="text-sm text-neutral-600">Personalizada:</label>
            <div class="relative">
              <input
                type="color"
                v-model="form.cor"
                class="w-10 h-8 border border-neutral-300 rounded cursor-pointer"
                title="Escolher cor personalizada"
              >
            </div>
            <span class="text-xs font-mono text-neutral-500 uppercase">{{ form.cor }}</span>
          </div>
        </div>
      </div>

      <!-- Data -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-700">
          Data <span class="text-danger">*</span>
        </label>
        <select
          v-model="form.data"
          @change="onDataChange"
          :disabled="diasDisponiveis.length === 0"
          class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
          :class="{
            'border-danger focus:ring-danger focus:border-danger': errors.data
          }"
        >
          <option value="" v-if="diasDisponiveis.length === 0">Nenhum dia disponível esta semana</option>
          <option value="" v-else>Selecione uma data</option>
          <option 
            v-for="dia in diasDisponiveis" 
            :key="dia.toISOString()" 
            :value="formatarDataParaInput(dia)"
          >
            {{ formatarDataParaExibicao(dia) }}
          </option>
        </select>
        <p v-if="errors.data" class="text-sm text-danger">
          {{ errors.data }}
        </p>
        <p v-else-if="diasDisponiveis.length === 0" class="text-sm text-amber-600">
          ⚠️ Todos os dias desta semana já passaram. Navegue para a próxima semana.
        </p>
        <p v-else-if="props.diasSemanaAtual && props.diasSemanaAtual.length > diasDisponiveis.length" class="text-sm text-neutral-500">
          ℹ️ Alguns dias já passaram e não estão disponíveis para agendamento.
        </p>
        
        <!-- Agendamentos existentes no dia selecionado -->
        <div v-if="agendamentosDoDiaSelecionado.length > 0" class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p class="text-sm font-medium text-amber-800 mb-2">
            ⚠️ Agendamentos já existentes neste dia:
          </p>
          <div class="space-y-1">
            <div 
              v-for="agendamento in agendamentosDoDiaSelecionado" 
              :key="`${agendamento.horaInicio}-${agendamento.horaFim}`"
              class="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded"
            >
              <strong>{{ agendamento.horaInicio }} - {{ agendamento.horaFim }}</strong>
              | {{ agendamento.titulo }}
            </div>
          </div>
        </div>
      </div>

      <!-- Horários (só habilitados se data estiver selecionada) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Hora Início -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-neutral-700">
            Hora Início <span class="text-danger">*</span>
          </label>
          <select
            v-model="form.horaInicio"
            :disabled="!form.data || horariosDisponiveis.length === 0"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
            :class="{
              'border-danger focus:ring-danger focus:border-danger': errors.horaInicio
            }"
          >
            <option value="" v-if="!form.data">Selecione uma data primeiro</option>
            <option value="" v-else-if="horariosDisponiveis.length === 0">Nenhum horário disponível hoje</option>
            <option value="" v-else>Selecione um horário</option>
            <option 
              v-for="hora in horariosDisponiveis" 
              :key="hora" 
              :value="hora"
            >
              {{ hora }}
            </option>
          </select>
          <p v-if="errors.horaInicio" class="text-sm text-danger">
            {{ errors.horaInicio }}
          </p>
          <p v-else-if="form.data && horariosDisponiveis.length === 0" class="text-sm text-amber-600">
            ⚠️ Todos os horários de hoje já passaram
          </p>
        </div>

        <!-- Hora Fim -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-neutral-700">
            Hora Fim <span class="text-danger">*</span>
          </label>
          <select
            v-model="form.horaFim"
            :disabled="!form.horaInicio"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
            :class="{
              'border-danger focus:ring-danger focus:border-danger': errors.horaFim
            }"
          >
            <option value="">Selecione</option>
            <option 
              v-for="hora in horariosFimDisponiveis" 
              :key="hora" 
              :value="hora"
            >
              {{ hora }}
            </option>
          </select>
          <p v-if="errors.horaFim" class="text-sm text-danger">
            {{ errors.horaFim }}
          </p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { ProfissionalRPC } from '~/types/user'
import type { Cliente } from '~/types/cliente'
import type { AgendamentoFormatado } from '~/composables/useAgendamentos'

// Tipo simplificado para clientes (para o modal)
interface ClienteSimplificado {
  id: number
  nome_completo: string
}

interface Props {
  modelValue: boolean
  profissionalAtual?: ProfissionalRPC | null
  diasSemanaAtual?: Date[]
  clientes?: Cliente[]
  carregandoClientes?: boolean
  agendamentos?: AgendamentoFormatado[]
  carregandoAgendamentos?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  profissionalAtual: null,
  diasSemanaAtual: () => [],
  clientes: () => [],
  carregandoClientes: false,
  agendamentos: () => [],
  carregandoAgendamentos: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [data: any]
  cancel: []
  close: []
}>()

// ===== ESTADO REATIVO =====
const loading = ref(false)

// Estado do dropdown de clientes
const buscaCliente = ref('')
const dropdownClienteAberto = ref(false)

// Formulário
const form = ref({
  clienteId: '',
  titulo: 'Consulta',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: '',
  cor: '#DBE9FE' // Cor padrão
})

// Erros de validação
const errors = ref({
  clienteId: '',
  titulo: '',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: ''
})

// ===== CORES =====

// Cores predefinidas para seleção rápida
const coresPredefinidas = [
  { nome: 'Azul Claro (Padrão)', valor: '#DBE9FE' },
  { nome: 'Verde Água', valor: '#71E3AD' },
  { nome: 'Azul Céu', valor: '#72C1EE' },
  { nome: 'Lavanda', valor: '#E3D5FF' },
  { nome: 'Rosa Claro', valor: '#FFD5E3' },
  { nome: 'Amarelo Pastel', valor: '#FFF3C7' },
  { nome: 'Salmão', valor: '#FFB5A0' },
  { nome: 'Verde Menta', valor: '#B5F0D1' },
  { nome: 'Lilás', valor: '#E5C9FF' },
  { nome: 'Pêssego', valor: '#FFD6B8' },
  { nome: 'Azul Bebê', valor: '#B8E3FF' },
  { nome: 'Verde Lima', valor: '#D4FF8C' }
]

// Função para selecionar uma cor predefinida
const selecionarCor = (cor: string) => {
  form.value.cor = cor
}

// ===== COMPUTED =====
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Cliente selecionado
const clienteSelecionado = computed(() => {
  return props.clientes?.find((c: Cliente) => c.id === Number(form.value.clienteId))
})

// Clientes filtrados pela busca
const clientesFiltrados = computed(() => {
  if (!props.clientes || props.clientes.length === 0) return []
  
  if (!buscaCliente.value.trim()) {
    return props.clientes.slice(0, 50) // Limite inicial para performance
  }
  
  const termo = buscaCliente.value.toLowerCase().trim()
  
  return props.clientes.filter(cliente => {
    const nome = cliente.nome_completo?.toLowerCase() || ''
    const cpf = cliente.cpf?.replace(/\D/g, '') || ''
    
    return nome.includes(termo) || cpf.includes(termo.replace(/\D/g, ''))
  }).slice(0, 50) // Limite de 50 resultados
})

// Dias disponíveis (filtra dias que já passaram)
const diasDisponiveis = computed(() => {
  if (!props.diasSemanaAtual || props.diasSemanaAtual.length === 0) return []
  
  const hoje = new Date()
  const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  
  return props.diasSemanaAtual.filter(dia => {
    const diaInicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate())
    return diaInicio >= hojeInicio
  })
})

// Validação do formulário
const isFormValid = computed(() => {
  return form.value.clienteId && 
         form.value.titulo.trim() && 
         form.value.data && 
         form.value.horaInicio && 
         form.value.horaFim
})

// Horários disponíveis (intervalos de 30 minutos, 8:00h às 22:00h)
// Filtra horários no passado e horários ocupados por outros agendamentos
const horariosDisponiveis = computed(() => {
  // Gerar todos os horários possíveis (8:00 às 22:00)
  const todosHorarios = []
  for (let h = 8; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      // Para 22h, só adicionar 22:00, não 22:30
      if (h === 22 && m > 0) break
      
      const hora = h.toString().padStart(2, '0')
      const minuto = m.toString().padStart(2, '0')
      todosHorarios.push(`${hora}:${minuto}`)
    }
  }
  
  // Se não há data selecionada, retorna todos os horários
  if (!form.value.data) {
    return todosHorarios
  }
  
  const dataSelecionada = new Date(form.value.data + 'T00:00:00')
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
      
      // Se a hora é maior que a atual, está disponível
      if (h > horaAtual) return true
      // Se a hora é igual à atual, verificar os minutos (deve ser pelo menos 30min à frente)
      if (h === horaAtual) return m > minutoAtual + 30
      // Se a hora é menor que a atual, não está disponível
      return false
    })
  }
  
  // Filtrar horários ocupados por agendamentos existentes na data selecionada
  if (props.agendamentos && props.agendamentos.length > 0) {
    const agendamentosDoDia = props.agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.dataInicio)
      return dataAgendamento.toDateString() === dataSelecionada.toDateString()
    })
    
    // Para cada agendamento do dia, remover horários ocupados
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
        
        // Horário está disponível se:
        // 1. Começa antes do agendamento existente (horarioMinutos < inicioMinutos)
        // 2. Começa exatamente no fim do agendamento existente (horarioMinutos >= fimMinutos)
        return horarioMinutos < inicioMinutos || horarioMinutos >= fimMinutos
      })
    })
  }
  
  return horariosValidos
})

// Horários de fim disponíveis (baseado no horário de início selecionado e conflitos)
const horariosFimDisponiveis = computed(() => {
  if (!form.value.horaInicio || !form.value.data) return []
  
  const partesInicio = form.value.horaInicio.split(':').map(Number)
  if (partesInicio.length !== 2) return []
  
  const [horaInicio, minutoInicio] = partesInicio
  if (horaInicio === undefined || minutoInicio === undefined) return []
  
  const inicioMinutos = horaInicio * 60 + minutoInicio
  const dataSelecionada = new Date(form.value.data + 'T00:00:00')
  
  // Gerar todos os horários possíveis após o início
  const todosHorarios = []
  for (let h = 8; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      // Para 22h, só adicionar 22:00, não 22:30
      if (h === 22 && m > 0) break
      
      const hora = h.toString().padStart(2, '0')
      const minuto = m.toString().padStart(2, '0')
      const totalMinutos = h * 60 + m
      
      if (totalMinutos > inicioMinutos) {
        todosHorarios.push(`${hora}:${minuto}`)
      }
    }
  }
  
  // Filtrar baseado em agendamentos existentes (evitar todos os tipos de conflito)
  if (props.agendamentos && props.agendamentos.length > 0) {
    const agendamentosDoDia = props.agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.dataInicio)
      return dataAgendamento.toDateString() === dataSelecionada.toDateString()
    })
    
    // Encontrar o primeiro conflito possível
    let limiteMaximo: number | null = null
    
    agendamentosDoDia.forEach(agendamento => {
      const inicioAgendamento = new Date(agendamento.dataInicio)
      const fimAgendamento = new Date(agendamento.dataFim)
      const inicioMinutosAgendamento = inicioAgendamento.getHours() * 60 + inicioAgendamento.getMinutes()
      const fimMinutosAgendamento = fimAgendamento.getHours() * 60 + fimAgendamento.getMinutes()
      
      // Caso 1: O novo agendamento começaria durante um agendamento existente
      // Se nosso início é durante um agendamento existente, não podemos nem começar
      if (inicioMinutos >= inicioMinutosAgendamento && inicioMinutos < fimMinutosAgendamento) {
        limiteMaximo = inicioMinutos // Não pode nem começar
        return
      }
      
      // Caso 2: O novo agendamento terminaria durante um agendamento existente
      // Se há um agendamento que começa após nosso início, limitamos até o início dele
      if (inicioMinutosAgendamento > inicioMinutos) {
        if (limiteMaximo === null || inicioMinutosAgendamento < limiteMaximo) {
          limiteMaximo = inicioMinutosAgendamento
        }
      }
      
      // Caso 3: Verificar se nosso agendamento não engloba completamente um existente
      // Isso já é coberto pelo caso 2, pois limitamos até o próximo início
    })
    
    // Se há limite máximo, filtrar horários até esse limite
    if (limiteMaximo !== null) {
      return todosHorarios.filter(hora => {
        const partes = hora.split(':').map(Number)
        const h = partes[0]
        const m = partes[1]
        
        if (h === undefined || m === undefined) return false
        
        const totalMinutos = h * 60 + m
        return totalMinutos <= limiteMaximo!
      })
    }
  }
  
  return todosHorarios
})

// Agendamentos já existentes no dia selecionado (para mostrar ao usuário)
const agendamentosDoDiaSelecionado = computed(() => {
  if (!form.value.data || !props.agendamentos) return []
  
  const dataSelecionada = new Date(form.value.data + 'T00:00:00')
  
  return props.agendamentos.filter(agendamento => {
    const dataAgendamento = new Date(agendamento.dataInicio)
    return dataAgendamento.toDateString() === dataSelecionada.toDateString()
  }).map(agendamento => {
    const inicio = new Date(agendamento.dataInicio)
    const fim = new Date(agendamento.dataFim)
    
    return {
      titulo: agendamento.titulo || 'Agendamento',
      horaInicio: inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      horaFim: fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      cliente: agendamento.clienteId ? `Cliente ID: ${agendamento.clienteId}` : 'Cliente não informado'
    }
  }).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
})

// ===== FUNÇÕES =====

// Formatar data para input (YYYY-MM-DD)
const formatarDataParaInput = (data: Date): string => {
  const isoString = data.toISOString().split('T')[0]
  return isoString || ''
}

// Formatar data para exibição
const formatarDataParaExibicao = (data: Date): string => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const diaSemana = diasSemana[data.getDay()]
  const dataFormatada = data.toLocaleDateString('pt-BR')
  return `${diaSemana}, ${dataFormatada}`
}

// Formatar CPF para exibição
const formatarCPF = (cpf: string | null | undefined): string => {
  if (!cpf) return ''
  
  const numerosApenas = cpf.replace(/\D/g, '')
  
  if (numerosApenas.length === 11) {
    return numerosApenas.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  return cpf
}

// ===== FUNÇÕES DO DROPDOWN DE CLIENTES =====

// Abrir dropdown de clientes
const abrirDropdownCliente = () => {
  dropdownClienteAberto.value = true
  
  // Se não há busca, mostrar nome do cliente selecionado
  if (!buscaCliente.value && clienteSelecionado.value) {
    buscaCliente.value = clienteSelecionado.value.nome_completo
  }
}

// Fechar dropdown com delay para permitir clique nos itens
const fecharDropdownCliente = () => {
  setTimeout(() => {
    dropdownClienteAberto.value = false
    
    // Se não há cliente selecionado, limpar busca
    if (!form.value.clienteId) {
      buscaCliente.value = ''
    } else if (clienteSelecionado.value) {
      // Mostrar nome do cliente selecionado
      buscaCliente.value = clienteSelecionado.value.nome_completo
    }
  }, 150)
}

// Filtrar clientes (acionado pelo @input)
const filtrarClientes = () => {
  // Se o usuário digitou algo diferente do nome do cliente selecionado,
  // limpar a seleção
  if (clienteSelecionado.value && buscaCliente.value !== clienteSelecionado.value.nome_completo) {
    form.value.clienteId = ''
  }
  
  // Abrir dropdown automaticamente ao digitar
  if (!dropdownClienteAberto.value) {
    dropdownClienteAberto.value = true
  }
}

// Selecionar cliente do dropdown
const selecionarCliente = (cliente: Cliente) => {
  form.value.clienteId = cliente.id.toString()
  buscaCliente.value = cliente.nome_completo
  dropdownClienteAberto.value = false
  
  // Limpar erro se houver
  if (errors.value.clienteId) {
    errors.value.clienteId = ''
  }
}

// Redirecionar para página de clientes para cadastrar novo cliente
const adicionarNovoCliente = () => {
  dropdownClienteAberto.value = false
  
  // Usar navigateTo do Nuxt para redirecionar
  navigateTo('/clientes')
}

// Quando a data muda, resetar horários
const onDataChange = () => {
  form.value.horaInicio = ''
  form.value.horaFim = ''
}

// Limpar erros
const limparErros = () => {
  errors.value = {
    clienteId: '',
    titulo: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: ''
  }
}

// Validar formulário
const validarFormulario = (): boolean => {
  limparErros()
  let valido = true

  if (!form.value.clienteId) {
    errors.value.clienteId = 'Cliente é obrigatório'
    valido = false
  }

  if (!form.value.titulo.trim()) {
    errors.value.titulo = 'Título é obrigatório'
    valido = false
  }

  if (!form.value.data) {
    errors.value.data = 'Data é obrigatória'
    valido = false
  }

  if (!form.value.horaInicio) {
    errors.value.horaInicio = 'Hora de início é obrigatória'
    valido = false
  }

  if (!form.value.horaFim) {
    errors.value.horaFim = 'Hora de fim é obrigatória'
    valido = false
  }

  // Validar se hora fim é maior que hora início
  if (form.value.horaInicio && form.value.horaFim) {
    const partesInicio = form.value.horaInicio.split(':').map(Number)
    const partesFim = form.value.horaFim.split(':').map(Number)
    
    if (partesInicio.length === 2 && partesFim.length === 2) {
      const [hInicio, mInicio] = partesInicio
      const [hFim, mFim] = partesFim
      
      if (hInicio !== undefined && mInicio !== undefined && 
          hFim !== undefined && mFim !== undefined) {
        const inicioMinutos = hInicio * 60 + mInicio
        const fimMinutos = hFim * 60 + mFim
        
        if (fimMinutos <= inicioMinutos) {
          errors.value.horaFim = 'Hora de fim deve ser maior que hora de início'
          valido = false
        }
      }
    }
  }

  return valido
}

// Resetar formulário
const resetarFormulario = () => {
  form.value = {
    clienteId: '',
    titulo: 'Consulta',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    cor: '#DBE9FE' // Cor padrão
  }
  
  // Resetar estado do dropdown de clientes
  buscaCliente.value = ''
  dropdownClienteAberto.value = false
  
  limparErros()
}

// Os clientes agora vêm via props do AgendamentoManager

// ===== HANDLERS =====

const handleConfirm = () => {
  if (!validarFormulario()) return

  const dadosAgendamento = {
    profissionalId: props.profissionalAtual?.profissional_id,
    clienteId: Number(form.value.clienteId),
    titulo: form.value.titulo.trim(),
    descricao: form.value.descricao.trim(),
    data: form.value.data,
    horaInicio: form.value.horaInicio,
    horaFim: form.value.horaFim,
    cor: form.value.cor
  }

  emit('confirm', dadosAgendamento)
}

const handleCancel = () => {
  resetarFormulario()
  emit('cancel')
}

const handleClose = () => {
  resetarFormulario()
  emit('close')
}

// ===== WATCHERS =====

// Sincronizar campo de busca com cliente selecionado
watch(() => form.value.clienteId, (novoClienteId) => {
  if (novoClienteId) {
    const cliente = props.clientes?.find(c => c.id.toString() === novoClienteId)
    if (cliente && buscaCliente.value !== cliente.nome_completo) {
      buscaCliente.value = cliente.nome_completo
    }
  } else {
    // Se não há cliente selecionado e dropdown não está aberto, limpar busca
    if (!dropdownClienteAberto.value) {
      buscaCliente.value = ''
    }
  }
})

// Limpar data selecionada se ela não estiver mais disponível (dias que passaram)
watch(() => diasDisponiveis.value, (novosDias) => {
  if (form.value.data && novosDias.length > 0) {
    const dataSelecionada = form.value.data
    const dataDisponivel = novosDias.find(dia => 
      formatarDataParaInput(dia) === dataSelecionada
    )
    
    if (!dataDisponivel) {
      form.value.data = ''
      form.value.horaInicio = ''
      form.value.horaFim = ''
    }
  }
}, { deep: true })

// Limpar horários quando a data mudar (caso os horários selecionados não estejam mais disponíveis)
watch(() => form.value.data, (novaData, dataAnterior) => {
  if (novaData !== dataAnterior && dataAnterior) {
    // Verificar se o horário de início ainda está disponível
    if (form.value.horaInicio && !horariosDisponiveis.value.includes(form.value.horaInicio)) {
      form.value.horaInicio = ''
      form.value.horaFim = ''
    }
  }
})

// ===== LIFECYCLE =====

// Os clientes são carregados pelo AgendamentoManager e passados via props
// Não há necessidade de lifecycle hooks aqui para buscar clientes
</script>