import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type PrimaryLinkProps = {
  href: Href;
  label: string;
  variant?: 'primary' | 'quiet';
  style?: ViewStyle;
};

export function PrimaryLink({ href, label, variant = 'primary', style }: PrimaryLinkProps) {
  const isPrimary = variant === 'primary';

  return (
    <Link href={href} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.base,
          isPrimary ? styles.primary : styles.quiet,
          pressed ? styles.pressed : null,
          style,
        ]}
      >
        <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.quietLabel]}>
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.text,
  },
  quiet: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSoft,
  },
  pressed: {
    opacity: 0.72,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  primaryLabel: {
    color: colors.black,
  },
  quietLabel: {
    color: colors.text,
  },
});
