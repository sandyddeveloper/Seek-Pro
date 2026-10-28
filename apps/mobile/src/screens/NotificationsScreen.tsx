import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainBottomNavigation from '../components/MainBottomNavigation';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import { createStyles } from '../styles/notifications.style';
import { useThemedStyles } from '../lib/theme-context';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type CategoryId =
  | 'tasks'
  | 'calendar'
  | 'morning'
  | 'evening'
  | 'budget'
  | 'health'
  | 'automation'
  | 'integrations';

type NotificationCategory = {
  id: CategoryId;
  title: string;
  description: string;
  icon: IconName;
  detail?: string;
  badge?: string;
  warning?: boolean;
};

const categories: NotificationCategory[] = [
  {
    id: 'tasks',
    title: 'Task Reminders',
    description: 'Deadlines, blockers, and upcoming action items',
    icon: 'checkbox-marked-circle-outline',
  },
  {
    id: 'calendar',
    title: 'Calendar Events',
    description: 'Meetings, executive travel, and scheduled blocks',
    icon: 'calendar-month-outline',
  },
  {
    id: 'morning',
    title: 'Morning Briefing',
    description: 'Daily strategic plan & prioritized agenda',
    icon: 'weather-sunset-up',
    detail: '7:30 AM',
  },
  {
    id: 'evening',
    title: 'Evening Summary',
    description: 'Velocity and completed milestones',
    icon: 'weather-night',
    detail: '8:00 PM',
  },
  {
    id: 'budget',
    title: 'Budget Alerts',
    description: 'Threshold spikes (80%), large SaaS debits',
    icon: 'cash-multiple',
  },
  {
    id: 'health',
    title: 'Health & Activity',
    description: 'Movement, rest window & recovery prompts',
    icon: 'heart-pulse',
  },
  {
    id: 'automation',
    title: 'Automation Updates',
    description: 'Execution receipts & daemon triggers',
    icon: 'lightning-bolt-outline',
  },
  {
    id: 'integrations',
    title: 'Integration Errors',
    description: 'OAuth token expiry & pipe synchronization issues',
    icon: 'sync-alert',
    badge: 'High Priority Guard',
    warning: true,
  },
];

const leadOptions = ['At time', '5m', '15m', '30m', '1h'] as const;
type LeadTime = (typeof leadOptions)[number];
const repeatOptions = ['Never', 'Every 5 min', 'Every 15 min', 'Hourly'] as const;
type RepeatOption = (typeof repeatOptions)[number];
const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const initialCategoryState: Record<CategoryId, boolean> = {
  tasks: true,
  calendar: true,
  morning: true,
  evening: true,
  budget: true,
  health: true,
  automation: true,
  integrations: false,
};

function Toggle({
  value,
  onToggle,
  label,
}: {
  value: boolean;
  onToggle: () => void;
  label: string;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={onToggle}
      style={[appTheme.styles.switchTrack, value ? appTheme.styles.switchOn : appTheme.styles.switchOff]}
    >
      <View style={[appTheme.styles.switchThumb, value && appTheme.styles.switchThumbOn]} />
    </Pressable>
  );
}

function SectionHeading({
  title,
  trailing,
  icon,
}: {
  title: string;
  trailing?: string;
  icon?: IconName;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.sectionHeading}>
      <View style={appTheme.styles.sectionHeadingTitle}>
        {icon ? <MaterialCommunityIcons color={appTheme.colors.mintBright} name={icon} size={18} /> : null}
        <Text style={appTheme.styles.sectionTitle}>{title}</Text>
      </View>
      {trailing ? <Text style={appTheme.styles.sectionTrailing}>{trailing}</Text> : null}
    </View>
  );
}

function CategoryRow({
  category,
  enabled,
  onToggle,
}: {
  category: NotificationCategory;
  enabled: boolean;
  onToggle: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.categoryRow}>
      <View style={[appTheme.styles.categoryIcon, category.warning && appTheme.styles.categoryWarningIcon]}>
        <MaterialCommunityIcons
          color={category.warning ? appTheme.colors.goldBright : appTheme.colors.mintBright}
          name={category.icon}
          size={20}
        />
      </View>
      <View style={appTheme.styles.categoryCopy}>
        <View style={appTheme.styles.categoryTitleRow}>
          <Text style={appTheme.styles.categoryTitle}>{category.title}</Text>
          {category.badge ? (
            <Text style={appTheme.styles.priorityBadge}>{category.badge}</Text>
          ) : null}
          {category.detail ? <Text style={appTheme.styles.categoryTime}>{category.detail}</Text> : null}
        </View>
        <Text style={appTheme.styles.categoryDescription}>{category.description}</Text>
      </View>
      <Toggle
        label={`${category.title} ${enabled ? 'enabled' : 'muted'}`}
        onToggle={onToggle}
        value={enabled}
      />
    </View>
  );
}

