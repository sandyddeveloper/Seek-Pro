import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainBottomNavigation from '../components/MainBottomNavigation';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import type { ThemeMode } from '../styles/theme.style';
import { createStyles } from '../styles/profile.style';
import { useThemedStyles } from '../lib/theme-context';

type SettingRowProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  status?: string;
  statusTone?: 'mint' | 'gold' | 'muted';
  emphasized?: boolean;
  onPress: () => void;
};

function SettingRow({
  icon,
  title,
  description,
  status,
  statusTone = 'muted',
  emphasized = false,
  onPress,
}: SettingRowProps) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        appTheme.styles.settingRow,
        emphasized && appTheme.styles.emphasizedRow,
        pressed && appTheme.styles.pressedRow,
      ]}
    >
      <View style={[appTheme.styles.rowIcon, emphasized && appTheme.styles.emphasizedRowIcon]}>
        <MaterialCommunityIcons
          color={statusTone === 'gold' ? appTheme.colors.gold : appTheme.colors.mint}
          name={icon}
          size={emphasized ? 20 : 18}
        />
      </View>
      <View style={appTheme.styles.rowCopy}>
        <Text style={[appTheme.styles.rowTitle, emphasized && appTheme.styles.emphasizedRowTitle]}>
          {title}
        </Text>
        <Text numberOfLines={2} style={appTheme.styles.rowDescription}>
          {description}
        </Text>
      </View>
      {status ? (
        <Text
          style={[
            appTheme.styles.rowStatus,
            statusTone === 'mint' && appTheme.styles.mintStatus,
            statusTone === 'gold' && appTheme.styles.goldStatus,
          ]}
        >
          {status}
        </Text>
      ) : null}
      <Ionicons color={appTheme.colors.muted} name="chevron-forward" size={16} />
    </Pressable>
  );
}

