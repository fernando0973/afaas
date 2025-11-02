<template>
  <div class="mx-auto max-w-5xl px-6 py-12">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-text mb-2">Componentes Base</h1>
      <p class="text-text-muted">Testando BaseButton, BaseInput, Ícones e Toasts com o design system AFAAS</p>
    </div>

    <!-- Toast Examples -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">Toast Notifications</h2>
      
      <div class="flex flex-wrap gap-3">
        <BaseButton variant="primary" @click="showSuccessToast">
          <template #iconLeft>
            <CheckCircleIcon class="w-5 h-5" />
          </template>
          Toast Sucesso
        </BaseButton>
        
        <BaseButton variant="danger" @click="showErrorToast">
          <template #iconLeft>
            <XCircleIcon class="w-5 h-5" />
          </template>
          Toast Erro
        </BaseButton>
        
        <BaseButton variant="secondary" @click="showWarningToast">
          <template #iconLeft>
            <ExclamationTriangleIcon class="w-5 h-5" />
          </template>
          Toast Aviso
        </BaseButton>
        
        <BaseButton variant="outline" @click="showInfoToast">
          <template #iconLeft>
            <InformationCircleIcon class="w-5 h-5" />
          </template>
          Toast Info
        </BaseButton>
      </div>
    </section>

    <!-- BaseButton -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">BaseButton</h2>

      <div class="space-y-8">
        <!-- Variantes -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Variantes</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="outline">Outline</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
          </div>
        </div>

        <!-- Com Ícones -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Com Ícones</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton variant="primary">
              <template #iconLeft>
                <PlusIcon class="w-5 h-5" />
              </template>
              Adicionar
            </BaseButton>
            
            <BaseButton variant="secondary">
              <template #iconLeft>
                <PencilIcon class="w-5 h-5" />
              </template>
              Editar
            </BaseButton>
            
            <BaseButton variant="danger">
              <template #iconLeft>
                <TrashIcon class="w-5 h-5" />
              </template>
              Excluir
            </BaseButton>
            
            <BaseButton variant="outline">
              Salvar
              <template #iconRight>
                <ArrowDownTrayIcon class="w-5 h-5" />
              </template>
            </BaseButton>
            
            <BaseButton variant="ghost">
              <template #iconLeft>
                <MagnifyingGlassIcon class="w-5 h-5" />
              </template>
              Buscar
            </BaseButton>
          </div>
        </div>

        <!-- Tamanhos -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Tamanhos</h3>
          <div class="flex flex-wrap items-center gap-3">
            <BaseButton size="sm">
              <template #iconLeft>
                <SparklesIcon class="w-4 h-4" />
              </template>
              Pequeno
            </BaseButton>
            <BaseButton size="md">
              <template #iconLeft>
                <SparklesIcon class="w-5 h-5" />
              </template>
              Médio
            </BaseButton>
            <BaseButton size="lg">
              <template #iconLeft>
                <SparklesIcon class="w-6 h-6" />
              </template>
              Grande
            </BaseButton>
          </div>
        </div>

        <!-- Estados -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Estados</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton>
              <template #iconLeft>
                <CheckIcon class="w-5 h-5" />
              </template>
              Normal
            </BaseButton>
            <BaseButton disabled>
              <template #iconLeft>
                <XMarkIcon class="w-5 h-5" />
              </template>
              Desabilitado
            </BaseButton>
            <BaseButton loading>Carregando</BaseButton>
          </div>
        </div>

        <!-- Full Width -->
        <div>
          <h3 class="text-lg font-medium text-text mb-3">Largura Total</h3>
          <BaseButton full-width>
            <template #iconLeft>
              <ArrowRightIcon class="w-5 h-5" />
            </template>
            Botão Full Width
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- BaseInput -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">BaseInput</h2>

      <div class="space-y-6 max-w-2xl">
        <!-- Input básico -->
        <BaseInput
          v-model="form.name"
          label="Nome completo"
          placeholder="Digite seu nome"
          hint="Como você gostaria de ser chamado"
        />

        <!-- Input obrigatório -->
        <BaseInput
          v-model="form.email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          required
        />

        <!-- Input com erro -->
        <BaseInput
          v-model="form.password"
          type="password"
          label="Senha"
          placeholder="********"
          :error="form.password.length > 0 && form.password.length < 6 ? 'Senha deve ter no mínimo 6 caracteres' : ''"
        />

        <!-- Input desabilitado -->
        <BaseInput
          model-value="Campo desabilitado"
          label="Campo desabilitado"
          disabled
        />

        <!-- Input readonly -->
        <BaseInput
          model-value="Campo somente leitura"
          label="Somente leitura"
          readonly
        />

        <!-- Input de telefone -->
        <BaseInput
          v-model="form.phone"
          type="tel"
          label="Telefone"
          placeholder="(00) 00000-0000"
          hint="DDD + número"
        />

        <!-- Input de data -->
        <BaseInput
          v-model="form.date"
          type="date"
          label="Data de nascimento"
        />
      </div>
    </section>

    <!-- Formulário de exemplo -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">Formulário de Exemplo</h2>
      
      <div class="max-w-2xl bg-surface border border-border rounded-xl p-6 shadow-card">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <BaseInput
            v-model="contactForm.name"
            label="Nome"
            placeholder="Seu nome"
            required
          />

          <BaseInput
            v-model="contactForm.email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            required
          />

          <BaseInput
            v-model="contactForm.message"
            label="Mensagem"
            placeholder="Digite sua mensagem"
            hint="Mínimo 10 caracteres"
          />

          <div class="flex gap-3 pt-2">
            <BaseButton type="submit" variant="primary">
              Enviar
            </BaseButton>
            <BaseButton type="button" variant="outline" @click="resetContactForm">
              Limpar
            </BaseButton>
          </div>
        </form>
      </div>
    </section>

    <!-- Debug Agendamentos -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-text mb-6">🐛 Debug Agendamentos 12/11/2025</h2>
      
      <div class="max-w-4xl bg-surface border border-border rounded-xl p-6 shadow-card">
        <!-- Controles de teste -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <BaseInput
            v-model.number="profissionalId"
            type="number"
            label="Profissional ID"
          />
          
          <BaseInput
            v-model="dataEspecifica"
            type="date"
            label="Data Específica"
          />
          
          <div class="flex items-end">
            <BaseButton 
              @click="testarBuscaEspecifica" 
              :disabled="carregandoDebug"
              variant="primary"
              full-width
            >
              {{ carregandoDebug ? 'Buscando...' : 'Testar Busca' }}
            </BaseButton>
          </div>
        </div>
        
        <div class="flex gap-3 mb-6">
          <BaseButton 
            @click="testarSemanaCompleta" 
            :disabled="carregandoDebug"
            variant="secondary"
          >
            Testar Semana 09/11 - 15/11
          </BaseButton>
          
          <BaseButton 
            @click="listarTodosAgendamentos" 
            :disabled="carregandoDebug"
            variant="outline"
          >
            Listar TODOS
          </BaseButton>
        </div>

        <!-- Resultados -->
        <div v-if="erroDebug" class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erro:</strong> {{ erroDebug }}
        </div>
        
        <div v-if="resultadosDebug.length === 0 && !carregandoDebug && !erroDebug" class="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded mb-4">
          Nenhum agendamento encontrado.
        </div>
        
        <div v-if="resultadosDebug.length > 0" class="mb-4">
          <p class="font-semibold mb-3">{{ resultadosDebug.length }} agendamento(s) encontrado(s):</p>
          
          <div v-for="agendamento in resultadosDebug" :key="agendamento.id" class="border border-neutral-200 rounded p-3 mb-2">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><strong>ID:</strong> {{ agendamento.id }}</div>
              <div><strong>Data:</strong> {{ agendamento.data }}</div>
              <div><strong>Hora:</strong> {{ agendamento.hora_inicio }} - {{ agendamento.hora_fim }}</div>
              <div><strong>Cancelado:</strong> {{ agendamento.cancelado ? 'Sim' : 'Não' }}</div>
            </div>
            <div class="mt-2">
              <div><strong>Título:</strong> {{ agendamento.titulo || 'Sem título' }}</div>
              <div><strong>Descrição:</strong> {{ agendamento.descricao || 'Sem descrição' }}</div>
            </div>
          </div>
        </div>

        <!-- Log de debug -->
        <div class="bg-neutral-900 text-neutral-100 p-4 rounded-lg max-h-40 overflow-y-auto">
          <h3 class="text-sm font-semibold mb-2">🔍 Log de Debug</h3>
          <div class="text-xs space-y-1 font-mono">
            <div v-for="(log, index) in logsDebug" :key="index">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Paleta de cores -->
    <section>
      <h2 class="text-2xl font-semibold text-text mb-6">Paleta de Cores</h2>
      
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-primary-500 text-white rounded-lg p-4">
          <p class="font-medium">Primary</p>
          <p class="text-sm opacity-90">#3a9d6d</p>
        </div>
        <div class="bg-secondary-500 text-white rounded-lg p-4">
          <p class="font-medium">Secondary</p>
          <p class="text-sm opacity-90">#a88968</p>
        </div>
        <div class="bg-neutral-500 text-white rounded-lg p-4">
          <p class="font-medium">Neutral</p>
          <p class="text-sm opacity-90">#8a9790</p>
        </div>
        <div class="bg-success text-white rounded-lg p-4">
          <p class="font-medium">Success</p>
          <p class="text-sm opacity-90">#3a9d6d</p>
        </div>
        <div class="bg-warning text-white rounded-lg p-4">
          <p class="font-medium">Warning</p>
          <p class="text-sm opacity-90">#d97706</p>
        </div>
        <div class="bg-danger text-white rounded-lg p-4">
          <p class="font-medium">Danger</p>
          <p class="text-sm opacity-90">#dc2626</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAgendamentos } from '~/composables/useAgendamentos'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const toast = useToast()

