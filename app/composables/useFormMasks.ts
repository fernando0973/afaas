/**
 * Composable para máscaras de formatação de formulários
 */

/**
 * Remove todos os caracteres não numéricos
 */
export function removeMask(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Formata CPF com máscara: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const digits = removeMask(value)
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
  }
  return value
}

/**
 * Formata telefone com máscara: (00) 00000-0000 ou (00) 0000-0000
 */
export function formatTelefone(value: string): string {
  const digits = removeMask(value)
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

/**
 * Formata CEP com máscara: 00.000-000
 */
export function formatCEP(value: string): string {
  const digits = removeMask(value)
  if (digits.length <= 8) {
    return digits.replace(/(\d{2})(\d{3})(\d)/, '$1.$2-$3')
  }
  return value
}

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = removeMask(cpf)
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

/**
 * Composable principal
 */
export function useFormMasks() {
  return {
    removeMask,
    formatCPF,
    formatTelefone,
    formatCEP,
    validateCPF
  }
}
