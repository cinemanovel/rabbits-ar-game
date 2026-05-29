import { useCallback, useEffect, useState } from 'react';

import { getTheIndex } from '@/services/indexService';
import type { IndexEntry } from '@/features/index/types';

type TheIndexState = {
  entries: IndexEntry[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useTheIndex(): TheIndexState {
  const [entries, setEntries] = useState<IndexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getTheIndex();

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setEntries(result.data ?? []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    entries,
    isLoading,
    error,
    refresh,
  };
}
