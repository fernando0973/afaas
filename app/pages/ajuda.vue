<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Hero Section / Cabeçalho da página -->
      <div class="pt-6 pb-8">
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-6 relative overflow-hidden">
          <!-- Decoração de fundo -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>
          
          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div class="flex-1">
                <!-- Breadcrumb/Categoria -->
                <div class="flex items-center gap-2 mb-2">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🆘 Suporte
                  </span>
                </div>
                
                <h1 class="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
                  Central de 
                  <span class="text-blue-600">Ajuda</span>
                </h1>
                
                <p class="text-base text-neutral-600 max-w-xl">
                  Encontre respostas, tutoriais e suporte para usar o sistema AFAAS de forma eficiente.
                </p>
              </div>
              
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 text-sm text-neutral-500">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="font-medium">Sistema online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Conteúdo principal em construção -->
        <div class="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <div class="text-center py-12">
            <!-- Ícone de construção -->
            <div class="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 10.172V5L8 4z" />
              </svg>
            </div>

            <!-- Título -->
            <h2 class="text-2xl font-bold text-neutral-900 mb-3">
              Página em Construção
            </h2>
            
            <!-- Descrição -->
            <p class="text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Estamos preparando uma completa central de ajuda com tutoriais, perguntas frequentes, 
              documentação do sistema e canais de suporte. Em breve você terá acesso a todos os 
              recursos para aproveitar ao máximo o sistema AFAAS.
            </p>

            <!-- Cards de funcionalidades futuras -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <!-- Tutoriais -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-blue-900 mb-2">Tutoriais</h3>
                <p class="text-sm text-blue-700">Guias passo a passo para usar todas as funcionalidades</p>
              </div>

              <!-- FAQ -->
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-green-900 mb-2">Perguntas Frequentes</h3>
                <p class="text-sm text-green-700">Respostas para as dúvidas mais comuns dos usuários</p>
              </div>

              <!-- Suporte -->
              <div class="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-purple-900 mb-2">Suporte Técnico</h3>
                <p class="text-sm text-purple-700">Canais diretos para resolver problemas técnicos</p>
              </div>
            </div>

            <!-- Call to action temporário -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <h4 class="text-lg font-semibold text-blue-900 mb-2">Precisa de Ajuda Agora?</h4>
                  <p class="text-blue-700 mb-4">
                    Enquanto nossa central de ajuda está sendo finalizada, você pode entrar em contato 
                    diretamente com nosso suporte técnico para resolver suas dúvidas.
                  </p>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <a 
                      href="mailto:suporte@afaas.com.br" 
                      class="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar E-mail
                    </a>
                    <a 
                      href="tel:+551140041234" 
                      class="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Ligar Agora
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta da página
definePageMeta({
  title: 'Ajuda',
  description: 'Central de ajuda e suporte',
  middleware: 'auth'
})

// Título da página
useHead({
  title: 'Ajuda - AFAAS Atendimento'
})
</script>