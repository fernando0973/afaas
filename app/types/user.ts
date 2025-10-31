/**
 * Tipos relacionados ao usuário e perfil
 */

/**
 * Perfil do usuário conforme tabela afaas_profiles
 */
export interface UserProfile {
  id: number
  created_at: string
  user_id: string | null
  nome: string | null
  role: string | null
  email: string | null
}

/**
 * Tipo para criação de novo perfil (omitindo campos gerados automaticamente)
 */
export type UserProfileCreate = Omit<UserProfile, 'id' | 'created_at'>

/**
 * Tipo para atualização de perfil (todos os campos opcionais exceto id)
 */
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'created_at' | 'user_id'>>

/**
 * Possíveis roles do usuário
 */
export type UserRole = 'user' | 'admin' | 'atendente'

/**
 * Mapeamento de roles para exibição
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  user: 'Usuário',
  atendente: 'Atendente'
}

/**
 * Cores para diferentes roles
 */
export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  admin: { bg: 'bg-purple-100', text: 'text-purple-800' },
  user: { bg: 'bg-blue-100', text: 'text-blue-800' },
  atendente: { bg: 'bg-green-100', text: 'text-green-800' }
}

/**
 * Função para verificar se é admin
 */
export const isAdminRole = (role: string): boolean => {
  return role === 'admin'
}

/**
 * Profissional retornado pela RPC afaas_get_profissionais
 */
export interface ProfissionalRPC {
  profissional_id: number
  perfil_id: number
  especialidade_id: number
  nome_profissional: string
  especialidade: string
}
