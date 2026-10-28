import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useThemedStyles } from '../lib/theme-context';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import { createStyles } from '../styles/main-bottom-navigation.style';

type MainBottomNavigationProps = {
  activeTab: MainNavigationTab;
  onTabPress: (tab: MainNavigationTab) => void;
};

function TabIcon({ tab, color }: { tab: MainNavigationTab; color: string }) {
  const appTheme = useThemedStyles(createStyles);
  switch (tab) {
    case 'today':
      return <MaterialCommunityIcons color={color} name="view-dashboard" size={22} />;
    case 'focus':
      return <MaterialCommunityIcons color={color} name="timer-outline" size={22} />;
    case 'assistant':
      return (
        <View style={appTheme.styles.assistantIcon}>
          <Image
            source={require('../../assets/seekpro-mark.png')}
            contentFit="contain"
            style={appTheme.styles.assistantLogo}
          />
        </View>
      );
    case 'insights':
      return (
        <MaterialCommunityIcons
          color={color}
          name="chart-timeline-variant"
          size={22}
        />
      );
    case 'settings':
      return <MaterialIcons color={color} name="settings" size={22} />;
  }
}

const tabs: { key: MainNavigationTab; label: string; accessibilityLabel: string }[] = [
  { key: 'today', label: 'Today', accessibilityLabel: 'Today' },
  { key: 'focus', label: 'Focus', accessibilityLabel: 'Focus' },
  { key: 'assistant', label: 'SeekPro', accessibilityLabel: 'SeekPro Assistant' },
  { key: 'insights', label: 'Insights', accessibilityLabel: 'Insights' },
  { key: 'settings', label: 'Settings', accessibilityLabel: 'Settings' },
];

export default function MainBottomNavigation({
  activeTab,
  onTabPress,
}: MainBottomNavigationProps) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.container}>
      {tabs.map(({ key, label, accessibilityLabel }) => {
        const isActive = activeTab === key;
        const iconColor = isActive ? appTheme.colors.mintBright : appTheme.colors.muted;

        return (
          <Pressable
            key={key}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => {
              if (!isActive) {
                onTabPress(key);
              }
            }}
            style={appTheme.styles.item}
          >
            <TabIcon tab={key} color={iconColor} />
            <Text
              style={[
                appTheme.styles.label,
                isActive && appTheme.styles.activeLabel,
                key === 'assistant' && appTheme.styles.assistantLabel,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
