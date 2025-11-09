<script setup lang="ts">
// Proteger a página com autenticação
definePageMeta({
  middleware: 'auth'
})

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