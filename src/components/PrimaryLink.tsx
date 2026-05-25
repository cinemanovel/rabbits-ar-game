import { Link, type Href } from 'expo-router';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, motion, radii, spacing, typography } from '@/theme';

type PrimaryLinkProps = {
  href: Href;
  label: string;
  variant?: 'primary' | 'quiet';
  style?: ViewStyle;
};

export function PrimaryLink({ href, label, variant = 'primary', style }: PrimaryLinkProps) {
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
      outputRange: [1, 0.82],
    }),
    transform: [
      {
        scale: pressValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.972],
        }),
      },
    ],
  };

  return (
    <Link href={href} asChild>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={style}
      >
        <Animated.View style={[styles.base, isPrimary ? styles.primary : styles.quiet, animatedStyle]}>
          <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.quietLabel]}>
            {label}
          </Text>
        </Animated.View>
      </Pressable>
    </Link>
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
