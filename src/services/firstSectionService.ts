import AsyncStorage from '@react-native-async-storage/async-storage';

import { INITIAL_FIRST_SECTION_STATE, type FirstSectionState } from '@/features/firstSection/types';

// First-section narrative progress is single-player, client-driven state with no
// integrity or abuse surface, so it lives in local storage rather than a remote table.
// If/when progression needs to be server-authoritative, move this behind a typed
// Supabase service with the same shape.
const STORAGE_KEY_PREFIX = 'rabbits.firstSection.v2.';

function storageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export async function loadFirstSectionState(userId: string): Promise<FirstSectionState> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId));

    if (!raw) {
      return { ...INITIAL_FIRST_SECTION_STATE };
    }

    const parsed = JSON.parse(raw) as Partial<FirstSectionState>;

    return { ...INITIAL_FIRST_SECTION_STATE, ...parsed };
  } catch {
    return { ...INITIAL_FIRST_SECTION_STATE };
  }
}

export async function saveFirstSectionState(
  userId: string,
  state: FirstSectionState,
): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKey(userId), JSON.stringify(state));
  } catch {
    // Best-effort persistence. The narrative still advances in-memory if a write fails.
  }
}

export async function clearFirstSectionState(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(storageKey(userId));
  } catch {
    // Best-effort clear.
  }
}
