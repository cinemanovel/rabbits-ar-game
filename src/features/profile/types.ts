import type { Database } from '@/types/database';

export type PlayerProfile = Database['public']['Tables']['profiles']['Row'];

export type PlayerProfileDraft = {
  displayName: string;
  handle: string;
  bio: string;
  onboardingCompleted: boolean;
};

export type ProfileResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };
