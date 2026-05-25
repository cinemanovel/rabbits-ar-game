import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryLink } from '@/components/PrimaryLink';
import { colors, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  return (
    <AppScreen
      eyebrow="Field file 000"
      title="Rabbits"
      description="A quiet signal is moving through the city. Step in when you are ready."
    >
      <View style={styles.signalCard}>
        <Text style={styles.signalLabel}>Current state</Text>
        <Text style={styles.signalText}>Shell online. Investigation pending.</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryLink href="/sign-in" label="Sign in" />
        <PrimaryLink href="/sign-up" label="Create account" variant="quiet" />
        <PrimaryLink href="/home" label="Enter placeholder shell" variant="quiet" />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  signalCard: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  signalLabel: {
    color: colors.textFaint,
    fontSize: typography.eyebrow,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  signalText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.sm,
  },
});
