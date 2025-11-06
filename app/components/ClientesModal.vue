<template>



  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    size="full"
    :confirm-button-text="confirmButtonText"
    :loading="loading"
    :confirm-disabled="!isFormValid || (props.isEdicao && !dadosForamAlterados)"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <!-- Conteúdo do modal -->
    <form @submit.prevent="handleConfirm" class="space-y-6">
      <!-- Sistema de Abas -->
      <div class="border-b border-neutral-200">
        <nav class="-mb-px flex flex-wrap">
          <button
            v-for="(aba, index) in abas"
            :key="aba.id"
            type="button"
            @click="abaAtiva = aba.id"
            :class="[
              'py-3 px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors flex-1 min-w-0',
              abaAtiva === aba.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            ]"
          >
            <div class="flex flex-col items-center space-y-1">
              <component :is="aba.icon" class="w-4 h-4" />
              <span class="text-center leading-tight">{{ aba.nome }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Conteúdo das Abas -->
      <div class="min-h-[500px]">
        <!-- Aba: Informações Pessoais -->
        <div v-if="abaAtiva === 'pessoais'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- CPF -->
            <BaseInput
              :model-value="form.cpf"
              @update:model-value="handleCPFInput"
              label="CPF"
              placeholder="000.000.000-00"
              required
              :error="errors.cpf"
              @blur="onCPFBlur"
              @input="clearFieldError('cpf')"
              maxlength="14"
            >
              <template #prefix>
                <IdentificationIcon class="w-5 h-5 text-neutral-400" />
              </template>
            </BaseInput>

            <!-- Data de Nascimento -->
            <BaseInput
              :model-value="form.data_nascimento"
              @update:model-value="form.data_nascimento = $event"
              label="Data de Nascimento"
              type="date"
              required
              :error="errors.data_nascimento"
              @blur="validateField('data_nascimento')"
              @input="clearFieldError('data_nascimento')"
            >
              <template #prefix>
                <CalendarDaysIcon class="w-5 h-5 text-neutral-400" />
              </template>
            </BaseInput>

            <!-- Nome Completo (obrigatório) -->
            <div class="lg:col-span-2">
              <BaseInput
                :model-value="form.nome_completo"
                @update:model-value="form.nome_completo = $event"
                label="Nome Completo"
                placeholder="Digite o nome completo..."
                required
                :error="errors.nome_completo"
                @blur="validateField('nome_completo')"
                @input="clearFieldError('nome_completo')"
              >
                <template #prefix>
                  <UserIcon class="w-5 h-5 text-neutral-400" />
                </template>
              </BaseInput>
            </div>
              <!-- E-mail -->
              <div class="lg:col-span-2">
                <BaseInput
                  :model-value="form.email"
                  @update:model-value="form.email = $event"
                  label="E-mail"
                  placeholder="email@exemplo.com"
                  :error="errors.email"
                  @blur="validateField('email')"
                  @input="clearFieldError('email')"
                  maxlength="120"
                  type="email"
                >
                  <template #prefix>
                    <BriefcaseIcon class="w-5 h-5 text-neutral-400" />
                  </template>
                </BaseInput>
              </div>

            <!-- Removido duplicidade: CPF e Data de Nascimento já estão no topo -->

            <!-- Altura -->
            <BaseInput
              :model-value="form.altura"
              @update:model-value="form.altura = $event"
              label="Altura (m)"
              placeholder="1.70"
              type="number"
              step="0.01"
              :error="errors.altura"
              @blur="validateField('altura')"
              @input="clearFieldError('altura')"
            />

            <!-- Peso -->
            <BaseInput
              :model-value="form.peso"
              @update:model-value="form.peso = $event"
              label="Peso (kg)"
              placeholder="70.5"
              type="number"
              step="0.1"
              :error="errors.peso"
              @blur="validateField('peso')"
              @input="clearFieldError('peso')"
            />

            <!-- Tipo Sanguíneo -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Tipo Sanguíneo
              </label>
              <select
                v-model="form.tipo_sanguineo"
                class="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Selecione...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <!-- Sexo -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Sexo <span class="text-red-500">*</span>
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="form.sexo"
                    type="radio"
                    value="masculino"
                    class="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-neutral-700">Masculino</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.sexo"
                    type="radio"
                    value="feminino"
                    class="mr-2 text-pink-600 focus:ring-pink-500"
                  />
                  <span class="text-sm text-neutral-700">Feminino</span>
                </label>
              </div>
              <p v-if="errors.sexo" class="text-sm text-red-600">{{ errors.sexo }}</p>
            </div>

            <!-- Naturalidade -->
            <BaseInput
              :model-value="form.naturalidade"
              @update:model-value="form.naturalidade = $event"
              label="Naturalidade"
              placeholder="Cidade de nascimento..."
            />

            <!-- Estado da Naturalidade -->
            <BaseInput
              :model-value="form.estado_naturalidade"
              @update:model-value="form.estado_naturalidade = $event"
              label="Estado da Naturalidade"
              placeholder="Estado de nascimento..."
            />

            <!-- Telefone -->
            <BaseInput
              :model-value="form.telefone"
              @update:model-value="handleTelefoneInput"
              label="Telefone com DDD"
              placeholder="(00) 00000-0000"
              :error="errors.telefone"
              @blur="validateField('telefone')"
              @input="clearFieldError('telefone')"
              maxlength="15"
            >
              <template #prefix>
                <PhoneIcon class="w-5 h-5 text-neutral-400" />
              </template>
            </BaseInput>

            <!-- Profissão -->
            <BaseInput
              :model-value="form.profissao"
              @update:model-value="form.profissao = $event"
              label="Profissão"
              placeholder="Digite a profissão..."
            >
              <template #prefix>
                <BriefcaseIcon class="w-5 h-5 text-neutral-400" />
              </template>
            </BaseInput>
          </div>
        </div>

        <!-- Aba: Endereço -->
        <div v-if="abaAtiva === 'endereco'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- CEP -->
            <BaseInput
              :model-value="form.cep"
              @update:model-value="handleCEPInput"
              label="CEP"
              placeholder="00.000-000"
              :error="errors.cep"
              @blur="validateField('cep')"
              @input="clearFieldError('cep')"
              maxlength="10"
            >
              <template #prefix>
                <MapPinIcon class="w-5 h-5 text-neutral-400" />
              </template>
            </BaseInput>

            <!-- Cidade -->
            <BaseInput
              :model-value="form.cidade"
              @update:model-value="form.cidade = $event"
              label="Cidade"
              placeholder="Digite a cidade..."
              :error="errors.cidade"
              @blur="validateField('cidade')"
              @input="clearFieldError('cidade')"
            />

            <!-- Estado -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Estado
              </label>
              <select
                v-model="form.estado"
                @blur="validateField('estado')"
                @change="clearFieldError('estado')"
                class="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.estado }"
              >
                <option value="">Selecione o estado...</option>
                <option v-for="estado in estadosBrasil" :key="estado" :value="estado">
                  {{ estado }}
                </option>
              </select>
              <p v-if="errors.estado" class="text-sm text-red-600">{{ errors.estado }}</p>
            </div>

            <!-- Endereço -->
            <div class="lg:col-span-2">
              <BaseInput
                :model-value="form.endereco"
                @update:model-value="form.endereco = $event"
                label="Endereço (Rua, Av., Rodovia...)"
                placeholder="Digite o endereço completo..."
                :error="errors.endereco"
                @blur="validateField('endereco')"
                @input="clearFieldError('endereco')"
              />
            </div>

            <!-- Número -->
            <BaseInput
              :model-value="form.numero"
              @update:model-value="form.numero = $event"
              label="Número"
              placeholder="123"
              :error="errors.numero"
              @blur="validateField('numero')"
              @input="clearFieldError('numero')"
            />

            <!-- Complemento -->
            <BaseInput
              :model-value="form.complemento"
              @update:model-value="form.complemento = $event"
              label="Complemento"
              placeholder="Apto, Casa, Bloco..."
            />

            <!-- Bairro -->
            <BaseInput
              :model-value="form.bairro"
              @update:model-value="form.bairro = $event"
              label="Bairro"
              placeholder="Digite o bairro..."
            />

            <!-- País -->
            <BaseInput
              :model-value="form.pais"
              @update:model-value="form.pais = $event"
              label="País"
              placeholder="Brasil"
            />
          </div>
        </div>

        <!-- Aba: Ambiente e Família -->
        <div v-if="abaAtiva === 'ambiente'" class="space-y-6">
          <div class="space-y-4">
            <!-- Como se sente em casa -->
            <BaseTextarea
              :model-value="form.como_se_sente_em_casa"
              @update:model-value="form.como_se_sente_em_casa = $event"
              label="Como se sente em casa?"
              placeholder="Descreva como você se sente no ambiente de casa..."
              :rows="3"
            />

            <!-- Quantas pessoas moram com você -->
            <BaseInput
              :model-value="form.quantas_pessoas_moram_com_voce"
              @update:model-value="form.quantas_pessoas_moram_com_voce = $event"
              label="Quantas pessoas moram com você?"
              type="number"
              placeholder="0"
            />

            <!-- Aspecto genético familiar -->
            <BaseTextarea
              :model-value="form.aspecto_genetico_familiar"
              @update:model-value="form.aspecto_genetico_familiar = $event"
              label="Aspecto genético de cada pessoa"
              placeholder="Descreva características genéticas relevantes da família..."
              :rows="3"
            />

            <!-- Histórico de doenças na família -->
            <BaseTextarea
              :model-value="form.historico_doencas_familia"
              @update:model-value="form.historico_doencas_familia = $event"
              label="Histórico de doenças na família"
              placeholder="Descreva o histórico de doenças familiares..."
              :rows="3"
            />
          </div>
        </div>

        <!-- Aba: Histórico Médico Pessoal -->
        <div v-if="abaAtiva === 'medico'" class="space-y-6">
          <div class="space-y-4">
            <!-- Acompanhamento médico -->
            <BaseTextarea
              :model-value="form.acompanhamento_medico"
              @update:model-value="form.acompanhamento_medico = $event"
              label="Acompanhamento médico, qual?"
              placeholder="Descreva o acompanhamento médico atual..."
              :rows="2"
            />

            <!-- Patologia -->
            <BaseTextarea
              :model-value="form.patologia"
              @update:model-value="form.patologia = $event"
              label="Patologia apresentada (doença)"
              placeholder="Descreva patologias ou doenças..."
              :rows="2"
            />

            <!-- Tratamento utilizado -->
            <BaseTextarea
              :model-value="form.tratamento_utilizado"
              @update:model-value="form.tratamento_utilizado = $event"
              label="Tratamento utilizado"
              placeholder="Descreva tratamentos em uso..."
              :rows="2"
            />

            <!-- Seção: Próteses e Transplantes -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Bloco: Próteses -->
              <div class="space-y-3 p-4 bg-neutral-50 rounded-lg">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-neutral-700">
                    Usa prótese?
                  </label>
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input
                        v-model="form.usa_protese"
                        type="radio"
                        :value="true"
                        class="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="text-sm text-neutral-700">Sim</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.usa_protese"
                        type="radio"
                        :value="false"
                        class="mr-2 text-neutral-600 focus:ring-neutral-500"
                      />
                      <span class="text-sm text-neutral-700">Não</span>
                    </label>
                  </div>
                </div>
                
                <!-- Tipo de prótese -->
                <BaseInput
                  v-if="form.usa_protese"
                  :model-value="form.tipo_protese"
                  @update:model-value="form.tipo_protese = $event"
                  label="Qual prótese?"
                  placeholder="Descreva a prótese..."
                />
              </div>

              <!-- Bloco: Transplantes -->
              <div class="space-y-3 p-4 bg-neutral-50 rounded-lg">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-neutral-700">
                    Fez transplante?
                  </label>
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input
                        v-model="form.fez_transplante"
                        type="radio"
                        :value="true"
                        class="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="text-sm text-neutral-700">Sim</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="form.fez_transplante"
                        type="radio"
                        :value="false"
                        class="mr-2 text-neutral-600 focus:ring-neutral-500"
                      />
                      <span class="text-sm text-neutral-700">Não</span>
                    </label>
                  </div>
                </div>

                <!-- Tipo de transplante -->
                <BaseInput
                  v-if="form.fez_transplante"
                  :model-value="form.tipo_transplante"
                  @update:model-value="form.tipo_transplante = $event"
                  label="Qual transplante?"
                  placeholder="Descreva o transplante..."
                />
              </div>
            </div>

            <!-- Ferimentos graves -->
            <BaseTextarea
              :model-value="form.ferimentos_graves"
              @update:model-value="form.ferimentos_graves = $event"
              label="Já teve ferimentos graves?"
              placeholder="Descreva ferimentos graves que já teve..."
              :rows="2"
            />

            <!-- Medicamentos em uso -->
            <BaseTextarea
              :model-value="form.medicamentos_em_uso"
              @update:model-value="form.medicamentos_em_uso = $event"
              label="Está tomando algum medicamento (Alopático, Homeopático, Fitoterápico, Florais)?"
              placeholder="Descreva os medicamentos em uso..."
              :rows="3"
            />

            <!-- Procedimentos cirúrgicos -->
            <BaseTextarea
              :model-value="form.procedimentos_cirurgicos"
              @update:model-value="form.procedimentos_cirurgicos = $event"
              label="Já passou por algum procedimento cirúrgico?"
              placeholder="Descreva procedimentos cirúrgicos..."
              :rows="2"
            />
          </div>
        </div>

        <!-- Aba: Hábitos e Condições -->
        <div v-if="abaAtiva === 'habitos'" class="space-y-6">
          <div class="space-y-4">
            <!-- Uso de substâncias químicas -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Faz uso de substância química contínua?
              </label>
              <div class="flex flex-wrap gap-3">
                <label v-for="substancia in substanciasQuimicas" :key="substancia" class="flex items-center">
                  <input
                    v-model="form.uso_substancias_quimicas"
                    type="checkbox"
                    :value="substancia"
                    class="mr-2 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span class="text-sm text-neutral-700">{{ substancia }}</span>
                </label>
              </div>
            </div>

            <!-- Histórico de doenças -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Você já teve?
              </label>
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <label v-for="doenca in doencasPassadas" :key="doenca" class="flex items-center">
                  <input
                    v-model="form.historico_doencas_passadas"
                    type="checkbox"
                    :value="doenca"
                    class="mr-2 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span class="text-sm text-neutral-700">{{ doenca }}</span>
                </label>
              </div>
            </div>

            <!-- Outras condições -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Outras condições:
              </label>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <label v-for="condicao in outrasCondicoes" :key="condicao" class="flex items-center">
                  <input
                    v-model="form.outras_condicoes"
                    type="checkbox"
                    :value="condicao"
                    class="mr-2 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span class="text-sm text-neutral-700">{{ condicao }}</span>
                </label>
              </div>
            </div>

            <!-- Dorme bem -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Dorme bem à noite?
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="form.dorme_bem"
                    type="radio"
                    :value="true"
                    class="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span class="text-sm text-neutral-700">Sim, dorme bem</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.dorme_bem"
                    type="radio"
                    :value="false"
                    class="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span class="text-sm text-neutral-700">Não dorme bem</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug - apenas para desenvolvimento -->
      <div v-if="props.isEdicao && props.clienteData?.id" class="text-xs text-neutral-400 bg-neutral-50 p-2 rounded">
        <span>Editando cliente ID: {{ props.clienteData.id }}</span>
      </div>
    </form>
  </BaseModal>
</template>



<script setup lang="ts">


// Handler para blur do CPF
const onCPFBlur = () => {
  // Validação básica de formato do CPF
  validateField('cpf')
}

// Toast composable
import { useToastNotification as useToast } from '~/composables/useToastNotification'
const toast = useToast()
import type { Cliente } from '~/types/cliente'
import {
  UserIcon,
  MapPinIcon,
  HomeIcon,
  HeartIcon,
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  PhoneIcon,
  BriefcaseIcon
} from '@heroicons/vue/24/outline'

// Props
interface Props {
  modelValue: boolean
  clienteData?: Cliente | null
  isEdicao?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  clienteData: null
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'cliente-salvo': [cliente: Cliente]
  'cancel': []
  'close': []
}>()

// Composables
const { inserirCliente, editarCliente } = useProfissionais()

// Estado
const loading = ref(false)
const abaAtiva = ref('pessoais')

// Definir abas
const abas = [
  { id: 'pessoais', nome: 'Dados\nPessoais', icon: UserIcon },
  { id: 'endereco', nome: 'Endereço', icon: MapPinIcon },
  { id: 'ambiente', nome: 'Família &\nAmbiente', icon: HomeIcon },
  { id: 'medico', nome: 'Histórico\nMédico', icon: HeartIcon },
  { id: 'habitos', nome: 'Hábitos &\nCondições', icon: ClipboardDocumentCheckIcon }
]

// Opções para checkboxes
const substanciasQuimicas = ['Álcool', 'Tabaco', 'Drogas ilícitas', 'Medicamentos não prescritos']
const doencasPassadas = ['Diabetes', 'Hipertensão', 'Cardiopatia', 'Hepatite', 'Tuberculose', 'HIV/AIDS']
const outrasCondicoes = ['Alergia alimentar', 'Intolerância à lactose', 'Celíaco', 'Vegetariano/Vegano']

// Formulário reativo
const form = reactive({
  // Informações Pessoais
  nome_completo: '',
  cpf: '',
  email: '',
  data_nascimento: '',
  altura: '',
  peso: '',
  tipo_sanguineo: '',
  sexo: '',
  naturalidade: '',
  estado_naturalidade: '',
  telefone: '',
  profissao: '',
  
  // Endereço
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
  
  // Ambiente e Família
  como_se_sente_em_casa: '',
  quantas_pessoas_moram_com_voce: '',
  aspecto_genetico_familiar: '',
  historico_doencas_familia: '',
  
  // Histórico Médico
  acompanhamento_medico: '',
  patologia: '',
  tratamento_utilizado: '',
  usa_protese: null as boolean | null,
  tipo_protese: '',
  fez_transplante: null as boolean | null,
  tipo_transplante: '',
  ferimentos_graves: '',
  medicamentos_em_uso: '',
  procedimentos_cirurgicos: '',
  
  // Hábitos e Condições
  uso_substancias_quimicas: [] as string[],
  historico_doencas_passadas: [] as string[],
  outras_condicoes: [] as string[],
  dorme_bem: null as boolean | null
})

// Erros de validação
const errors = reactive({
  nome_completo: '',
  cpf: '',
  email: '',
  data_nascimento: '',
  altura: '',
  peso: '',
  tipo_sanguineo: '',
  sexo: '',
  naturalidade: '',
  estado_naturalidade: '',
  telefone: '',
  profissao: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: '',
  como_se_sente_em_casa: '',
  quantas_pessoas_moram_com_voce: '',
  aspecto_genetico_familiar: '',
  historico_doencas_familia: '',
  acompanhamento_medico: '',
  patologia: '',
  tratamento_utilizado: '',
  usa_protese: '',
  tipo_protese: '',
  fez_transplante: '',
  tipo_transplante: '',
  ferimentos_graves: '',
  medicamentos_em_uso: '',
  procedimentos_cirurgicos: '',
  uso_substancias_quimicas: '',
  historico_doencas_passadas: '',
  outras_condicoes: '',
  dorme_bem: ''
})

// Computed
const modalTitle = computed(() => props.isEdicao ? 'Editar Cliente' : 'Novo Cliente')
const modalSubtitle = computed(() => props.isEdicao ? 'Altere as informações do cliente' : 'Preencha as informações do cliente')
const confirmButtonText = computed(() => props.isEdicao ? 'Salvar Alterações' : 'Salvar Cliente')

// Dados originais para comparação (apenas na edição)
const dadosOriginais = ref<any>(null)

const isFormValid = computed(() => {
  return form.nome_completo.trim() !== '' &&
    form.cpf.trim() !== '' &&
    form.data_nascimento.trim() !== '' &&
    form.sexo.trim() !== ''
})

// Verifica se os dados foram alterados (apenas na edição)
const dadosForamAlterados = computed(() => {
  if (!props.isEdicao || !dadosOriginais.value) return true
  
  // Comparar todos os campos do formulário com os dados originais
  const camposParaComparar = [
    'nome_completo', 'cpf', 'email', 'data_nascimento', 'altura', 'peso',
    'tipo_sanguineo', 'sexo', 'naturalidade', 'estado_naturalidade', 
    'telefone', 'profissao', 'cep', 'endereco', 'numero', 'complemento',
    'bairro', 'cidade', 'estado', 'pais', 'como_se_sente_em_casa',
    'quantas_pessoas_moram_com_voce', 'aspecto_genetico_familiar', 
    'historico_doencas_familia', 'acompanhamento_medico', 'patologia',
    'tratamento_utilizado', 'usa_protese', 'tipo_protese', 'fez_transplante',
    'tipo_transplante', 'ferimentos_graves', 'medicamentos_em_uso',
    'procedimentos_cirurgicos', 'dorme_bem'
  ]
  
  // Verificar campos simples
  for (const campo of camposParaComparar) {
    const valorAtual = form[campo as keyof typeof form]
    const valorOriginal = dadosOriginais.value[campo]
    
    // Normalizar valores para comparação
    const normalizeValue = (value: any) => {
      if (value === null || value === undefined || value === '') return ''
      if (typeof value === 'string') return value.trim()
      return String(value)
    }
    
    if (normalizeValue(valorAtual) !== normalizeValue(valorOriginal)) {
      return true
    }
  }
  
  // Verificar arrays (uso_substancias_quimicas, historico_doencas_passadas, outras_condicoes)
  const camposArray = ['uso_substancias_quimicas', 'historico_doencas_passadas', 'outras_condicoes']
  for (const campo of camposArray) {
    const arrayAtual = Array.isArray(form[campo as keyof typeof form]) ? form[campo as keyof typeof form] as string[] : []
    const arrayOriginal = Array.isArray(dadosOriginais.value[campo]) ? dadosOriginais.value[campo] : []
    
    if (JSON.stringify([...arrayAtual].sort()) !== JSON.stringify([...arrayOriginal].sort())) {
      return true
    }
  }
  
  return false
})

// Métodos de validação
const validateField = (field: keyof typeof form) => {
  switch (field) {
    case 'email':
      if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
        errors.email = 'E-mail inválido'
      } else {
        errors.email = ''
      }
      break
    case 'nome_completo':
      if (!form.nome_completo.trim()) {
        errors.nome_completo = 'Nome completo é obrigatório'
      } else if (form.nome_completo.trim().length < 2) {
        errors.nome_completo = 'Nome deve ter pelo menos 2 caracteres'
      } else if (form.nome_completo.trim().length > 200) {
        errors.nome_completo = 'Nome deve ter no máximo 200 caracteres'
      } else {
        errors.nome_completo = ''
      }
      break
    case 'cpf':
      if (form.cpf) {
        const cpfLimpo = removeMask(form.cpf)
        if (cpfLimpo.length === 11) {
          if (!validateCPF(cpfLimpo)) {
            errors.cpf = 'CPF inválido'
          } else {
            errors.cpf = ''
          }
        } else if (cpfLimpo.length > 0) {
          errors.cpf = 'CPF deve ter 11 dígitos'
        } else {
          errors.cpf = ''
        }
      } else {
        errors.cpf = ''
      }
      break
    case 'telefone':
      if (form.telefone) {
        const telefoneLimpo = removeMask(form.telefone)
        if (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11) {
          errors.telefone = 'Telefone deve ter 10 ou 11 dígitos'
        } else {
          errors.telefone = ''
        }
      } else {
        errors.telefone = ''
      }
      break
    case 'altura':
      if (form.altura && (parseFloat(form.altura) < 0.5 || parseFloat(form.altura) > 2.5)) {
        errors.altura = 'Altura deve estar entre 0.5 e 2.5 metros'
      } else {
        errors.altura = ''
      }
      break
    case 'peso':
      if (form.peso && (parseFloat(form.peso) < 10 || parseFloat(form.peso) > 500)) {
        errors.peso = 'Peso deve estar entre 10 e 500 kg'
      } else {
        errors.peso = ''
      }
      break
    case 'cep':
      if (form.cep) {
        const cepLimpo = removeMask(form.cep)
        if (cepLimpo.length !== 8) {
          errors.cep = 'CEP deve ter 8 dígitos'
        } else {
          errors.cep = ''
        }
      } else {
        errors.cep = ''
      }
      break
    case 'cidade':
      if (form.cidade && form.cidade.trim().length > 100) {
        errors.cidade = 'Nome da cidade deve ter no máximo 100 caracteres'
      } else {
        errors.cidade = ''
      }
      break
    case 'estado':
      if (form.estado) {
        if (form.estado.length !== 2) {
          errors.estado = 'Estado deve ter 2 letras (ex: SP, RJ)'
        } else if (!estadosBrasil.includes(form.estado.toUpperCase())) {
          errors.estado = 'Estado inválido'
        } else {
          errors.estado = ''
        }
      } else {
        errors.estado = ''
      }
      break
    case 'endereco':
      if (form.endereco && form.endereco.trim().length > 200) {
        errors.endereco = 'Endereço deve ter no máximo 200 caracteres'
      } else {
        errors.endereco = ''
      }
      break
    case 'numero':
      if (form.numero && form.numero.trim().length > 10) {
        errors.numero = 'Número deve ter no máximo 10 caracteres'
      } else {
        errors.numero = ''
      }
      break
    case 'sexo':
      if (!form.sexo.trim()) {
        errors.sexo = 'Sexo é obrigatório'
      } else {
        errors.sexo = ''
      }
      break
    case 'data_nascimento':
      if (form.data_nascimento) {
        const data = new Date(form.data_nascimento)
        const hoje = new Date()
        if (data > hoje) {
          errors.data_nascimento = 'Data de nascimento não pode ser futura'
        } else {
          errors.data_nascimento = ''
        }
      } else {
        errors.data_nascimento = ''
      }
      break
  }
}

