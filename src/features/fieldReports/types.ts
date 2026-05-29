import type { Database } from '@/types/database';

export type FieldReport = Database['public']['Tables']['field_reports']['Row'];

export type FieldReportDraft = {
  title?: string | null;
  body: string;
};

export type FieldReportResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };
