<template>
  <div class="flex flex-col items-center justify-center text-center">
    <div v-if="loading" class="text-text-muted">
      Carregando...
    </div>
    <div v-else-if="profissional" class="space-y-1">
      <h3 class="text-lg font-semibold text-text">
        {{ profissional.nome_profissional }}
      </h3>
      <p class="text-sm text-text-muted">
        {{ profissional.especialidade }}
      </p>
    </div>
    <div v-else class="text-text-muted">
      Nenhum profissional encontrado
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Profissional } from '~/types/profissional'

// Estado do componente
const profissional = ref<Profissional | null>(null)
const loading = ref(true)

// Composables e Stores
const userStore = useUserStore()
const agendamentoStore = useAgendamentoStore()
const profissionaisStore = useProfissionaisStore()

// Função para buscar profissionais usando o store (com cache)
const buscarProfissionais = async () => {
  try {
    loading.value = true
    
    // Usar store - busca com cache automático
    const listaProfissionais = await profissionaisStore.buscarProfissionais()
    
    if (listaProfissionais && listaProfissionais.length > 0) {
      // Primeiro, tenta encontrar o profissional baseado no profile_id do usuário logado
      const profileData = userStore.profile
      const userProfileId = profileData?.id
      
      if (userProfileId) {
        const profissionalLogado = listaProfissionais.find((p: any) => p.perfil_id === userProfileId)
        
        if (profissionalLogado) {
          profissional.value = profissionalLogado
          // Só atualizar o store se for diferente do atual
          const profId = profissionalLogado.profissional_id || profissionalLogado.id
          if (profId && agendamentoStore.profissionalSelecionadoId !== profId) {
            agendamentoStore.setProfissionalSelecionado(profId)
          }
          return
        }
      }
      
      // Se não encontrar o profissional do usuário logado, usa o primeiro da lista
      profissional.value = listaProfissionais[0] || null
      
      // Atualizar o store com o primeiro profissional da lista (só se for diferente)
      if (profissional.value) {
        const profId = profissional.value.profissional_id || profissional.value.id
        if (profId && agendamentoStore.profissionalSelecionadoId !== profId) {
          agendamentoStore.setProfissionalSelecionado(profId)
        }
      }
    } else {
      profissional.value = null
    }
    
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
    profissional.value = null
  } finally {
    loading.value = false
  }
}

// Buscar dados quando o componente for montado
onMounted(async () => {
  await buscarProfissionais()
})
</script>