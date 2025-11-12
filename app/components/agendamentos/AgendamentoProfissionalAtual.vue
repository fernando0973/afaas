<template>
  <button
    type="button"
    class="w-full flex flex-col items-center justify-center text-center rounded-lg px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    :disabled="loading"
    @click="handleAbrirSelecao"
  >
    <div v-if="loading" class="text-text-muted">
      Carregando...
    </div>
    <div v-else-if="profissional" class="space-y-1">
      <h3 class="text-lg font-semibold text-text">
        {{ profissional.nome_profissional || profissional.nome_completo }}
      </h3>
      <p class="text-sm text-text-muted">
        {{ profissional.especialidade || 'Especialidade não informada' }}
      </p>
    </div>
    <div v-else class="text-text-muted">
      Nenhum profissional encontrado
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Profissional } from '~/types/profissional'
import { useAgendamentos } from '~/composables/useAgendamentos'
import { useAgendamentoStore } from '~/stores/agendamento'
import { useProfissionaisStore } from '~/stores/useProfissionaisStore'
import { useUserStore } from '~/stores/useUserStore'

const emit = defineEmits<{ 'abrir-selecao': [] }>()

// Estado do componente
const profissional = ref<Profissional | null>(null)
const loading = ref(true)

// Composables e Stores
const userStore = useUserStore()
const agendamentoStore = useAgendamentoStore()
const profissionaisStore = useProfissionaisStore()
const { profissionalSelecionadoId } = storeToRefs(agendamentoStore)
const { profissionais } = storeToRefs(profissionaisStore)

const sincronizarProfissionalComSelecao = (profissionaisLista: readonly Profissional[], selecionadoId: number | null) => {
  if (!selecionadoId) {
    profissional.value = null
    return
  }

  const encontrado = profissionaisLista.find((item: Profissional) => {
    const itemId = item.profissional_id ?? item.id
    return itemId === selecionadoId
  })

  if (encontrado) {
    profissional.value = encontrado
  }
}

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
        const profissionalLogado = listaProfissionais.find((p: Profissional) => p.perfil_id === userProfileId)

        if (profissionalLogado) {
          profissional.value = profissionalLogado
          const profId = profissionalLogado.profissional_id || profissionalLogado.id || null

          // Só atualizar o store se for diferente do atual
          if (profId && profissionalSelecionadoId.value !== profId) {
            agendamentoStore.setProfissionalSelecionado(profId)

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
        const profId = profissional.value.profissional_id || profissional.value.id || null
        if (profId && profissionalSelecionadoId.value !== profId) {
          agendamentoStore.setProfissionalSelecionado(profId)

          // Tentar carregar agendamentos se não existirem
          await tentarCarregarAgendamentos(profId)
        }
      }
    } else {
      profissional.value = null
    }
  } catch (error) {
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
      return
    }

    // Verificar cache primeiro
    const agendamentosCache = agendamentoStore.buscarNoCache(profId, agendamentoStore.diasSemana)
    if (agendamentosCache) {
      agendamentoStore.setAgendamentos(agendamentosCache)
      return
    }

    // Se não tem cache nem dados, carregar do banco
    const { buscarAgendamentosSemana } = useAgendamentos()
    await buscarAgendamentosSemana(profId, agendamentoStore.diasSemana, false)
  } catch (error) {
  }
}

const handleAbrirSelecao = () => {
  emit('abrir-selecao')
}

// Atualiza exibição quando o ID selecionado mudar
watch(profissionalSelecionadoId, (selecionadoId: number | null) => {
  sincronizarProfissionalComSelecao(profissionais.value, selecionadoId)
})

// Reage a atualizações da lista de profissionais
watch(
  () => profissionais.value,
  (lista: readonly Profissional[]) => {
    sincronizarProfissionalComSelecao(lista, profissionalSelecionadoId.value)
  }
)

// Buscar dados quando o componente for montado
onMounted(async () => {
  await buscarProfissionais()
})
</script>