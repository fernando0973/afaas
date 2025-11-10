import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    let { id, titulo, descricao, cor } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do agendamento é obrigatório'
      })
    }

    // Limpar dados de entrada
    if (titulo) titulo = titulo.trim()
    if (descricao) descricao = descricao.trim()
    if (cor) cor = cor.trim()

    // Usar service role para contornar RLS
    const supabase = serverSupabaseServiceRole(event)

    // Primeiro verificar se o agendamento existe
    const { data: existingRecord, error: selectError } = await supabase
      .from('afaas_agendamentos')
      .select('id, titulo, descricao, cor')
      .eq('id', id)
      .single()

    if (selectError || !existingRecord) {
      throw createError({
        statusCode: 404,
        statusMessage: `Agendamento com ID ${id} não encontrado`
      })
    }

    // Atualizar o registro
    const { data, error } = await supabase
      .from('afaas_agendamentos')
      .update({
        titulo,
        descricao,
        cor
      })
      .eq('id', id)
      .select()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Erro do Supabase: ${error.message}`
      })
    }

    if (!data || data.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Falha na atualização do registro'
      })
    }

    return {
      success: true,
      data: data[0],
      message: 'Agendamento atualizado com sucesso'
    }

  } catch (error: any) {
    // Se for um erro H3, relançar
    if (error.statusCode) {
      throw error
    }
    
    // Caso contrário, criar erro genérico
    throw createError({
      statusCode: 500,
      statusMessage: `Erro interno: ${error.message}`
    })
  }
})