import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { colors, spacing, typography } from '@/theme';

const settings = ['Notifications deferred', 'Location deferred', 'Purchases deferred'];

export default function SettingsTab() {
  return (
    <AppScreen
      eyebrow="Controls"
      title="Settings"
      description="Future permissions and account controls will stay plain, explicit, and separate from lore."
    >
      {settings.map((item) => (
        <View key={item} style={styles.item}>
          <Text style={styles.itemText}>{item}</Text>
          <Text style={styles.itemState}>Off</Text>
        </View>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemText: {
    color: colors.text,
    fontSize: typography.body,
  },
  itemState: {
    color: colors.textFaint,
    fontSize: typography.eyebrow,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