// Debug de agendamentos
const { debugBuscarPorData, buscarAgendamentosSemana } = useAgendamentos()
const profissionalId = ref(1)
const dataEspecifica = ref('2025-11-12')
const carregandoDebug = ref(false)
const resultadosDebug = ref<any[]>([])
const erroDebug = ref<string | null>(null)
const logsDebug = ref<string[]>([])

// Capturar logs do console para debug
const originalConsoleLog = console.log
console.log = (...args) => {
  logsDebug.value.push(new Date().toLocaleTimeString() + ': ' + args.join(' '))
  originalConsoleLog(...args)
}

const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  date: ''
})

const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

// Toast functions
const showSuccessToast = () => {
  toast.success('Operação realizada com sucesso!', {
    timeout: 3000
  })
}

const showErrorToast = () => {
  toast.error('Erro ao processar a operação!', {
    timeout: 3000
  })
}

const showWarningToast = () => {
  toast.warning('Atenção! Verifique os dados informados.', {
    timeout: 3000
  })
}

const showInfoToast = () => {
  toast.info('Informação importante sobre o sistema.', {
    timeout: 3000
  })
}

const handleSubmit = () => {
  toast.success('Formulário enviado com sucesso!')
  console.log('Formulário enviado:', contactForm.value)
}

const resetContactForm = () => {
  contactForm.value = {
    name: '',
    email: '',
    message: ''
  }
  toast.info('Formulário limpo')
}

