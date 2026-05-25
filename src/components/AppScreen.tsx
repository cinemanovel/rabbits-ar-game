import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, spacing, typography } from '@/theme';

type AppScreenProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function AppScreen({ eyebrow, title, description, children }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        <View style={styles.panel}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  eyebrow: {
    color: colors.signal,
    fontSize: typography.eyebrow,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '700',
    letterSpacing: -1.4,
    lineHeight: 52,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.bodyLarge,
    lineHeight: 28,
    maxWidth: 340,
  },
  panel: {
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
  },
});
