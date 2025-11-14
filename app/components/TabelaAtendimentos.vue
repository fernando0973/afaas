<template>
  <div class="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-[1200px] divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Profissional Principal
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Especialidade
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Profissional Auxiliar
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Especialidade
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Plantas
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr
            v-for="atendimento in props.atendimentos"
            :key="atendimento.id"
            class="hover:bg-neutral-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
              {{ props.formatarData(atendimento.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
              {{ atendimento.cliente?.nome_completo || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
              {{ props.obterProfissionalPrincipal(atendimento) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
              {{ props.obterEspecialidadePrincipal(atendimento) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
              {{ props.obterProfissionalAuxiliar(atendimento) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
              {{ props.obterEspecialidadeAuxiliar(atendimento) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {{ atendimento.plantas?.length || 0 }} planta(s)
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="emit('ver-detalhes', atendimento.id)"
                class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Ver detalhes
              </button>
            </td>
          </tr>

          <tr v-if="props.atendimentos.length === 0">
            <td colspan="8" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center text-neutral-400">
                <ClipboardDocumentListIcon class="w-12 h-12 mb-3" />
                <p class="text-sm font-medium">Nenhum atendimento encontrado</p>
                <p class="text-xs mt-1">Tente ajustar os filtros de busca</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-white px-6 py-4 border-t border-neutral-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-neutral-600">
          Exibindo <span class="font-medium">{{ totalFiltrado }}</span> de
          <span class="font-medium">{{ props.totalAtendimentos }}</span> atendimentos
        </div>
        <div class="flex gap-2">
          <button
            @click="emit('pagina-anterior')"
            :disabled="desabilitarAnterior"
            class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <button
            @click="emit('pagina-proxima')"
            :disabled="desabilitarProxima"
            class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardDocumentListIcon } from '@heroicons/vue/24/solid'

interface Atendimento {
  id: number
  created_at: string
  cliente?: { nome_completo?: string | null }
  profissionais?: any[]
  plantas?: any[]
  [key: string]: any
}

const props = defineProps<{
  atendimentos: Atendimento[]
  totalAtendimentos: number
  paginaAtual: number
  itensPorPagina: number
  formatarData: (data: string) => string
  obterProfissionalPrincipal: (atendimento: Atendimento) => string
  obterEspecialidadePrincipal: (atendimento: Atendimento) => string
  obterProfissionalAuxiliar: (atendimento: Atendimento) => string
  obterEspecialidadeAuxiliar: (atendimento: Atendimento) => string
}>()

const emit = defineEmits<{
  'ver-detalhes': [id: number]
  'pagina-anterior': []
  'pagina-proxima': []
}>()

const totalFiltrado = computed(() => props.atendimentos.length)
const desabilitarAnterior = computed(() => props.paginaAtual <= 1)
const desabilitarProxima = computed(
  () => props.paginaAtual * props.itensPorPagina >= props.totalAtendimentos
)
</script>
