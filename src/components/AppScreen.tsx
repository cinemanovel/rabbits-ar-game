import { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, motion, radii, spacing, typography } from '@/theme';

type AppScreenProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function AppScreen({ eyebrow, title, description, children }: AppScreenProps) {
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: 1,
      duration: motion.atmospheric,
      useNativeDriver: true,
    }).start();
  }, [reveal]);

  const contentStyle = {
    opacity: reveal,
    transform: [
      {
        translateY: reveal.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backdrop} pointerEvents="none">
        <View style={styles.glow} />
        <View style={styles.lowGlow} />
        <View style={styles.signalLine} />
      </View>

      <Animated.View style={[styles.container, contentStyle]}>
        <View style={styles.header}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        <View style={styles.panel}>
          <View style={styles.panelAccent} />
          {children}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  glow: {
    position: 'absolute',
    top: -120,
    right: -140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.accentMuted,
    opacity: 0.14,
  },
  lowGlow: {
    position: 'absolute',
    bottom: -170,
    left: -160,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.signalMuted,
    opacity: 0.08,
  },
  signalLine: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    top: '42%',
    height: 1,
    backgroundColor: colors.borderSoft,
    opacity: 0.58,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    maxWidth: 380,
  },
  eyebrow: {
    color: colors.signal,
    fontSize: typography.eyebrow,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 54,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.bodyLarge,
    lineHeight: 29,
    maxWidth: 340,
  },
  panel: {
    position: 'relative',
    gap: spacing.lg,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.24,
    shadowRadius: 30,
    elevation: 8,
  },
  panelAccent: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 1,
    backgroundColor: colors.signal,
    opacity: 0.34,
  },
});
