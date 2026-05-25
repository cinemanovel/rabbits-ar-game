import type { User } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { usePlayerProfile } from '@/features/profile/usePlayerProfile';
import { colors, motion, radii, spacing, typography } from '@/theme';

type OnboardingStep = 'intro' | 'signal' | 'threshold' | 'handle' | 'profile' | 'final';

type OnboardingFlowProps =
  | {
      mode: 'loading';
      user?: never;
    }
  | {
      mode?: 'flow';
      user: User;
    };

const steps: OnboardingStep[] = ['intro', 'signal', 'threshold', 'handle', 'profile', 'final'];

function makeDefaultHandle(email?: string) {
  const base = email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '_') ?? 'player';
  const compact = base.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  return compact.length >= 3 ? compact.slice(0, 24) : 'player';
}

export function OnboardingFlow(props: OnboardingFlowProps) {
  const router = useRouter();
  const user = props.mode === 'loading' ? undefined : props.user;
  const { error: profileError, isLoading, isSaving, profile, save } = usePlayerProfile(user?.id);
  const [stepIndex, setStepIndex] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const reveal = useMemo(() => new Animated.Value(1), []);

  const step = steps[stepIndex];
  const progress = `${stepIndex + 1} / ${steps.length}`;

  useEffect(() => {
    reveal.setValue(0);
    Animated.timing(reveal, {
      toValue: 1,
      duration: motion.measured,
      useNativeDriver: true,
    }).start();
  }, [reveal, stepIndex]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setDisplayName(profile?.display_name || user.email?.split('@')[0] || '');
    setHandle(profile?.handle || makeDefaultHandle(user.email));
    setBio(profile?.bio || '');
  }, [profile, user]);

  useEffect(() => {
    if (profile?.onboarding_completed) {
      router.replace('/home');
    }
  }, [profile?.onboarding_completed, router]);

  const avatarInitial = useMemo(
    () => (displayName || user?.email || 'R').charAt(0).toUpperCase(),
    [displayName, user?.email],
  );

  const goNext = () => {
    setLocalError(null);
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setLocalError(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const completeOnboarding = async () => {
    setLocalError(null);

    const didSave = await save({
      displayName,
      handle,
      bio,
      onboardingCompleted: true,
    });

    if (!didSave) {
      return;
    }

    router.replace('/home');
  };

  if (props.mode === 'loading' || isLoading) {
    return (
      <OnboardingFrame eyebrow="Receiving" title="Checking signal" progress="-" description="Verifying your session and profile state.">
        <Text style={styles.bodyText}>Hold for signal.</Text>
      </OnboardingFrame>
    );
  }

  return (
    <OnboardingFrame
      eyebrow="First contact"
      title={copyByStep[step].title}
      progress={progress}
      description={copyByStep[step].description}
    >
      <Animated.View
        style={[
          styles.stepReveal,
          {
            opacity: reveal,
            transform: [
              {
                translateY: reveal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              },
            ],
          },
        ]}
      >
        {step === 'intro' ? (
        <View style={styles.stack}>
          <Text style={styles.bodyText}>
            The app is quiet because the investigation has not started yet. That is intentional.
          </Text>
          <Text style={styles.faintText}>No game state. No location. No community feed. Just the first mark.</Text>
          <PrimaryButton label="Begin" onPress={goNext} />
        </View>
        ) : null}

        {step === 'signal' ? (
        <View style={styles.stack}>
          <View style={styles.signalCard}>
            <Text style={styles.cardLabel}>Unresolved signal</Text>
            <Text style={styles.cardText}>There are patterns that only appear after someone agrees to notice.</Text>
          </View>
          <PrimaryButton label="Continue" onPress={goNext} />
          <PrimaryButton label="Back" onPress={goBack} variant="quiet" />
        </View>
        ) : null}

        {step === 'threshold' ? (
        <View style={styles.stack}>
          <Text style={styles.bodyText}>You are not joining a feed. You are opening a file.</Text>
          <Text style={styles.faintText}>The profile below is private foundation only. Public systems are deferred.</Text>
          <PrimaryButton label="Set identity" onPress={goNext} />
          <PrimaryButton label="Back" onPress={goBack} variant="quiet" />
        </View>
        ) : null}

        {step === 'handle' ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.stack}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarInitial}</Text>
              </View>
              <View style={styles.avatarCopy}>
                <Text style={styles.cardLabel}>Avatar placeholder</Text>
                <Text style={styles.faintText}>Image upload comes later.</Text>
              </View>
            </View>
            <Field label="Display name" value={displayName} onChangeText={setDisplayName} maxLength={48} />
            <Field
              autoCapitalize="none"
              autoCorrect={false}
              helper="3-24 lowercase letters, numbers, or underscores."
              label="Handle"
              maxLength={24}
              onChangeText={(value) => setHandle(value.trim().toLowerCase())}
              value={handle}
            />
            <PrimaryButton label="Confirm handle" onPress={goNext} />
            <PrimaryButton label="Back" onPress={goBack} variant="quiet" />
          </View>
        </KeyboardAvoidingView>
        ) : null}

        {step === 'profile' ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.stack}>
            <Field
              helper={`${bio.length}/160`}
              label="Short bio"
              maxLength={160}
              multiline
              onChangeText={setBio}
              placeholder="A restrained note for your private profile."
              value={bio}
            />
            <Text style={styles.faintText}>This writes only your profile foundation. No social profile is created.</Text>
            <PrimaryButton label="Review" onPress={goNext} />
            <PrimaryButton label="Back" onPress={goBack} variant="quiet" />
          </View>
        </KeyboardAvoidingView>
        ) : null}

        {step === 'final' ? (
        <View style={styles.stack}>
          <View style={styles.signalCard}>
            <Text style={styles.cardLabel}>Identity prepared</Text>
            <Text style={styles.cardText}>{displayName || 'Unnamed participant'}</Text>
            <Text style={styles.faintText}>{handle ? `@${handle}` : 'Handle required'}</Text>
          </View>
          <Text style={styles.bodyText}>When you enter, the shell opens. The mystery remains dormant.</Text>
          {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}
          {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
          <PrimaryButton
            disabled={isSaving}
            label={isSaving ? 'Opening' : 'Enter the app'}
            onPress={completeOnboarding}
          />
          <PrimaryButton disabled={isSaving} label="Back" onPress={goBack} variant="quiet" />
        </View>
        ) : null}
      </Animated.View>
    </OnboardingFrame>
  );
}

