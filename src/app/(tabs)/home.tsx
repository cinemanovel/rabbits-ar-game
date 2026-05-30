import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { useAuth } from '@/features/auth/AuthProvider';
import { usePlayerProfile } from '@/features/profile/usePlayerProfile';
import { useActiveSignal } from '@/features/signal/useActiveSignal';
import { colors, radii, spacing, typography } from '@/theme';

const dispatchAudioSource = require('../../../assets/audio/dispatch-001.mp3');

export default function HomeTab() {
  const { user } = useAuth();
  const { error, isLoading, signal } = useActiveSignal(user?.id);
  const { isLoading: isProfileLoading, profile } = usePlayerProfile(user?.id);
  const dispatchPlayer = useAudioPlayer(dispatchAudioSource);
  const dispatchStatus = useAudioPlayerStatus(dispatchPlayer);
  const isDispatchPlaying = dispatchStatus.playing;
  const isDispatchPaused = !isDispatchPlaying && dispatchStatus.currentTime > 0;

  useEffect(() => {
    if (dispatchStatus.didJustFinish) {
      dispatchPlayer.seekTo(0);
    }
  }, [dispatchStatus.didJustFinish, dispatchPlayer]);

  const handlePlayDispatch = () => {
    if (isDispatchPlaying) {
      return;
    }

    if (!isDispatchPaused) {
      dispatchPlayer.seekTo(0);
    }

    dispatchPlayer.play();
  };

  const handlePauseDispatch = () => {
    dispatchPlayer.pause();
  };

  const handleStopDispatch = () => {
    dispatchPlayer.pause();
    dispatchPlayer.seekTo(0);
  };

  const heroTitle = isLoading ? 'Checking receiver' : signal ? signal.title : 'Dormant signal';
  const heroCopy = isLoading
    ? 'Verifying the line.'
    : signal
      ? signal.body
      : 'The shell is ready for the first chapter, but no live mystery systems are active.';

  return (
    <AppScreen
      eyebrow="Signal"
      title="Home"
      description={
        signal
          ? 'The receiver is awake. A transmission is on the line.'
          : 'The receiver is awake. Nothing has been transmitted yet.'
      }
    >
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.meta}>Receiver</Text>
          <View style={styles.controlCluster}>
            <Pressable
              accessibilityLabel="Play dispatch"
              accessibilityRole="button"
              hitSlop={{ top: 12, bottom: 12, left: 4, right: 4 }}
              onPress={handlePlayDispatch}
              style={({ pressed }) => [styles.control, pressed ? styles.controlPressed : null]}
            >
              <View style={styles.playIcon} />
            </Pressable>
            <Pressable
              accessibilityLabel="Pause dispatch"
              accessibilityRole="button"
              hitSlop={{ top: 12, bottom: 12, left: 4, right: 4 }}
              onPress={handlePauseDispatch}
              style={({ pressed }) => [styles.control, pressed ? styles.controlPressed : null]}
            >
              <View style={styles.pauseIcon}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            </Pressable>
            <Pressable
              accessibilityLabel="Stop dispatch"
              accessibilityRole="button"
              hitSlop={{ top: 12, bottom: 12, left: 4, right: 4 }}
              onPress={handleStopDispatch}
              style={({ pressed }) => [styles.control, pressed ? styles.controlPressed : null]}
            >
              <View style={styles.stopIcon} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.heroTitle}>{heroTitle}</Text>
        <Text style={styles.heroCopy}>{error ?? heroCopy}</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.meta}>Dispatches</Text>
          <Text style={styles.detail}>Queue active</Text>
        </View>
        <Text style={styles.value}>01</Text>
      </View>

      <View style={styles.dispatchCard}>
        <Text style={styles.dispatchEyebrow}>Attention</Text>
        <Text style={styles.dispatchBody}>Your account has been flagged for review.</Text>
        <Text style={styles.dispatchBody}>Access to file 004773 is restricted.</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.meta}>Case file</Text>
          <Text style={styles.detail}>{profile?.tier ?? 'Unclassified'}</Text>
        </View>
        <Text style={styles.value}>
          {isProfileLoading ? '--' : profile?.case_number ?? '--'}
        </Text>
      </View>
      <Text style={styles.note}>No clues, community systems, or game logic are active yet.</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 22,
    backgroundColor: colors.veil,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  control: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlPressed: {
    opacity: 0.5,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.signal,
    opacity: 0.85,
  },
  pauseIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pauseBar: {
    width: 3,
    height: 10,
    borderRadius: 1,
    backgroundColor: colors.signal,
    opacity: 0.85,
  },
  stopIcon: {
    width: 9,
    height: 9,
    borderRadius: 1.5,
    backgroundColor: colors.signal,
    opacity: 0.85,
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  heroCopy: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    minHeight: 72,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  meta: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  detail: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 21,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  dispatchCard: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
  },
  dispatchEyebrow: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  dispatchBody: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
    paddingTop: spacing.sm,
  },
});
