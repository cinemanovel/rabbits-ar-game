import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { useTheIndex } from '@/features/index/useTheIndex';
import type { IndexEntry } from '@/features/index/types';
import { colors, spacing, typography } from '@/theme';

function formatIndexName(entry: IndexEntry) {
  const displayName = entry.display_name.trim();

  if (displayName.length > 0) {
    return displayName;
  }

  return `@${entry.handle}`;
}

function formatLastActive(lastActiveAt: string) {
  const timestamp = new Date(lastActiveAt);

  if (Number.isNaN(timestamp.getTime())) {
    return '--';
  }

  return timestamp.toISOString().slice(0, 10);
}

export default function IndexTab() {
  const { entries, error, isLoading } = useTheIndex();

  return (
    <AppScreen
      eyebrow="Index"
      title="The Index"
      description="Indexed participants with an active case file on record."
    >
      {isLoading ? <Text style={styles.stateCopy}>Scanning index.</Text> : null}
      {!isLoading && error ? <Text style={styles.stateCopy}>{error}</Text> : null}
      {!isLoading && !error && entries.length === 0 ? (
        <Text style={styles.stateCopy}>No indexed participants.</Text>
      ) : null}

      {!isLoading && !error
        ? entries.map((entry) => (
            <View key={entry.case_number} style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.caseNumber}>{entry.case_number}</Text>
                <Text style={styles.name}>{formatIndexName(entry)}</Text>
                <Text style={styles.metaLine}>
                  {entry.tier}
                  {entry.region ? ` · ${entry.region}` : ''}
                </Text>
              </View>
              <View style={styles.rowAside}>
                <Text style={styles.asideLabel}>Last active</Text>
                <Text style={styles.asideValue}>{formatLastActive(entry.last_active_at)}</Text>
              </View>
            </View>
          ))
        : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  stateCopy: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg,
    minHeight: 88,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  rowMain: {
    flex: 1,
    gap: spacing.xs,
  },
  caseNumber: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.4,
    fontVariant: ['tabular-nums'],
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  metaLine: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  rowAside: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  asideLabel: {
    color: colors.textFaint,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  asideValue: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
});
