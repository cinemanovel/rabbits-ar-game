import { supabase } from '@/lib/supabase';
import type { IndexEntry, IndexResult } from '@/features/index/types';

export async function getTheIndex(): Promise<IndexResult<IndexEntry[]>> {
  const { data, error } = await supabase
    .from('the_index')
    .select('*')
    .order('case_number', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data ?? [], error: null };
}
