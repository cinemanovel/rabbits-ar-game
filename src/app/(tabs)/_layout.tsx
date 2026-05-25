import { Tabs } from 'expo-router';

import { colors, typography } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: {
          fontSize: typography.eyebrow,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 18,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.backgroundSoft,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
