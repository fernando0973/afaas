/**
 * Constantes relacionadas aos dados de clientes
 */

export const TIPOS_SANGUINEOS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const

export const SUBSTANCIAS_QUIMICAS = [
  'Álcool',
  'Tabaco',
  'Drogas ilícitas',
  'Medicamentos não prescritos'
] as const

export const DOENCAS_PASSADAS = [
  'Diabetes',
  'Hipertensão',
  'Cardiopatia',
  'Hepatite',
  'Tuberculose',
  'HIV/AIDS'
] as const

export const OUTRAS_CONDICOES = [
  'Alergia alimentar',
  'Intolerância à lactose',
  'Celíaco',
  'Vegetariano/Vegano'
] as const

export type TipoSanguineo = typeof TIPOS_SANGUINEOS[number]
export type SubstanciaQuimica = typeof SUBSTANCIAS_QUIMICAS[number]
export type DoencaPassada = typeof DOENCAS_PASSADAS[number]
export type OutraCondicao = typeof OUTRAS_CONDICOES[number]
