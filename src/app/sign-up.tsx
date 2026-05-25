import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryLink } from '@/components/PrimaryLink';
import { useAuth } from '@/features/auth/AuthProvider';
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
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const result = await signUp(email, password);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.session) {
      router.replace('/home');
      return;
    }

    setMessage('Account request sent. Confirm your email, then sign in.');
  };

  const isDisabled = isAuthLoading || isSubmitting || !email.trim() || password.length < 6;

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
