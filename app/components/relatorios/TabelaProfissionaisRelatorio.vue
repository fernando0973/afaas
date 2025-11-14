<template>
  <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead class="bg-neutral-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Profissional
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Especialidade
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Atendimentos
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr 
            v-for="profissional in profissionaisPaginados" 
            :key="profissional.profissional_id"
            class="hover:bg-neutral-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-600">
                      {{ profissional.nome_profissional?.charAt(0)?.toUpperCase() || '?' }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-neutral-900">
                    {{ profissional.nome_profissional || 'Nome não disponível' }}
                  </div>
                  <div class="text-sm text-neutral-500">
                    Profissional
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ profissional.especialidade }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {{ profissional.totalAtendimentos || 0 }} atendimento(s)
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="$emit('visualizar-detalhes', profissional.profissional_id)"
                class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Ver detalhes
              </button>
            </td>
          </tr>

          <!-- Estado vazio -->
          <tr v-if="!carregando && profissionaisPaginados.length === 0">
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center text-neutral-400">
                <UserGroupIcon class="w-12 h-12 mb-3" />
                <p class="text-sm font-medium">Nenhum profissional encontrado</p>
                <p class="text-xs mt-1">Tente ajustar os filtros de busca</p>
              </div>
            </td>
          </tr>

          <!-- Estado de carregamento -->
          <tr v-if="carregando">
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center text-neutral-400">
                <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
                <p class="text-sm font-medium">Carregando profissionais...</p>
                <p class="text-xs mt-1">Aguarde um momento</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div class="bg-white px-6 py-4 border-t border-neutral-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-neutral-600">
          Exibindo <span class="font-medium">{{ profissionaisPaginados.length }}</span> de 
          <span class="font-medium">{{ totalProfissionais }}</span> profissionais
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('pagina-anterior')"
            :disabled="paginaAtual === 1"
            class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span class="text-sm text-neutral-500">
            Página {{ paginaAtual }} de {{ totalPaginas }}
          </span>
          <button
            @click="$emit('pagina-proxima')"
            :disabled="paginaAtual >= totalPaginas"
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
import { UserGroupIcon } from '@heroicons/vue/24/solid'

interface ProfissionalRelatorio {
  profissional_id: number
  nome_profissional?: string | null
  especialidade?: string | null
  totalAtendimentos?: number
}

defineProps<{
  profissionaisPaginados: ProfissionalRelatorio[]
  totalProfissionais: number
  carregando: boolean
  paginaAtual: number
  totalPaginas: number
}>()

defineEmits<{
  (event: 'visualizar-detalhes', id: number): void
  (event: 'pagina-anterior'): void
  (event: 'pagina-proxima'): void
}>()
</script>