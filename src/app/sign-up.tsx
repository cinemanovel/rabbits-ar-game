import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryLink } from '@/components/PrimaryLink';
import { getAuthCallbackUrl, useAuth } from '@/features/auth/AuthProvider';
import { colors, spacing, typography } from '@/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoading: isAuthLoading, session, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Redirect href="/home" />;
  }

  const handleSignUp = async () => {
    if (__DEV__) {
      console.log('[auth:signup] button press', {
        hasEmail: Boolean(email.trim()),
        passwordLength: password.length,
      });
    }

    setError(null);
    setMessage(null);

    if (!email.trim()) {
      if (__DEV__) {
        console.log('[auth:signup] validation failed: missing email');
      }

      setError('Enter an email address.');
      return;
    }

    if (password.length < 6) {
      if (__DEV__) {
        console.log('[auth:signup] validation failed: password too short');
      }

      setError('Use at least 6 characters.');
      return;
    }

    if (__DEV__) {
      console.log('[auth:signup] validation passed');
      console.log('[auth:signup] signUp invocation skipped for navigation audit');
      console.log('[auth:signup] would use emailRedirectTo:', getAuthCallbackUrl());
      console.log('[auth:signup] audit mode: skipping Supabase signUp call');
      setMessage('Audit mode: Create Account press reached the sign-up handler.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(email, password);

      setIsSubmitting(false);

      if (result.error) {
        if (__DEV__) {
          console.log('[auth:signup] provider returned error:', result.error);
        }

        setError(result.error);
        return;
      }

      if (result.session) {
        if (__DEV__) {
          console.log('[auth:signup] provider returned session');
        }

        router.replace('/home');
        return;
      }

      if (__DEV__) {
        console.log('[auth:signup] provider returned no session; confirmation email expected');
      }

      setMessage('Account request sent. Confirm your email, then sign in.');
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unexpected sign-up error.';

      if (__DEV__) {
        console.log('[auth:signup] exception:', message);
      }

      setIsSubmitting(false);
      setError(message);
    }
  };

  const isDisabled = isAuthLoading || isSubmitting;

  return (
    <AppScreen
      eyebrow="Invitation"
      title="Create account"
      description="Create a Supabase email account. No profile or game state is created yet."
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <Text style={styles.kicker}>Auth foundation</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            style={styles.input}
            textContentType="newPassword"
            value={password}
          />
          <Text style={styles.helper}>Use at least 6 characters.</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            disabled={isDisabled}
            label={isSubmitting ? 'Creating' : 'Create account'}
            onPress={handleSignUp}
          />
          <PrimaryLink href="/sign-in" label="Sign in instead" variant="quiet" />
          <PrimaryLink href="/" label="Back to welcome" variant="quiet" />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  kicker: {
    color: colors.signal,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
  },
  message: {
    color: colors.accent,
    fontSize: typography.small,
    lineHeight: 21,
  },
  error: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
});
