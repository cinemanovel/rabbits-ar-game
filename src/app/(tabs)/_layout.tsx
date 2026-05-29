import { Redirect, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { useAuth } from '@/features/auth/AuthProvider';
import { usePlayerProfile } from '@/features/profile/usePlayerProfile';
import { colors, typography } from '@/theme';

export default function TabsLayout() {
  const { isLoading, session } = useAuth();
  const {
    error: profileError,
    isLoading: isProfileLoading,
    profile,
  } = usePlayerProfile(session?.user.id);

  useEffect(() => {
    if (__DEV__) {
      console.log('[route:tabs] decision state', {
        isAuthLoading: isLoading,
        isProfileLoading,
        hasSession: Boolean(session),
        hasProfile: Boolean(profile),
        onboardingCompleted: profile?.onboarding_completed ?? null,
        profileError,
        target: isLoading || isProfileLoading
          ? 'loading'
          : !session
            ? '/sign-in'
            : profileError
              ? 'profile-error'
              : !profile || !profile.onboarding_completed
                ? '/onboarding'
                : 'tabs',
      });
    }
  }, [isLoading, isProfileLoading, profile, profileError, session]);

  if (isLoading || isProfileLoading) {
    return (
      <AppScreen eyebrow="Access" title="Checking session" description="Verifying local session state.">
        <Text style={styles.loadingText}>Hold for signal.</Text>
      </AppScreen>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (profileError) {
    return (
      <AppScreen eyebrow="Profile" title="Signal blocked" description="Profile state could not be verified.">
        <Text style={styles.loadingText}>{profileError}</Text>
      </AppScreen>
    );
  }

  if (!profile || !profile.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: {
          fontSize: typography.caption,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          height: 84,
          paddingTop: 14,
          paddingBottom: 22,
          borderTopWidth: 1,
          borderTopColor: colors.borderSoft,
          backgroundColor: colors.veil,
        },
        tabBarItemStyle: {
          paddingVertical: 7,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
      <Tabs.Screen name="index" options={{ title: 'Index' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