function SettingSection({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.section}>
      <Text style={appTheme.styles.sectionTitle}>{title}</Text>
      <View style={appTheme.styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function ProfileScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const [isThemePickerVisible, setIsThemePickerVisible] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
    HankenGrotesk: HankenGrotesk_400Regular,
    HankenGroteskMedium: HankenGrotesk_500Medium,
    HankenGroteskSemiBold: HankenGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load profile screen fonts.', fontError);
    }
  }, [fontError]);

  const showDemoMessage = (feature: string) => {
    Alert.alert(feature, 'This profile preview is not connected to live data yet.');
  };

  const appearanceLabel =
    appTheme.preference === 'system'
      ? `Executive ${appTheme.mode === 'light' ? 'Mint' : 'Dark Mint'} · System`
      : `Executive ${appTheme.preference === 'light' ? 'Mint · Light' : 'Dark Mint · Dark'}`;

  const handleTabPress = (tab: MainNavigationTab) => {
    if (tab === 'today') {
      router.replace('/dashboard');
      return;
    }
    if (tab === 'assistant') {
      router.push('/assistant-hub' as Href);
      return;
    }
    showDemoMessage(tab);
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
          <View style={appTheme.styles.headerCopy}>
            <Text style={appTheme.styles.eyebrow}>Profile &amp; Settings</Text>
            <Text style={appTheme.styles.pageTitle}>Executive Account</Text>
          </View>
          <Pressable
            accessibilityLabel="Settings options"
            accessibilityRole="button"
            onPress={() => showDemoMessage('Settings options')}
            style={({ pressed }) => [appTheme.styles.optionsButton, pressed && appTheme.styles.pressedRow]}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="options-outline" size={20} />
          </Pressable>
        </View>

        <View style={appTheme.styles.profileCard}>
          <View style={appTheme.styles.identityRow}>
            <View style={appTheme.styles.avatar}>
              <Ionicons color={appTheme.colors.mintBright} name="person" size={34} />
            </View>
            <View style={appTheme.styles.identityCopy}>
              <View style={appTheme.styles.nameRow}>
                <Text numberOfLines={1} style={appTheme.styles.name}>SRK</Text>
                <MaterialCommunityIcons color={appTheme.colors.mint} name="check-decagram" size={17} />
              </View>
              <Text numberOfLines={1} style={appTheme.styles.email}>santhosh.raj@example.com</Text>
              <View style={appTheme.styles.membershipBadge}>
                <Text style={appTheme.styles.membershipText}>✦ PRO MEMBER</Text>
              </View>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => showDemoMessage('Edit profile')}
            style={({ pressed }) => [appTheme.styles.editButton, pressed && appTheme.styles.pressedRow]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mint} name="pencil" size={16} />
            <Text style={appTheme.styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={appTheme.styles.statsCard}>
          <View style={appTheme.styles.stat}>
            <Text style={appTheme.styles.statValue}>1,284</Text>
            <Text style={appTheme.styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={appTheme.styles.statDivider} />
          <View style={appTheme.styles.stat}>
            <Text style={[appTheme.styles.statValue, appTheme.styles.mintValue]}>48h</Text>
            <Text style={appTheme.styles.statLabel}>Time Saved</Text>
          </View>
          <View style={appTheme.styles.statDivider} />
          <View style={appTheme.styles.stat}>
            <Text style={[appTheme.styles.statValue, appTheme.styles.greenValue]}>12</Text>
            <Text style={appTheme.styles.statLabel}>Active Habits</Text>
          </View>
        </View>

        <SettingSection title="My Account">
          <SettingRow
            icon="account-outline"
            title="Personal Information"
            description="Santhosh Raj K · santhosh.raj@example.com"
            onPress={() => showDemoMessage('Personal information')}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="medal-outline"
            title="Membership & Billing"
            description="✦ PRO MEMBER · Renews Oct 2024"
            status="PRO"
            statusTone="gold"
            onPress={() => showDemoMessage('Membership & billing')}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="palette-outline"
            title="Theme and Appearance"
            description={appearanceLabel}
            onPress={() => setIsThemePickerVisible(true)}
          />
        </SettingSection>

        <SettingSection title="My Assistant">
          <SettingRow
            icon="auto-fix"
            title="AI Assistant Preferences"
            description="Personalize how SeekPro works for you."
            status="Active"
            statusTone="mint"
            emphasized
            onPress={() => router.push('/assistant-preferences' as Href)}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="robot-outline"
            title="Automation & Daemons"
            description="Autonomous routines across tasks..."
            status="4 Active"
            statusTone="mint"
            onPress={() => showDemoMessage('Automation and daemons')}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="bell-outline"
            title="Notifications & Reminders"
            description="Smart Priority Briefs · Sound on"
            onPress={() => router.push('/notifications' as Href)}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="hub"
            title="Connected Apps & Integrations"
            description="6 of 9 services linked · Calendar, Health, Bank"
            status="Linked"
            onPress={() => router.push('/connected-apps' as Href)}
          />
        </SettingSection>

        <SettingSection title="Privacy & Support">
          <SettingRow
            icon="fingerprint"
            title="Privacy & Security"
            description="FaceID Active · End-to-End Encrypted"
            status="Active"
            statusTone="mint"
            onPress={() => router.push('/privacy-security' as Href)}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="shield-check-outline"
            title="System Permissions"
            description="Location, Health telemetry, Financial access"
            onPress={() => showDemoMessage('System permissions')}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="headset"
            title="Help & Concierge Support"
            description="24/7 Priority Assistant & Documentation"
            onPress={() => showDemoMessage('Help and concierge support')}
          />
          <View style={appTheme.styles.separator} />
          <SettingRow
            icon="logout"
            title="Log Out"
            description="Sign out of Santhosh Raj K executive session"
            onPress={() => showDemoMessage('Log out')}
          />
        </SettingSection>
      </ScrollView>
      <Modal
        animationType="fade"
        onRequestClose={() => setIsThemePickerVisible(false)}
        transparent
        visible={isThemePickerVisible}
      >
        <View style={appTheme.styles.themeModalOverlay}>
          <Pressable
            accessibilityLabel="Close appearance settings"
            accessibilityRole="button"
            onPress={() => setIsThemePickerVisible(false)}
            style={appTheme.styles.themeModalBackdrop}
          />
          <View accessibilityViewIsModal style={appTheme.styles.themeModal}>
            <View style={appTheme.styles.themeModalHeader}>
              <View style={appTheme.styles.themeModalHeaderCopy}>
                <Text style={appTheme.styles.themeModalTitle}>Theme and Appearance</Text>
                <Text style={appTheme.styles.themeModalDescription}>
                  Choose how SeekPro looks on this device.
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close appearance settings"
                accessibilityRole="button"
                onPress={() => setIsThemePickerVisible(false)}
                style={appTheme.styles.themeModalClose}
              >
                <Ionicons color={appTheme.colors.muted} name="close" size={20} />
              </Pressable>
            </View>
            {([
              { value: 'system', title: 'System', description: 'Match your device settings', icon: 'theme-light-dark' },
              { value: 'light', title: 'Light', description: 'Executive Mint', icon: 'white-balance-sunny' },
              { value: 'dark', title: 'Dark', description: 'Executive Dark Mint', icon: 'weather-night' },
            ] satisfies { value: ThemeMode; title: string; description: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[]).map((option) => {
              const isSelected = appTheme.preference === option.value;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  key={option.value}
                  onPress={() => {
                    appTheme.setPreference(option.value);
                    setIsThemePickerVisible(false);
                  }}
                  style={[
                    appTheme.styles.themeOption,
                    isSelected && appTheme.styles.themeOptionSelected,
                  ]}
                >
                  <View style={appTheme.styles.themeOptionIcon}>
                    <MaterialCommunityIcons
                      color={isSelected ? appTheme.colors.mintBright : appTheme.colors.muted}
                      name={option.icon}
                      size={20}
                    />
                  </View>
                  <View style={appTheme.styles.themeOptionCopy}>
                    <Text style={appTheme.styles.themeOptionTitle}>{option.title}</Text>
                    <Text style={appTheme.styles.themeOptionDescription}>{option.description}</Text>
                  </View>
                  {isSelected ? (
                    <Ionicons color={appTheme.colors.mintBright} name="checkmark-circle" size={20} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
      <MainBottomNavigation activeTab="settings" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
