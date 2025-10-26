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
import { ref, onMounted, watch } from 'vue'
import type { ProfissionalRPC } from '~/types/user'

// Estado do componente
const profissional = ref<ProfissionalRPC | null>(null)
const loading = ref(true)

// Composables
const { buscarProfissionais: fetchProfissionais } = useProfissionais()
const userStore = useUserStore()

// Função para buscar profissionais
const buscarProfissionais = async () => {
  try {
    loading.value = true
    
    const resultado = await fetchProfissionais()
    
    if (resultado.success && resultado.data && resultado.data.length > 0) {
      // Primeiro, tenta encontrar o profissional baseado no profile_id do usuário logado
      const userProfileId = userStore.profile?.id
      
      if (userProfileId) {
        const profissionalLogado = resultado.data.find(p => p.perfil_id === userProfileId)
        
        if (profissionalLogado) {
          profissional.value = profissionalLogado
          return
        }
      }
      
      // Se não encontrar o profissional do usuário logado, usa o primeiro da lista
      profissional.value = resultado.data[0] || null
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
watch(() => userStore.profile, async (newProfile) => {
  if (newProfile) {
    await buscarProfissionais()
  }
}, { immediate: false })

// Buscar dados quando o componente for montado
onMounted(async () => {
  // Garantir que o perfil do usuário esteja carregado
  if (!userStore.profile) {
    await userStore.fetchProfile()
  }
  
  await buscarProfissionais()
})
</script>