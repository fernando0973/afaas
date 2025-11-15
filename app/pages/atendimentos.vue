<template>
  <div class="h-[95dvh] flex flex-col bg-neutral-50">
    <!-- Header -->
    <header class="bg-white border-b border-neutral-200 px-6 py-6 flex-shrink-0">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 mb-2">Atendimentos</h1>
            <p class="text-neutral-600">Gestão operacional de atendimentos em tempo real</p>
          </div>
          <BaseButton
            variant="primary"
            @click="abrirModalNovoAtendimento"
            class="flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Novo Atendimento
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 min-h-0 overflow-y-auto p-6">
      <form class="max-w-7xl mx-auto space-y-6" @submit.prevent="salvarAtendimento">
        <!-- Seção: Dados Básicos -->
        <section class="bg-white rounded-lg border border-neutral-200 p-6">
          <header class="mb-4">
            <h2 class="text-lg font-semibold text-neutral-900">Dados Básicos do Atendimento</h2>
            <p class="text-sm text-neutral-600">Informações essenciais sobre cliente e profissional</p>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cliente -->
            <BaseSelector
              v-model="form.cliente_id"
              label="Cliente"
              placeholder="Selecione um cliente"
              required
              :disabled="carregando"
              value-type="number"
            >
              <option
                v-for="cliente in clientes"
                :key="cliente.id"
                :value="cliente.id"
              >
                {{ cliente.nome_completo }} - {{ formatarCPF(cliente.cpf) }}
              </option>
            </BaseSelector>

            <!-- Profissional -->
            <BaseSelector
              v-model="form.profissional_id"
              label="Profissional"
              placeholder="Selecione um profissional"
              required
              :disabled="carregando"
              value-type="number"
            >
              <option
                v-for="profissional in profissionais"
                :key="profissional.profissional_id"
                :value="profissional.profissional_id"
              >
                {{ profissional.nome_profissional }} - {{ profissional.especialidade }}
              </option>
            </BaseSelector>
          </div>

          <!-- Divino Auxiliar e Pode Auxiliar -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <BaseCheck
              v-model="form.eh_divino_auxiliar"
              label="É Divino Auxiliar"
              container-class="p-3 bg-neutral-50 rounded-lg"
            />

            <BaseCheck
              v-model="form.pode_auxiliar"
              label="Pode Auxiliar"
              container-class="p-3 bg-neutral-50 rounded-lg"
            />
          </div>
        </section>

        <!-- Seção: Sinais Vitais -->
        <section class="bg-white rounded-lg border border-neutral-200 p-6">
          <header class="mb-4">
            <h2 class="text-lg font-semibold text-neutral-900">Sinais Vitais</h2>
            <p class="text-sm text-neutral-600">Registre os principais indicadores vitais do paciente</p>
          </header>

          <div class="space-y-6">
            <!-- Pressão Arterial -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model.number="form.pressao_sistolica"
                type="number"
                :min="0"
                :max="300"
                placeholder="Ex: 120"
                label="Pressão Sistólica (mmHg)"
              />

              <BaseInput
                v-model.number="form.pressao_diastolica"
                type="number"
                :min="0"
                :max="200"
                placeholder="Ex: 80"
                label="Pressão Diastólica (mmHg)"
              />
            </div>

            <!-- Batimento Cardíaco e Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model.number="form.batimento_cardiaco"
                type="number"
                :min="0"
                :max="300"
                placeholder="Ex: 65"
                label="Batimento Cardíaco (bpm)"
              />

              <BaseSelector
                v-model="form.status_cardiaco"
                label="Status Cardíaco"
                placeholder="Selecione..."
                :options="statusCardiacoOptions"
              />
            </div>

            <!-- Energia Vital -->
            <div>
              <BaseInput
                v-model.number="form.energia_vital"
                type="number"
                :min="10"
                :max="100"
                placeholder="Ex: 75"
                label="Energia Vital (10-100)"
              />
              <div v-if="form.energia_vital !== null" class="mt-3">
                <div class="w-full bg-neutral-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all"
                    :class="getEnergiaVitalColor(form.energia_vital)"
                    :style="{ width: `${form.energia_vital}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Imunidade e Meridiano -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseSelector
                v-model="form.imunidade"
                label="Imunidade"
                placeholder="Selecione..."
                :options="imunidadeOptions"
              />

              <BaseSelector
                v-model="form.meridiano"
                label="Meridiano"
                placeholder="Selecione..."
                :options="meridianoOptions"
              />
            </div>
          </div>
        </section>

        <!-- Seção: Centros Energéticos -->
        <section class="bg-white rounded-lg border border-neutral-200 p-6">
          <header class="mb-4 space-y-1">
            <h2 class="text-lg font-semibold text-neutral-900">Centros Energéticos</h2>
            <p class="text-sm text-neutral-600">
              Marque os centros energéticos que apresentam desequilíbrio
            </p>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <BaseCheck
              v-model="form.centro_coronario"
              label="Coronário"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.centro_frontal"
              label="Frontal"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.centro_laringeo"
              label="Laríngeo"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.centro_cardiaco"
              label="Cardíaco"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.centro_plexo_solar"
              label="Plexo Solar"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.centro_umbilical"
              label="Umbilical"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.centro_base"
              label="Base"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />
          </div>
        </section>

        <!-- Seção: Cadernos -->
        <section class="bg-white rounded-lg border border-neutral-200 p-6">
          <header class="mb-4 space-y-1">
            <h2 class="text-lg font-semibold text-neutral-900">Cadernos, lâminas e tabelas</h2>
            <p class="text-sm text-neutral-600">
              Marque os cadernos, lâminas ou tabelas utilizados no atendimento
            </p>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <BaseCheck
              v-model="form.caderno_virus"
              label="Vírus"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.caderno_bacteria"
              label="Bactérias"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.caderno_fungos"
              label="Fungos"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.caderno_parasitas"
              label="Parasitas"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.caderno_micoplasma"
              label="Micoplasma"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.caderno_bacilos"
              label="Bacilos"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.caderno_artrites"
              label="Artrites"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />

            <BaseCheck
              v-model="form.caderno_doencas"
              label="Doenças"
              container-class="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            />
          </div>

          <div class="space-y-4">
            <!-- Causas e Desalinhamentos -->
            <BaseTextarea
              v-model="form.causas_desalinhamentos"
              :rows="3"
              placeholder="Descreva as causas identificadas..."
              label="Causas de Desalinhamentos/Desequilíbrios"
            />

            <!-- Modificados / Outros -->
            <BaseTextarea
              v-model="form.modificados_outros"
              :rows="3"
              placeholder="Informações adicionais..."
              label="Modificados / Outros"
            />
          </div>
        </section>

        <!-- Seção: Encaminhamentos -->
        <section class="bg-white rounded-lg border border-neutral-200 p-6">
          <header class="mb-4">
            <h2 class="text-lg font-semibold text-neutral-900">Encaminhamentos</h2>
            <p class="text-sm text-neutral-600">Registre encaminhamentos necessários para o paciente</p>
          </header>

          <div class="space-y-4">
            <!-- Encaminhamento Médico -->
            <div class="p-4 bg-neutral-50 rounded-lg space-y-3">
              <BaseCheck
                v-model="form.enc_medico"
                label="Encaminhamento Médico"
                container-class="flex"
                label-class="font-semibold text-neutral-900"
              />

              <div v-if="form.enc_medico" class="space-y-3 pl-7">
                <BaseSelector
                  v-model="form.enc_medico_tipo"
                  label="Tipo de Médico"
                  placeholder="Selecione..."
                  :options="encaminhamentoMedicoOptions"
                />

                <div v-if="form.enc_medico_tipo === 'especialista'">
                  <BaseInput
                    v-model="form.enc_medico_especialista"
                    type="text"
                    placeholder="Digite a especialidade..."
                    label="Especialista"
                  />
                </div>
              </div>
            </div>

            <!-- Encaminhamento Terapeuta -->
            <div class="p-4 bg-neutral-50 rounded-lg space-y-3">
              <BaseCheck
                v-model="form.enc_terapeuta"
                label="Encaminhamento para Terapeuta"
                container-class="flex"
                label-class="font-semibold text-neutral-900"
              />

              <div v-if="form.enc_terapeuta" class="pl-7">
                <BaseInput
                  v-model="form.enc_terapeuta_especialista"
                  type="text"
                  placeholder="Digite o tipo de terapeuta..."
                  label="Especialista/Terapeuta"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Seção: Plano Terapêutico -->
        <section class="bg-white rounded-lg border border-neutral-200 p-6">
          <header class="mb-4">
            <h2 class="text-lg font-semibold text-neutral-900">Plano Terapêutico</h2>
            <p class="text-sm text-neutral-600">Defina o plano terapêutico e recomendações de plantas medicinais</p>
          </header>

          <div class="space-y-6">
            <!-- Plantas Medicinais -->
            <div>
              <BaseSelector
                v-model="plantaSelecionada"
                label="Plantas Medicinais (Chás)"
                placeholder="Selecione uma planta para adicionar"
                :disabled="carregando"
                container-class="mb-3"
                value-type="number"
                @change="adicionarPlanta"
              >
                <option
                  v-for="planta in plantasDisponiveis"
                  :key="planta.id"
                  :value="planta.id"
                >
                  {{ planta.nome_popular }}
                  <template v-if="planta.nome_cientifico">
                    ({{ planta.nome_cientifico }})
                  </template>
                </option>
              </BaseSelector>

              <!-- Lista de plantas adicionadas -->
              <div v-if="form.plantas.length > 0" class="space-y-2">
                <div
                  v-for="(planta, index) in form.plantas"
                  :key="index"
                  class="flex items-start gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                >
                  <div class="flex-1">
                    <div class="font-medium text-sm text-neutral-900">
                      {{ obterNomePlanta(planta.planta_id) }}
                    </div>
                    <BaseTextarea
                      v-model="planta.observacao_planta"
                      :rows="2"
                      placeholder="Observações sobre esta planta (opcional)"
                      size="sm"
                      class="mt-2"
                    />
                  </div>
                  <button
                    type="button"
                    @click="removerPlanta(index)"
                    class="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remover planta"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p v-else class="text-sm text-neutral-500 italic">
                Nenhuma planta adicionada ainda
              </p>
            </div>

            <!-- Instruções Gerais -->
            <BaseTextarea
              v-model="form.plano_instrucoes_gerais"
              :rows="4"
              placeholder="Digite as instruções gerais para o paciente..."
              label="Sugestões Terapêuticas"
            />

            <!-- Dosagem e Período -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BaseInput
                v-model.number="form.plano_dosagem_ml"
                type="number"
                :min="0"
                placeholder="Ex: 50"
                label="Dosagem (ml)"
              />

              <BaseInput
                v-model.number="form.plano_periodo_horas"
                type="number"
                :min="0"
                placeholder="Ex: 8"
                label="Período (horas)"
              />

              <BaseInput
                v-model.number="form.plano_duracao_dias"
                type="number"
                :min="0"
                placeholder="Ex: 30"
                label="Duração (dias)"
              />
            </div>

            <!-- Frequência de Sessões -->
            <BaseInput
              v-model="form.plano_sessoes_frequencia"
              type="text"
              placeholder="Ex: 2x por semana"
              label="Frequência de Sessões"
            />

            <!-- Observações -->
            <BaseTextarea
              v-model="form.observacoes"
              :rows="4"
              placeholder="Digite observações gerais sobre o atendimento..."
              label="Observações Gerais do Atendimento"
            />
          </div>
        </section>

        <!-- Botões de ação (fixos no final) -->
        <div class="bg-white rounded-lg border border-neutral-200 p-4">
          <div class="flex justify-end gap-3">
            <BaseButton
              type="button"
              variant="secondary"
              @click="cancelarAtendimento"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :disabled="!formularioValido || carregando"
            >
              {{ isEdicao ? 'Salvar Alterações' : 'Criar Atendimento' }}
            </BaseButton>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import BaseCheck from '~/components/BaseCheck.vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseSelector from '~/components/BaseSelector.vue'
