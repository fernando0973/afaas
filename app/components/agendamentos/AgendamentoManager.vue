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
      <div class="w-20 flex-shrink-0 border-r border-neutral-200">
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
    <div class="flex-shrink-0 px-6 py-2 border-t border-neutral-200 bg-neutral-50">
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
      @confirm="handleConfirmarNovoAgendamento"
      @cancel="handleCancelarNovoAgendamento"
      @close="handleFecharNovoAgendamento"
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
const { diasSemana, profissionalSelecionadoId, dataReferencia } = storeToRefs(agendamentoStore)


const { buscarAgendamentosSemana, limparCache } = useAgendamentos()
const { buscarProfissionais, buscarClientes } = useProfissionais()

// ===== ESTADO REATIVO =====
const agendamentos = ref<AgendamentoFormatado[]>([])
const carregandoAgendamentos = ref(false)
const erroAgendamentos = ref<string | null>(null)

// Estados do modal
const modalNovoAgendamentoAberto = ref(false)
const profissionalAtual = ref<any>(null)

// Estados dos clientes
const clientes = ref<any[]>([])
const carregandoClientes = ref(false)
const erroClientes = ref<string | null>(null)

// ===== COMPUTED PARA OTIMIZAR FILTROS =====

/**
 * Mapeia agendamentos por data para acesso otimizado
 * Evita reprocessamento em cada componente filho
 */
const agendamentosPorData = computed(() => {
  const mapa = new Map<string, AgendamentoFormatado[]>()
  
  agendamentos.value.forEach(agendamento => {
    const data = agendamento.dataInicio
    const chave = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`
    
    if (!mapa.has(chave)) {
      mapa.set(chave, [])
    }
    mapa.get(chave)!.push(agendamento)
  })
  
  return mapa
})

/**
 * Função para obter agendamentos de uma data específica
 * Será fornecida via provide/inject para os componentes filhos
 */
const obterAgendamentosDoDia = (data: Date): AgendamentoFormatado[] => {
  const chave = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`
  return agendamentosPorData.value.get(chave) || []
}

// ===== PROVIDE/INJECT PARA COMPONENTES FILHOS =====
provide('agendamentosDoDia', obterAgendamentosDoDia)
provide('carregandoAgendamentos', readonly(carregandoAgendamentos))
provide('erroAgendamentos', readonly(erroAgendamentos))

// ===== FUNÇÕES DE BUSCA =====

/**
 * Buscar todos os agendamentos do profissional selecionado
 * Sempre busca dados frescos do banco quando solicitado
 */
const carregarAgendamentos = async (forcarAtualizacao = true) => {
  const profId = profissionalSelecionadoId.value
  const semanaAtual = diasSemana.value
  
  if (!profId || semanaAtual.length !== 7) {
    agendamentos.value = []
    return
  }
  
  try {
    carregandoAgendamentos.value = true
    erroAgendamentos.value = null
    
    // Sempre força atualização para garantir dados sincronizados
    const resultado = await buscarAgendamentosSemana(profId, semanaAtual, forcarAtualizacao)
    agendamentos.value = resultado
    
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error)
    erroAgendamentos.value = 'Erro ao carregar agendamentos'
    agendamentos.value = []
  } finally {
    carregandoAgendamentos.value = false
  }
}

// ===== WATCHERS REATIVOS =====

/**
 * Recarregar quando o profissional selecionado mudar
 * Reatividade automática e otimizada
 */
watch(profissionalSelecionadoId, async (novoProfId, profAnterior) => {
  // Só carregar se realmente mudou e não está carregando
  if (novoProfId && novoProfId !== profAnterior && !carregandoAgendamentos.value) {
    await carregarAgendamentos()
  }
}, { immediate: false })

/**
 * Recarregar quando a semana (dataReferencia) mudar
 * SEMPRE busca dados frescos no banco para garantir sincronização
 */
watch(dataReferencia, async (novaData, dataAnterior) => {
  // Só recarregar se a data realmente mudou e temos profissional selecionado
  if (novaData && dataAnterior && 
      novaData.getTime() !== dataAnterior.getTime() && 
      profissionalSelecionadoId.value &&
      !carregandoAgendamentos.value) {
    

    // Limpar cache para garantir dados atualizados
    limparCache(profissionalSelecionadoId.value)
    await carregarAgendamentos()
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
 * Útil para atualizar após criar/editar/deletar agendamento
 * @param limparCacheAntes - Se true, limpa o cache antes de recarregar
 */
const recarregarAgendamentos = async (limparCacheAntes = false) => {
  if (limparCacheAntes && profissionalSelecionadoId.value) {
    console.log('🧹 Limpando cache antes do recarregamento')
    limparCache(profissionalSelecionadoId.value)
  }
  
  console.log('🔄 Recarregamento manual de agendamentos')
  await carregarAgendamentos()
}

// ===== FUNÇÕES DO MODAL =====

// Buscar dados do profissional atual
const buscarProfissionalAtual = async () => {
  if (!profissionalSelecionadoId.value) return

  try {
    const resultado = await buscarProfissionais()
    
    if (resultado.success && resultado.data) {
      profissionalAtual.value = resultado.data.find(p => p.profissional_id === profissionalSelecionadoId.value)
    }
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

// Handlers do modal
const handleConfirmarNovoAgendamento = async (dados: any) => {
  try {

    
    // Criar agendamento no banco
    await criarAgendamento(dados)
    
    // Recarregar agendamentos com cache limpo
    await recarregarAgendamentos(true)
    
    // Fechar modal
    modalNovoAgendamentoAberto.value = false
    

    
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error)
    // Modal permanece aberto em caso de erro para o usuário tentar novamente
  }
}

const handleCancelarNovoAgendamento = () => {

  modalNovoAgendamentoAberto.value = false
}

const handleFecharNovoAgendamento = () => {

  modalNovoAgendamentoAberto.value = false
}

// Expor funções para uso externo se necessário
defineExpose({
  recarregarAgendamentos,
  agendamentos: computed(() => agendamentos.value),
  carregandoAgendamentos: computed(() => carregandoAgendamentos.value)
})
</script>