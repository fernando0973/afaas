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
          const profId = profissionalLogado.profissional_id || profissionalLogado.id
          
          // Só atualizar o store se for diferente do atual
          if (profId && agendamentoStore.profissionalSelecionadoId !== profId) {
            agendamentoStore.setProfissionalSelecionado(profId)
            console.log(`👤 Profissional selecionado: ${profissional.value.nome_profissional} (ID: ${profId})`)
            
            // Tentar carregar agendamentos se não existirem
            await tentarCarregarAgendamentos(profId)
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
          console.log(`👤 Profissional padrão selecionado: ${profissional.value.nome_profissional} (ID: ${profId})`)
          
          // Tentar carregar agendamentos se não existirem
          await tentarCarregarAgendamentos(profId)
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

/**
 * Tenta carregar agendamentos se não existirem no store
 * Evita carregar desnecessariamente se já tem dados
 */
const tentarCarregarAgendamentos = async (profId: number) => {
  try {
    // Verificar se já tem agendamentos no store
    const agendamentosAtuais = agendamentoStore.agendamentos
    const jaTemDados = agendamentosAtuais.length > 0
    
    if (jaTemDados) {
      console.log('✅ Agendamentos já carregados, não recarregando')
      return
    }
    
    // Verificar cache primeiro
    const agendamentosCache = agendamentoStore.buscarNoCache(profId, agendamentoStore.diasSemana)
    if (agendamentosCache) {
      console.log('💾 Restaurando agendamentos do cache')
      agendamentoStore.setAgendamentos(agendamentosCache)
      return
    }
    
    // Se não tem cache nem dados, carregar do banco
    console.log('🔄 Carregando agendamentos para profissional selecionado')
    const { buscarAgendamentosSemana } = useAgendamentos()
    await buscarAgendamentosSemana(profId, agendamentoStore.diasSemana, false)
    
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error)
  }
}

// Buscar dados quando o componente for montado
onMounted(async () => {
  await buscarProfissionais()
})
</script>