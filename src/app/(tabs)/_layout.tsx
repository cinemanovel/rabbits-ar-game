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
