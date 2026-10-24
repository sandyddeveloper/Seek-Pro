import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import { styles } from '../styles/main-bottom-navigation.style';

type MainBottomNavigationProps = {
  activeTab: MainNavigationTab;
  onTabPress: (tab: MainNavigationTab) => void;
};

function TabIcon({ tab, color }: { tab: MainNavigationTab; color: string }) {
  switch (tab) {
    case 'today':
      return <MaterialCommunityIcons color={color} name="view-dashboard" size={22} />;
    case 'focus':
      return <MaterialCommunityIcons color={color} name="timer-outline" size={22} />;
    case 'assistant':
      return (
        <View style={styles.assistantIcon}>
          <MaterialCommunityIcons color="#50df9c" name="auto-fix" size={20} />
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
  return (
    <View style={styles.container}>
      {tabs.map(({ key, label, accessibilityLabel }) => {
        const isActive = activeTab === key;
        const iconColor = isActive ? '#a0e8c2' : '#89938c';

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
            style={styles.item}
          >
            <TabIcon tab={key} color={iconColor} />
            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
                key === 'assistant' && styles.assistantLabel,
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
