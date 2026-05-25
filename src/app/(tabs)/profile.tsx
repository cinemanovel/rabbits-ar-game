import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, radii, spacing, typography } from '@/theme';

export default function ProfileTab() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setError(null);
    setIsSigningOut(true);

    const result = await signOut();

    setIsSigningOut(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace('/');
  };

  return (
    <AppScreen
      eyebrow="Identity"
      title="Profile"
      description="Your Supabase session is active. A player profile will arrive later."
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() ?? 'R'}</Text>
        </View>
        <View style={styles.identityCopy}>
          <Text style={styles.name}>{user?.email ?? 'Signed-in participant'}</Text>
          <Text style={styles.status}>Session active</Text>
        </View>
      </View>
      <Text style={styles.note}>No account, inventory, rank, or personal game state exists yet.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton
        disabled={isSigningOut}
        label={isSigningOut ? 'Signing out' : 'Sign out'}
        onPress={handleSignOut}
        variant="quiet"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  avatarText: {
    color: colors.signal,
    fontSize: typography.title,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  identityCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: '700',
  },
  status: {
    color: colors.textFaint,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    paddingTop: spacing.xs,
  },
  error: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
});
