import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/features/auth/AuthProvider';
import { usePlayerProfile } from '@/features/profile/usePlayerProfile';
import { colors, spacing, typography } from '@/theme';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default function SettingsTab() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const {
    error: profileError,
    isLoading: isProfileLoading,
    isSaving,
    profile,
    resetOnboarding,
  } = usePlayerProfile(user?.id);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setError(null);
    setMessage(null);
    setIsSigningOut(true);

    const result = await signOut();

    setIsSigningOut(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace('/');
  };

  const handleResetOnboarding = async () => {
    setError(null);
    setMessage(null);

    const didReset = await resetOnboarding();

    if (!didReset) {
      return;
    }

    setMessage('Onboarding reset. Returning to first-time flow.');
    router.replace('/onboarding');
  };

  return (
    <AppScreen
      eyebrow="Controls"
      title="Settings"
      description="Account and testing controls stay plain, explicit, and separate from lore."
    >
      <View style={styles.accountCard}>
        <Text style={styles.sectionLabel}>Signed in</Text>
        <Text style={styles.email}>{user?.email ?? 'Unknown email'}</Text>
        <Text style={styles.detail}>
          {profile?.onboarding_completed ? 'Onboarding complete' : 'Onboarding required'}
        </Text>
      </View>

      {isDevelopment ? (
        <View style={styles.testingCard}>
          <Text style={styles.sectionLabel}>Development testing</Text>
          <Text style={styles.detail}>
            Reset only flips `onboarding_completed` to false. It does not delete your account or profile.
          </Text>
          <PrimaryButton
            disabled={isProfileLoading || isSaving || isSigningOut}
            label={isSaving ? 'Resetting' : 'Reset onboarding'}
            onPress={handleResetOnboarding}
            variant="quiet"
          />
        </View>
      ) : null}

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {profileError ? <Text style={styles.error}>{profileError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton
        disabled={isSigningOut || isSaving}
        label={isSigningOut ? 'Signing out' : 'Sign out'}
        onPress={handleSignOut}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  accountCard: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  sectionLabel: {
    color: colors.signal,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  email: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: '700',
    lineHeight: 25,
  },
  detail: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 21,
  },
  testingCard: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  success: {
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
