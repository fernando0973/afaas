<template>
  <div class="h-[100dvh] flex flex-col bg-neutral-50">
    <!-- Cabeçalho -->
  <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-neutral-900">Atendimentos</h1>
            <p class="text-sm text-neutral-600 mt-1">
              Acompanhe os atendimentos agendados, conclua tarefas e monitore status em tempo real
            </p>
          </div>

          <BaseButton
            variant="primary"
            class="hidden sm:inline-flex"
            @click="navegarParaAgendamentos"
          >
            <template #iconLeft>
                <CalendarDaysIcon class="w-4 h-4" />
            </template>
            Novo agendamento
          </BaseButton>
        </div>

        <!-- Campo de busca principal -->
        <div class="flex justify-center">
          <div class="relative w-full max-w-lg">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              v-model="termoBuscaTabela"
              type="text"
              placeholder="Buscar atendimentos por nome do cliente ou por CPF"
              class="block w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              :class="{ 'border-blue-300 bg-blue-50': termoBuscaTabela && termoBuscaTabela.length >= 2 }"
              @input="handleBuscaInput"
            />

            <button
              v-if="termoBuscaTabela"
              @click="limparBusca"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <BaseButton
          variant="primary"
          class="sm:hidden"
          block
          @click="navegarParaAgendamentos"
        >
          <template #iconLeft>
            <CalendarDaysIcon class="w-4 h-4" />
          </template>
          Novo agendamento
        </BaseButton>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 min-h-0 overflow-hidden p-6">
      <div class="bg-white border border-neutral-200 rounded-xl shadow-sm h-full min-h-0 overflow-hidden p-6">
        <ListaAtendimentos class="h-full" :termo-busca="termoBuscaTabela" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/BaseButton.vue'
import ListaAtendimentos from '../components/atendimentos/ListaAtendimentos.vue'

// Meta da página
definePageMeta({
  title: 'Atendimentos',
  description: 'Gerencie os atendimentos agendados'
})

useHead({
  title: 'Atendimentos - AFAAS Atendimento'
})

const router = useRouter()

const termoBuscaTabela = ref('')
let timeoutBusca: ReturnType<typeof setTimeout> | null = null

const handleBuscaInput = () => {
  if (timeoutBusca) {
    clearTimeout(timeoutBusca)
  }

  timeoutBusca = setTimeout(() => {
    // filtragem ocorre no componente via prop
  }, 300)
}

const limparBusca = () => {
  termoBuscaTabela.value = ''
}

const navegarParaAgendamentos = () => {
  router.push('/admin')
}
</script>