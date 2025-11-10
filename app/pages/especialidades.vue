<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Cabeçalho da página -->
    <header class="bg-white border-b border-neutral-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-neutral-900">Especialidades</h1>
          <p class="text-sm text-neutral-600 mt-1">
            Gerencie as especialidades e áreas de atuação dos profissionais
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton 
            variant="outline"
            @click="filtrarEspecialidades"
          >
            <template #iconLeft>
              <AcademicCapIcon class="w-4 h-4" />
            </template>
            Filtrar
          </BaseButton>
          <BaseButton 
            variant="primary"
            :disabled="!isAdmin"
            @click="adicionarEspecialidade"
          >
            <template #iconLeft>
              <PlusIcon class="w-4 h-4" />
            </template>
            Nova Especialidade
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="p-6">
      <EspecialidadeTable
        ref="tabelaRef"
        :is-admin="isAdmin"
        @editar="handleEditar"
        @remover="handleRemover"
        @recarregar="handleRecarregar"
        @adicionar="handleAdicionar"
      />
    </main>

    <!-- Modal de especialidade -->
    <EspecialidadeModal
      v-model="showModal"
      :is-edicao="modalIsEdicao"
      :especialidade-id="modalEspecialidadeId"
      :especialidade-data="modalEspecialidadeData"
      @save="handleSaveEspecialidade"
      @cancel="handleCancelModal"
      @close="handleCloseModal"
    />

    <!-- Modal de confirmação de remoção -->
    <BaseConfirmModal
      v-model="showConfirmModal"
      type="danger"
      title="Excluir especialidade"
      :message="`Tem certeza que deseja excluir '${especialidadeParaRemover?.especialidade}'? Esta ação não pode ser desfeita.`"
      confirm-text="Sim, excluir"
      cancel-text="Cancelar"
      @confirm="handleConfirmRemocao"
      @cancel="handleCancelRemocao"
      @close="handleCancelRemocao"
    />
  </div>
</template>

<script setup lang="ts">
import { AcademicCapIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { Especialidade } from '~/types/especialidade'
import { useProfissionais } from '~/composables/useProfissionais'
import { useToastNotification as useToast } from '~/composables/useToastNotification'

// Meta da página
definePageMeta({
  title: 'Especialidades',
  description: 'Gerencie as especialidades e áreas de atuação dos profissionais'
})

// Título da página
useHead({
  title: 'Especialidades - AFAAS'
})

// Store do usuário para verificar permissões
const userStore = useUserStore()

// Hidratação segura para evitar mismatches
const { safeValue } = useSafeHydration()

// Referência para o componente da tabela
const tabelaRef = ref()

// Computed para verificar se é admin (com fallback seguro para SSR)
const isAdmin = computed(() => safeValue(userStore.isAdmin, false))

// Estados do modal
const showModal = ref(false)
const modalIsEdicao = ref(false)
const modalEspecialidadeId = ref<number | null>(null)
const modalEspecialidadeData = ref<Especialidade | null>(null)

// Handlers para os eventos da tabela
const handleEditar = (especialidade: Especialidade) => {
  modalIsEdicao.value = true
  modalEspecialidadeId.value = especialidade.id
  modalEspecialidadeData.value = especialidade
  showModal.value = true
}

const handleRemover = (especialidade: Especialidade) => {
  especialidadeParaRemover.value = especialidade
  showConfirmModal.value = true
}

// Handler para confirmação de remoção
const handleConfirmRemocao = async () => {
  if (!especialidadeParaRemover.value) return

  const resp = await removerEspecialidade(especialidadeParaRemover.value.id)
  
  if (resp.success) {
    toast.success(resp.message || 'Especialidade removida com sucesso!')
    // recarregar tabela
    if (tabelaRef.value?.recarregarDados) {
      await tabelaRef.value.recarregarDados()
    }
  } else {
    toast.error(resp.message || 'Erro ao remover especialidade')
  }
  
  // fechar modal e limpar estado
  showConfirmModal.value = false
  especialidadeParaRemover.value = null
}

// Handler para cancelar remoção
const handleCancelRemocao = () => {
  showConfirmModal.value = false
  especialidadeParaRemover.value = null
}

const handleRecarregar = () => {
  // TODO: Implementar feedback de sucesso se necessário
}

const handleAdicionar = () => {
  modalIsEdicao.value = false
  modalEspecialidadeId.value = null
  modalEspecialidadeData.value = null
  showModal.value = true
}

// Handlers para os botões do cabeçalho
const filtrarEspecialidades = () => {
  // TODO: Implementar filtros
}

const adicionarEspecialidade = () => {
  modalIsEdicao.value = false
  modalEspecialidadeId.value = null
  modalEspecialidadeData.value = null
  showModal.value = true
}

// Handlers do modal
const { inserirEspecialidade, editarEspecialidade, removerEspecialidade } = useProfissionais()
const toast = useToast()

// Estados do modal de confirmação
const showConfirmModal = ref(false)
const especialidadeParaRemover = ref<Especialidade | null>(null)

const handleSaveEspecialidade = async (data: { especialidade: string; id?: number }) => {

  if (!modalIsEdicao.value) {
    // Criar nova especialidade
    const nome = data.especialidade
    const resp = await inserirEspecialidade(nome)

    if (resp.success) {
      toast.success(resp.message || 'Especialidade criada com sucesso!')
      // fechar modal
      showModal.value = false
      // recarregar tabela
      if (tabelaRef.value?.recarregarDados) {
        await tabelaRef.value.recarregarDados()
      }
    } else {
      // backend pode retornar mensagem de erro (ex: sem permissão)
      toast.error(resp.message || 'Erro ao criar especialidade')
    }
  } else {
    // Editar especialidade existente
    const nome = data.especialidade
    const id = modalEspecialidadeId.value

    if (id) {
      const resp = await editarEspecialidade(nome, id)

      if (resp.success) {
        toast.success(resp.message || 'Especialidade editada com sucesso!')
        // fechar modal
        showModal.value = false
        // recarregar tabela
        if (tabelaRef.value?.recarregarDados) {
          await tabelaRef.value.recarregarDados()
        }
      } else {
        toast.error(resp.message || 'Erro ao editar especialidade')
      }
    } else {
      toast.error('ID da especialidade não encontrado')
    }
  }
}

const handleCancelModal = () => {
  showModal.value = false
}

const handleCloseModal = () => {
  showModal.value = false
}

// Perfil do usuário já carregado pelo plugin auth.client.ts
// Removido userStore.fetchProfile() duplicado
</script>