import BaseTextarea from '~/components/BaseTextarea.vue'

definePageMeta({
  title: 'Atendimentos',
  layout: 'default',
  middleware: ['auth']
})

useHead({
  title: 'Atendimentos - AFAAS'
})

type SelectorOption = { value: string; label: string }

const statusCardiacoOptions: SelectorOption[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'alterado', label: 'Alterado' },
  { value: 'critico', label: 'Crítico' }
]

const imunidadeOptions: SelectorOption[] = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
  { value: 'muito_baixa', label: 'Muito Baixa' }
]

const meridianoOptions: SelectorOption[] = [
  { value: 'norte', label: 'Norte' },
  { value: 'sul', label: 'Sul' },
  { value: 'leste', label: 'Leste' },
  { value: 'oeste', label: 'Oeste' }
]

const encaminhamentoMedicoOptions: SelectorOption[] = [
  { value: 'clinico_geral', label: 'Clínico Geral' },
  { value: 'especialista', label: 'Especialista' }
]

// Composables
const { buscarProfissionais } = useProfissionais()
const { buscarPlantas } = usePlantas()
const { criarAtendimento, atualizarAtendimento } = useAtendimentos()
const toast = useToastNotification()
const supabase = useSupabaseClient()
const router = useRouter()

// Estado
const carregando = ref(false)
const isEdicao = ref(false)
const clientes = ref<any[]>([])
const profissionais = ref<any[]>([])
const plantas = ref<any[]>([])
const plantaSelecionada = ref<number | null>(null)

