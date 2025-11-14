<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Gestão de Profissionais</h1>
    
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Lista de Profissionais</h2>
          <button
            @click="abrirModalCriar"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Adicionar Profissional
          </button>
        </div>
      </div>

      <!-- Tabela de Profissionais -->
      <TabelaProfissionais
        :profissionais="profissionais"
        @visualizar="handleVisualizar"
        @editar="handleEditar"
        @remover="handleRemover"
      />
    </div>

    <!-- Modal de Confirmação de Remoção -->
    <BaseConfirmModal
      v-model="showConfirmModal"
      title="Confirmar Remoção"
      message="Tem certeza que deseja remover este profissional? Esta ação não pode ser desfeita."
      @confirm="handleConfirmRemocao"
      @cancel="handleCancelRemocao"
      @close="handleCancelRemocao"
    />

    <!-- Modal de Profissional -->
    <ProfissionalModal
      v-model="showModal"
      :is-edicao="modalIsEdicao"
      :profissional="profissionalParaEditar"
      :especialidades="especialidades"
      :perfis="perfis"
      @salvar="aoSalvarProfissional"
      @cancelar="fecharModal"
      @fechar="fecharModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/solid'

// Tipos
interface ProfissionalTabela {
  profissional_id: string
  nome_profissional: string
  especialidade: string
  totalAtendimentos?: number
}

// Estado reativo
const profissionais = ref<ProfissionalTabela[]>([])
const showModal = ref(false)
const showConfirmModal = ref(false)
const modalIsEdicao = ref(false)
const profissionalParaEditar = ref<any>(null)
const profissionalParaRemover = ref<any>(null)
const especialidades = ref<any[]>([])
const perfis = ref<any[]>([])

// Composables
const { buscarProfissionais, buscarEspecialidades, buscarPerfis, inserirProfissional, removerProfissional } = useProfissionais()
const toast = useToastNotification()

// Função para carregar profissionais
const carregarProfissionais = async () => {
  try {
    const resultado = await buscarProfissionais()

    if (resultado.success && resultado.data) {
      // Converter de ProfissionalRPC para ProfissionalTabela
      const profissionaisConvertidos: ProfissionalTabela[] = resultado.data.map((prof: any) => ({
        profissional_id: String(prof.id),
        nome_profissional: prof.nome_profissional || 'Sem nome',
        especialidade: prof.especialidade || 'Sem especialidade'
      }))

      profissionais.value = profissionaisConvertidos
    } else {
      console.error('Erro ao carregar profissionais:', resultado.error)
    }
  } catch (error) {
    console.error('Erro inesperado ao carregar profissionais:', error)
  }
}

// Funções do modal
const abrirModalCriar = async () => {
  modalIsEdicao.value = false
  profissionalParaEditar.value = null
  await carregarDadosModal()
  showModal.value = true
}

const fecharModal = () => {
  showModal.value = false
  modalIsEdicao.value = false
  profissionalParaEditar.value = null
}

const carregarDadosModal = async () => {
  // Carregar especialidades e perfis para o modal
  try {
    const [resultEsp, resultPerfis] = await Promise.all([
      buscarEspecialidades(),
      buscarPerfis()
    ])
    
    if (resultEsp.success) especialidades.value = resultEsp.data
    if (resultPerfis.success) perfis.value = resultPerfis.data
  } catch (error) {
    console.error('Erro ao carregar dados do modal:', error)
  }
}

// Handlers da tabela
const handleVisualizar = (profissional: any) => {
  toast.info('Funcionalidade de visualização em desenvolvimento')
}

const handleEditar = (profissional: any) => {
  toast.info('Funcionalidade de edição em desenvolvimento')
}

const handleRemover = (profissional: any) => {
  profissionalParaRemover.value = profissional
  showConfirmModal.value = true
}

// Confirmação de remoção
const handleConfirmRemocao = async () => {
  if (!profissionalParaRemover.value) return

  try {
    const resultado = await removerProfissional(profissionalParaRemover.value.profissional_id)
    
    if (resultado.success) {
      toast.success(resultado.message)
      await carregarProfissionais()
    } else {
      toast.error(resultado.message)
    }
  } catch (error) {
    toast.error('Erro inesperado ao remover profissional')
  } finally {
    showConfirmModal.value = false
    profissionalParaRemover.value = null
  }
}

const handleCancelRemocao = () => {
  showConfirmModal.value = false
  profissionalParaRemover.value = null
}

// Salvar profissional
const aoSalvarProfissional = async (dadosProfissional: any) => {
  console.log('aoSalvarProfissional chamada com:', dadosProfissional)
  try {
    const resultado = await inserirProfissional(dadosProfissional.profile_id, dadosProfissional.especialidade_id)
    console.log('Resultado inserirProfissional:', resultado)
    
    if (resultado.success) {
      toast.success(resultado.message)
      fecharModal()
      await carregarProfissionais()
    } else {
      console.log('Erro - success é false:', resultado)
      toast.error(resultado.message || 'Erro ao adicionar profissional')
    }
  } catch (error: any) {
    console.log('Erro capturado no catch:', error)
    toast.error('Erro interno ao adicionar profissional')
  }
}

// Carregar dados ao montar
onMounted(() => {
  carregarProfissionais()
})
</script>