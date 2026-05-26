import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'quiet';
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}: PrimaryButtonProps) {
  const isPrimary = variant === 'primary';

  const handlePress = () => {
    if (__DEV__) {
      console.log('[ui:button] onPress', { label, disabled });
    }

    if (disabled) {
      return;
    }

    onPress();
  };

  const handlePressIn = () => {
    if (__DEV__) {
      console.log('[ui:button] onPressIn', { label, disabled });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.quiet,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.quietLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.text,
    shadowColor: colors.signal,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  quiet: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  disabled: {
    opacity: 0.46,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.972 }],
  },
  label: {
    fontSize: typography.small,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  primaryLabel: {
    color: colors.black,
  },
  quietLabel: {
    color: colors.text,
  },
});
