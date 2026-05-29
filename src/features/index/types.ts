import type { Database } from '@/types/database';

export type IndexEntry = Database['public']['Views']['the_index']['Row'];

export type IndexResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };
