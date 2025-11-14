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
      afaas_profiles: {
        Row: {
          id: number
          created_at: string
          user_id: string | null
          nome: string | null
          role: string | null
          email: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id?: string | null
          nome?: string | null
          role?: string | null
          email?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string | null
          nome?: string | null
          role?: string | null
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "afaas_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      afaas_agendamentos: {
        Row: {
          id: number
          created_at: string
          user_id: string | null
          profissional_id: number | null
          cliente_id: number | null
          data: string | null
          hora_inicio: string | null
          hora_fim: string | null
          titulo: string | null
          descricao: string | null
          cancelado: boolean | null
          cancelado_as: string | null
          cor: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id?: string | null
          profissional_id?: number | null
          cliente_id?: number | null
          data?: string | null
          hora_inicio?: string | null
          hora_fim?: string | null
          titulo?: string | null
          descricao?: string | null
          cancelado?: boolean | null
          cancelado_as?: string | null
          cor?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string | null
          profissional_id?: number | null
          cliente_id?: number | null
          data?: string | null
          hora_inicio?: string | null
          hora_fim?: string | null
          titulo?: string | null
          descricao?: string | null
          cancelado?: boolean | null
          cancelado_as?: string | null
          cor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "afaas_agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "afaas_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afaas_agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "afaas_profissionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afaas_agendamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      afaas_atendimentos: {
        Row: {
          id: number
          created_at: string
          cliente_id: number
          profissional_id: number
          eh_divino_auxiliar: boolean | null
          pode_auxiliar: boolean | null
          pressao_sistolica: number | null
          pressao_diastolica: number | null
          batimento_cardiaco: number | null
          status_cardiaco: string | null
          energia_vital: number | null
          imunidade: string | null
          meridiano: string | null
          centro_coronario: boolean
          centro_frontal: boolean
          centro_laringeo: boolean
          centro_cardiaco: boolean
          centro_plexo_solar: boolean
          centro_umbilical: boolean
          centro_base: boolean
          caderno_virus: boolean
          caderno_bacteria: boolean
          caderno_fungos: boolean
          caderno_parasitas: boolean
          caderno_micoplasma: boolean
          caderno_bacilos: boolean
          caderno_artrites: boolean
          caderno_doencas: boolean
          causas_desalinhamentos: string | null
          modificados_outros: string | null
          enc_medico: boolean
          enc_medico_tipo: string | null
          enc_medico_especialista: string | null
          enc_terapeuta: boolean
          enc_terapeuta_especialista: string | null
          plano_instrucoes_gerais: string | null
          plano_dosagem_ml: number | null
          plano_periodo_horas: number | null
          plano_duracao_dias: number | null
          plano_sessoes_frequencia: string | null
          observacoes: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          cliente_id: number
          profissional_id: number
          eh_divino_auxiliar?: boolean | null
          pode_auxiliar?: boolean | null
          pressao_sistolica?: number | null
          pressao_diastolica?: number | null
          batimento_cardiaco?: number | null
          status_cardiaco?: string | null
          energia_vital?: number | null
          imunidade?: string | null
          meridiano?: string | null
          centro_coronario?: boolean
          centro_frontal?: boolean
          centro_laringeo?: boolean
          centro_cardiaco?: boolean
          centro_plexo_solar?: boolean
          centro_umbilical?: boolean
          centro_base?: boolean
          caderno_virus?: boolean
          caderno_bacteria?: boolean
          caderno_fungos?: boolean
          caderno_parasitas?: boolean
          caderno_micoplasma?: boolean
          caderno_bacilos?: boolean
          caderno_artrites?: boolean
          caderno_doencas?: boolean
          causas_desalinhamentos?: string | null
          modificados_outros?: string | null
          enc_medico?: boolean
          enc_medico_tipo?: string | null
          enc_medico_especialista?: string | null
          enc_terapeuta?: boolean
          enc_terapeuta_especialista?: string | null
          plano_instrucoes_gerais?: string | null
          plano_dosagem_ml?: number | null
          plano_periodo_horas?: number | null
          plano_duracao_dias?: number | null
          plano_sessoes_frequencia?: string | null
          observacoes?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          cliente_id?: number
          profissional_id?: number
          eh_divino_auxiliar?: boolean | null
          pode_auxiliar?: boolean | null
          pressao_sistolica?: number | null
          pressao_diastolica?: number | null
          batimento_cardiaco?: number | null
          status_cardiaco?: string | null
          energia_vital?: number | null
          imunidade?: string | null
          meridiano?: string | null
          centro_coronario?: boolean
          centro_frontal?: boolean
          centro_laringeo?: boolean
          centro_cardiaco?: boolean
          centro_plexo_solar?: boolean
          centro_umbilical?: boolean
          centro_base?: boolean
          caderno_virus?: boolean
          caderno_bacteria?: boolean
          caderno_fungos?: boolean
          caderno_parasitas?: boolean
          caderno_micoplasma?: boolean
          caderno_bacilos?: boolean
          caderno_artrites?: boolean
          caderno_doencas?: boolean
          causas_desalinhamentos?: string | null
          modificados_outros?: string | null
          enc_medico?: boolean
          enc_medico_tipo?: string | null
          enc_medico_especialista?: string | null
          enc_terapeuta?: boolean
          enc_terapeuta_especialista?: string | null
          plano_instrucoes_gerais?: string | null
          plano_dosagem_ml?: number | null
          plano_periodo_horas?: number | null
          plano_duracao_dias?: number | null
          plano_sessoes_frequencia?: string | null
          observacoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "afaas_atendimentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "afaas_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afaas_atendimentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "afaas_profissionais"
            referencedColumns: ["id"]
          }
        ]
      }
      afaas_atendimento_plantas: {
        Row: {
          id: number
          created_at: string
          atendimento_id: number
          planta_id: number
          observacao_planta: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          atendimento_id: number
          planta_id: number
          observacao_planta?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          atendimento_id?: number
          planta_id?: number
          observacao_planta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "afaas_atendimento_plantas_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "afaas_atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afaas_atendimento_plantas_planta_id_fkey"
            columns: ["planta_id"]
            isOneToOne: false
            referencedRelation: "afaas_plantas_medicinais"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      afaas_view_agendamentos_completos: {
        Row: {
          agendamento_id: number
          created_at: string
          user_id: string | null
          data: string | null
          data_formatada: string | null
          hora_inicio: string | null
          hora_fim: string | null
          horario_formatado: string | null
          titulo: string | null
          descricao: string | null
          cancelado: boolean | null
          cancelado_as: string | null
          cor: string | null
          cliente_id: number | null
          nome_cliente: string | null
          cpf_cliente: string | null
          profissional_id: number | null
          nome_profissional: string | null
          especialidade: string | null
          profissional_completo: string | null
          cliente_completo: string | null
        }
      }
    }
    Functions: {
      afaas_isadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      afaas_update_infos_user: {
        Args: {
          p_nome: string
        }
        Returns: {
          success: boolean
          message: string
        }
      }
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
  created_at: string
  user_id: string
  nome: string
  role: string
  email: string
}

export interface AgendamentoCompletoView {
  agendamento_id: number
  created_at: string
  user_id: string | null
  data: string | null
  data_formatada: string | null
  hora_inicio: string | null
  hora_fim: string | null
  horario_formatado: string | null
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null
  cor: string | null
  cliente_id: number | null
  nome_cliente: string | null
  cpf_cliente: string | null
  profissional_id: number | null
  nome_profissional: string | null
  especialidade: string | null
  profissional_completo: string | null
  cliente_completo: string | null
}

/**
 * Interface para atendimento completo com dados relacionados
 */
export interface AtendimentoCompleto extends Tables<'afaas_atendimentos'> {
  cliente?: Tables<'afaas_clientes'>
  profissional?: {
    id: number
    nome: string
    especialidade: string
  }
  profissionais?: Array<{
    id: number | null
    funcao?: string | null
    nome?: string | null
    especialidade?: string | null
  }>
  plantas?: Array<{
    id: number
    atendimento_plantas_id: number
    nome_popular: string
    nome_cientifico: string | null
    observacao_planta: string | null
  }>
}

/**
 * Interface para criação de atendimento com plantas
 */
export interface CriarAtendimentoInput {
  atendimento: TablesInsert<'afaas_atendimentos'>
  plantas?: Array<{
    planta_id: number
    observacao_planta?: string | null
  }>
}