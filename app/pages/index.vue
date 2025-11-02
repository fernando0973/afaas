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
    <!-- Componente principal de gerenciamento ocupando toda a tela -->
    <AgendamentoManager />
</template>