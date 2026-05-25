import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { colors, radii, spacing, typography } from '@/theme';

export default function ProfileTab() {
  return (
    <AppScreen
      eyebrow="Identity"
      title="Profile"
      description="A player profile will live here after account systems are approved."
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>R</Text>
        </View>
        <View style={styles.identityCopy}>
          <Text style={styles.name}>Unknown participant</Text>
          <Text style={styles.status}>Identity unbound</Text>
        </View>
      </View>
      <Text style={styles.note}>No account, inventory, rank, or personal game state exists yet.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  avatarText: {
    color: colors.signal,
    fontSize: typography.title,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  identityCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: '700',
  },
  status: {
    color: colors.textFaint,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    paddingTop: spacing.xs,
  },
});
