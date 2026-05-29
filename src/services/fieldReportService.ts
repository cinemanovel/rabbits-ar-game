import { supabase } from '@/lib/supabase';
import type { FieldReport, FieldReportDraft, FieldReportResult } from '@/features/fieldReports/types';

function validateFieldReportDraft(draft: FieldReportDraft): string | null {
  const body = draft.body.trim();
  const title = draft.title?.trim() ?? '';

  if (body.length < 1 || body.length > 2000) {
    return 'Report body must be 1-2000 characters.';
  }

  if (title.length > 120) {
    return 'Report title must be 1-120 characters when provided.';
  }

  return null;
}

export async function getMyFieldReports(userId: string): Promise<FieldReportResult<FieldReport[]>> {
  const { data, error } = await supabase
    .from('field_reports')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data ?? [], error: null };
}

export async function submitFieldReport(
  userId: string,
  draft: FieldReportDraft,
): Promise<FieldReportResult<FieldReport>> {
  const validationError = validateFieldReportDraft(draft);

  if (validationError) {
    return { data: null, error: validationError };
  }

  const title = draft.title?.trim() ?? '';
  const body = draft.body.trim();

  const { data, error } = await supabase
    .from('field_reports')
    .insert({
      profile_id: userId,
      title: title.length > 0 ? title : null,
      body,
      status: 'submitted',
    })
    .select('*')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
