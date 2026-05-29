export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          handle: string;
          bio: string;
          avatar_placeholder: string;
          onboarding_completed: boolean;
          case_number: string;
          tier: string;
          region: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          handle: string;
          bio?: string;
          avatar_placeholder?: string;
          onboarding_completed?: boolean;
          case_number?: string;
          tier?: string;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          handle?: string;
          bio?: string;
          avatar_placeholder?: string;
          onboarding_completed?: boolean;
          case_number?: string;
          tier?: string;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      field_reports: {
        Row: {
          id: string;
          profile_id: string;
          title: string | null;
          body: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title?: string | null;
          body: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string | null;
          body?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'field_reports_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      signals: {
        Row: {
          id: string;
          player_id: string | null;
          title: string;
          body: string;
          signal_type: string;
          status: string;
          sort_order: number;
          available_at: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id?: string | null;
          title: string;
          body: string;
          signal_type?: string;
          status?: string;
          sort_order?: number;
          available_at?: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string | null;
          title?: string;
          body?: string;
          signal_type?: string;
          status?: string;
          sort_order?: number;
          available_at?: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'signals_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      the_index: {
        Row: {
          case_number: string;
          display_name: string;
          handle: string;
          tier: string;
          region: string | null;
          last_active_at: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
