import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryLink } from '@/components/PrimaryLink';
import { colors, spacing, typography } from '@/theme';

export default function SignInScreen() {
  return (
    <AppScreen
      eyebrow="Access"
      title="Sign in"
      description="Authentication will connect here in a later phase. For now, this is a quiet door."
    >
      <Text style={styles.placeholder}>Supabase auth is intentionally deferred.</Text>
      <PrimaryLink href="/home" label="Continue to shell" />
      <PrimaryLink href="/" label="Back to welcome" variant="quiet" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    marginBottom: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
