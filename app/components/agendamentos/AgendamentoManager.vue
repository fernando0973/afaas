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
      :carregando-agendamentos="carregandoAgendamentos"
      @agendamento-criado="handleAgendamentoCriado"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, provide, readonly } from 'vue'

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
  carregandoAgendamentos,
  erroAgendamentos,
  agendamentosPorData
} = storeToRefs(agendamentoStore)

const { buscarAgendamentosSemana, limparCache } = useAgendamentos()
const { buscarClientes } = useProfissionais()

// Usar store de profissionais (cache centralizado)
const profissionaisStore = useProfissionaisStore()

// ===== ESTADO REATIVO LOCAL =====
// Estados do modal
const modalNovoAgendamentoAberto = ref(false)
const profissionalAtual = ref<any>(null)

// Estados dos clientes
const clientes = ref<any[]>([])
const carregandoClientes = ref(false)
const erroClientes = ref<string | null>(null)

// ===== PROVIDE/INJECT PARA COMPONENTES FILHOS =====
provide('agendamentosDoDia', agendamentoStore.obterAgendamentosDoDia)
provide('carregandoAgendamentos', carregandoAgendamentos)
provide('erroAgendamentos', erroAgendamentos)

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
    console.error('Erro ao carregar agendamentos:', error)
  }
}

// ===== WATCHERS REATIVOS =====

/**
 * Recarregar quando o profissional selecionado mudar
 * Verifica cache primeiro, carrega só se necessário
 */
watch(profissionalSelecionadoId, async (novoProfId, profAnterior) => {
  if (novoProfId && novoProfId !== profAnterior) {
    // Verifica se já tem dados em cache primeiro
    const agendamentosCache = agendamentoStore.buscarNoCache(novoProfId, diasSemana.value)
    if (agendamentosCache) {
      console.log('✅ Usando cache para novo profissional')
      agendamentoStore.setAgendamentos(agendamentosCache)
    } else {
      console.log('🔄 Carregando dados para novo profissional')
      await carregarAgendamentos(true)
    }
  }
}, { immediate: false })

/**
 * Recarregar quando a semana (dataReferencia) mudar
 * Verifica cache primeiro, carrega só se necessário
 */
watch(dataReferencia, async (novaData, dataAnterior) => {
  if (novaData && dataAnterior && 
      novaData.getTime() !== dataAnterior.getTime() && 
      profissionalSelecionadoId.value) {
    
    // Verifica se já tem dados em cache para esta semana
    const agendamentosCache = agendamentoStore.buscarNoCache(profissionalSelecionadoId.value, diasSemana.value)
    if (agendamentosCache) {
      console.log('✅ Usando cache para nova semana')
      agendamentoStore.setAgendamentos(agendamentosCache)
    } else {
      console.log('🔄 Carregando dados para nova semana')
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
    console.error('❌ Erro ao carregar clientes:', error)
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
    console.log('🧹 Limpando cache antes do recarregamento')
    agendamentoStore.limparCache(profissionalSelecionadoId.value)
  }
  
  console.log('🔄 Recarregamento manual de agendamentos')
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
    console.error('Erro ao buscar profissional atual:', error)
  }
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
      console.error('❌ Erro ao criar agendamento:', error)
      throw error
    }


    return data
    
  } catch (error) {
    console.error('❌ Erro na criação do agendamento:', error)
    throw error
  }
}

// Handler para quando um agendamento é criado
const handleAgendamentoCriado = async () => {
  console.log('🔄 Agendamento criado! Forçando atualização da lista...')
  
  // Limpar cache completamente para garantir dados frescos
  const profId = profissionalSelecionadoId.value
  if (profId) {
    console.log(`🧹 Limpando cache para profissional ${profId}`)
    agendamentoStore.limparCache(profId)
  }
  
  // Recarregar agendamentos forçando busca no banco
  await carregarAgendamentos(true)
  
  // Fechar modal
  modalNovoAgendamentoAberto.value = false
  
  console.log('✅ Lista de agendamentos atualizada!')
}

// Expor funções para uso externo se necessário
defineExpose({
  recarregarAgendamentos,
  agendamentos,
  carregandoAgendamentos
})
</script>