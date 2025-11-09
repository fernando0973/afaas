<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex-shrink-0 px-6 pt-4 pb-3">
      <!-- Primeira linha: 3 componentes principais -->
      <div class="h-20 grid grid-cols-3 items-center mb-4">
        <!-- Lado esquerdo: Controlador de navegação -->
        <div class="flex justify-start">
          <AgendamentoControlador />
        </div>
        
        <!-- Centro: Informações do profissional -->
        <div class="flex justify-center">
          <AgendamentoProfissionalInfo />
        </div>
        
        <!-- Lado direito: Botão para novo agendamento -->
        <div class="flex justify-end pr-4 space-x-2">
          
          <BaseButton 
            variant="primary"
            @click="novoAgendamento"
          >
            + Novo
          </BaseButton>
        </div>
      </div>
      
      <!-- Segunda linha: Visualizador de dias -->
      <AgendamentoListaDias :dias="diasSemana" />
    </div>

    <!-- Corpo -->
    <div class="flex-1 flex overflow-hidden px-6 pb-2 min-h-0">
      <!-- Lado esquerdo: Régua de horários -->
      <div class="w-20 flex-shrink-0">
        <AgendamentoReguaHorarios />
      </div>
      
      <!-- Lado direito: Área principal dos agendamentos -->
      <div class="flex-1 overflow-hidden" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
        <AgendamentoItemSlot 
          v-for="(dia, index) in diasSemana" 
          :key="index"
          :data="dia"
          @agendamento-click="editarAgendamento"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-shrink-0 px-6 py-2 bg-neutral-50">
      <div class="flex items-center justify-center text-xs text-neutral-600">
        <!-- Informações do sistema -->
        <div class="flex items-center space-x-4">
          <span class="font-medium">AFAAS Atendimento v1.0</span>
          <span>Sistema de Agendamentos</span>
        </div>
      </div>
    </div>

    <!-- Modal de Novo Agendamento -->
    <NovoAgendamentoModal
      v-model="modalNovoAgendamentoAberto"
      :profissional-atual="profissionalAtual"
      :dias-semana-atual="diasSemana"
      :clientes="clientes"
      :carregando-clientes="carregandoClientes"
      :agendamentos="agendamentos"
      :carregando-agendamentos="carregando"
      @agendamento-criado="handleAgendamentoCriado"
    />

    <!-- Modal de Editar Agendamento -->
    <EditarAgendamentoModal
      v-model="modalEditarAgendamentoAberto"
      :agendamento="agendamentoSelecionado"
      @agendamento-atualizado="handleAgendamentoAtualizado"
      @agendamento-cancelado="handleAgendamentoCancelado"
    />
  </div>
</template>

<script setup lang="ts">
import { useAgendamentos, type AgendamentoFormatado } from '~/composables/useAgendamentos'

// Cliente do Supabase para criação do agendamento
const supabase = useSupabaseClient()

// ===== STORES E COMPOSABLES =====
const agendamentoStore = useAgendamentoStore()
const { 
  diasSemana, 
  profissionalSelecionadoId, 
  dataReferencia, 
  agendamentos,
  carregando,
  erro,
  agendamentosPorData
} = storeToRefs(agendamentoStore)

const { buscarAgendamentosSemana, limparCache } = useAgendamentos()
const { buscarClientes } = useProfissionais()

// Usar store de profissionais (cache centralizado)
const profissionaisStore = useProfissionaisStore()

// ===== ESTADO REATIVO LOCAL =====
// Estados do modal
const modalNovoAgendamentoAberto = ref(false)
const modalEditarAgendamentoAberto = ref(false)
const profissionalAtual = ref<any>(null)
const agendamentoSelecionado = ref<AgendamentoFormatado | null>(null)

// Estados dos clientes
const clientes = ref<any[]>([])
const carregandoClientes = ref(false)
const erroClientes = ref<string | null>(null)

// ===== PROVIDE/INJECT PARA COMPONENTES FILHOS =====
provide('agendamentosDoDia', agendamentoStore.obterAgendamentosDoDia)
provide('carregandoAgendamentos', carregando)
provide('erroAgendamentos', erro)

// ===== FUNÇÕES DE BUSCA =====

/**
 * Buscar todos os agendamentos do profissional selecionado
 * Usa o store centralizado para manter dados durante navegação
 */
const carregarAgendamentos = async (forcarAtualizacao = true) => {
  const profId = profissionalSelecionadoId.value
  const semanaAtual = diasSemana.value
  
  if (!profId || semanaAtual.length !== 7) {
    agendamentoStore.limparAgendamentos()
    return
  }
  
  try {
    // Delega para o composable que usa o store
    await buscarAgendamentosSemana(profId, semanaAtual, forcarAtualizacao)
  } catch (error) {
  }
}

// ===== WATCHERS REATIVOS =====

/**
 * Recarregar quando o profissional selecionado mudar
 * Verifica cache primeiro, carrega só se necessário
 */
watch(profissionalSelecionadoId, async (novoProfId: string | null, profAnterior: string | null) => {
  if (novoProfId && novoProfId !== profAnterior) {
    // Verifica se já tem dados em cache primeiro
    const agendamentosCache = agendamentoStore.buscarNoCache(novoProfId, diasSemana.value)
    if (agendamentosCache) {
      agendamentoStore.setAgendamentos(agendamentosCache)
    } else {
      await carregarAgendamentos(true)
    }
  }
}, { immediate: false })

