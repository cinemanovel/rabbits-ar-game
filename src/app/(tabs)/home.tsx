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
        <Text style={styles.meta}>Feed</Text>
        <Text style={styles.value}>Dormant</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.meta}>Chapter</Text>
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  meta: {
    color: colors.textFaint,
    fontSize: typography.eyebrow,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    paddingTop: spacing.sm,
  },
});
