<template>
  <div class="h-screen flex bg-neutral-50">
    <!-- Sidebar -->
    <div class="flex-shrink-0">
      <AppSidebar />
    </div>
    
    <!-- Área Principal -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Conteúdo da página -->
      <div class="flex-1 overflow-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const pageInfo = computed(() => {
  // No servidor, não tenta computar informações específicas de rota
  if (!process.client) {
    return { title: 'AFAAS', description: 'Sistema de atendimentos' }
  }
  
  const path = route.path
  
  switch (path) {
    case '/':
      return { title: 'Dashboard', description: 'Visão geral do sistema de atendimentos AFAAS' }
    case '/clientes':
      return { title: 'Clientes', description: 'Gerenciamento de clientes cadastrados' }
    case '/atendentes':
      return { title: 'Atendentes', description: 'Gerenciamento da equipe de atendentes' }
    case '/atendimentos':
      return { title: 'Atendimentos', description: 'Agendamentos e histórico de atendimentos' }
    case '/relatorios':
      return { title: 'Relatórios', description: 'Relatórios e estatísticas do sistema' }
    case '/relatorios/agendamentos':
      return { title: 'Relatório de Agendamentos', description: 'Visualize e analise os agendamentos realizados' }
    case '/plantas':
      return { title: 'Plantas', description: 'Gerenciamento de plantas medicinais' }
    case '/configuracoes':
      return { title: 'Configurações', description: 'Configurações do sistema' }
    case '/ajuda':
      return { title: 'Ajuda', description: 'Central de ajuda e suporte' }
    case '/profile':
      return { title: 'Perfil', description: 'Gerenciamento do perfil do usuário' }
    default:
      return { title: 'AFAAS', description: 'Sistema de atendimentos' }
  }
})
</script>