// Formulário
const form = reactive({
  // Dados básicos
  cliente_id: null as number | null,
  profissional_id: null as number | null,
  eh_divino_auxiliar: false,
  pode_auxiliar: false,
  
  // Sinais vitais
  pressao_sistolica: null as number | null,
  pressao_diastolica: null as number | null,
  batimento_cardiaco: null as number | null,
  status_cardiaco: null as string | null,
  energia_vital: null as number | null,
  imunidade: null as string | null,
  meridiano: null as string | null,
  
  // Centros energéticos
  centro_coronario: false,
  centro_frontal: false,
  centro_laringeo: false,
  centro_cardiaco: false,
  centro_plexo_solar: false,
  centro_umbilical: false,
  centro_base: false,
  
  // Cadernos
  caderno_virus: false,
  caderno_bacteria: false,
  caderno_fungos: false,
  caderno_parasitas: false,
  caderno_micoplasma: false,
  caderno_bacilos: false,
  caderno_artrites: false,
  caderno_doencas: false,
  causas_desalinhamentos: null as string | null,
  modificados_outros: null as string | null,
  
  // Encaminhamentos
  enc_medico: false,
  enc_medico_tipo: null as string | null,
  enc_medico_especialista: null as string | null,
  enc_terapeuta: false,
  enc_terapeuta_especialista: null as string | null,
  
  // Plano terapêutico
  plano_instrucoes_gerais: null as string | null,
  plano_dosagem_ml: null as number | null,
  plano_periodo_horas: null as number | null,
  plano_duracao_dias: null as number | null,
  plano_sessoes_frequencia: null as string | null,
  observacoes: null as string | null,
  
  // Plantas
  plantas: [] as Array<{
    planta_id: number
    observacao_planta: string | null
  }>
})

