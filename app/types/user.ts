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
