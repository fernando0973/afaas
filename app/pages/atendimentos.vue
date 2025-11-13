<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Atendimentos</h1>
        <p class="text-neutral-600">Gestão operacional de atendimentos em tempo real</p>
      </div>
    </header>
    <main class="flex-1 min-h-0 overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <h2 class="text-xl font-semibold text-neutral-900 mb-2">Página em Desenvolvimento</h2>
          <p class="text-neutral-600">Esta página será usada para gestão operacional.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Atendimentos',
  layout: 'default',
  middleware: ['auth']
})

useHead({
  title: 'Atendimentos - AFAAS'
})
</script>
