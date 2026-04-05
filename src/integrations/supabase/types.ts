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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      extracted_fields: {
        Row: {
          accepted: boolean
          confidence: number
          created_at: string
          document_id: string
          field_name: string
          id: string
          source_location: string | null
          value: string
        }
        Insert: {
          accepted?: boolean
          confidence?: number
          created_at?: string
          document_id: string
          field_name: string
          id?: string
          source_location?: string | null
          value: string
        }
        Update: {
          accepted?: boolean
          confidence?: number
          created_at?: string
          document_id?: string
          field_name?: string
          id?: string
          source_location?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "extracted_fields_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "intake_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      intake_documents: {
        Row: {
          ai_classification_confidence: number | null
          ai_classified_type:
            | Database["public"]["Enums"]["document_type"]
            | null
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          email_id: string | null
          errors: string[] | null
          file_name: string
          file_path: string | null
          file_size: number
          file_type: string
          id: string
          page_count: number | null
          processing_progress: number | null
          processing_status: Database["public"]["Enums"]["document_processing_status"]
          rfp_id: string | null
          updated_at: string
          upload_source: string
        }
        Insert: {
          ai_classification_confidence?: number | null
          ai_classified_type?:
            | Database["public"]["Enums"]["document_type"]
            | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          email_id?: string | null
          errors?: string[] | null
          file_name: string
          file_path?: string | null
          file_size?: number
          file_type: string
          id?: string
          page_count?: number | null
          processing_progress?: number | null
          processing_status?: Database["public"]["Enums"]["document_processing_status"]
          rfp_id?: string | null
          updated_at?: string
          upload_source?: string
        }
        Update: {
          ai_classification_confidence?: number | null
          ai_classified_type?:
            | Database["public"]["Enums"]["document_type"]
            | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          email_id?: string | null
          errors?: string[] | null
          file_name?: string
          file_path?: string | null
          file_size?: number
          file_type?: string
          id?: string
          page_count?: number | null
          processing_progress?: number | null
          processing_status?: Database["public"]["Enums"]["document_processing_status"]
          rfp_id?: string | null
          updated_at?: string
          upload_source?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_documents_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "intake_emails"
            referencedColumns: ["id"]
          },
        ]
      }
      intake_emails: {
        Row: {
          ai_summary: string | null
          attachment_count: number
          body_preview: string | null
          cc_addresses: string[] | null
          created_at: string
          from_address: string
          from_name: string | null
          group_detected: string | null
          id: string
          processing_status: Database["public"]["Enums"]["email_processing_status"]
          received_at: string
          rfp_id: string | null
          subject: string
          thread_count: number | null
          thread_id: string | null
          to_address: string | null
          tpa_detected: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          attachment_count?: number
          body_preview?: string | null
          cc_addresses?: string[] | null
          created_at?: string
          from_address: string
          from_name?: string | null
          group_detected?: string | null
          id?: string
          processing_status?: Database["public"]["Enums"]["email_processing_status"]
          received_at?: string
          rfp_id?: string | null
          subject: string
          thread_count?: number | null
          thread_id?: string | null
          to_address?: string | null
          tpa_detected?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          attachment_count?: number
          body_preview?: string | null
          cc_addresses?: string[] | null
          created_at?: string
          from_address?: string
          from_name?: string | null
          group_detected?: string | null
          id?: string
          processing_status?: Database["public"]["Enums"]["email_processing_status"]
          received_at?: string
          rfp_id?: string | null
          subject?: string
          thread_count?: number | null
          thread_id?: string | null
          to_address?: string | null
          tpa_detected?: string | null
          updated_at?: string
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
      document_processing_status:
        | "queued"
        | "classifying"
        | "extracting"
        | "review"
        | "accepted"
        | "rejected"
        | "error"
      document_type:
        | "census"
        | "sob"
        | "experience"
        | "application"
        | "rfp_letter"
        | "id_cards"
        | "unknown"
      email_processing_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "skipped"
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
      document_processing_status: [
        "queued",
        "classifying",
        "extracting",
        "review",
        "accepted",
        "rejected",
        "error",
      ],
      document_type: [
        "census",
        "sob",
        "experience",
        "application",
        "rfp_letter",
        "id_cards",
        "unknown",
      ],
      email_processing_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "skipped",
      ],
    },
  },
} as const
