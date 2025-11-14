<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="w-full max-w-[1600px] mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <button
            @click="voltarParaRelatorios"
            class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeftIcon class="w-5 h-5 text-neutral-600" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-neutral-900">Relatório de Clientes</h1>
            <p class="text-neutral-600 mt-1">
              Indicadores e detalhes da base de clientes cadastrados no sistema
            </p>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-4 mt-6">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
            </div>
            <input
              v-model="termoBusca"
              type="text"
              placeholder="Buscar por nome, CPF ou cidade..."
              class="block w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <select
            v-model="filtroEstado"
            class="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[160px]"
          >
            <option value="">Todos os estados</option>
            <option v-for="estado in estadosDisponiveis" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>

          <select
            v-model="filtroEngajamento"
            class="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[200px]"
          >
            <option value="todos">Todos os clientes</option>
            <option value="com-atendimentos">Com atendimentos</option>
            <option value="sem-atendimentos">Sem atendimentos</option>
          </select>

          <button
            @click="exportarRelatorio"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ArrowDownTrayIcon class="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 min-h-0 overflow-y-auto p-6">
      <div class="w-full max-w-[1600px] mx-auto space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <BaseCard
            title="Total de Clientes"
            :value="estatisticas.totalClientes"
            caption="clientes cadastrados"
            icon-wrapper-class="bg-blue-100"
          >
            <template #icon>
              <UsersIcon class="w-5 h-5 text-blue-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Clientes Ativos"
            :value="estatisticas.clientesComAtendimentos"
            caption="com atendimentos registrados"
            icon-wrapper-class="bg-green-100"
          >
            <template #icon>
              <UserGroupIcon class="w-5 h-5 text-green-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Novos (30 dias)"
            :value="estatisticas.clientesNovosUltimos30Dias"
            caption="clientes adicionados recentemente"
            icon-wrapper-class="bg-purple-100"
          >
            <template #icon>
              <UserPlusIcon class="w-5 h-5 text-purple-600" />
            </template>
          </BaseCard>

          <BaseCard
            title="Média por Cliente"
            :value="estatisticas.mediaAtendimentosPorCliente"
            caption="atendimentos em média"
            icon-wrapper-class="bg-amber-100"
          >
            <template #icon>
              <ChartBarIcon class="w-5 h-5 text-amber-600" />
            </template>
          </BaseCard>
        </div>

        <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200">
              <thead class="bg-neutral-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Atendimentos
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Último Atendimento
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-neutral-200">
                <tr
                  v-for="cliente in clientesPaginados"
                  :key="cliente.id"
                  class="hover:bg-neutral-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-blue-600">
                            {{ cliente.nome_completo?.charAt(0)?.toUpperCase() || '?' }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-neutral-900">
                          {{ cliente.nome_completo || 'Nome não disponível' }}
                        </div>
                        <div class="text-xs text-neutral-500">
                          Cadastrado em {{ formatarDataCurta(cliente.created_at) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {{ formatarCPF(cliente.cpf) || 'Não informado' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <div class="flex items-center gap-2">
                      <MapPinIcon class="w-4 h-4 text-neutral-400" />
                      <span>
                        {{ cliente.cidade || 'Cidade não informada' }}
                        <template v-if="cliente.estado">
                          / {{ cliente.estado }}
                        </template>
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="cliente.totalAtendimentos > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'"
                    >
                      {{ cliente.totalAtendimentos }} atendimento(s)
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {{ formatarUltimoAtendimento(cliente.ultimoAtendimento) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="visualizarDetalhes(cliente.id)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>

                <tr v-if="!carregando && clientesPaginados.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-neutral-400">
                      <ClipboardDocumentListIcon class="w-12 h-12 mb-3" />
                      <p class="text-sm font-medium">Nenhum cliente encontrado</p>
                      <p class="text-xs mt-1">Tente ajustar os filtros de busca</p>
                    </div>
                  </td>
                </tr>

                <tr v-if="carregando">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center text-neutral-400">
                      <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
                      <p class="text-sm font-medium">Carregando clientes...</p>
                      <p class="text-xs mt-1">Aguarde um momento</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-white px-6 py-4 border-t border-neutral-200">
            <div class="flex items-center justify-between flex-col gap-3 md:flex-row">
              <div class="text-sm text-neutral-600">
                Exibindo
                <span class="font-medium">{{ clientesPaginados.length }}</span>
                de
                <span class="font-medium">{{ clientesFiltrados.length }}</span>
                clientes filtrados ({{ clientes.length }} no total)
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="paginaAnterior"
                  :disabled="paginaAtual === 1"
                  class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span class="text-sm text-neutral-500">
                  Página {{ paginaAtual }} de {{ totalPaginas }}
                </span>
                <button
                  @click="paginaProxima"
                  :disabled="paginaAtual >= totalPaginas"
                  class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  UserGroupIcon,
  UserPlusIcon,
  ChartBarIcon,
  MapPinIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/solid'
import BaseCard from '~/components/BaseCard.vue'
import { useRelatorios } from '~/composables/useRelatorios'

definePageMeta({
  title: 'Relatório de Clientes',
  description: 'Estatísticas e dados detalhados dos clientes',
  name: 'relatorios-clientes'
})

useHead({ title: 'Relatório de Clientes - AFAAS Atendimento' })

const router = useRouter()

const {
  buscarClientesRelatorio,
  calcularEstatisticasClientes,
  formatarData
} = useRelatorios()

type ClienteRelatorio = Awaited<ReturnType<typeof buscarClientesRelatorio>>[number]

type FiltroEngajamento = 'todos' | 'com-atendimentos' | 'sem-atendimentos'

const clientes = ref<ClienteRelatorio[]>([])
const carregando = ref(false)
const termoBusca = ref('')
const filtroEstado = ref('')
const filtroEngajamento = ref<FiltroEngajamento>('todos')
const paginaAtual = ref(1)
const itensPorPagina = 15

const estatisticas = reactive({
  totalClientes: 0,
  clientesComAtendimentos: 0,
  clientesSemAtendimento: 0,
  clientesNovosUltimos30Dias: 0,
  mediaAtendimentosPorCliente: 0
})

const estadosDisponiveis = computed(() => {
  const estados = new Set<string>()
  clientes.value.forEach(cliente => {
    if (cliente.estado) {
      estados.add(cliente.estado)
    }
  })
  return Array.from(estados).sort()
})

const normalizarTexto = (valor: string | null | undefined) => {
  return (valor ?? '').toString().trim().toLowerCase()
}

const limparCpf = (cpf: string | null | undefined) => {
  return (cpf ?? '').replace(/\D/g, '')
}

const clientesFiltrados = computed(() => {
  const termo = normalizarTexto(termoBusca.value)
  const cpfTermo = limparCpf(termoBusca.value)

  return clientes.value.filter(cliente => {
    const correspondeBusca = termo
      ? normalizarTexto(cliente.nome_completo).includes(termo) ||
        limparCpf(cliente.cpf).includes(cpfTermo) ||
        normalizarTexto(cliente.cidade).includes(termo)
      : true

    const correspondeEstado = filtroEstado.value
      ? cliente.estado === filtroEstado.value
      : true

    const correspondeEngajamento =
      filtroEngajamento.value === 'todos' ||
      (filtroEngajamento.value === 'com-atendimentos' && (cliente.totalAtendimentos ?? 0) > 0) ||
      (filtroEngajamento.value === 'sem-atendimentos' && (cliente.totalAtendimentos ?? 0) === 0)

    return correspondeBusca && correspondeEstado && correspondeEngajamento
  })
})

const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(clientesFiltrados.value.length / itensPorPagina))
})

const clientesPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  return clientesFiltrados.value.slice(inicio, inicio + itensPorPagina)
})

watch([termoBusca, filtroEstado, filtroEngajamento], () => {
  paginaAtual.value = 1
})

const voltarParaRelatorios = () => {
  router.push('/relatorios')
}

const paginaAnterior = () => {
  if (paginaAtual.value > 1) {
    paginaAtual.value -= 1
  }
}

const paginaProxima = () => {
  if (paginaAtual.value < totalPaginas.value) {
    paginaAtual.value += 1
  }
}

const exportarRelatorio = () => {
  console.log('Exportar relatório de clientes')
}

const formatarCPF = (cpf: string | null | undefined) => {
  const numeros = limparCpf(cpf)
  if (numeros.length !== 11) {
    return cpf ?? ''
  }
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatarDataCurta = (data: string | null) => {
  if (!data) {
    return 'Data não informada'
  }
  return formatarData(data)
}

const formatarUltimoAtendimento = (data: string | null) => {
  if (!data) {
    return 'Sem registros'
  }
  return formatarData(data)
}

const visualizarDetalhes = (clienteId: number) => {
  console.log('Visualizar detalhes do cliente:', clienteId)
}

const carregarClientes = async () => {
  carregando.value = true
  try {
    const dados = await buscarClientesRelatorio()
    clientes.value = dados.map(cliente => ({
      ...cliente,
      totalAtendimentos: cliente.totalAtendimentos ?? 0,
      ultimoAtendimento: cliente.ultimoAtendimento ?? null
    }))

    const stats = calcularEstatisticasClientes(clientes.value)
    Object.assign(estatisticas, stats)
  } catch (error) {
    console.error('Erro ao carregar clientes para relatório:', error)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarClientes()
})
</script>