const clearFieldError = (field: keyof typeof errors) => {
  errors[field] = ''
}

// Funções de máscara
const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
  }
  return value
}

const formatTelefone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
  }
  return value
}

const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 8) {
    return digits.replace(/(\d{2})(\d{3})(\d)/, '$1.$2-$3')
  }
  return value
}

// Função para remover máscara
const removeMask = (value: string) => {
  return value.replace(/\D/g, '')
}

// Estados brasileiros
const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

// Handlers de input com máscara
const handleCPFInput = (value: string) => {
  const formatted = formatCPF(value)
  form.cpf = formatted
  validateCPF(removeMask(formatted))
}

const handleTelefoneInput = (value: string) => {
  form.telefone = formatTelefone(value)
}

const handleCEPInput = (value: string) => {
  form.cep = formatCEP(value)
}

const handleEstadoInput = (value: string) => {
  const upperValue = value.toUpperCase().slice(0, 2)
  form.estado = upperValue
}

// Métodos de validação
const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return false
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validar dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit === 10 || digit === 11) digit = 0
  if (digit !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit === 10 || digit === 11) digit = 0
  if (digit !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

const validateForm = () => {
  let isValid = true
  // Resetar erros
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Validar email apenas se preenchido
  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = 'E-mail inválido'
    isValid = false
  }

  // Validações obrigatórias
  if (!form.nome_completo.trim()) {
    errors.nome_completo = 'Nome completo é obrigatório'
    isValid = false
  }

  if (!form.cpf.trim()) {
    errors.cpf = 'CPF é obrigatório'
    isValid = false
  } else {
    const cpfLimpo = removeMask(form.cpf)
    if (!validateCPF(cpfLimpo)) {
      errors.cpf = 'CPF inválido'
      isValid = false
    }
  }

  if (!form.data_nascimento.trim()) {
    errors.data_nascimento = 'Data de nascimento é obrigatória'
    isValid = false
  }

  if (!form.sexo.trim()) {
    errors.sexo = 'Sexo é obrigatório'
    isValid = false
  }

  // Validações numéricas
  if (form.altura && (parseFloat(form.altura) <= 0 || parseFloat(form.altura) > 3)) {
    errors.altura = 'Altura deve ser entre 0.1 e 3.0 metros'
    isValid = false
  }

  if (form.peso && (parseFloat(form.peso) <= 0 || parseFloat(form.peso) > 500)) {
    errors.peso = 'Peso deve ser entre 0.1 e 500 kg'
    isValid = false
  }

  return isValid
}

