import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, spacing, typography } from '@/theme';

const settings = ['Notifications deferred', 'Location deferred', 'Purchases deferred'];

export default function SettingsTab() {
  const router = useRouter();
  const { signOut } = useAuth();
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
      eyebrow="Controls"
      title="Settings"
      description="Account controls stay plain, explicit, and separate from lore."
    >
      {settings.map((item) => (
        <View key={item} style={styles.item}>
          <View style={styles.itemCopy}>
            <Text style={styles.itemText}>{item}</Text>
            <Text style={styles.itemDetail}>Awaiting approved phase</Text>
          </View>
          <Text style={styles.itemState}>Off</Text>
        </View>
      ))}
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 66,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  itemCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  itemText: {
    color: colors.text,
    fontSize: typography.body,
  },
  itemDetail: {
    color: colors.textFaint,
    fontSize: typography.small,
  },
  itemState: {
    color: colors.signal,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  error: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
});
