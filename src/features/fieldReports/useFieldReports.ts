import { useCallback, useEffect, useState } from 'react';

import { getMyFieldReports, submitFieldReport } from '@/services/fieldReportService';
import type { FieldReport, FieldReportDraft } from '@/features/fieldReports/types';

type FieldReportsState = {
  reports: FieldReport[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  submit: (draft: FieldReportDraft) => Promise<boolean>;
};

export function useFieldReports(userId: string | undefined): FieldReportsState {
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await getMyFieldReports(userId);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setReports(result.data ?? []);
  }, [userId]);

  const submit = useCallback(
    async (draft: FieldReportDraft) => {
      if (!userId) {
        setError('Sign in before submitting a field report.');
        return false;
      }

      setIsSubmitting(true);
      setError(null);

      const result = await submitFieldReport(userId, draft);

      setIsSubmitting(false);

      if (result.error || !result.data) {
        setError(result.error ?? 'Field report could not be submitted.');
        return false;
      }

      setReports((current) => [result.data, ...current]);
      return true;
    },
    [userId],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    reports,
    isLoading,
    isSubmitting,
    error,
    refresh,
    submit,
  };
}