// Computed
const plantasDisponiveis = computed(() => {
  const idsAdicionados = form.plantas.map((p: any) => p.planta_id)
  return plantas.value.filter((p: any) => !idsAdicionados.includes(p.id))
})

const formularioValido = computed(() => {
  return form.cliente_id !== null && form.profissional_id !== null
})

// Funções auxiliares
const formatarCPF = (cpf: string) => {
  if (!cpf) return ''
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const getEnergiaVitalColor = (valor: number) => {
  if (valor >= 70) return 'bg-green-500'
  if (valor >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const obterNomePlanta = (plantaId: number) => {
  const planta = plantas.value.find((p: any) => p.id === plantaId)
  if (!planta) return 'Planta desconhecida'
  
  return planta.nome_cientifico
    ? `${planta.nome_popular} (${planta.nome_cientifico})`
    : planta.nome_popular
}

const adicionarPlanta = () => {
  if (plantaSelecionada.value) {
    form.plantas.push({
      planta_id: plantaSelecionada.value,
      observacao_planta: null
    })
    plantaSelecionada.value = null
  }
}

const removerPlanta = (index: number) => {
  form.plantas.splice(index, 1)
}

const resetarFormulario = () => {
  // Dados básicos
  form.cliente_id = null
  form.profissional_id = null
  form.eh_divino_auxiliar = false
  form.pode_auxiliar = false
  
  // Sinais vitais
  form.pressao_sistolica = null
  form.pressao_diastolica = null
  form.batimento_cardiaco = null
  form.status_cardiaco = null
  form.energia_vital = null
  form.imunidade = null
  form.meridiano = null
  
  // Centros energéticos
  form.centro_coronario = false
  form.centro_frontal = false
  form.centro_laringeo = false
  form.centro_cardiaco = false
  form.centro_plexo_solar = false
  form.centro_umbilical = false
  form.centro_base = false
  
  // Cadernos
  form.caderno_virus = false
  form.caderno_bacteria = false
  form.caderno_fungos = false
  form.caderno_parasitas = false
  form.caderno_micoplasma = false
  form.caderno_bacilos = false
  form.caderno_artrites = false
  form.caderno_doencas = false
  form.causas_desalinhamentos = null
  form.modificados_outros = null
  
  // Encaminhamentos
  form.enc_medico = false
  form.enc_medico_tipo = null
  form.enc_medico_especialista = null
  form.enc_terapeuta = false
  form.enc_terapeuta_especialista = null
  
  // Plano terapêutico
  form.plano_instrucoes_gerais = null
  form.plano_dosagem_ml = null
  form.plano_periodo_horas = null
  form.plano_duracao_dias = null
  form.plano_sessoes_frequencia = null
  form.observacoes = null
  
  // Plantas
  form.plantas = []
  plantaSelecionada.value = null
}

// Handlers
const abrirModalNovoAtendimento = () => {
  isEdicao.value = false
  resetarFormulario()
}

const cancelarAtendimento = () => {
  resetarFormulario()
  router.push('/relatorios')
}

const salvarAtendimento = async () => {
  if (!formularioValido.value || !form.cliente_id || !form.profissional_id) return

  carregando.value = true

  try {
    const dados = {
      atendimento: {
        // Dados básicos
        cliente_id: form.cliente_id,
        profissional_id: form.profissional_id,
        eh_divino_auxiliar: form.eh_divino_auxiliar || null,
        pode_auxiliar: form.pode_auxiliar || null,
        
        // Sinais vitais
        pressao_sistolica: form.pressao_sistolica,
        pressao_diastolica: form.pressao_diastolica,
        batimento_cardiaco: form.batimento_cardiaco,
        status_cardiaco: form.status_cardiaco,
        energia_vital: form.energia_vital,
        imunidade: form.imunidade,
        meridiano: form.meridiano,
        
        // Centros energéticos
        centro_coronario: form.centro_coronario,
        centro_frontal: form.centro_frontal,
        centro_laringeo: form.centro_laringeo,
        centro_cardiaco: form.centro_cardiaco,
        centro_plexo_solar: form.centro_plexo_solar,
        centro_umbilical: form.centro_umbilical,
        centro_base: form.centro_base,
        
        // Cadernos
        caderno_virus: form.caderno_virus,
        caderno_bacteria: form.caderno_bacteria,
        caderno_fungos: form.caderno_fungos,
        caderno_parasitas: form.caderno_parasitas,
        caderno_micoplasma: form.caderno_micoplasma,
        caderno_bacilos: form.caderno_bacilos,
        caderno_artrites: form.caderno_artrites,
        caderno_doencas: form.caderno_doencas,
        causas_desalinhamentos: form.causas_desalinhamentos,
        modificados_outros: form.modificados_outros,
        
        // Encaminhamentos
        enc_medico: form.enc_medico,
        enc_medico_tipo: form.enc_medico_tipo,
        enc_medico_especialista: form.enc_medico_especialista,
        enc_terapeuta: form.enc_terapeuta,
        enc_terapeuta_especialista: form.enc_terapeuta_especialista,
        
        // Plano terapêutico
        plano_instrucoes_gerais: form.plano_instrucoes_gerais,
        plano_dosagem_ml: form.plano_dosagem_ml,
        plano_periodo_horas: form.plano_periodo_horas,
        plano_duracao_dias: form.plano_duracao_dias,
        plano_sessoes_frequencia: form.plano_sessoes_frequencia,
        observacoes: form.observacoes
      },
      plantas: form.plantas
    }

    await criarAtendimento(dados)
    toast.success('Atendimento criado com sucesso!')
    resetarFormulario()
    router.push('/relatorios')
  } catch (error: any) {
    console.error('Erro ao salvar atendimento:', error)
    toast.error(error.message || 'Erro ao salvar atendimento')
  } finally {
    carregando.value = false
  }
}

// Carregar dados
const carregarDados = async () => {
  carregando.value = true

  try {
    // Carregar clientes
    const { data: clientesData } = await supabase
      .from('afaas_clientes')
      .select('*')
      .order('nome_completo')

    clientes.value = clientesData || []

    // Carregar profissionais
    const profissionaisData = await buscarProfissionais()
    if (profissionaisData.success) {
      profissionais.value = profissionaisData.data
    }

    // Carregar plantas
    const plantasData = await buscarPlantas()
    if (plantasData.success) {
      plantas.value = plantasData.data
    }
  } catch (error: any) {
    console.error('Erro ao carregar dados:', error)
    toast.error('Erro ao carregar dados necessários')
  } finally {
    carregando.value = false
  }
}

// Lifecycle
onMounted(() => {
  carregarDados()
})
</script>