// Funções de debug de agendamentos
const testarBuscaEspecifica = async () => {
  carregandoDebug.value = true
  erroDebug.value = null
  logsDebug.value = []
  
  try {
    const resultado = await debugBuscarPorData(profissionalId.value, dataEspecifica.value)
    resultadosDebug.value = resultado || []
  } catch (err: any) {
    erroDebug.value = err.message || 'Erro desconhecido'
    resultadosDebug.value = []
  } finally {
    carregandoDebug.value = false
  }
}

const testarSemanaCompleta = async () => {
  carregandoDebug.value = true
  erroDebug.value = null
  logsDebug.value = []
  
  try {
    // Criar array com os 7 dias da semana (09/11 a 15/11)
    const diasSemana = [
      new Date(2025, 10, 9),  // Domingo 09/11
      new Date(2025, 10, 10), // Segunda 10/11
      new Date(2025, 10, 11), // Terça 11/11
      new Date(2025, 10, 12), // Quarta 12/11
      new Date(2025, 10, 13), // Quinta 13/11
      new Date(2025, 10, 14), // Sexta 14/11
      new Date(2025, 10, 15), // Sábado 15/11
    ]
    
    const resultado = await buscarAgendamentosSemana(profissionalId.value, diasSemana, true)
    resultadosDebug.value = resultado || []
  } catch (err: any) {
    erroDebug.value = err.message || 'Erro desconhecido'
    resultadosDebug.value = []
  } finally {
    carregandoDebug.value = false
  }
}

const listarTodosAgendamentos = async () => {
  carregandoDebug.value = true
  erroDebug.value = null
  logsDebug.value = []
  
  try {
    const supabase = useSupabaseClient()
    
    // Primeiro, buscar todos os profissionais usando o composable
    const { buscarProfissionais } = useProfissionais()
    const resultadoProfissionais = await buscarProfissionais()
    
    logsDebug.value.push(`Profissionais disponíveis:`)
    if (resultadoProfissionais.success && resultadoProfissionais.data) {
      resultadoProfissionais.data.forEach(prof => {
        logsDebug.value.push(`  - ID ${prof.profissional_id}: ${prof.nome_profissional}`)
      })
    }
    
    // Depois, buscar agendamentos do profissional específico
    const { data, error } = await supabase
      .from('afaas_agendamentos')
      .select('*')
      .eq('profissional_id', profissionalId.value)
      .order('data', { ascending: true })
    
    if (error) throw error
    
    resultadosDebug.value = data || []
    logsDebug.value.push(`Total de agendamentos do profissional ${profissionalId.value}: ${data?.length || 0}`)
    
    // Buscar TODOS os agendamentos para comparação
    const { data: todosAgendamentos } = await supabase
      .from('afaas_agendamentos')
      .select('*')
      .order('data', { ascending: true })
    
    logsDebug.value.push(`Total geral de agendamentos no sistema: ${todosAgendamentos?.length || 0}`)
    
    // Mostrar resumo por profissional
    if (todosAgendamentos) {
      const resumoPorProfissional = new Map()
      todosAgendamentos.forEach(agend => {
        const profId = agend.profissional_id
        if (!resumoPorProfissional.has(profId)) {
          resumoPorProfissional.set(profId, 0)
        }
        resumoPorProfissional.set(profId, resumoPorProfissional.get(profId) + 1)
      })
      
      logsDebug.value.push(`Resumo de agendamentos por profissional:`)
      resumoPorProfissional.forEach((count, profId) => {
        logsDebug.value.push(`  - Profissional ID ${profId}: ${count} agendamento(s)`)
      })
    }
    
  } catch (err: any) {
    erroDebug.value = err.message || 'Erro desconhecido'
    resultadosDebug.value = []
  } finally {
    carregandoDebug.value = false
  }
}
</script>
