import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { colors, spacing, typography } from '@/theme';

export default function HomeTab() {
  return (
    <AppScreen
      eyebrow="Signal"
      title="Home"
      description="The receiver is awake. Nothing has been transmitted yet."
    >
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.meta}>Receiver</Text>
          <View style={styles.statusDot} />
        </View>
        <Text style={styles.heroTitle}>Dormant signal</Text>
        <Text style={styles.heroCopy}>The shell is ready for the first chapter, but no live mystery systems are active.</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.meta}>Dispatches</Text>
          <Text style={styles.detail}>Queue silent</Text>
        </View>
        <Text style={styles.value}>00</Text>
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.meta}>Chapter</Text>
          <Text style={styles.detail}>Awaiting first file</Text>
        </View>
        <Text style={styles.value}>--</Text>
      </View>
      <Text style={styles.note}>No clues, community systems, or game logic are active yet.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 22,
    backgroundColor: colors.veil,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.signal,
    opacity: 0.72,
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  heroCopy: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    minHeight: 72,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  meta: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  detail: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 21,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
    paddingTop: spacing.sm,
  },
});
