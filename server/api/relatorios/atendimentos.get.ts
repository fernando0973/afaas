import { serverSupabaseServiceRole } from '#supabase/server'

interface Atendimento {
  id: number
  created_at: string
  cliente_id: number | null
  [key: string]: any
}

interface ProfissionalView {
  profissional_id: number
  nome_profissional: string | null
  especialidade: string | null
}

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseServiceRole(event)

  const { data: atendimentos, error: atendimentosError } = await supabase
    .from('afaas_atendimentos')
    .select(`
      *,
      cliente:afaas_clientes(*)
    `)
    .order('created_at', { ascending: false })

  if (atendimentosError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar atendimentos',
      data: atendimentosError
    })
  }

  if (!atendimentos || atendimentos.length === 0) {
    return []
  }

  const atendimentoIds = atendimentos.map((atendimento: Atendimento) => atendimento.id)

  const { data: profissionaisRelacionados, error: profissionaisRelError } = await supabase
    .from('afaas_atendimento_profissionais')
    .select('id, atendimento_id, profissional_id, funcao')
    .in('atendimento_id', atendimentoIds)

  if (profissionaisRelError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar profissionais dos atendimentos',
      data: profissionaisRelError
    })
  }

  const { data: plantasRelacionadas, error: plantasError } = await supabase
    .from('afaas_atendimento_plantas')
    .select(`
      atendimento_id,
      afaas_plantas_medicinais(
        id,
        nome_popular
      )
    `)
    .in('atendimento_id', atendimentoIds)

  if (plantasError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar plantas dos atendimentos',
      data: plantasError
    })
  }

  const profissionalIds = Array.from(
    new Set(
      (profissionaisRelacionados || [])
        .map((profissional) => profissional.profissional_id)
        .filter((id): id is number => typeof id === 'number')
    )
  )

  let profissionaisViewMap = new Map<number, ProfissionalView>()

  if (profissionalIds.length > 0) {
    const { data: profissionaisView, error: viewError } = await supabase
      .from('afaas_view_profissionais')
      .select('profissional_id, nome_profissional, especialidade')
      .in('profissional_id', profissionalIds)

    if (viewError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao buscar dados da view de profissionais',
        data: viewError
      })
    }

    if (profissionaisView) {
      profissionaisViewMap = new Map(
        profissionaisView.map((item) => [item.profissional_id, item])
      )
    }
  }

  const profissionaisPorAtendimento = new Map<number, any[]>()

  if (profissionaisRelacionados) {
    profissionaisRelacionados.forEach((relacao) => {
      const atual = profissionaisPorAtendimento.get(relacao.atendimento_id) || []
      const info = profissionaisViewMap.get(relacao.profissional_id as number)

      atual.push({
        id: relacao.profissional_id,
        funcao: relacao.funcao,
        nome: info?.nome_profissional || 'Nome não disponível',
        especialidade: info?.especialidade || 'Especialidade não disponível'
      })

      profissionaisPorAtendimento.set(relacao.atendimento_id, atual)
    })
  }

  const plantasPorAtendimento = new Map<number, any[]>()

  if (plantasRelacionadas) {
    plantasRelacionadas.forEach((planta) => {
      const atual = plantasPorAtendimento.get(planta.atendimento_id) || []
      atual.push({
        id: planta.afaas_plantas_medicinais?.id,
        nome_popular: planta.afaas_plantas_medicinais?.nome_popular || ''
      })
      plantasPorAtendimento.set(planta.atendimento_id, atual)
    })
  }

  const resultado = atendimentos.map((atendimento: Atendimento) => ({
    ...atendimento,
    profissionais: profissionaisPorAtendimento.get(atendimento.id) || [],
    plantas: plantasPorAtendimento.get(atendimento.id) || []
  }))

  return resultado
})
