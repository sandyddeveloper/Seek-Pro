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
import { createStyles } from '../styles/assistant-preferences.style';
import { useThemedStyles } from '../lib/theme-context';

type PreferenceToggle = 'voice' | 'personalization' | 'tasks' | 'email' | 'finance'
  | 'confirmMessages' | 'confirmPurchases' | 'morning' | 'evening' | 'quietHours';

type ToggleRowProps = {
  title: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
  status?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  accent?: boolean;
  compact?: boolean;
};

function ToggleSwitch({ value, onToggle, label }: {
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

function ToggleRow({
  title,
  description,
  value,
  onToggle,
  status,
  icon,
  accent = false,
  compact = false,
}: ToggleRowProps) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={[appTheme.styles.toggleRow, compact && appTheme.styles.compactToggleRow]}>
      {icon ? (
        <View style={[appTheme.styles.rowIcon, accent && appTheme.styles.accentRowIcon]}>
          <MaterialCommunityIcons
            color={accent ? appTheme.colors.gold : appTheme.colors.mintBright}
            name={icon}
            size={19}
          />
        </View>
      ) : null}
      <View style={appTheme.styles.rowCopy}>
        <View style={appTheme.styles.rowTitleLine}>
          <Text numberOfLines={1} style={appTheme.styles.rowTitle}>{title}</Text>
          {status ? <Text style={appTheme.styles.rowStatus}>{status}</Text> : null}
        </View>
        {description ? (
          <Text numberOfLines={2} style={appTheme.styles.rowDescription}>{description}</Text>
        ) : null}
      </View>
      <ToggleSwitch
        label={`${title} ${value ? 'enabled' : 'disabled'}`}
        onToggle={onToggle}
        value={value}
      />
    </View>
  );
}

function SectionTitle({ children }: React.PropsWithChildren) {
  const appTheme = useThemedStyles(createStyles);
  return <Text style={appTheme.styles.sectionTitle}>{children}</Text>;
}

function PreferenceCard({ children, style }: React.PropsWithChildren<{
  style?: object;
}>) {
  const appTheme = useThemedStyles(createStyles);
  return <View style={[appTheme.styles.card, style]}>{children}</View>;
}

function ChoiceSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="radiogroup"
      style={appTheme.styles.choiceGroup}
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option)}
            style={[appTheme.styles.choice, selected && appTheme.styles.choiceSelected]}
          >
            <Text style={[appTheme.styles.choiceText, selected && appTheme.styles.choiceTextSelected]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DetailRow({
  icon,
  title,
  description,
  status,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  status?: string;
  onPress: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [appTheme.styles.detailRow, pressed && appTheme.styles.pressed]}
    >
      <View style={appTheme.styles.rowIcon}>
        <MaterialCommunityIcons color={appTheme.colors.mintBright} name={icon} size={19} />
      </View>
      <View style={appTheme.styles.rowCopy}>
        <Text style={appTheme.styles.rowTitle}>{title}</Text>
        <Text numberOfLines={1} style={appTheme.styles.rowDescription}>{description}</Text>
      </View>
      {status ? <Text style={appTheme.styles.rowStatus}>{status}</Text> : null}
      <Ionicons color={appTheme.colors.muted} name="chevron-forward" size={17} />
    </Pressable>
  );
}

