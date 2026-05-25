import { useCallback, useEffect, useState } from 'react';

import { getPlayerProfile, resetPlayerOnboarding, savePlayerProfile } from '@/services/profileService';
import type { PlayerProfile, PlayerProfileDraft } from '@/features/profile/types';

type ProfileState = {
  profile: PlayerProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  resetOnboarding: () => Promise<boolean>;
  save: (draft: PlayerProfileDraft) => Promise<boolean>;
};

export function usePlayerProfile(userId: string | undefined): ProfileState {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getPlayerProfile(userId);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setProfile(result.data);
  }, [userId]);

  const save = useCallback(
    async (draft: PlayerProfileDraft) => {
      if (!userId) {
        setError('Sign in before editing your profile.');
        return false;
      }

      setIsSaving(true);
      setError(null);

      const result = await savePlayerProfile(userId, draft);

      setIsSaving(false);

      if (result.error) {
        setError(result.error);
        return false;
      }

      setProfile(result.data);
      return true;
    },
    [userId],
  );

  const resetOnboarding = useCallback(async () => {
    if (!userId) {
      setError('Sign in before resetting onboarding.');
      return false;
    }

    setIsSaving(true);
    setError(null);

    const result = await resetPlayerOnboarding(userId);

    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return false;
    }

    setProfile(result.data);
    return true;
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    profile,
    isLoading,
    isSaving,
    error,
    refresh,
    resetOnboarding,
    save,
  };
}
