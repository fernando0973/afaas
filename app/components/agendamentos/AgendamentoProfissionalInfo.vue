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
      <p class="text-xs text-text-muted bg-neutral-100 px-2 py-1 rounded">
        ID: {{ profissional.profissional_id }}
      </p>
    </div>
    <div v-else class="text-text-muted">
      Nenhum profissional encontrado
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ProfissionalRPC } from '~/types/user'

// Estado do componente
const profissional = ref<ProfissionalRPC | null>(null)
const loading = ref(true)

// Composables e Stores
const { buscarProfissionais: fetchProfissionais } = useProfissionais()
const userStore = useUserStore()
const agendamentoStore = useAgendamentoStore()

// Use storeToRefs para acessar as refs de forma reativa
const { profile: userProfile } = storeToRefs(userStore)

// Função para buscar profissionais
const buscarProfissionais = async () => {
  try {
    loading.value = true
    
    const resultado = await fetchProfissionais()
    
    if (resultado.success && resultado.data && resultado.data.length > 0) {
      // Primeiro, tenta encontrar o profissional baseado no profile_id do usuário logado
      const profileData = userProfile.value
      const userProfileId = profileData?.id
      
      if (userProfileId) {
        const profissionalLogado = resultado.data.find(p => p.perfil_id === userProfileId)
        
        if (profissionalLogado) {
          profissional.value = profissionalLogado
          // Só atualizar o store se for diferente do atual
          if (agendamentoStore.profissionalSelecionadoId !== profissionalLogado.profissional_id) {
            agendamentoStore.setProfissionalSelecionado(profissionalLogado.profissional_id)
          }
          return
        }
      }
      
      // Se não encontrar o profissional do usuário logado, usa o primeiro da lista
      profissional.value = resultado.data[0] || null
      
      // Atualizar o store com o primeiro profissional da lista (só se for diferente)
      if (profissional.value && agendamentoStore.profissionalSelecionadoId !== profissional.value.profissional_id) {
        agendamentoStore.setProfissionalSelecionado(profissional.value.profissional_id)
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

// Watcher para reagir quando o perfil do usuário mudar
watch(userProfile, async (newProfile, oldProfile) => {
  const newProfileId = newProfile?.id
  const oldProfileId = oldProfile?.id
  
  // Só recarregar se o ID realmente mudou e não for a primeira execução
  if (newProfileId && newProfileId !== oldProfileId) {
    await buscarProfissionais()
  }
}, { immediate: false })

// Buscar dados quando o componente for montado
onMounted(async () => {
  // Garantir que o perfil do usuário esteja carregado
  const profileData = userProfile.value
  if (!profileData) {
    await userStore.fetchProfile()
    
    // Aguardar um pouco para garantir que o perfil seja propagado
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  await buscarProfissionais()
})

// Adicionar um watcher adicional para casos onde o perfil demora para carregar
watch(() => userStore.loading, async (isLoading, wasLoading) => {
  // Quando o loading do perfil terminar e não havia profissional selecionado ainda
  if (wasLoading && !isLoading && userProfile.value && !profissional.value) {
    await buscarProfissionais()
  }
})
</script>