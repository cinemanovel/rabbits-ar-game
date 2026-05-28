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
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
