import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { colors, spacing, typography } from '@/theme';

export default function HomeTab() {
  return (
    <AppScreen
      eyebrow="Signal"
      title="Home"
      description="The first live chapter will surface here when the mystery prototype begins."
    >
      <View style={styles.row}>
        <View>
          <Text style={styles.meta}>Feed</Text>
          <Text style={styles.detail}>No dispatches queued</Text>
        </View>
        <Text style={styles.value}>Dormant</Text>
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.meta}>Chapter</Text>
          <Text style={styles.detail}>Prototype not connected</Text>
        </View>
        <Text style={styles.value}>Unassigned</Text>
      </View>
      <Text style={styles.note}>No clues, community systems, or game logic are active yet.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    minHeight: 68,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  meta: {
    color: colors.signal,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  detail: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontSize: typography.small,
  },
  value: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    paddingTop: spacing.sm,
  },
});