/**
 * Recarregar quando a semana (dataReferencia) mudar
 * Verifica cache primeiro, carrega só se necessário
 */
watch(dataReferencia, async (novaData: Date | null, dataAnterior: Date | null) => {
  if (novaData && dataAnterior && 
      novaData.getTime() !== dataAnterior.getTime() && 
      profissionalSelecionadoId.value) {
    
    // Verifica se já tem dados em cache para esta semana
    const agendamentosCache = agendamentoStore.buscarNoCache(profissionalSelecionadoId.value, diasSemana.value)
    if (agendamentosCache) {
      agendamentoStore.setAgendamentos(agendamentosCache)
    } else {
      await carregarAgendamentos(true)
    }
  }
}, { immediate: false })

// ===== FUNÇÕES DE BUSCA DOS CLIENTES =====

/**
 * Buscar lista de clientes em segundo plano
 * Esta função roda independentemente dos agendamentos
 */
const carregarClientes = async () => {
  try {
    carregandoClientes.value = true
    erroClientes.value = null
    

    const resultado = await buscarClientes()
    
    if (resultado.success && resultado.data) {
      clientes.value = resultado.data

    } else {
      throw new Error(resultado.error || 'Erro ao buscar clientes')
    }
    
  } catch (error) {
    erroClientes.value = 'Erro ao carregar lista de clientes'
    clientes.value = []
  } finally {
    carregandoClientes.value = false
  }
}

// ===== LIFECYCLE HOOKS =====

onMounted(async () => {
  // O profissional será selecionado automaticamente pelo AgendamentoProfissionalInfo
  // Os agendamentos serão carregados quando o profissional for selecionado via watcher
  
  // Carregar clientes em segundo plano (não bloqueia a interface)
  carregarClientes()
})

// ===== ACTIONS =====

/**
 * Função para recarregar agendamentos manualmente
 * @param limparCacheAntes - Se true, limpa o cache antes de recarregar
 */
const recarregarAgendamentos = async (limparCacheAntes = false) => {
  if (limparCacheAntes && profissionalSelecionadoId.value) {
    agendamentoStore.limparCache(profissionalSelecionadoId.value)
  }
  
  await carregarAgendamentos(true)
}

// ===== FUNÇÕES DO MODAL =====

// Buscar dados do profissional atual usando o store
const buscarProfissionalAtual = async () => {
  if (!profissionalSelecionadoId.value) return

  try {
    await profissionaisStore.buscarProfissionais()
    profissionalAtual.value = profissionaisStore.profissionais.find(
      (p: any) => p.profissional_id === profissionalSelecionadoId.value
    )
  } catch (error) {
  }
}

// Função para editar agendamento existente
const editarAgendamento = (agendamento: AgendamentoFormatado) => {
  agendamentoSelecionado.value = agendamento
  modalEditarAgendamentoAberto.value = true
}

// Handlers para eventos do modal de edição
const handleAgendamentoAtualizado = async (agendamentoAtualizado?: any) => {
  modalEditarAgendamentoAberto.value = false
  
  // Se recebemos os dados atualizados, tentar atualizar diretamente no store
  if (agendamentoAtualizado) {
    agendamentoStore.atualizarAgendamento(agendamentoAtualizado)
  } else {
    // Fallback: limpar cache e recarregar
    agendamentoStore.limparCache()
    await carregarAgendamentos(true)
  }
  
  // Limpar referência ao agendamento selecionado depois para evitar problemas de reatividade
  agendamentoSelecionado.value = null
}

const handleAgendamentoCancelado = async () => {
  modalEditarAgendamentoAberto.value = false
  agendamentoSelecionado.value = null
  // Recarregar agendamentos para mostrar as mudanças
  await carregarAgendamentos(true)
}

// Função para criar novo agendamento
const novoAgendamento = async () => {

  
  // Buscar dados do profissional antes de abrir o modal
  await buscarProfissionalAtual()
  
  // Abrir modal
  modalNovoAgendamentoAberto.value = true

}

// Função para criar agendamento no Supabase
const criarAgendamento = async (dados: any) => {
  try {

    
    const { data, error } = await supabase
      .from('afaas_agendamentos')
      .insert([{
        profissional_id: dados.profissionalId,
        cliente_id: dados.clienteId,
        titulo: dados.titulo,
        descricao: dados.descricao,
        data: dados.data,
        hora_inicio: dados.horaInicio,
        hora_fim: dados.horaFim,
        cor: dados.cor || '#DBE9FE'
      }])
      .select()

    if (error) {
      throw error
    }


    return data
    
  } catch (error) {
    throw error
  }
}

// Handler para quando um agendamento é criado
const handleAgendamentoCriado = async () => {
  
  // Limpar cache completamente para garantir dados frescos
  const profId = profissionalSelecionadoId.value
  if (profId) {
    agendamentoStore.limparCache(profId)
  }
  
  // Recarregar agendamentos forçando busca no banco
  await carregarAgendamentos(true)
  
  // Fechar modal
  modalNovoAgendamentoAberto.value = false
  
}

// Expor funções para uso externo se necessário
defineExpose({
  recarregarAgendamentos,
  agendamentos,
  carregando
})
</script>