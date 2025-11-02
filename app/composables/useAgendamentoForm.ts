import { ref, computed } from 'vue'

export interface FormData {
  clienteId: string
  titulo: string
  descricao: string
  data: string
  horaInicio: string
  horaFim: string
  cor: string
}

export interface FormErrors {
  clienteId: string
  titulo: string
  descricao: string
  data: string
  horaInicio: string
  horaFim: string
}

export const useAgendamentoForm = () => {
  // Estado do formulário
  const form = ref<FormData>({
    clienteId: '',
    titulo: 'Consulta',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    cor: '#DBE9FE' // Cor padrão
  })

  // Erros de validação
  const errors = ref<FormErrors>({
    clienteId: '',
    titulo: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: ''
  })

  // Loading state
  const loading = ref(false)

  // Validação do formulário
  const isFormValid = computed(() => {
    return form.value.clienteId && 
           form.value.titulo.trim() && 
           form.value.data && 
           form.value.horaInicio && 
           form.value.horaFim
  })

  // Limpar erros
  const clearErrors = () => {
    errors.value = {
      clienteId: '',
      titulo: '',
      descricao: '',
      data: '',
      horaInicio: '',
      horaFim: ''
    }
  }

  // Validar formulário
  const validateForm = (): boolean => {
    clearErrors()
    let isValid = true

    if (!form.value.clienteId) {
      errors.value.clienteId = 'Cliente é obrigatório'
      isValid = false
    }

    if (!form.value.titulo.trim()) {
      errors.value.titulo = 'Título é obrigatório'
      isValid = false
    }

    if (!form.value.data) {
      errors.value.data = 'Data é obrigatória'
      isValid = false
    }

    if (!form.value.horaInicio) {
      errors.value.horaInicio = 'Hora de início é obrigatória'
      isValid = false
    }

    if (!form.value.horaFim) {
      errors.value.horaFim = 'Hora de fim é obrigatória'
      isValid = false
    }

    // Validar se hora fim é maior que hora início
    if (form.value.horaInicio && form.value.horaFim) {
      const [hInicio, mInicio] = form.value.horaInicio.split(':').map(Number)
      const [hFim, mFim] = form.value.horaFim.split(':').map(Number)
      
      if (hInicio !== undefined && mInicio !== undefined && 
          hFim !== undefined && mFim !== undefined) {
        const inicioMinutos = hInicio * 60 + mInicio
        const fimMinutos = hFim * 60 + mFim
        
        if (fimMinutos <= inicioMinutos) {
          errors.value.horaFim = 'Hora de fim deve ser maior que hora de início'
          isValid = false
        }
      }
    }

    return isValid
  }

  // Resetar formulário
  const resetForm = () => {
    form.value = {
      clienteId: '',
      titulo: 'Consulta',
      descricao: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      cor: '#DBE9FE' // Cor padrão
    }
    
    clearErrors()
  }

  // Preparar dados para envio
  const prepareFormData = (profissionalId?: number) => {
    return {
      profissionalId,
      clienteId: Number(form.value.clienteId),
      titulo: form.value.titulo.trim(),
      descricao: form.value.descricao.trim(),
      data: form.value.data,
      horaInicio: form.value.horaInicio,
      horaFim: form.value.horaFim,
      cor: form.value.cor
    }
  }

  return {
    form,
    errors,
    loading,
    isFormValid,
    clearErrors,
    validateForm,
    resetForm,
    prepareFormData
  }
}