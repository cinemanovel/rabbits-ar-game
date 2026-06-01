import { useCallback, useEffect, useRef, useState } from 'react';

import { matchesEmilySupportReference } from '@/config/externalSurfaces';
import { openExternalSurface } from '@/lib/openExternalSurface';
import {
  clearFirstSectionState,
  loadFirstSectionState,
  saveFirstSectionState,
} from '@/services/firstSectionService';
import { INITIAL_FIRST_SECTION_STATE, type FirstSectionState } from '@/features/firstSection/types';

type SubmitEmilyReferenceResult =
  | { ok: true }
  | { ok: false; error: string };

type FirstSectionApi = {
  state: FirstSectionState;
  isLoaded: boolean;
  markTraceVisible: () => void;
  markDispatchAvailable: () => void;
  markDispatchCompleted: () => void;
  openEmilySupportSite: () => Promise<{ ok: true } | { ok: false; error: string }>;
  submitEmilyReference: (reference: string) => SubmitEmilyReferenceResult;
  submitCorrection: () => void;
  activateRadiant: () => void;
  closeFirstSection: () => void;
  reset: () => void;
};

export function useFirstSection(userId: string | undefined): FirstSectionApi {
  const [state, setState] = useState<FirstSectionState>({ ...INITIAL_FIRST_SECTION_STATE });
  const [isLoaded, setIsLoaded] = useState(false);
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  useEffect(() => {
    let active = true;

    if (!userId) {
      setState({ ...INITIAL_FIRST_SECTION_STATE });
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);

    loadFirstSectionState(userId).then((loaded) => {
      if (active) {
        setState(loaded);
        setIsLoaded(true);
      }
    });

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const uid = userIdRef.current;

    if (!uid) {
      return;
    }

    saveFirstSectionState(uid, state);
  }, [state, isLoaded]);

  const update = useCallback((patch: Partial<FirstSectionState>) => {
    setState((current) => {
      const keys = Object.keys(patch) as (keyof FirstSectionState)[];
      const changed = keys.some((key) => current[key] !== patch[key]);

      if (!changed) {
        return current;
      }

      return { ...current, ...patch };
    });
  }, []);

  const markTraceVisible = useCallback(() => update({ trace_004773_visible: true }), [update]);

  const markDispatchAvailable = useCallback(
    () => update({ dispatch_001_available: true }),
    [update],
  );

  const markDispatchCompleted = useCallback(
    () => update({ dispatch_001_completed: true, emily_contact_available: true }),
    [update],
  );

  const openEmilySupportSite = useCallback(async () => {
    const result = await openExternalSurface('emilySupport');

    if (!result.ok) {
      return result;
    }

    update({ emily_site_opened: true });
    return { ok: true as const };
  }, [update]);

  const submitEmilyReference = useCallback(
    (reference: string): SubmitEmilyReferenceResult => {
      const trimmed = reference.trim();

      if (trimmed.length === 0) {
        return { ok: false, error: 'Enter the support reference from the page.' };
      }

      if (!matchesEmilySupportReference(trimmed)) {
        return { ok: false, error: 'That reference does not match the support page.' };
      }

      update({
        emily_reference_submitted: true,
        emily_contact_attempted: true,
        emily_reply_001_received: true,
      });

      return { ok: true };
    },
    [update],
  );

  const submitCorrection = useCallback(
    () => update({ correction_request_submitted: true }),
    [update],
  );

  const activateRadiant = useCallback(() => update({ radiant_l1_active: true }), [update]);

  const closeFirstSection = useCallback(() => update({ first_section_closed: true }), [update]);

  const reset = useCallback(() => {
    const uid = userIdRef.current;

    if (uid) {
      clearFirstSectionState(uid);
    }

    setState({ ...INITIAL_FIRST_SECTION_STATE });
  }, []);

  return {
    state,
    isLoaded,
    markTraceVisible,
    markDispatchAvailable,
    markDispatchCompleted,
    openEmilySupportSite,
    submitEmilyReference,
    submitCorrection,
    activateRadiant,
    closeFirstSection,
    reset,
  };
}
