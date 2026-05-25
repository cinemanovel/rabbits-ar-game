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
        <View style={styles.signalHeader}>
          <Text style={styles.signalLabel}>Current state</Text>
          <View style={styles.signalDot} />
        </View>
        <Text style={styles.signalText}>Shell online</Text>
        <Text style={styles.signalSubtext}>Investigation pending. No live systems attached.</Text>
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
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  signalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signalLabel: {
    color: colors.textFaint,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  signalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.signal,
    opacity: 0.8,
  },
  signalText: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  signalSubtext: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 21,
  },
  actions: {
    gap: spacing.md,
  },
});
