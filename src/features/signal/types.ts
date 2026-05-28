import type { Database } from '@/types/database';

export type Signal = Database['public']['Tables']['signals']['Row'];

export type SignalResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };
