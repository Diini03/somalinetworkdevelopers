export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          ai_score: number | null
          ai_score_updated_at: string | null
          availability: string
          bio: string
          certifications: string[] | null
          created_at: string | null
          cv: string | null
          email: string
          expected_salary_max: number
          expected_salary_min: number
          experience: Json
          github: string | null
          id: string
          linkedin: string | null
          location: string
          name: string
          photo: string
          portfolio: string | null
          profile_completeness: number | null
          qualification: string
          skills: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_score?: number | null
          ai_score_updated_at?: string | null
          availability: string
          bio: string
          certifications?: string[] | null
          created_at?: string | null
          cv?: string | null
          email: string
          expected_salary_max: number
          expected_salary_min: number
          experience?: Json
          github?: string | null
          id?: string
          linkedin?: string | null
          location: string
          name: string
          photo: string
          portfolio?: string | null
          profile_completeness?: number | null
          qualification: string
          skills: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_score?: number | null
          ai_score_updated_at?: string | null
          availability?: string
          bio?: string
          certifications?: string[] | null
          created_at?: string | null
          cv?: string | null
          email?: string
          expected_salary_max?: number
          expected_salary_min?: number
          experience?: Json
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string
          name?: string
          photo?: string
          portfolio?: string | null
          profile_completeness?: number | null
          qualification?: string
          skills?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          candidate_id: string
          email_sent_successfully: boolean
          error_message: string | null
          id: string
          message: string
          sender_email: string
          sender_name: string
          sent_at: string
          subject: string
        }
        Insert: {
          candidate_id: string
          email_sent_successfully?: boolean
          error_message?: string | null
          id?: string
          message: string
          sender_email: string
          sender_name: string
          sent_at?: string
          subject: string
        }
        Update: {
          candidate_id?: string
          email_sent_successfully?: boolean
          error_message?: string | null
          id?: string
          message?: string
          sender_email?: string
          sender_name?: string
          sent_at?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_candidate: {
        Args: { _id: string }
        Returns: {
          ai_score: number
          availability: string
          bio: string
          certifications: string[]
          created_at: string
          experience: Json
          github: string
          id: string
          linkedin: string
          location: string
          name: string
          photo: string
          portfolio: string
          qualification: string
          skills: string[]
          title: string
        }[]
      }
      get_public_candidates: {
        Args: never
        Returns: {
          ai_score: number
          availability: string
          bio: string
          certifications: string[]
          created_at: string
          experience: Json
          github: string
          id: string
          linkedin: string
          location: string
          name: string
          photo: string
          portfolio: string
          qualification: string
          skills: string[]
          title: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
