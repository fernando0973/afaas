import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || !body.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID do agendamento é obrigatório'
      })
    }

    // Usar service role para contornar RLS (método correto do guia Supabase)
    const supabase = await serverSupabaseServiceRole(event)

    console.log('API Server - Cancelando agendamento:', body.id)
    
    const { data, error } = await supabase
      .from('afaas_agendamentos')
      .update({
        cancelado: true,
        cancelado_as: body.cancelado_as || new Date().toISOString()
      })
      .eq('id', body.id)
      .select()

    if (error) {
      console.error('Erro ao cancelar agendamento:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao cancelar agendamento: ${error.message}`
      })
    }

    console.log('Agendamento cancelado com sucesso:', data)

    return {
      success: true,
      data: data[0]
    }

  } catch (error: any) {
    console.error('Erro na API de cancelar agendamento:', error)
    
    return {
      success: false,
      error: error.message || 'Erro interno do servidor'
    }
  }
})