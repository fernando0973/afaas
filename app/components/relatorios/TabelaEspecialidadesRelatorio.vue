<template>
  <div class="relative">
    <!-- Loading state -->
    <div v-if="carregando" class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-neutral-200 rounded w-1/4"></div>
        <div class="space-y-3">
          <div v-for="n in 5" :key="n" class="grid grid-cols-4 gap-4">
            <div class="h-4 bg-neutral-200 rounded"></div>
            <div class="h-4 bg-neutral-200 rounded"></div>
            <div class="h-4 bg-neutral-200 rounded"></div>
            <div class="h-4 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela Principal -->
    <div v-else-if="especialidades.length > 0" class="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-neutral-200">
          <!-- Header -->
          <thead class="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Posição
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Especialidade
              </th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Profissionais
              </th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Atendimentos
              </th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="bg-white divide-y divide-neutral-200">
            <tr
              v-for="(especialidade, index) in especialidades"
              :key="especialidade.id"
              class="hover:bg-neutral-50 transition-colors duration-150"
            >
              <!-- Posição/Ranking -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    :class="[
                      'flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-white'
                        : index === 1
                        ? 'bg-gradient-to-br from-neutral-300 to-neutral-500 border-neutral-200 text-white'
                        : index === 2
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-500 text-white'
                        : 'bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300 text-indigo-800'
                    ]"
                  >
                    {{ index + 1 }}
                  </div>
                </div>
              </td>

              <!-- Nome da Especialidade -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div class="text-sm font-semibold text-neutral-900">
                    {{ especialidade.especialidade }}
                  </div>
                </div>
              </td>

              <!-- Profissionais -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="space-y-1">
                  <div class="text-sm font-bold text-neutral-900">
                    {{ especialidade.totalProfissionais || 0 }}
                  </div>
                  <div class="text-xs text-neutral-500">
                    profissionais
                  </div>
                </div>
              </td>

              <!-- Atendimentos -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="space-y-1">
                  <div class="text-sm font-bold text-neutral-900">
                    {{ especialidade.totalAtendimentos || 0 }}
                  </div>
                  <div class="text-xs text-neutral-500">
                    atendimentos
                  </div>
                </div>
              </td>

              <!-- Ações -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="$emit('abrirDetalhes', especialidade)"
                  class="inline-flex items-center px-3 py-1.5 border border-indigo-300 shadow-sm text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all duration-150"
                  title="Ver detalhes da especialidade"
                >
                  Ver Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
      <div class="mx-auto h-12 w-12 text-neutral-400 mb-4">
        <AcademicCapIcon class="h-full w-full" />
      </div>
      <h3 class="text-lg font-medium text-neutral-900 mb-2">
        Nenhuma especialidade encontrada
      </h3>
      <p class="text-sm text-neutral-500 max-w-sm mx-auto">
        Não há especialidades que correspondam aos filtros aplicados.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AcademicCapIcon } from '@heroicons/vue/24/outline'

// Tipos
type EspecialidadeRelatorio = {
  id: number
  especialidade: string
  created_at: string
  totalProfissionais?: number
  totalAtendimentos?: number
}

// Props
defineProps<{
  especialidades: EspecialidadeRelatorio[]
  carregando: boolean
}>()

// Events
defineEmits<{
  abrirDetalhes: [especialidade: EspecialidadeRelatorio]
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>