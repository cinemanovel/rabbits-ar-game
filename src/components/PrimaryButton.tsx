import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, motion, radii, spacing, typography } from '@/theme';

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
  const pressValue = useRef(new Animated.Value(0)).current;

  const setPressed = (pressed: boolean) => {
    Animated.timing(pressValue, {
      toValue: pressed ? 1 : 0,
      duration: motion.quick,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    opacity: pressValue.interpolate({
      inputRange: [0, 1],
      outputRange: [disabled ? 0.5 : 1, disabled ? 0.5 : 0.78],
    }),
    transform: [
      {
        scale: pressValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, disabled ? 1 : 0.985],
        }),
      },
    ],
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={style}
    >
      <Animated.View style={[styles.base, isPrimary ? styles.primary : styles.quiet, animatedStyle]}>
        <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.quietLabel]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.text,
    shadowColor: colors.signal,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4,
  },
  quiet: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  primaryLabel: {
    color: colors.black,
  },
  quietLabel: {
    color: colors.text,
  },
});
