import { supabase } from '@/lib/supabase';
import type { Signal, SignalResult } from '@/features/signal/types';

async function getPublishedTargetedSignal(userId: string): Promise<SignalResult<Signal | null>> {
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('player_id', userId)
    .eq('status', 'published')
    .lte('available_at', new Date().toISOString())
    .order('sort_order', { ascending: true })
    .order('available_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

async function getPublishedGlobalSignal(): Promise<SignalResult<Signal | null>> {
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .is('player_id', null)
    .eq('status', 'published')
    .lte('available_at', new Date().toISOString())
    .order('sort_order', { ascending: true })
    .order('available_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getActiveSignal(userId: string): Promise<SignalResult<Signal | null>> {
  const targetedResult = await getPublishedTargetedSignal(userId);

  if (targetedResult.error) {
    return targetedResult;
  }

  if (targetedResult.data) {
    return targetedResult;
  }

  return getPublishedGlobalSignal();
}
