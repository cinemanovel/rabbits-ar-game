import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryLink } from '@/components/PrimaryLink';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, typography } from '@/theme';

export default function AuthCallbackRoute() {
  const router = useRouter();
  const incomingUrl = Linking.useLinkingURL();
  const { completeAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(true);
  const handledUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!incomingUrl || handledUrl.current === incomingUrl) {
      return;
    }

    handledUrl.current = incomingUrl;
    setError(null);
    setIsCompleting(true);

    completeAuthCallback(incomingUrl).then((result) => {
      setIsCompleting(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.replace('/home');
    });
  }, [completeAuthCallback, incomingUrl, router]);

  return (
    <AppScreen
      eyebrow="Access"
      title={isCompleting ? 'Confirming' : error ? 'Link failed' : 'Confirmed'}
      description="Completing the secure Supabase email confirmation flow."
    >
      <Text style={error ? styles.error : styles.message}>
        {error ?? 'Hold for session exchange.'}
      </Text>
      {error ? <PrimaryLink href="/sign-in" label="Back to sign in" variant="quiet" /> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  message: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  error: {
    color: colors.signal,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
