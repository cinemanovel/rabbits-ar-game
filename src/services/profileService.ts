import { supabase } from '@/lib/supabase';
import type { PlayerProfile, PlayerProfileDraft, ProfileResult } from '@/features/profile/types';

function normalizeHandle(handle: string) {
  return handle.trim().toLowerCase();
}

function validateProfileDraft(draft: PlayerProfileDraft): string | null {
  const displayName = draft.displayName.trim();
  const handle = normalizeHandle(draft.handle);
  const bio = draft.bio.trim();

  if (displayName.length < 1 || displayName.length > 48) {
    return 'Display name must be 1-48 characters.';
  }

  if (!/^[a-z0-9_]{3,24}$/.test(handle)) {
    return 'Handle must be 3-24 lowercase letters, numbers, or underscores.';
  }

  if (bio.length > 160) {
    return 'Bio must be 160 characters or fewer.';
  }

  return null;
}

function formatProfileError(message: string) {
  if (message.toLowerCase().includes('profiles_handle_unique_idx')) {
    return 'That handle is already taken.';
  }

  if (message.toLowerCase().includes('duplicate key')) {
    return 'That handle is already taken.';
  }

  return message;
}

export async function getPlayerProfile(userId: string): Promise<ProfileResult<PlayerProfile | null>> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

  if (error) {
    return { data: null, error: formatProfileError(error.message) };
  }

  return { data, error: null };
}

export async function savePlayerProfile(
  userId: string,
  draft: PlayerProfileDraft,
): Promise<ProfileResult<PlayerProfile>> {
  const validationError = validateProfileDraft(draft);

  if (validationError) {
    return { data: null, error: validationError };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        display_name: draft.displayName.trim(),
        handle: normalizeHandle(draft.handle),
        bio: draft.bio.trim(),
        avatar_placeholder: 'signal',
        onboarding_completed: draft.onboardingCompleted,
      },
      {
        onConflict: 'id',
      },
    )
    .select('*')
    .single();

  if (error) {
    return { data: null, error: formatProfileError(error.message) };
  }

  return { data, error: null };
}
