<template>
  <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ranking
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Planta
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Nome científico
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Partes utilizadas
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Indicações (resumo)
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total de indicações
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              RENISUS
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr
            v-for="(planta, index) in plantas"
            :key="planta.id"
            class="hover:bg-neutral-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-700 font-semibold">
                {{ index + 1 }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-neutral-900">
                  {{ planta.nome_popular }}
                </span>
                <span class="text-xs text-neutral-500">
                  Cadastrada em {{ formatarDataCurta(planta.created_at) }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              {{ planta.nome_cientifico || 'Não informado' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              {{ formatarPartesUsadas(planta.partes_usadas) }}
            </td>
            <td class="px-6 py-4 text-sm text-neutral-700 max-w-xs">
              {{ resumirTexto(planta.indicacoes || planta.acao_terapeutica, 90) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                {{ obterPontuacaoIndicacoes(planta) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                v-if="planta.renisus"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                RENISUS
              </span>
              <span v-else class="text-xs text-neutral-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="$emit('abrirDetalhes', planta)"
                class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Ver detalhes
              </button>
            </td>
          </tr>

          <!-- Estado vazio -->
          <tr v-if="plantas.length === 0 && !carregando">
            <td colspan="8" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center text-neutral-400">
                <ClipboardDocumentListIcon class="w-12 h-12 mb-3" />
                <p class="text-sm font-medium">Nenhuma planta encontrada</p>
                <p class="text-xs mt-1">Ajuste sua busca ou filtros para visualizar outros resultados</p>
              </div>
            </td>
          </tr>

          <!-- Estado de carregamento -->
          <tr v-if="carregando">
            <td colspan="8" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center text-neutral-400">
                <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
                <p class="text-sm font-medium">Carregando plantas...</p>
                <p class="text-xs mt-1">Aguarde enquanto buscamos os dados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardDocumentListIcon } from '@heroicons/vue/24/solid'

interface PlantaRelatorio {
  id: number
  nome_popular: string
  nome_cientifico?: string | null
  partes_usadas?: string[] | null
  indicacoes?: string | null
  acao_terapeutica?: string | null
  created_at: string | null
  renisus?: boolean | null
}

defineProps<{
  plantas: PlantaRelatorio[]
  carregando?: boolean
}>()

defineEmits<{
  (event: 'abrirDetalhes', planta: PlantaRelatorio): void
}>()

const resumirTexto = (texto: string | null | undefined, limite = 90) => {
  if (!texto) {
    return 'Sem informações cadastradas'
  }
  const textoLimpo = texto.trim()
  if (textoLimpo.length <= limite) {
    return textoLimpo
  }
  return `${textoLimpo.slice(0, limite).trim()}...`
}

const formatarPartesUsadas = (partes: string[] | null | undefined) => {
  if (!Array.isArray(partes) || partes.length === 0) {
    return 'Não informado'
  }
  if (partes.length <= 2) {
    return partes.join(', ')
  }
  const [primeira, segunda, ...resto] = partes
  return `${primeira}, ${segunda} +${resto.length}`
}

const formatarDataCurta = (data: string | null | undefined) => {
  if (!data) {
    return 'Data não informada'
  }
  try {
    const parsed = new Date(data)
    if (Number.isNaN(parsed.getTime())) {
      return 'Data não informada'
    }
    return parsed.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return 'Data não informada'
  }
}

const contarIndicacoes = (texto: string | null | undefined) => {
  if (!texto) {
    return 0
  }

  const segmentos = texto
    .split(/\r?\n|;|•|-|\u2022/)
    .map(item => item.replace(/^[\s•\-–]+/, '').trim())
    .filter(Boolean)

  if (segmentos.length === 0 && texto.trim().length > 0) {
    return 1
  }

  return segmentos.length
}

const obterPontuacaoIndicacoes = (planta: PlantaRelatorio) => {
  const totalIndicacoes = contarIndicacoes(planta.indicacoes)
  const totalAcoes = contarIndicacoes(planta.acao_terapeutica)
  return Math.max(totalIndicacoes, totalAcoes)
}
</script>