import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { useAuth } from '@/features/auth/AuthProvider';
import { usePlayerProfile } from '@/features/profile/usePlayerProfile';
import { useActiveSignal } from '@/features/signal/useActiveSignal';
import { colors, spacing, typography } from '@/theme';

export default function HomeTab() {
  const { user } = useAuth();
  const { error, isLoading, signal } = useActiveSignal(user?.id);
  const { isLoading: isProfileLoading, profile } = usePlayerProfile(user?.id);

  const heroTitle = isLoading ? 'Checking receiver' : signal ? signal.title : 'Dormant signal';
  const heroCopy = isLoading
    ? 'Verifying the line.'
    : signal
      ? signal.body
      : 'The shell is ready for the first chapter, but no live mystery systems are active.';

  return (
    <AppScreen
      eyebrow="Signal"
      title="Home"
      description={
        signal
          ? 'The receiver is awake. A transmission is on the line.'
          : 'The receiver is awake. Nothing has been transmitted yet.'
      }
    >
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.meta}>Receiver</Text>
          <View style={[styles.statusDot, signal ? styles.statusDotLive : null]} />
        </View>
        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroCopy}>{error ?? heroCopy}</Text>
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
          <Text style={styles.meta}>Case file</Text>
          <Text style={styles.detail}>{profile?.tier ?? 'Unclassified'}</Text>
        </View>
        <Text style={styles.value}>
          {isProfileLoading ? '--' : profile?.case_number ?? '--'}
        </Text>
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
  statusDotLive: {
    opacity: 1,
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
