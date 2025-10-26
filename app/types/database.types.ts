export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      afaas_clientes: {
        Row: {
            id: number
            created_at: string | null
            deleted_at: string | null
            nome_completo: string
            cpf: string | null
            data_nascimento: string | null
            altura: number | null
            peso: number | null
            tipo_sanguineo: string | null
            sexo: string | null
            naturalidade: string | null
            estado_naturalidade: string | null
            telefone: string | null
            profissao: string | null
            cep: string | null
            endereco: string | null
            numero: string | null
            complemento: string | null
            bairro: string | null
            cidade: string | null
            estado: string | null
            pais: string | null
            como_se_sente_em_casa: string | null
            quantas_pessoas_moram_com_voce: number | null
            aspecto_genetico_familiar: string | null
            historico_doencas_familia: string | null
            acompanhamento_medico: string | null
            patologia: string | null
            tratamento_utilizado: string | null
            usa_protese: boolean | null
            tipo_protese: string | null
            fez_transplante: boolean | null
            tipo_transplante: string | null
            ferimentos_graves: string | null
            medicamentos_em_uso: string | null
            procedimentos_cirurgicos: string | null
            uso_substancias_quimicas: string[] | null
            historico_doencas_passadas: string[] | null
            outras_condicoes: string[] | null
            dorme_bem: boolean | null
            email: string | null
        }
        Insert: {
         id?: number
         created_at?: string | null
         deleted_at?: string | null
         nome_completo: string
         cpf?: string | null
         data_nascimento?: string | null
         altura?: number | null
         peso?: number | null
         tipo_sanguineo?: string | null
         sexo?: string | null
         naturalidade?: string | null
         estado_naturalidade?: string | null
         telefone?: string | null
         profissao?: string | null
         cep?: string | null
         endereco?: string | null
         numero?: string | null
         complemento?: string | null
         bairro?: string | null
         cidade?: string | null
         estado?: string | null
         pais?: string | null
         como_se_sente_em_casa?: string | null
         quantas_pessoas_moram_com_voce?: number | null
         aspecto_genetico_familiar?: string | null
         historico_doencas_familia?: string | null
         acompanhamento_medico?: string | null
         patologia?: string | null
         tratamento_utilizado?: string | null
         usa_protese?: boolean | null
         tipo_protese?: string | null
         fez_transplante?: boolean | null
         tipo_transplante?: string | null
         ferimentos_graves?: string | null
         medicamentos_em_uso?: string | null
         procedimentos_cirurgicos?: string | null
         uso_substancias_quimicas?: string[] | null
         historico_doencas_passadas?: string[] | null
         outras_condicoes?: string[] | null
         dorme_bem?: boolean | null
         email?: string | null
        }
        Update: {
         id?: number
         created_at?: string | null
         deleted_at?: string | null
         nome_completo?: string
         cpf?: string | null
         data_nascimento?: string | null
         altura?: number | null
         peso?: number | null
         tipo_sanguineo?: string | null
         sexo?: string | null
         naturalidade?: string | null
         estado_naturalidade?: string | null
         telefone?: string | null
         profissao?: string | null
         cep?: string | null
         endereco?: string | null
         numero?: string | null
         complemento?: string | null
         bairro?: string | null
         cidade?: string | null
         estado?: string | null
         pais?: string | null
         como_se_sente_em_casa?: string | null
         quantas_pessoas_moram_com_voce?: number | null
         aspecto_genetico_familiar?: string | null
         historico_doencas_familia?: string | null
         acompanhamento_medico?: string | null
         patologia?: string | null
         tratamento_utilizado?: string | null
         usa_protese?: boolean | null
         tipo_protese?: string | null
         fez_transplante?: boolean | null
         tipo_transplante?: string | null
         ferimentos_graves?: string | null
         medicamentos_em_uso?: string | null
         procedimentos_cirurgicos?: string | null
         uso_substancias_quimicas?: string[] | null
         historico_doencas_passadas?: string[] | null
         outras_condicoes?: string[] | null
         dorme_bem?: boolean | null
         email?: string | null
        }
        Relationships: []
      }
      afaas_plantas_medicinais: {
        Row: {
          id: number
          created_at: string | null
          deleted_at: string | null
          nome_popular: string
          nome_cientifico: string | null
          partes_usadas: string[] | null
          sabor_propriedade: string[] | null
          meridianos: string[] | null
          acao_terapeutica: string | null
          indicacoes: string | null
          contraindicacoes: string | null
          renisus: boolean | null
        }
        Insert: {
          id?: number
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
        Update: {
          id?: number
          created_at?: string | null
          deleted_at?: string | null
          nome_popular?: string
          nome_cientifico?: string | null
          partes_usadas?: string[] | null
          sabor_propriedade?: string[] | null
          meridianos?: string[] | null
          acao_terapeutica?: string | null
          indicacoes?: string | null
          contraindicacoes?: string | null
          renisus?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"])[EnumName]
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
  ? (Database["public"]["Enums"])[PublicEnumNameOrOptions]
  : never

/**
 * Perfil retornado pela RPC afaas_get_profiles_if_admin
 */
export interface PerfilRPC {
  id: number
  nome: string
}