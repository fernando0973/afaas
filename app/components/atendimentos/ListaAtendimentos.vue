<template>
  <div class="relative h-full flex flex-col gap-4">
    <!-- Cabeçalho com informações - altura automática -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
      <p class="text-xs text-neutral-500">
        <template v-if="carregando">
          Carregando atendimentos...
        </template>
        <template v-else-if="erro">
          Não foi possível carregar os atendimentos.
        </template>
        <template v-else-if="atendimentosFiltrados.length === 0">
          Nenhum atendimento encontrado para os filtros atuais.
        </template>
        <template v-else>
          Exibindo
          <span class="font-semibold text-neutral-700">{{ atendimentosPaginados.length }}</span>
          de
          <span class="font-semibold text-neutral-700">{{ atendimentosFiltrados.length }}</span>
          atendimento{{ atendimentosFiltrados.length === 1 ? '' : 's' }} nesta página
        </template>
      </p>
      <p v-if="!carregando && !erro && atendimentosFiltrados.length > 0 && ultimaAtualizacaoFormatada" class="text-xs text-neutral-400">
        Atualizado em {{ ultimaAtualizacaoFormatada }}
      </p>
    </div>

  <!-- Área de conteúdo - ocupa todo o espaço restante; scroll isolado -->
  <div class="min-h-0 overflow-hidden">
      <!-- Estados de loading, erro e vazio - TODOS com h-full -->
  <div v-if="carregando" class="h-full overflow-y-auto pr-2 pb-20">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="indice in 6" :key="indice" class="rounded-2xl border border-neutral-200 bg-neutral-100/70 p-6 animate-pulse">
            <div class="h-4 w-32 rounded bg-neutral-200" />
            <div class="mt-4 h-6 w-48 rounded bg-neutral-200" />
            <div class="mt-6 space-y-3">
              <div class="h-4 w-full rounded bg-neutral-200" />
              <div class="h-4 w-4/5 rounded bg-neutral-200" />
              <div class="h-4 w-3/5 rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>

  <div v-else-if="erro" class="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
        <p class="text-sm font-medium">{{ erro }}</p>
        <button class="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-100" @click="carregarAtendimentos">
          Tentar novamente
        </button>
      </div>

  <div v-else-if="atendimentosFiltrados.length === 0" class="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-neutral-900">Nenhum atendimento encontrado</h3>
        <p class="text-sm text-neutral-600">Ajuste os filtros ou verifique agendamentos em outro período.</p>
      </div>

      <!-- Lista de cards scrollável - SEMPRE h-full -->
  <div class="lista-atendimentos-scroll h-full overflow-y-auto pr-2 pb-20">
        <article
          v-for="atendimento in atendimentosPaginados"
          :key="atendimento.agendamento_id"
          class="relative mb-3 last:mb-0 overflow-hidden rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
        >
          <span class="absolute inset-y-0 left-0 w-1" :style="{ backgroundColor: atendimento.cor || '#2563eb' }" />

          <div class="space-y-3">
              <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.2fr_1.1fr_1.1fr_auto] lg:items-start">
                <div class="flex items-start gap-4">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Agendamento</p>
                    <p class="text-sm font-semibold text-neutral-900">{{ formatarData(atendimento.data) }}</p>
                    <p class="text-xs text-neutral-600">{{ formatarHorario(atendimento.hora_inicio, atendimento.hora_fim) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Profissional</p>
                    <p class="text-xs font-medium text-neutral-900">{{ atendimento.nome_profissional || 'Profissional não informado' }}</p>
                    <p class="text-xs text-neutral-600">{{ atendimento.especialidade || 'Especialidade não registrada' }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM8 13c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zM16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Cliente</p>
                    <p class="text-xs font-medium text-neutral-900">{{ atendimento.nome_cliente || 'Cliente não informado' }}</p>
                    <p class="text-xs text-neutral-600">{{ atendimento.cpf_cliente || atendimento.cliente_completo || 'Documento não informado' }}</p>
                  </div>
                </div>

                <div class="flex flex-col items-end gap-2 lg:justify-self-end">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
                      obterStatus(atendimento).classes
                    ]"
                  >
                    {{ obterStatus(atendimento).rotulo }}
                  </span>

                  <button
                    class="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                    @click="emit('visualizar', atendimento)"
                  >
                    <EyeIcon class="h-3.5 w-3.5" />
                    Visualizar
                  </button>
                </div>
              </div>

              <div v-if="atendimento.cancelado && atendimento.cancelado_as" class="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-red-700">
                <p class="text-[11px] font-semibold uppercase tracking-wide">Cancelado em</p>
                <p class="mt-0.5 text-xs">{{ formatarDataHora(atendimento.cancelado_as) }}</p>
              </div>
            </div>
          </article>
      </div>
    </div>

    <!-- Paginador overlay absoluto: sempre ancorado ao rodapé do container -->
    <div class="pointer-events-auto absolute inset-x-0 bottom-0 z-10 h-20 border-t border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 flex items-center">
      <div class="w-full px-0">
        <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="atendimentosFiltrados.length"
          :items-per-page="itemsPerPage"
          @page-changed="handleTrocaPagina"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from '#imports'
import { useAgendamentos } from '~/composables/useAgendamentos'
import type { AgendamentoCompletoView } from '~/types/database.types'
// @ts-ignore
import { EyeIcon } from '@heroicons/vue/24/outline'
import BasePagination from '../BasePagination.vue'

const props = defineProps<{
  termoBusca?: string
}>()

const emit = defineEmits<{
  visualizar: [AgendamentoCompletoView]
}>()

const { buscarRelatorioAgendamentos } = useAgendamentos()

const atendimentos = ref<AgendamentoCompletoView[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)
const ultimaAtualizacao = ref<Date | null>(null)
const currentPage = ref(1)
const itemsPerPage = 6

const normalizar = (valor: string) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const gerarDataHora = (data?: string | null, horario?: string | null) => {
  if (!data || !horario) {
    return null
  }

  const horarioLimpo = horario.split(/[-+]/)[0] ?? horario
  return new Date(`${data}T${horarioLimpo}`)
}

const formatarData = (data?: string | null) => {
  if (!data) {
    return 'Data não informada'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'long'
  }).format(new Date(data))
}

const formatarHorario = (inicio?: string | null, fim?: string | null) => {
  const inicioLimpo = inicio?.split(/[-+]/)[0]
  const fimLimpo = fim?.split(/[-+]/)[0]

  if (!inicioLimpo && !fimLimpo) {
    return 'Horário não informado'
  }

  const formatar = (valor: string | undefined | null) => {
    if (!valor) {
      return null
    }
    return valor.slice(0, 5)
  }

  const inicioFormatado = formatar(inicioLimpo)
  const fimFormatado = formatar(fimLimpo)

  if (inicioFormatado && fimFormatado) {
    return `${inicioFormatado} - ${fimFormatado}`
  }

  return inicioFormatado || fimFormatado || 'Horário não informado'
}

const formatarDataHora = (valor?: string | null) => {
  if (!valor) {
    return 'Data não informada'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(valor))
}

const obterStatus = (atendimento: AgendamentoCompletoView) => {
  if (atendimento.cancelado) {
    return {
      rotulo: 'Cancelado',
      classes: 'border-red-200 bg-red-100 text-red-700'
    }
  }

  const dataInicio = gerarDataHora(atendimento.data, atendimento.hora_inicio)
  if (dataInicio && dataInicio < new Date()) {
    return {
      rotulo: 'Realizado',
      classes: 'border-emerald-200 bg-emerald-100 text-emerald-700'
    }
  }

  return {
    rotulo: 'Agendado',
    classes: 'border-blue-200 bg-blue-100 text-blue-700'
  }
}

const atendimentosFiltrados = computed(() => {
  if (!props.termoBusca || props.termoBusca.trim().length < 2) {
    return atendimentos.value
  }

  const termoNormalizado = normalizar(props.termoBusca)

  return atendimentos.value.filter((item: AgendamentoCompletoView) => {
    const campos = [
      item.nome_cliente,
      item.cpf_cliente,
      item.cliente_completo,
      item.nome_profissional,
      item.profissional_completo,
      item.especialidade,
      item.titulo,
      item.descricao
    ]
      .filter((campo): campo is string => Boolean(campo))
      .map((campo) => normalizar(campo))

    return campos.some((campo) => campo.includes(termoNormalizado))
  })
})

const ultimaAtualizacaoFormatada = computed(() => {
  if (!ultimaAtualizacao.value) {
    return null
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(ultimaAtualizacao.value)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(atendimentosFiltrados.value.length / itemsPerPage))
})

const atendimentosPaginados = computed(() => {
  const inicio = (currentPage.value - 1) * itemsPerPage
  const fim = inicio + itemsPerPage
  return atendimentosFiltrados.value.slice(inicio, fim)
})

const carregarAtendimentos = async () => {
  carregando.value = true
  erro.value = null

  const hoje = new Date()
  const dataInicio = new Date(hoje)
  dataInicio.setMonth(dataInicio.getMonth() - 1)
  const dataFim = new Date(hoje)
  dataFim.setMonth(dataFim.getMonth() + 1)

  try {
    const dados = await buscarRelatorioAgendamentos({
      dataInicio,
      dataFim,
      incluirCancelados: true
    })

    atendimentos.value = dados
    ultimaAtualizacao.value = new Date()
    currentPage.value = 1
  } catch (erroInesperado) {
    const mensagem = erroInesperado instanceof Error
      ? erroInesperado.message
      : 'Não foi possível carregar os atendimentos. Tente novamente.'
    erro.value = mensagem
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarAtendimentos()
})

watch(() => props.termoBusca, () => {
  currentPage.value = 1
})

watch(atendimentosFiltrados, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

const handleTrocaPagina = (pagina: number) => {
  currentPage.value = pagina
  
  // Força o scroll voltar ao topo ao mudar de página
  // Isso evita que a paginação "pule" baseado na posição do scroll
  nextTick(() => {
    const scrollContainer = document.querySelector('.lista-atendimentos-scroll')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
  })
}
</script>
```