export default function NotificationsScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
    HankenGrotesk: HankenGrotesk_400Regular,
    HankenGroteskMedium: HankenGrotesk_500Medium,
    HankenGroteskSemiBold: HankenGrotesk_600SemiBold,
  });
  const [categoryState, setCategoryState] = useState(initialCategoryState);
  const [leadTime, setLeadTime] = useState<LeadTime>('15m');
  const [repeat, setRepeat] = useState<RepeatOption>('Never');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [activeDays, setActiveDays] = useState([true, true, true, true, true, true, true]);
  const [deliveryMode, setDeliveryMode] = useState<'silence' | 'digest'>('silence');
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [sensitivePreviews, setSensitivePreviews] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const activeCategoryCount = Object.values(categoryState).filter(Boolean).length;

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load notifications screen fonts.', fontError);
    }
  }, [fontError]);

  const toggleCategory = (id: CategoryId) => {
    setCategoryState((current) => ({ ...current, [id]: !current[id] }));
    setHasSaved(false);
  };

  const toggleDay = (dayIndex: number) => {
    setActiveDays((current) => current.map((isActive, index) => (
      index === dayIndex ? !isActive : isActive
    )));
    setHasSaved(false);
  };

  const cycleRepeat = () => {
    const index = repeatOptions.indexOf(repeat);
    setRepeat(repeatOptions[(index + 1) % repeatOptions.length]);
    setHasSaved(false);
  };

  const testPing = () => {
    Alert.alert('Test notification', 'This is a local preview. No push notification was sent.');
  };

  const handleTabPress = (tab: MainNavigationTab) => {
    if (tab === 'today') {
      router.replace('/dashboard');
    } else if (tab === 'assistant') {
      router.replace('/assistant-hub' as Href);
    } else if (tab === 'settings') {
      router.replace('/profile' as Href);
    } else {
      Alert.alert(tab, 'This destination is a preview.');
    }
  };

  if (!fontsLoaded && !fontError) {
    return <View style={appTheme.styles.safeArea} />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={appTheme.styles.safeArea}>
      <StatusBar style={appTheme.mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={appTheme.styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={appTheme.styles.topBar}>
          <Pressable
            accessibilityLabel="Back to Profile and Settings"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={appTheme.styles.backButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="arrow-back" size={20} />
          </Pressable>
          <View style={appTheme.styles.brand}>
            <Image
              contentFit="contain"
              source={require('../../assets/seekpro-mark.png')}
              style={appTheme.styles.brandLogo}
            />
            <Text style={appTheme.styles.brandTitle}>AI Assistant</Text>
          </View>
          <View style={appTheme.styles.topBarActions}>
            <View style={appTheme.styles.activeBadge}>
              <View style={appTheme.styles.activeDot} />
              <Text style={appTheme.styles.activeText}>Active</Text>
            </View>
          </View>
        </View>

        <View style={appTheme.styles.titleBlock}>
          <View style={appTheme.styles.titleMetaRow}>
            <View style={appTheme.styles.pushBadge}>
              <View style={appTheme.styles.activeDot} />
              <Text style={appTheme.styles.pushBadgeText}>Push: Active (Granted)</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={testPing}
              style={({ pressed }) => [appTheme.styles.testPingButton, pressed && appTheme.styles.pressed]}
            >
              <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="bell-ring-outline" size={16} />
              <Text style={appTheme.styles.testPingText}>Test Ping</Text>
            </Pressable>
          </View>
          <Text style={appTheme.styles.pageTitle}>Notifications &amp; Reminders</Text>
          <Text style={appTheme.styles.pageSubtitle}>
            Stay informed, your way. Control how and when SeekPro reaches you.
          </Text>
        </View>

        <View style={appTheme.styles.overviewCard}>
          <View style={appTheme.styles.permissionCard}>
            <View style={appTheme.styles.permissionIcon}>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="check-decagram" size={19} />
            </View>
            <View style={appTheme.styles.permissionCopy}>
              <Text style={appTheme.styles.permissionTitle}>iOS System Permissions: Active &amp; Granted</Text>
              <Text style={appTheme.styles.permissionDescription}>APNs priority delivery enabled</Text>
            </View>
            <Text style={appTheme.styles.permissionOs}>iOS / APNs</Text>
          </View>
          <View style={appTheme.styles.upcomingHeader}>
            <View style={appTheme.styles.upcomingTitleRow}>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="calendar-clock" size={17} />
              <Text style={appTheme.styles.upcomingTitle}>3 upcoming reminders today</Text>
            </View>
            <Text style={appTheme.styles.timezone}>PST</Text>
          </View>
          {[
            ['Exec Board Sync', '10:00 AM'],
            ['Q3 SaaS Budget Audit', '2:00 PM'],
            ['Evening Debrief & Velocity', '7:30 PM'],
          ].map(([title, time]) => (
            <View key={title} style={appTheme.styles.upcomingReminder}>
              <Text style={appTheme.styles.upcomingReminderTitle}>{title}</Text>
              <Text style={appTheme.styles.upcomingReminderTime}>{time}</Text>
            </View>
          ))}
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading
            title="Notification Categories"
            trailing={`${activeCategoryCount} Active · ${categories.length - activeCategoryCount} Muted`}
          />
          <View style={appTheme.styles.categoryCard}>
            {categories.map((category, index) => (
              <View key={category.id}>
                <CategoryRow
                  category={category}
                  enabled={categoryState[category.id]}
                  onToggle={() => toggleCategory(category.id)}
                />
                {index < categories.length - 1 ? <View style={appTheme.styles.separator} /> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading title="Reminder Preferences" trailing="Configured" icon="tune-variant" />
          <View style={appTheme.styles.preferenceCard}>
            <View style={appTheme.styles.preferenceBlock}>
              <View style={appTheme.styles.preferenceHeadingRow}>
                <View style={appTheme.styles.preferenceCopy}>
                  <Text style={appTheme.styles.preferenceTitle}>Default Reminder Lead</Text>
                  <Text style={appTheme.styles.preferenceDescription}>Lead time before scheduled commitments</Text>
                </View>
                <Text style={appTheme.styles.selectedLead}>{leadTime === 'At time' ? 'At time' : `${leadTime} before`}</Text>
              </View>
              <View style={appTheme.styles.leadOptions}>
                {leadOptions.map((option) => (
                  <Pressable
                    key={option}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: leadTime === option }}
                    onPress={() => {
                      setLeadTime(option);
                      setHasSaved(false);
                    }}
                    style={[appTheme.styles.leadOption, leadTime === option && appTheme.styles.leadOptionSelected]}
                  >
                    <Text style={[appTheme.styles.leadOptionText, leadTime === option && appTheme.styles.leadOptionTextSelected]}>
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={appTheme.styles.preferenceDivider} />
            <Pressable
              accessibilityRole="button"
              onPress={cycleRepeat}
              style={appTheme.styles.repeatRow}
            >
              <View style={appTheme.styles.preferenceCopy}>
                <Text style={appTheme.styles.preferenceTitle}>Repeat Reminders</Text>
                <Text style={appTheme.styles.preferenceDescription}>Suppress alert once</Text>
              </View>
              <View style={appTheme.styles.selectValue}>
                <Text style={appTheme.styles.selectValueText}>{repeat}</Text>
                <Ionicons color={appTheme.colors.mutedBright} name="chevron-down" size={15} />
              </View>
            </Pressable>
          </View>
          <View style={appTheme.styles.priorityCard}>
            <Text style={appTheme.styles.priorityHeading}>Priority-Based Rules</Text>
            {[
              { title: 'High Priority', subtitle: 'Immediate push + persistent banner', icon: 'shield-check', tone: 'high' },
              { title: 'Medium Priority', subtitle: 'Scheduled alert (Tasks & calendar)', icon: 'alarm', tone: 'medium' },
              { title: 'Low Priority', subtitle: 'Bundled silently into Daily Briefing', icon: 'archive-outline', tone: 'low' },
            ].map((item) => (
              <View key={item.title} style={appTheme.styles.priorityRow}>
                <View style={[appTheme.styles.priorityDot, item.tone === 'high' ? appTheme.styles.priorityDotHigh : item.tone === 'medium' ? appTheme.styles.priorityDotMedium : appTheme.styles.priorityDotLow]} />
                <View style={appTheme.styles.priorityCopy}>
                  <Text style={appTheme.styles.priorityTitle}>{item.title}</Text>
                  <Text style={appTheme.styles.priorityDescription}>{item.subtitle}</Text>
                </View>
                <MaterialCommunityIcons color={appTheme.colors.muted} name={item.icon as IconName} size={18} />
              </View>
            ))}
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading title="Quiet Hours &amp; Deep Focus" trailing="Nightly Protected" />
          <View style={appTheme.styles.quietCard}>
            <View style={appTheme.styles.quietHeadingRow}>
              <View style={appTheme.styles.quietIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="bed-clock" size={21} />
              </View>
              <View style={appTheme.styles.preferenceCopy}>
                <Text style={appTheme.styles.preferenceTitle}>Quiet Hours Window</Text>
                <Text style={appTheme.styles.preferenceDescription}>Suppress routine audio &amp; vibration</Text>
              </View>
              <Toggle
                label={`Quiet hours ${quietHoursEnabled ? 'enabled' : 'disabled'}`}
                onToggle={() => {
                  setQuietHoursEnabled((current) => !current);
                  setHasSaved(false);
                }}
                value={quietHoursEnabled}
              />
            </View>
            <View style={appTheme.styles.quietTimeRow}>
              <View style={appTheme.styles.quietTimeCard}>
                <Text style={appTheme.styles.quietTimeLabel}>Starts</Text>
                <Text style={appTheme.styles.quietTimeValue}>10:00 PM</Text>
                <Text style={appTheme.styles.quietTimeNote}>Scheduled wind-down</Text>
              </View>
              <View style={appTheme.styles.quietTimeCard}>
                <Text style={appTheme.styles.quietTimeLabel}>Ends</Text>
                <Text style={appTheme.styles.quietTimeValue}>07:00 AM</Text>
                <Text style={appTheme.styles.quietTimeNote}>Pre-briefing</Text>
              </View>
            </View>
            <View style={appTheme.styles.activeDaysSection}>
              <Text style={appTheme.styles.preferenceTitle}>Active Days</Text>
              <Text style={appTheme.styles.preferenceDescription}>All 7 days</Text>
              <View style={appTheme.styles.weekdays}>
                {weekdays.map((day, index) => (
                  <Pressable
                    key={`day-${index}`}
                    accessibilityLabel={`${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]} quiet hours ${activeDays[index] ? 'on' : 'off'}`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: activeDays[index] }}
                    onPress={() => toggleDay(index)}
                    style={[appTheme.styles.weekday, activeDays[index] && appTheme.styles.weekdayActive]}
                  >
                    <Text style={[appTheme.styles.weekdayText, activeDays[index] && appTheme.styles.weekdayTextActive]}>{day}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={appTheme.styles.modeChoices}>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: deliveryMode === 'silence' }}
                onPress={() => {
                  setDeliveryMode('silence');
                  setHasSaved(false);
                }}
                style={[appTheme.styles.modeCard, deliveryMode === 'silence' && appTheme.styles.modeCardSelected]}
              >
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="volume-mute" size={18} />
                <Text style={appTheme.styles.modeTitle}>Silence Routine Notifications</Text>
                <Text style={appTheme.styles.modeDescription}>Sounds and vibrations are silenced; notifications remain in Notification Center.</Text>
              </Pressable>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: deliveryMode === 'digest' }}
                onPress={() => {
                  setDeliveryMode('digest');
                  setHasSaved(false);
                }}
                style={[appTheme.styles.modeCard, deliveryMode === 'digest' && appTheme.styles.modeCardSelected]}
              >
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="text-box-check-outline" size={18} />
                <Text style={appTheme.styles.modeTitle}>Deliver as Morning Digest</Text>
                <Text style={appTheme.styles.modeDescription}>Bundle routine notifications when quiet hours end at 7:00 AM.</Text>
              </Pressable>
            </View>
            <View style={appTheme.styles.urgentRow}>
              <View style={appTheme.styles.urgentIcon}>
                <MaterialCommunityIcons color={appTheme.colors.goldBright} name="lightning-bolt" size={18} />
              </View>
              <View style={appTheme.styles.preferenceCopy}>
                <Text style={appTheme.styles.urgentTitle}>Urgent Security &amp; Token Auth Alerts</Text>
                <Text style={appTheme.styles.preferenceDescription}>Critical failures bypass Quiet Hours immediately.</Text>
              </View>
              <Toggle
                label={`Urgent alerts ${urgentAlerts ? 'enabled' : 'disabled'}`}
                onToggle={() => {
                  setUrgentAlerts((current) => !current);
                  setHasSaved(false);
                }}
                value={urgentAlerts}
              />
            </View>
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading title="Channels &amp; Haptics" />
          <View style={appTheme.styles.channelsCard}>
            <ChannelRow
              icon="cellphone"
              title="Push Notifications"
              description="Lockscreen, banner & dynamic island"
              enabled={pushEnabled}
              onToggle={() => {
                setPushEnabled((current) => !current);
                setHasSaved(false);
              }}
            />
            <View style={appTheme.styles.separator} />
            <ChannelRow
              icon="email-outline"
              title="Email Notifications"
              description="Weekly executive digests & audit reports"
              enabled={emailEnabled}
              onToggle={() => {
                setEmailEnabled((current) => !current);
                setHasSaved(false);
              }}
            />
            <View style={appTheme.styles.separator} />
            <ChannelRow
              icon="inbox-outline"
              title="In-App Notification Center"
              description="Persistent log of receipts and actions"
              enabled={inAppEnabled}
              onToggle={() => {
                setInAppEnabled((current) => !current);
                setHasSaved(false);
              }}
            />
            <View style={appTheme.styles.separator} />
            <View style={appTheme.styles.channelRow}>
              <View style={appTheme.styles.channelIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name={soundEnabled ? 'volume-high' : 'volume-off'} size={19} />
              </View>
              <View style={appTheme.styles.channelCopy}>
                <Text style={appTheme.styles.categoryTitle}>Sound Profile</Text>
                <Text style={appTheme.styles.categoryDescription}>
                  {soundEnabled ? 'SeekPro Pulse (Subtle Mint Tone)' : 'Sound muted'}
                </Text>
              </View>
              <Toggle
                label={`Notification sounds ${soundEnabled ? 'enabled' : 'disabled'}`}
                onToggle={() => {
                  setSoundEnabled((current) => !current);
                  setHasSaved(false);
                }}
                value={soundEnabled}
              />
            </View>
            <View style={appTheme.styles.separator} />
            <ChannelRow
              icon="vibrate"
              title="Haptic Feedback"
              description="Taptic engine micro-pulses enabled"
              enabled={hapticsEnabled}
              onToggle={() => {
                setHapticsEnabled((current) => !current);
                setHasSaved(false);
              }}
            />
            <View style={appTheme.styles.separator} />
            <ChannelRow
              icon="eye-lock-outline"
              title="Sensitive Previews"
              description="Show content only when unlocked (FaceID)"
              enabled={sensitivePreviews}
              onToggle={() => {
                setSensitivePreviews((current) => !current);
                setHasSaved(false);
              }}
            />
          </View>
        </View>

        <View style={appTheme.styles.saveSection}>
          <View style={appTheme.styles.saveStatusRow}>
            <Text style={appTheme.styles.saveStatusLabel}>Status</Text>
            <View style={appTheme.styles.savedStatus}>
              <MaterialCommunityIcons
                color={hasSaved ? appTheme.colors.mint : appTheme.colors.muted}
                name={hasSaved ? 'check-circle' : 'circle-outline'}
                size={16}
              />
              <Text style={appTheme.styles.savedStatusText}>{hasSaved ? 'Changes saved locally' : 'Unsaved changes'}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setHasSaved(true);
              Alert.alert('Preferences saved', 'Notification preferences were saved to this local preview only.');
            }}
            style={({ pressed }) => [appTheme.styles.saveButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintDark} name="content-save-outline" size={19} />
            <Text style={appTheme.styles.saveButtonText}>Save Notification Preferences</Text>
          </Pressable>
          {hasSaved ? (
            <View style={appTheme.styles.savedToast}>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="cloud-check-outline" size={18} />
              <Text style={appTheme.styles.savedToastText}>Preferences saved to this device preview</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <MainBottomNavigation activeTab="settings" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

function ChannelRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: IconName;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.channelRow}>
      <View style={appTheme.styles.channelIcon}>
        <MaterialCommunityIcons color={appTheme.colors.mintBright} name={icon} size={19} />
      </View>
      <View style={appTheme.styles.channelCopy}>
        <Text style={appTheme.styles.categoryTitle}>{title}</Text>
        <Text style={appTheme.styles.categoryDescription}>{description}</Text>
      </View>
      <Toggle label={`${title} ${enabled ? 'enabled' : 'disabled'}`} onToggle={onToggle} value={enabled} />
    </View>
  );
}
