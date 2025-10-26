<script setup lang="ts">
import { 
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

// Import explícito do componente
import AgendamentoManager from '~/components/agendamentos/AgendamentoManager.vue'

const { user } = useAuth()

// Inicializar store de agendamento
const agendamentoStore = useAgendamentoStore()

// Título da página
useHead({
  title: 'Agendamentos - AFAAS Atendimento'
})

// O layout default será aplicado automaticamente
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Cabeçalho da página -->
    <header class="px-6 py-2 flex-shrink-0">
      <h1 class="text-xl font-semibold text-neutral-900">Agendamentos</h1>
    </header>

    <!-- Conteúdo principal -->
    <main class="px-6 pb-6 flex-1 overflow-hidden">
      <!-- Componente principal de gerenciamento -->
      <AgendamentoManager />
    </main>
  </div>
</template>