export default function AIAssistantPreferencesScreen() {
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
  const [depth, setDepth] = useState('Balanced');
  const [pacing, setPacing] = useState('Standard (1.0x)');
  const [toggles, setToggles] = useState<Record<PreferenceToggle, boolean>>({
    voice: true,
    personalization: true,
    tasks: true,
    email: true,
    finance: true,
    confirmMessages: true,
    confirmPurchases: true,
    morning: true,
    evening: true,
    quietHours: true,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load assistant preferences fonts.', fontError);
    }
  }, [fontError]);

  const showDemoMessage = (feature: string) => {
    Alert.alert(feature, 'This assistant preference is a local preview and is not synced yet.');
  };
  const togglePreference = (key: PreferenceToggle) => {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  };
  const handleTabPress = (tab: MainNavigationTab) => {
    if (tab === 'today') {
      router.replace('/dashboard');
    } else if (tab === 'settings') {
      router.replace('/profile' as Href);
    } else if (tab === 'assistant') {
      router.replace('/assistant-hub' as Href);
    } else {
      showDemoMessage(tab);
    }
  };

  if (!fontsLoaded && !fontError) {
    return <View style={appTheme.styles.safeArea} />;
  }

  return (
    <SafeAreaView style={appTheme.styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style={appTheme.mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={appTheme.styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={appTheme.styles.header}>
          <View style={appTheme.styles.brand}>
            <View style={appTheme.styles.brandMark}>
              <Image
                source={require('../../assets/seekpro-mark.png')}
                contentFit="contain"
                style={appTheme.styles.brandMarkImage}
              />
            </View>
            <Text style={appTheme.styles.headerTitle}>AI Assistant</Text>
          </View>
          <View style={appTheme.styles.activeBadge}>
            <View style={appTheme.styles.activeDot} />
            <Text style={appTheme.styles.activeText}>Active</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => showDemoMessage('Sync status')}
          style={({ pressed }) => [appTheme.styles.syncStatusCard, pressed && appTheme.styles.pressed]}
        >
          <Ionicons color={appTheme.colors.mint} name="checkmark-circle" size={17} />
          <View style={appTheme.styles.syncStatusCopy}>
            <Text style={appTheme.styles.syncStatusTitle}>Synced · Encrypted</Text>
            <Text style={appTheme.styles.syncStatusDescription}>Last synced just now · Tap for details</Text>
          </View>
          <Text style={appTheme.styles.cloudStatus}>Cloud Ready</Text>
          <Ionicons color={appTheme.colors.mintBright} name="chevron-forward" size={15} />
        </Pressable>

        <View style={appTheme.styles.introCard}>
          <View style={appTheme.styles.introIdentity}>
            <View style={appTheme.styles.aiMark}>
              <Image
                source={require('../../assets/seekpro-mark.png')}
                contentFit="contain"
                style={appTheme.styles.aiMarkImage}
              />
            </View>
            <View style={appTheme.styles.introNameGroup}>
              <Text style={appTheme.styles.introTitle}>SeekPro AI</Text>
              <View style={appTheme.styles.readyRow}>
                <View style={appTheme.styles.activeDot} />
                <Text style={appTheme.styles.readyText}>Ready to assist</Text>
              </View>
            </View>
          </View>
          <Text style={appTheme.styles.introDescription}>
            Your autonomous companion engineered for executive clarity, schedule synthesis, and daily momentum.
          </Text>
        </View>

        <View style={appTheme.styles.section}>
          <SectionTitle>Response Preferences</SectionTitle>
          <PreferenceCard>
            <Text style={appTheme.styles.controlLabel}>Synthesis Depth</Text>
            <ChoiceSelector
              label="Synthesis depth"
              options={['Concise', 'Balanced', 'Detailed'] as const}
              value={depth}
              onChange={setDepth}
            />
            <ToggleRow
              icon="waveform"
              title="Voice Responses"
              description="Read executive summaries aloud"
              value={toggles.voice}
              onToggle={() => togglePreference('voice')}
            />
            <View style={appTheme.styles.pacingHeader}>
              <Text style={appTheme.styles.controlLabel}>Pacing &amp; Cadence</Text>
              <Text style={appTheme.styles.pacingValue}>1.0x Normal</Text>
            </View>
            <ChoiceSelector
              label="Pacing and cadence"
              options={['Gentle (0.8x)', 'Standard (1.0x)', 'Brisk (1.25x)'] as const}
              value={pacing}
              onChange={setPacing}
            />
            <DetailRow
              icon="web"
              title="Preferred Language"
              description="English (US) · Auto-detect accents"
              onPress={() => showDemoMessage('Preferred language')}
            />
          </PreferenceCard>
        </View>

        <View style={appTheme.styles.section}>
          <SectionTitle>Memory &amp; Personalization</SectionTitle>
          <PreferenceCard>
            <ToggleRow
              icon="head-lightbulb-outline"
              title="Continuous Personalization"
              description="Tailor suggestions based on past interactions"
              value={toggles.personalization}
              onToggle={() => togglePreference('personalization')}
            />
            <DetailRow
              icon="database-outline"
              title="Manage AI Memory"
              description="Review, edit, or purge stored preferences"
              status="42 facts"
              onPress={() => router.push('/ai-memory' as Href)}
            />
            <DetailRow
              icon="alarm"
              title="Preferred Routines"
              description="Configure briefings and wind-down workflows"
              onPress={() => showDemoMessage('Preferred routines')}
            />
            <DetailRow
              icon="tune-variant"
              title="Topic &amp; Tone Tuning"
              description="Calibrate formality, humor, and depth limits"
              onPress={() => showDemoMessage('Topic and tone tuning')}
            />
          </PreferenceCard>
          <View style={appTheme.styles.privacyNote}>
            <MaterialCommunityIcons color={appTheme.colors.mint} name="shield-check-outline" size={15} />
            <Text numberOfLines={2} style={appTheme.styles.privacyNoteText}>
              Memories are user-owned, encrypted, and excluded from global model training.
            </Text>
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionTitle>Automation Permissions</SectionTitle>
          <PreferenceCard>
            <ToggleRow
              icon="check-circle-outline"
              title="Manage Daily Tasks"
              description="Reschedule overdue tasks &amp; priorities"
              status="Active"
              value={toggles.tasks}
              onToggle={() => togglePreference('tasks')}
            />
            <ToggleRow
              icon="email-outline"
              title="Access Email"
              description="Read-only headers &amp; flight/receipt parsing"
              status="Read Only"
              value={toggles.email}
              onToggle={() => togglePreference('email')}
            />
            <ToggleRow
              icon="cash-multiple"
              title="Financial Intelligence"
              description="Read-only spend alerts &amp; renewals"
              status="Guarded"
              accent
              value={toggles.finance}
              onToggle={() => togglePreference('finance')}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/advanced-permissions' as Href)}
              style={({ pressed }) => [appTheme.styles.footerLink, pressed && appTheme.styles.pressed]}
            >
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="shield-check" size={17} />
              <Text style={appTheme.styles.footerLinkText}>Advanced Automation &amp; Permissions</Text>
              <Ionicons color={appTheme.colors.mintBright} name="chevron-forward" size={17} />
            </Pressable>
          </PreferenceCard>
        </View>

        <PreferenceCard style={appTheme.styles.safetyCard}>
          <View style={appTheme.styles.safetyHeading}>
            <MaterialCommunityIcons color={appTheme.colors.mint} name="shield-outline" size={18} />
            <Text style={appTheme.styles.safetyTitle}>Safety &amp; Confirmations</Text>
          </View>
          <ToggleRow
            title="Always confirm before dispatching emails or messages"
            value={toggles.confirmMessages}
            onToggle={() => togglePreference('confirmMessages')}
            compact
          />
          <ToggleRow
            title="Prompt before consequential actions (purchases, deletes)"
            value={toggles.confirmPurchases}
            onToggle={() => togglePreference('confirmPurchases')}
            compact
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => showDemoMessage('Recent agent actions')}
            style={({ pressed }) => [appTheme.styles.recentActionsLink, pressed && appTheme.styles.pressed]}
          >
            <Ionicons color={appTheme.colors.muted} name="time-outline" size={16} />
            <Text style={appTheme.styles.recentActionsText}>Review 18 recent autonomous agent actions</Text>
            <Ionicons color={appTheme.colors.muted} name="chevron-forward" size={15} />
          </Pressable>
        </PreferenceCard>

        <View style={appTheme.styles.section}>
          <SectionTitle>Daily Routine</SectionTitle>
          <PreferenceCard>
            <ToggleRow
              title="Morning Briefing"
              description="Calendar, weather, top 3 priorities"
              status="07:30 AM"
              value={toggles.morning}
              onToggle={() => togglePreference('morning')}
              compact
            />
            <ToggleRow
              title="Evening Summary"
              description="Completed goals and tomorrow's prep"
              status="09:15 PM"
              value={toggles.evening}
              onToggle={() => togglePreference('evening')}
              compact
            />
            <ToggleRow
              icon="moon-waning-crescent"
              title="Quiet Hours"
              description="10:30 PM – 07:00 AM (Silences non-urgent alerts)"
              value={toggles.quietHours}
              onToggle={() => togglePreference('quietHours')}
            />
          </PreferenceCard>
        </View>

        <View style={appTheme.styles.syncFooter}>
          <Pressable
            accessibilityRole="button"
            onPress={() => showDemoMessage('Sync now')}
            style={({ pressed }) => [appTheme.styles.syncButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintDark} name="sync" size={19} />
            <Text style={appTheme.styles.syncButtonText}>Sync Now</Text>
          </Pressable>
          <Text style={appTheme.styles.syncFooterText}>
            Last synced: 2 minutes ago · All data end-to-end encrypted
          </Text>
        </View>
      </ScrollView>
      <MainBottomNavigation activeTab="settings" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