function Field({
  helper,
  label,
  multiline = false,
  ...inputProps
}: {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  helper?: string;
  label: string;
  maxLength?: number;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.signal}
        style={[styles.input, multiline ? styles.bioInput : null]}
      />
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

function OnboardingFrame({
  children,
  description,
  eyebrow,
  progress,
  title,
}: {
  children: ReactNode;
  description: string;
  eyebrow: string;
  progress: string;
  title: string;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backdrop} pointerEvents="none">
        <View style={styles.glow} />
        <View style={styles.lowGlow} />
        <View style={styles.signalLine} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.progress}>{progress}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.panel}>
          <View style={styles.panelAccent} />
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const copyByStep: Record<OnboardingStep, { title: string; description: string }> = {
  intro: {
    title: 'Before the first signal',
    description: 'A short orientation for a quiet system.',
  },
  signal: {
    title: 'Something is already here',
    description: 'Not a clue yet. A shape in the dark.',
  },
  threshold: {
    title: 'A private mark',
    description: 'Set the identity this device will recognize.',
  },
  handle: {
    title: 'Choose the name',
    description: 'A handle keeps the file distinct without making it public.',
  },
  profile: {
    title: 'Leave a trace',
    description: 'A short note, optional and restrained.',
  },
  final: {
    title: 'The door is ready',
    description: 'The app shell will open. The deeper systems remain locked.',
  },
};

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
    right: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.accentMuted,
    opacity: 0.13,
  },
  lowGlow: {
    position: 'absolute',
    bottom: -180,
    left: -160,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.signalMuted,
    opacity: 0.07,
  },
  signalLine: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    top: '38%',
    height: 1,
    backgroundColor: colors.borderSoft,
    opacity: 0.68,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2.6,
    textTransform: 'uppercase',
  },
  progress: {
    color: colors.textFaint,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 38,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 26,
    maxWidth: 340,
  },
  panel: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 7,
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
  stepReveal: {
    minHeight: 1,
  },
  stack: {
    gap: spacing.lg,
  },
  bodyText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 26,
  },
  faintText: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  signalCard: {
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radii.md,
    backgroundColor: colors.veil,
    padding: spacing.lg,
  },
  cardLabel: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  cardText: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  avatarRow: {
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
  },
  avatarCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.signal,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.veil,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
  },
  bioInput: {
    minHeight: 96,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  helper: {
    color: colors.textFaint,
    fontSize: typography.small,
    lineHeight: 21,
  },
  errorText: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
});
