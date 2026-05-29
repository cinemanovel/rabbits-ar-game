import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/features/auth/AuthProvider';
import { usePlayerProfile } from '@/features/profile/usePlayerProfile';
import { colors, radii, spacing, typography } from '@/theme';

export default function ProfileTab() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { error: profileError, isLoading, isSaving, profile, save } = usePlayerProfile(user?.id);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setDisplayName(profile.display_name);
    setHandle(profile.handle);
    setBio(profile.bio);
    setOnboardingCompleted(profile.onboarding_completed);
  }, [profile]);

  const handleSignOut = async () => {
    setError(null);
    setIsSigningOut(true);

    const result = await signOut();

    setIsSigningOut(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace('/');
  };

  const handleSave = async () => {
    setSavedMessage(null);
    setError(null);

    const didSave = await save({
      displayName,
      handle,
      bio,
      onboardingCompleted,
    });

    if (didSave) {
      setSavedMessage('Profile saved.');
    }
  };

  const avatarInitial = (displayName || user?.email || 'R').charAt(0).toUpperCase();

  return (
    <AppScreen
      eyebrow="Identity"
      title="Profile"
      description="Shape the private player identity attached to this account."
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitial}</Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.name}>{displayName || 'Unnamed participant'}</Text>
              <Text style={styles.status}>{handle ? `@${handle}` : 'Handle unclaimed'}</Text>
              {profile?.case_number ? (
                <Text style={styles.caseFile}>{profile.case_number}</Text>
              ) : null}
              {profile?.tier ? <Text style={styles.tier}>{profile.tier}</Text> : null}
            </View>
          </View>

          <Text style={styles.note}>Avatar images are deferred. This mark is a placeholder only.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Display name</Text>
            <TextInput
              maxLength={48}
              onChangeText={setDisplayName}
              placeholder="Display name"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              value={displayName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Handle</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={24}
              onChangeText={(value) => setHandle(value.trim().toLowerCase())}
              placeholder="username"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              value={handle}
            />
            <Text style={styles.helper}>3-24 lowercase letters, numbers, or underscores.</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Short bio</Text>
            <TextInput
              maxLength={160}
              multiline
              onChangeText={setBio}
              placeholder="A short note for your private profile."
              placeholderTextColor={colors.textFaint}
              style={[styles.input, styles.bioInput]}
              value={bio}
            />
            <Text style={styles.helper}>{bio.length}/160</Text>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={styles.label}>Onboarding complete</Text>
              <Text style={styles.helper}>Tracks whether this basic setup is finished.</Text>
            </View>
            <Switch
              ios_backgroundColor={colors.surfaceMuted}
              onValueChange={setOnboardingCompleted}
              thumbColor={onboardingCompleted ? colors.text : colors.textMuted}
              trackColor={{ false: colors.surfaceMuted, true: colors.signalMuted }}
              value={onboardingCompleted}
            />
          </View>

          {isLoading ? <Text style={styles.helper}>Loading profile.</Text> : null}
          {savedMessage ? <Text style={styles.success}>{savedMessage}</Text> : null}
          {profileError ? <Text style={styles.error}>{profileError}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            disabled={isLoading || isSaving || isSigningOut}
            label={isSaving ? 'Saving' : 'Save profile'}
            onPress={handleSave}
          />
          <PrimaryButton
            disabled={isSigningOut || isSaving}
            label={isSigningOut ? 'Signing out' : 'Sign out'}
            onPress={handleSignOut}
            variant="quiet"
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
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
  caseFile: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.4,
    fontVariant: ['tabular-nums'],
  },
  tier: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 21,
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
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
  },
  bioInput: {
    minHeight: 92,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  helper: {
    color: colors.textFaint,
    fontSize: typography.small,
    lineHeight: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 64,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderSoft,
  },
  toggleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  success: {
    color: colors.accent,
    fontSize: typography.small,
    lineHeight: 21,
  },
  error: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
});
