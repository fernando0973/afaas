<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Cabeçalho da página -->
    <header class="bg-white border-b border-neutral-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-neutral-900">Profissionais</h1>
          <p class="text-sm text-neutral-600 mt-1">
            Gerencie os profissionais e suas especialidades
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <BaseButton 
            variant="outline"
            @click="filtrarProfissionais"
          >
            <template #iconLeft>
              <UserGroupIcon class="w-4 h-4" />
            </template>
            Filtrar
          </BaseButton>
          <BaseButton 
            variant="primary"
            :disabled="!isAdmin || carregandoDados"
            @click="abrirModalCriar"
          >
            <template #iconLeft>
              <PlusIcon class="w-4 h-4" />
            </template>
            Novo Profissional
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="p-6">
      <TabelaProfissionais
        ref="tabelaRef"
        :is-admin="isAdmin"
        @editar="handleEditar"
        @remover="handleRemover"
        @recarregar="handleRecarregar"
        @adicionar="handleAdicionar"
      />
    </main>

    <!-- Modal de confirmação de remoção -->
    <BaseConfirmModal
      v-model="showConfirmModal"
      type="danger"
      title="Excluir profissional"
      :message="`Tem certeza que deseja excluir '${profissionalParaRemover?.nome_profissional}'? Esta ação não pode ser desfeita.`"
      confirm-text="Sim, excluir"
      cancel-text="Cancelar"
      @confirm="handleConfirmRemocao"
      @cancel="handleCancelRemocao"
      @close="handleCancelRemocao"
    />

    <!-- Modal de Profissional -->
    <ProfissionalModal
      v-model="showModal"
      :is-edicao="modalIsEdicao"
      :profissional="profissionalParaEditar"
      :perfis="perfis"
      :especialidades="especialidades"
      :carregando="carregandoDados"
      @salvar="aoSalvarProfissional"
      @cancelar="fecharModal"
      @fechar="fecharModal"
    />
  </div>
</template>

<script setup lang="ts">
import { UserGroupIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { ProfissionalRPC } from '~/types/user'
import type { PerfilRPC } from '~/types/database.types'
import type { Especialidade } from '~/types/especialidade'
import { useToastNotification as useToast } from '~/composables/useToastNotification'

// Meta da página
definePageMeta({
  title: 'Profissionais',
  description: 'Gerencie os profissionais e suas especialidades'
})

// Título da página
useHead({
  title: 'Profissionais - AFAAS'
})

// Store do usuário para verificar permissões
const userStore = useUserStore()

// Composables
const { buscarPerfis, buscarEspecialidades, removerProfissional, inserirProfissional } = useProfissionais()

// Referência para o componente da tabela
const tabelaRef = ref()

// Computed para verificar se é admin
const isAdmin = computed(() => userStore.isAdmin)

// Estados para os dados do modal
const perfis = ref([] as PerfilRPC[])
const especialidades = ref([] as Especialidade[])
const carregandoDados = ref(false)

// Estados do modal de profissional
const showModal = ref(false)
const modalIsEdicao = ref(false)
const profissionalParaEditar = ref<ProfissionalRPC | null>(null)

// Estados do modal de confirmação
const showConfirmModal = ref(false)
const profissionalParaRemover = ref<ProfissionalRPC | null>(null)

// Toast
const toast = useToast()

// Funções para carregar dados
const carregarPerfis = async () => {
  try {
    const resultado = await buscarPerfis()
    if (resultado.success) {
      perfis.value = resultado.data
    } else {
      toast.error('Erro ao carregar usuários/perfis')
    }
  } catch (error) {
    toast.error('Erro ao carregar usuários/perfis')
  }
}

const carregarEspecialidades = async () => {
  try {
    const resultado = await buscarEspecialidades()
    if (resultado.success) {
      especialidades.value = resultado.data
    } else {
      toast.error('Erro ao carregar especialidades')
    }
  } catch (error) {
    toast.error('Erro ao carregar especialidades')
  }
}

const carregarDadosModal = async () => {
  if (carregandoDados.value) return // Evita múltiplas chamadas simultâneas
  
  carregandoDados.value = true
  try {
    await Promise.all([
      carregarPerfis(),
      carregarEspecialidades()
    ])
  } catch (error) {
    toast.error('Erro ao carregar dados necessários')
  } finally {
    carregandoDados.value = false
  }
}

// Funções do modal de profissional
const abrirModalCriar = async () => {
  modalIsEdicao.value = false
  profissionalParaEditar.value = null
  await carregarDadosModal()
  showModal.value = true
}

const abrirModalEditar = async (profissional: ProfissionalRPC) => {
  modalIsEdicao.value = true
  profissionalParaEditar.value = profissional
  await carregarDadosModal()
  showModal.value = true
}

const fecharModal = () => {
  showModal.value = false
  modalIsEdicao.value = false
  profissionalParaEditar.value = null
  perfis.value = []
  especialidades.value = []
}

const aoSalvarProfissional = async (dadosProfissional: any) => {
  
  try {
    const resultado = await inserirProfissional(dadosProfissional.profile_id, dadosProfissional.especialidade_id)
    
    if (resultado.success) {
      toast.success(resultado.message)
      fecharModal()
      
      // Recarregar a tabela de profissionais
      if (tabelaRef.value && typeof tabelaRef.value.recarregarDados === 'function') {
        await tabelaRef.value.recarregarDados()
      }
    } else {
      toast.error(resultado.message || 'Erro ao adicionar profissional')
    }
  } catch (error: any) {
    toast.error('Erro interno ao adicionar profissional')
  }
}

// Handlers para os eventos da tabela
const handleEditar = (profissional: ProfissionalRPC) => {
  abrirModalEditar(profissional)
}

const handleRemover = (profissional: ProfissionalRPC) => {
  profissionalParaRemover.value = profissional
  showConfirmModal.value = true
}

// Handler para confirmação de remoção
const handleConfirmRemocao = async () => {
  if (!profissionalParaRemover.value) return

  try {
    const resultado = await removerProfissional(profissionalParaRemover.value.profissional_id)
    
    if (resultado.success) {
      toast.success(resultado.message)
      
      // Recarregar a tabela
      if (tabelaRef.value && typeof tabelaRef.value.recarregarDados === 'function') {
        await tabelaRef.value.recarregarDados()
      }
    } else {
      toast.error(resultado.message)
    }
  } catch (error) {
    toast.error('Erro inesperado ao remover profissional')
  } finally {
    // Fechar modal e limpar estado
    showConfirmModal.value = false
    profissionalParaRemover.value = null
  }
}

// Handler para cancelar remoção
const handleCancelRemocao = () => {
  showConfirmModal.value = false
  profissionalParaRemover.value = null
}

const handleRecarregar = () => {
  // TODO: Implementar feedback de sucesso se necessário
}

const handleAdicionar = () => {
  abrirModalCriar()
}

// Handlers para os botões do cabeçalho
const filtrarProfissionais = () => {
  // TODO: Implementar filtros
  toast.info('Funcionalidade de filtro em desenvolvimento')
}

const adicionarProfissional = () => {
  // TODO: Implementar modal de adição
  toast.info('Funcionalidade de adição em desenvolvimento')
}

// Perfil do usuário já carregado pelo plugin auth.client.ts
// Removido userStore.fetchProfile() duplicado
</script>