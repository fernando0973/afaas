<template>
  <div class="min-h-screen flex">
    <!-- Coluna Esquerda - Formulário -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 bg-surface">
      <div class="w-full max-w-md">
        <!-- Título e descrição do sistema -->
        <div class="mb-12 text-center">
          <h1 class="text-3xl font-bold text-text mb-2">
            Gerenciamento de Atendimentos
          </h1>
          <p class="text-text-muted text-lg">
            Sistema AFAAS de cadastro e agendamento
          </p>
        </div>

        <!-- Formulário de login -->
        <LoginForm />
      </div>
    </div>

    <!-- Coluna Direita - Imagem -->
    <div class="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-12">
      <div class="max-w-lg w-full">
        <img 
          src="~/assets/images/AFAAS_Logo_Completo.svg" 
          alt="AFAAS - Associação Filantrópica de Apoio Alternativo à Saúde" 
          class="w-full h-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Desabilita o layout padrão para a página de login
definePageMeta({
  layout: false
})
</script>