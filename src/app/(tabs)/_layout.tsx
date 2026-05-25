import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors, typography } from '@/theme';

export default function TabsLayout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <AppScreen eyebrow="Access" title="Checking session" description="Verifying local session state.">
        <Text style={styles.loadingText}>Hold for signal.</Text>
      </AppScreen>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
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
          letterSpacing: 1.3,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          height: 82,
          paddingTop: 12,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: colors.borderSoft,
          backgroundColor: colors.backgroundSoft,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
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