// Métodos principais
const handleConfirm = async () => {
  if (!validateForm()) {
    // Ir para a primeira aba que tem erro
    const errosOrdenados = {
      pessoais: ['nome_completo', 'cpf', 'data_nascimento', 'sexo', 'email', 'altura', 'peso'],
      endereco: ['cep', 'endereco', 'cidade', 'estado'],
      ambiente: ['como_se_sente_em_casa', 'quantas_pessoas_moram_com_voce'],
      medico: ['acompanhamento_medico', 'patologia'],
      habitos: ['dorme_bem']
    }
    
    for (const [aba, campos] of Object.entries(errosOrdenados)) {
      if (campos.some(campo => errors[campo as keyof typeof errors])) {
        abaAtiva.value = aba
        break
      }
    }
    return
  }

  loading.value = true

  try {
    // Preparar dados para envio (removendo máscaras)
    const clienteData = {
      nome_completo: form.nome_completo.trim(),
      cpf: removeMask(form.cpf),
      email: form.email.trim() || null,
      data_nascimento: form.data_nascimento.trim(),
      altura: form.altura ? parseFloat(form.altura) : null,
      peso: form.peso ? parseFloat(form.peso) : null,
      tipo_sanguineo: form.tipo_sanguineo.trim() || null,
      sexo: form.sexo.trim(),
      naturalidade: form.naturalidade.trim() || null,
      estado_naturalidade: form.estado_naturalidade.trim() || null,
      telefone: removeMask(form.telefone),
      profissao: form.profissao.trim() || null,
      cep: removeMask(form.cep),
      endereco: form.endereco.trim() || null,
      numero: form.numero.trim() || null,
      complemento: form.complemento.trim() || null,
      bairro: form.bairro.trim() || null,
      cidade: form.cidade.trim() || null,
      estado: form.estado.trim() || null,
      pais: form.pais.trim() || null,
      como_se_sente_em_casa: form.como_se_sente_em_casa.trim() || null,
      quantas_pessoas_moram_com_voce: form.quantas_pessoas_moram_com_voce ? parseInt(form.quantas_pessoas_moram_com_voce) : null,
      aspecto_genetico_familiar: form.aspecto_genetico_familiar.trim() || null,
      historico_doencas_familia: form.historico_doencas_familia.trim() || null,
      acompanhamento_medico: form.acompanhamento_medico.trim() || null,
      patologia: form.patologia.trim() || null,
      tratamento_utilizado: form.tratamento_utilizado.trim() || null,
      usa_protese: form.usa_protese,
      tipo_protese: form.tipo_protese.trim() || null,
      fez_transplante: form.fez_transplante,
      tipo_transplante: form.tipo_transplante.trim() || null,
      ferimentos_graves: form.ferimentos_graves.trim() || null,
      medicamentos_em_uso: form.medicamentos_em_uso.trim() || null,
      procedimentos_cirurgicos: form.procedimentos_cirurgicos.trim() || null,
      uso_substancias_quimicas: form.uso_substancias_quimicas,
      historico_doencas_passadas: form.historico_doencas_passadas,
      outras_condicoes: form.outras_condicoes,
      dorme_bem: form.dorme_bem
    }

    let resultado
    if (props.isEdicao && props.clienteData?.id) {
    resultado = await editarCliente(props.clienteData.id, clienteData)
    if (resultado.success && resultado.data) {
      toast.success('Dados do cliente atualizados com sucesso!')
      emit('cliente-salvo', resultado.data)
      resetForm()
    } else {
      toast.error(resultado.message || 'Erro ao atualizar cliente!')
    }
    } else {
    resultado = await inserirCliente(clienteData)
    if (resultado.success && resultado.data) {
      toast.success('Novo cliente criado com sucesso!')
      emit('cliente-salvo', resultado.data)
      resetForm()
    } else {
      toast.error(resultado.message || 'Erro ao criar cliente!')
    }
    }

    if (resultado.success && resultado.data) {
      emit('cliente-salvo', resultado.data)
      emit('update:modelValue', false)
      resetForm()
    } else {
      console.error('Erro ao salvar cliente:', resultado.message)
    }
  } catch (error) {
    console.error('Erro inesperado ao salvar cliente:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
  resetForm()
}

const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
  resetForm()
}

// Resetar formulário
const resetForm = () => {
  // Informações Pessoais
  form.nome_completo = ''
  form.cpf = ''
  form.email = ''
  form.data_nascimento = ''
  form.altura = ''
  form.peso = ''
  form.tipo_sanguineo = ''
  form.sexo = ''
  form.naturalidade = ''
  form.estado_naturalidade = ''
  form.telefone = ''
  form.profissao = ''
  
  // Endereço
  form.cep = ''
  form.endereco = ''
  form.numero = ''
  form.complemento = ''
  form.bairro = ''
  form.cidade = ''
  form.estado = ''
  form.pais = 'Brasil'
  
  // Ambiente e Família
  form.como_se_sente_em_casa = ''
  form.quantas_pessoas_moram_com_voce = ''
  form.aspecto_genetico_familiar = ''
  form.historico_doencas_familia = ''
  
  // Histórico Médico
  form.acompanhamento_medico = ''
  form.patologia = ''
  form.tratamento_utilizado = ''
  form.usa_protese = null
  form.tipo_protese = ''
  form.fez_transplante = null
  form.tipo_transplante = ''
  form.ferimentos_graves = ''
  form.medicamentos_em_uso = ''
  form.procedimentos_cirurgicos = ''
  
  // Hábitos e Condições
  form.uso_substancias_quimicas = []
  form.historico_doencas_passadas = []
  form.outras_condicoes = []
  form.dorme_bem = null
  
  // Reset de erros e aba ativa
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  abaAtiva.value = 'pessoais'
  loading.value = false
  
  // Limpar dados originais
  dadosOriginais.value = null
}

// Carregar dados para edição
const loadClienteData = () => {
  if (props.clienteData) {
    // Informações Pessoais
  form.nome_completo = props.clienteData.nome_completo || ''
  form.cpf = props.clienteData.cpf ? formatCPF(props.clienteData.cpf) : ''
  form.email = props.clienteData.email || ''
  form.data_nascimento = props.clienteData.data_nascimento || ''
  form.altura = props.clienteData.altura?.toString() || ''
  form.peso = props.clienteData.peso?.toString() || ''
  form.tipo_sanguineo = props.clienteData.tipo_sanguineo || ''
  form.sexo = props.clienteData.sexo || ''
  form.naturalidade = props.clienteData.naturalidade || ''
  form.estado_naturalidade = props.clienteData.estado_naturalidade || ''
  form.telefone = props.clienteData.telefone ? formatTelefone(props.clienteData.telefone) : ''
  form.profissao = props.clienteData.profissao || ''
    
    // Endereço
    form.cep = props.clienteData.cep ? formatCEP(props.clienteData.cep) : ''
    form.endereco = props.clienteData.endereco || ''
    form.numero = props.clienteData.numero || ''
    form.complemento = props.clienteData.complemento || ''
    form.bairro = props.clienteData.bairro || ''
    form.cidade = props.clienteData.cidade || ''
    form.estado = props.clienteData.estado || ''
    form.pais = props.clienteData.pais || 'Brasil'
    
    // Ambiente e Família
    form.como_se_sente_em_casa = props.clienteData.como_se_sente_em_casa || ''
    form.quantas_pessoas_moram_com_voce = props.clienteData.quantas_pessoas_moram_com_voce?.toString() || ''
    form.aspecto_genetico_familiar = props.clienteData.aspecto_genetico_familiar || ''
    form.historico_doencas_familia = props.clienteData.historico_doencas_familia || ''
    
    // Histórico Médico
    form.acompanhamento_medico = props.clienteData.acompanhamento_medico || ''
    form.patologia = props.clienteData.patologia || ''
    form.tratamento_utilizado = props.clienteData.tratamento_utilizado || ''
    form.usa_protese = props.clienteData.usa_protese
    form.tipo_protese = props.clienteData.tipo_protese || ''
    form.fez_transplante = props.clienteData.fez_transplante
    form.tipo_transplante = props.clienteData.tipo_transplante || ''
    form.ferimentos_graves = props.clienteData.ferimentos_graves || ''
    form.medicamentos_em_uso = props.clienteData.medicamentos_em_uso || ''
    form.procedimentos_cirurgicos = props.clienteData.procedimentos_cirurgicos || ''
    
    // Hábitos e Condições
    form.uso_substancias_quimicas = props.clienteData.uso_substancias_quimicas || []
    form.historico_doencas_passadas = props.clienteData.historico_doencas_passadas || []
    form.outras_condicoes = props.clienteData.outras_condicoes || []
    form.dorme_bem = props.clienteData.dorme_bem
    
    // Salvar dados originais para comparação (apenas na edição)
    if (props.isEdicao) {
      dadosOriginais.value = {
        nome_completo: form.nome_completo,
        cpf: form.cpf,
        email: form.email,
        data_nascimento: form.data_nascimento,
        altura: form.altura,
        peso: form.peso,
        tipo_sanguineo: form.tipo_sanguineo,
        sexo: form.sexo,
        naturalidade: form.naturalidade,
        estado_naturalidade: form.estado_naturalidade,
        telefone: form.telefone,
        profissao: form.profissao,
        cep: form.cep,
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        pais: form.pais,
        como_se_sente_em_casa: form.como_se_sente_em_casa,
        quantas_pessoas_moram_com_voce: form.quantas_pessoas_moram_com_voce,
        aspecto_genetico_familiar: form.aspecto_genetico_familiar,
        historico_doencas_familia: form.historico_doencas_familia,
        acompanhamento_medico: form.acompanhamento_medico,
        patologia: form.patologia,
        tratamento_utilizado: form.tratamento_utilizado,
        usa_protese: form.usa_protese,
        tipo_protese: form.tipo_protese,
        fez_transplante: form.fez_transplante,
        tipo_transplante: form.tipo_transplante,
        ferimentos_graves: form.ferimentos_graves,
        medicamentos_em_uso: form.medicamentos_em_uso,
        procedimentos_cirurgicos: form.procedimentos_cirurgicos,
        uso_substancias_quimicas: [...form.uso_substancias_quimicas],
        historico_doencas_passadas: [...form.historico_doencas_passadas],
        outras_condicoes: [...form.outras_condicoes],
        dorme_bem: form.dorme_bem
      }
    }
  }
}

// Watchers
// Exemplo de uso para remoção (implemente onde for chamado):
// const resultado = await removerCliente(id)
// if (resultado.success) {
//   toast.success ? toast.success('Cliente removido com sucesso!') : toast('Cliente removido com sucesso!')
// } else {
//   toast.error ? toast.error(resultado.message || 'Erro ao remover cliente!') : toast(resultado.message || 'Erro ao remover cliente!')
// }
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.isEdicao && props.clienteData) {
      loadClienteData()
    } else {
      resetForm()
    }
  }
})

watch(() => props.clienteData, () => {
  if (props.modelValue && props.isEdicao) {
    loadClienteData()
  }
})
</script>