import { useCallback, useEffect, useState } from 'react';

import { getActiveSignal } from '@/services/signalService';
import type { Signal } from '@/features/signal/types';

type ActiveSignalState = {
  signal: Signal | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useActiveSignal(userId: string | undefined): ActiveSignalState {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setSignal(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getActiveSignal(userId);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSignal(result.data);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    signal,
    isLoading,
    error,
    refresh,
  };
}
