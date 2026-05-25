import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryLink } from '@/components/PrimaryLink';
import { colors, spacing, typography } from '@/theme';

export default function SignUpScreen() {
  return (
    <AppScreen
      eyebrow="Invitation"
      title="Create account"
      description="Account creation will arrive with the auth phase. No identity data is collected here."
    >
      <Text style={styles.placeholder}>This placeholder does not store or submit anything.</Text>
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
