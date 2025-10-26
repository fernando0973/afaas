/**
 * Interface para Planta Medicinal
 * Baseada na tabela afaas_plantas_medicinais do Supabase
 */
export interface PlantaMedicinal {
  id: number
  created_at?: string | null
  deleted_at?: string | null
  nome_popular: string
  nome_cientifico?: string | null
  partes_usadas?: string[] | null
  sabor_propriedade?: string[] | null
  meridianos?: string[] | null
  acao_terapeutica?: string | null
  indicacoes?: string | null
  contraindicacoes?: string | null
  renisus?: boolean | null
}