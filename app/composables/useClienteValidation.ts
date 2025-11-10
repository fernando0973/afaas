/**
 * Composable para validação de formulário de cliente
 */

import { removeMask, validateCPF } from './useFormMasks'

// Estados brasileiros inline (shared/constants não está no srcDir 'app')
const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const

export interface ClienteFormErrors {
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
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  [key: string]: string
}

export function useClienteValidation() {
  const errors = reactive<ClienteFormErrors>({
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
    pais: ''
  })

  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'email':
        if (value?.trim() && !/^\S+@\S+\.\S+$/.test(value.trim())) {
          errors.email = 'E-mail inválido'
        } else {
          errors.email = ''
        }
        break

      case 'nome_completo':
        if (!value?.trim()) {
          errors.nome_completo = 'Nome completo é obrigatório'
        } else if (value.trim().length < 2) {
          errors.nome_completo = 'Nome deve ter pelo menos 2 caracteres'
        } else if (value.trim().length > 200) {
          errors.nome_completo = 'Nome deve ter no máximo 200 caracteres'
        } else {
          errors.nome_completo = ''
        }
        break

      case 'cpf':
        if (value) {
          const cpfLimpo = removeMask(value)
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
        if (value) {
          const telefoneLimpo = removeMask(value)
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
        if (value && (parseFloat(value) < 0.5 || parseFloat(value) > 2.5)) {
          errors.altura = 'Altura deve estar entre 0.5 e 2.5 metros'
        } else {
          errors.altura = ''
        }
        break

      case 'peso':
        if (value && (parseFloat(value) < 10 || parseFloat(value) > 500)) {
          errors.peso = 'Peso deve estar entre 10 e 500 kg'
        } else {
          errors.peso = ''
        }
        break

      case 'cep':
        if (value) {
          const cepLimpo = removeMask(value)
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
        if (value && value.trim().length > 100) {
          errors.cidade = 'Nome da cidade deve ter no máximo 100 caracteres'
        } else {
          errors.cidade = ''
        }
        break

      case 'estado':
        if (value) {
          if (value.length !== 2) {
            errors.estado = 'Estado deve ter 2 letras (ex: SP, RJ)'
          } else if (!ESTADOS_BRASIL.includes(value.toUpperCase())) {
            errors.estado = 'Estado inválido'
          } else {
            errors.estado = ''
          }
        } else {
          errors.estado = ''
        }
        break

      case 'endereco':
        if (value && value.trim().length > 200) {
          errors.endereco = 'Endereço deve ter no máximo 200 caracteres'
        } else {
          errors.endereco = ''
        }
        break

      case 'numero':
        if (value && value.trim().length > 10) {
          errors.numero = 'Número deve ter no máximo 10 caracteres'
        } else {
          errors.numero = ''
        }
        break

      case 'sexo':
        if (!value?.trim()) {
          errors.sexo = 'Sexo é obrigatório'
        } else {
          errors.sexo = ''
        }
        break

      case 'data_nascimento':
        if (value) {
          const data = new Date(value)
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

  const clearFieldError = (field: string) => {
    if (errors[field] !== undefined) {
      errors[field] = ''
    }
  }

  const clearAllErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
  }

  const validateForm = (form: any): boolean => {
    let isValid = true
    clearAllErrors()

    // Validar email apenas se preenchido
    if (form.email?.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errors.email = 'E-mail inválido'
      isValid = false
    }

    // Validações obrigatórias
    if (!form.nome_completo?.trim()) {
      errors.nome_completo = 'Nome completo é obrigatório'
      isValid = false
    }

    if (!form.cpf?.trim()) {
      errors.cpf = 'CPF é obrigatório'
      isValid = false
    } else {
      const cpfLimpo = removeMask(form.cpf)
      if (!validateCPF(cpfLimpo)) {
        errors.cpf = 'CPF inválido'
        isValid = false
      }
    }

    if (!form.data_nascimento?.trim()) {
      errors.data_nascimento = 'Data de nascimento é obrigatória'
      isValid = false
    }

    if (!form.sexo?.trim()) {
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

  return {
    errors,
    validateField,
    clearFieldError,
    clearAllErrors,
    validateForm
  }
}
