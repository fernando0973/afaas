<template>
  <div class="bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <!-- Cabeçalho da tabela -->
    <div class="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-neutral-900">Profissionais Cadastrados</h3>
          <p class="text-sm text-neutral-600 mt-1">
            {{ profissionais.length }} {{ profissionais.length === 1 ? 'profissional encontrado' : 'profissionais encontrados' }}
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton 
            variant="outline"
            size="sm"
            :disabled="carregando"
            @click="$emit('recarregar')"
          >
            <template #iconLeft>
              <ArrowPathIcon :class="['w-4 h-4', carregando ? 'animate-spin' : '']" />
            </template>
            Atualizar
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Estado de carregamento -->
    <div v-if="carregando" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <ArrowPathIcon class="w-8 h-8 text-neutral-400 animate-spin mb-3" />
        <p class="text-neutral-600">Carregando profissionais...</p>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="profissionais.length === 0" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center">
        <UserGroupIcon class="w-12 h-12 text-neutral-300 mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 mb-2">Nenhum profissional encontrado</h3>
        <p class="text-neutral-600 mb-4">Comece adicionando o primeiro profissional do sistema.</p>
        <BaseButton 
          variant="primary"
          @click="$emit('adicionar')"
        >
          <template #iconLeft>
            <PlusIcon class="w-4 h-4" />
          </template>
          Adicionar Profissional
        </BaseButton>
      </div>
    </div>

    <!-- Tabela de dados -->
    <div v-else class="overflow-x-auto">
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
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          <tr 
            v-for="profissional in profissionais" 
            :key="profissional.profissional_id"
            class="hover:bg-neutral-50 transition-colors cursor-pointer"
            @click="$emit('visualizar', profissional.profissional_id)"
            title="Clique para visualizar detalhes do profissional"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-600">
                      {{ profissional.nome_profissional?.charAt(0)?.toUpperCase() || '?' }}
                    </span>
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-neutral-900">
                    {{ profissional.nome_profissional || 'Nome não disponível' }}
                  </div>
                  <div class="text-xs text-neutral-500">
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {{ profissional.totalAtendimentos || 0 }} atendimento(s)
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, UserGroupIcon, PlusIcon } from '@heroicons/vue/24/outline'

interface ProfissionalTabela {
  profissional_id: string
  nome_profissional: string
  especialidade: string
  totalAtendimentos?: number
}

withDefaults(defineProps<{
  profissionais: ProfissionalTabela[]
  carregando?: boolean
}>(), {
  profissionais: () => [],
  carregando: false
})

defineEmits<{
  visualizar: [profissionalId: string]
  recarregar: []
  adicionar: []
}>()
</script>