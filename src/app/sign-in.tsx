import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryLink } from '@/components/PrimaryLink';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, spacing, typography } from '@/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { isLoading: isAuthLoading, session, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Redirect href="/home" />;
  }

  const handleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);

    const result = await signIn(email, password);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace('/home');
  };

  const isDisabled = isAuthLoading || isSubmitting || !email.trim() || !password;

  return (
    <AppScreen
      eyebrow="Access"
      title="Sign in"
      description="Enter with the email and password attached to your Supabase account."
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <Text style={styles.kicker}>Secure access</Text>
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
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            style={styles.input}
            textContentType="password"
            value={password}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            disabled={isDisabled}
            label={isSubmitting ? 'Signing in' : 'Sign in'}
            onPress={() => {
              if (__DEV__) {
                console.log('[auth:signin] handler invoked');
              }

              handleSignIn();
            }}
          />
          <PrimaryLink href="/sign-up" label="Create account" variant="quiet" />
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
  error: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
});
