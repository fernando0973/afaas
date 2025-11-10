/**
 * Composable para gerenciar o formulário de cliente
 */

import type { Cliente } from '~/types/cliente'
import { formatCPF, formatTelefone, formatCEP, removeMask } from './useFormMasks'

export interface ClienteFormData {
  // Informações Pessoais
  nome_completo: string
  cpf: string
  email: string
  data_nascimento: string
  altura: string
  peso: string
  tipo_sanguineo: string
  sexo: string
  naturalidade: string
  estado_naturalidade: string
  telefone: string
  profissao: string
  
  // Endereço
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  
  // Ambiente e Família
  como_se_sente_em_casa: string
  quantas_pessoas_moram_com_voce: string
  aspecto_genetico_familiar: string
  historico_doencas_familia: string
  
  // Histórico Médico
  acompanhamento_medico: string
  patologia: string
  tratamento_utilizado: string
  usa_protese: boolean | null
  tipo_protese: string
  fez_transplante: boolean | null
  tipo_transplante: string
  ferimentos_graves: string
  medicamentos_em_uso: string
  procedimentos_cirurgicos: string
  
  // Hábitos e Condições
  uso_substancias_quimicas: string[]
  historico_doencas_passadas: string[]
  outras_condicoes: string[]
  dorme_bem: boolean | null
}

export function useClienteForm() {
  const form = reactive<ClienteFormData>({
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
    usa_protese: null,
    tipo_protese: '',
    fez_transplante: null,
    tipo_transplante: '',
    ferimentos_graves: '',
    medicamentos_em_uso: '',
    procedimentos_cirurgicos: '',
    
    // Hábitos e Condições
    uso_substancias_quimicas: [],
    historico_doencas_passadas: [],
    outras_condicoes: [],
    dorme_bem: null
  })

  const dadosOriginais = ref<any>(null)

  const resetForm = () => {
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
    form.cep = ''
    form.endereco = ''
    form.numero = ''
    form.complemento = ''
    form.bairro = ''
    form.cidade = ''
    form.estado = ''
    form.pais = 'Brasil'
    form.como_se_sente_em_casa = ''
    form.quantas_pessoas_moram_com_voce = ''
    form.aspecto_genetico_familiar = ''
    form.historico_doencas_familia = ''
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
    form.uso_substancias_quimicas = []
    form.historico_doencas_passadas = []
    form.outras_condicoes = []
    form.dorme_bem = null
    dadosOriginais.value = null
  }

  const loadClienteData = (cliente: Cliente) => {
    form.nome_completo = cliente.nome_completo || ''
    form.cpf = cliente.cpf ? formatCPF(cliente.cpf) : ''
    form.email = cliente.email || ''
    form.data_nascimento = cliente.data_nascimento || ''
    form.altura = cliente.altura?.toString() || ''
    form.peso = cliente.peso?.toString() || ''
    form.tipo_sanguineo = cliente.tipo_sanguineo || ''
    form.sexo = cliente.sexo || ''
    form.naturalidade = cliente.naturalidade || ''
    form.estado_naturalidade = cliente.estado_naturalidade || ''
    form.telefone = cliente.telefone ? formatTelefone(cliente.telefone) : ''
    form.profissao = cliente.profissao || ''
    form.cep = cliente.cep ? formatCEP(cliente.cep) : ''
    form.endereco = cliente.endereco || ''
    form.numero = cliente.numero || ''
    form.complemento = cliente.complemento || ''
    form.bairro = cliente.bairro || ''
    form.cidade = cliente.cidade || ''
    form.estado = cliente.estado || ''
    form.pais = cliente.pais || 'Brasil'
    form.como_se_sente_em_casa = cliente.como_se_sente_em_casa || ''
    form.quantas_pessoas_moram_com_voce = cliente.quantas_pessoas_moram_com_voce?.toString() || ''
    form.aspecto_genetico_familiar = cliente.aspecto_genetico_familiar || ''
    form.historico_doencas_familia = cliente.historico_doencas_familia || ''
    form.acompanhamento_medico = cliente.acompanhamento_medico || ''
    form.patologia = cliente.patologia || ''
    form.tratamento_utilizado = cliente.tratamento_utilizado || ''
    form.usa_protese = cliente.usa_protese
    form.tipo_protese = cliente.tipo_protese || ''
    form.fez_transplante = cliente.fez_transplante
    form.tipo_transplante = cliente.tipo_transplante || ''
    form.ferimentos_graves = cliente.ferimentos_graves || ''
    form.medicamentos_em_uso = cliente.medicamentos_em_uso || ''
    form.procedimentos_cirurgicos = cliente.procedimentos_cirurgicos || ''
    form.uso_substancias_quimicas = cliente.uso_substancias_quimicas || []
    form.historico_doencas_passadas = cliente.historico_doencas_passadas || []
    form.outras_condicoes = cliente.outras_condicoes || []
    form.dorme_bem = cliente.dorme_bem

    // Salvar snapshot dos dados originais
    dadosOriginais.value = JSON.parse(JSON.stringify(form))
  }

  const prepareDataForSubmit = () => {
    return {
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
  }

  const dadosForamAlterados = computed(() => {
    if (!dadosOriginais.value) return true
    return JSON.stringify(form) !== JSON.stringify(dadosOriginais.value)
  })

  const isFormValid = computed(() => {
    return form.nome_completo.trim() !== '' &&
      form.cpf.trim() !== '' &&
      form.data_nascimento.trim() !== '' &&
      form.sexo.trim() !== ''
  })

  return {
    form,
    dadosOriginais,
    resetForm,
    loadClienteData,
    prepareDataForSubmit,
    dadosForamAlterados,
    isFormValid
  }
}
