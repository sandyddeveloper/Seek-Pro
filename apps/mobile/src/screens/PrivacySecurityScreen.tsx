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
import { createStyles } from '../styles/privacy-security.style';
import { useThemedStyles } from '../lib/theme-context';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

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
  icon,
  title,
  trailing,
}: {
  icon: IconName;
  title: string;
  trailing?: string;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.sectionHeading}>
      <View style={appTheme.styles.sectionHeadingLeft}>
        <MaterialCommunityIcons color={appTheme.colors.securityMint} name={icon} size={18} />
        <Text style={appTheme.styles.sectionTitle}>{title}</Text>
      </View>
      {trailing ? <Text style={appTheme.styles.sectionTrailing}>{trailing}</Text> : null}
    </View>
  );
}

function SettingRow({
  icon,
  title,
  description,
  value,
  onPress,
  trailing,
  tone = 'mint',
}: {
  icon: IconName;
  title: string;
  description: string;
  value?: string;
  onPress: () => void;
  trailing?: React.ReactNode;
  tone?: 'mint' | 'gold' | 'muted';
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [appTheme.styles.settingRow, pressed && appTheme.styles.pressed]}
    >
      <View style={[appTheme.styles.settingIcon, tone === 'gold' && appTheme.styles.settingIconGold]}>
        <MaterialCommunityIcons
          color={tone === 'gold' ? appTheme.colors.goldBright : appTheme.colors.mintBright}
          name={icon}
          size={19}
        />
      </View>
      <View style={appTheme.styles.settingCopy}>
        <Text style={appTheme.styles.settingTitle}>{title}</Text>
        <Text style={appTheme.styles.settingDescription}>{description}</Text>
      </View>
      {trailing ?? (value ? <Text style={appTheme.styles.settingValue}>{value}</Text> : null)}
      <Ionicons color={appTheme.colors.securityMuted} name="chevron-forward" size={16} />
    </Pressable>
  );
}

export default function PrivacySecurityScreen() {
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
  const [biometricLock, setBiometricLock] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [diagnosticLogs, setDiagnosticLogs] = useState(true);
  const [activeSessions, setActiveSessions] = useState(2);
  const [autoLock, setAutoLock] = useState('Instantly on backgrounding');

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load privacy and security fonts.', fontError);
    }
  }, [fontError]);

  const showPreview = (title: string, description: string) => {
    Alert.alert(title, description);
  };

  const terminateSessions = () => {
    Alert.alert(
      'Terminate all other sessions?',
      'This local preview will sign out the MacBook session. No real sessions will be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate Preview Session',
          style: 'destructive',
          onPress: () => setActiveSessions(1),
        },
      ],
    );
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
          <View style={appTheme.styles.activeBadge}>
            <View style={appTheme.styles.activeDot} />
            <Text style={appTheme.styles.activeText}>Active</Text>
          </View>
        </View>

        <View style={appTheme.styles.titleBlock}>
          <Text style={appTheme.styles.pageTitle}>Privacy &amp; Security</Text>
          <Text style={appTheme.styles.pageSubtitle}>
            Manage your data sovereignty, active devices, and enclave protection.
          </Text>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading icon="shield-lock-outline" title="Vault &amp; Access Security" />
          <View style={appTheme.styles.card}>
            <View style={appTheme.styles.vaultBanner}>
              <View style={appTheme.styles.vaultIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="shield-lock" size={22} />
              </View>
              <View style={appTheme.styles.vaultCopy}>
                <Text style={appTheme.styles.vaultTitle}>Vault Armor</Text>
                <Text style={appTheme.styles.vaultDescription}>Hardware-isolated enclave posture protected</Text>
              </View>
              <View style={appTheme.styles.protectedBadge}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="check-decagram" size={14} />
                <Text style={appTheme.styles.protectedText}>Protected</Text>
              </View>
            </View>

            <View style={appTheme.styles.securityRow}>
              <View style={appTheme.styles.rowIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="fingerprint" size={20} />
              </View>
              <View style={appTheme.styles.rowCopy}>
                <Text style={appTheme.styles.rowTitle}>Biometric App Lock</Text>
                <Text style={appTheme.styles.rowDescription}>FaceID or TouchID gate on app resume</Text>
              </View>
              <Toggle
                label={`Biometric app lock ${biometricLock ? 'enabled' : 'disabled'}`}
                onToggle={() => setBiometricLock((value) => !value)}
                value={biometricLock}
              />
            </View>
            <View style={appTheme.styles.separator} />
            <SettingRow
              icon="pin-outline"
              title="Master Passcode"
              description="6-digit cryptographic PIN"
              value="••••••"
              onPress={() => showPreview('Master passcode', 'Passcode changes are not connected in this local preview.')}
            />
            <View style={appTheme.styles.separator} />
            <View style={appTheme.styles.securityRow}>
              <View style={appTheme.styles.rowIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="cellphone-lock" size={19} />
              </View>
              <View style={appTheme.styles.rowCopy}>
                <Text style={appTheme.styles.rowTitle}>Two-Factor Auth</Text>
                <Text style={appTheme.styles.rowDescription}>Hardware FIDO2 &amp; Authenticator app</Text>
              </View>
              <Toggle
                label={`Two-factor authentication ${twoFactor ? 'active' : 'inactive'}`}
                onToggle={() => setTwoFactor((value) => !value)}
                value={twoFactor}
              />
            </View>
            <View style={appTheme.styles.separator} />
            <SettingRow
              icon="timer-outline"
              title="Auto-Lock Threshold"
              description="Lock app after inactivity"
              value={autoLock}
              onPress={() => {
                const options = ['Instantly on backgrounding', '30 seconds', '1 minute', '5 minutes'];
                const next = (options.indexOf(autoLock) + 1) % options.length;
                setAutoLock(options[next]);
              }}
            />
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading icon="eye-lock-outline" title="Privacy Controls" />
          <View style={appTheme.styles.card}>
            <SettingRow
              icon="brain"
              title="AI Memory &amp; Training"
              description="Zero-data retention for foundation models"
              value="Enclave"
              onPress={() => router.push('/ai-memory' as Href)}
            />
            <View style={appTheme.styles.separator} />
            <SettingRow
              icon="apps"
              title="App Permissions"
              description="4 linked external service credentials"
              value="Review (4)"
              onPress={() => router.push('/connected-apps' as Href)}
            />
            <View style={appTheme.styles.separator} />
            <SettingRow
              icon="access-point"
              title="Personal Telemetry Ingestion"
              description="Biometric, financial &amp; calendar sensors"
              onPress={() => router.push('/advanced-permissions' as Href)}
            />
            <View style={appTheme.styles.separator} />
            <View style={appTheme.styles.securityRow}>
              <View style={appTheme.styles.rowIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="chart-box-outline" size={19} />
              </View>
              <View style={appTheme.styles.rowCopy}>
                <Text style={appTheme.styles.rowTitle}>Diagnostic Logs</Text>
                <Text style={appTheme.styles.rowDescription}>Send anonymized crash diagnostics</Text>
              </View>
              <Toggle
                label={`Diagnostic logs ${diagnosticLogs ? 'enabled' : 'disabled'}`}
                onToggle={() => setDiagnosticLogs((value) => !value)}
                value={diagnosticLogs}
              />
            </View>
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading
            icon="devices"
            title="Active Sessions &amp; Devices"
            trailing={`${activeSessions} Nodes Online`}
          />
          <View style={appTheme.styles.card}>
            <View style={appTheme.styles.deviceRow}>
              <View style={appTheme.styles.deviceIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="cellphone" size={21} />
              </View>
              <View style={appTheme.styles.deviceCopy}>
                <View style={appTheme.styles.deviceTitleRow}>
                  <Text style={appTheme.styles.deviceTitle}>iPhone 15 Pro Max</Text>
                  <Text style={appTheme.styles.thisDeviceBadge}>This Device</Text>
                </View>
                <Text style={appTheme.styles.deviceDescription}>San Francisco, CA · Active right now</Text>
              </View>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="check-circle" size={17} />
            </View>
            <View style={appTheme.styles.separator} />
            {activeSessions > 1 ? (
              <View style={appTheme.styles.deviceRow}>
                <View style={appTheme.styles.deviceIcon}>
                  <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="laptop" size={21} />
                </View>
                <View style={appTheme.styles.deviceCopy}>
                  <Text style={appTheme.styles.deviceTitle}>MacBook Pro 16″ (M3 Max)</Text>
                  <Text style={appTheme.styles.deviceDescription}>San Francisco, CA · Active 1h ago</Text>
                </View>
                <Pressable
                  accessibilityLabel="Terminate MacBook session"
                  accessibilityRole="button"
                  onPress={terminateSessions}
                  style={appTheme.styles.deviceAction}
                >
                  <MaterialCommunityIcons color={appTheme.colors.danger} name="logout" size={18} />
                </Pressable>
              </View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={terminateSessions}
              style={({ pressed }) => [appTheme.styles.terminateButton, pressed && appTheme.styles.pressed]}
            >
              <MaterialCommunityIcons color={appTheme.colors.danger} name="power-settings" size={17} />
              <Text style={appTheme.styles.terminateText}>Terminate All Other Active Sessions</Text>
            </Pressable>
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading icon="text-box-check-outline" title="Audit Ledger" trailing="Immutable Ledger" />
          <View style={appTheme.styles.card}>
            <AuditRow
              icon="fingerprint"
              title="Authenticated via Passkey (FaceID)"
              detail="Today, 09:14 AM · San Francisco, US"
            />
            <View style={appTheme.styles.separator} />
            <AuditRow
              icon="key-change"
              title="2FA Enclave Recovery Key Rotated"
              detail="Yesterday, 04:30 PM · Hardware Vault"
            />
            <View style={appTheme.styles.separator} />
            <AuditRow
              icon="shield-check"
              title="Automation Scope Granted: Plaid API"
              detail="Oct 12, 11:20 AM · Read-only access"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => showPreview('Cryptographic audit log', 'The full 90-day audit log is not connected in this preview.')}
              style={appTheme.styles.auditLink}
            >
              <Text style={appTheme.styles.auditLinkText}>View Full 90-Day Cryptographic Audit Log</Text>
              <Ionicons color={appTheme.colors.mintBright} name="arrow-forward" size={16} />
            </Pressable>
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading icon="database-lock-outline" title="Data Sovereignty" />
          <View style={appTheme.styles.card}>
            <View style={appTheme.styles.sovereigntyBanner}>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="shield-check" size={20} />
              <View style={appTheme.styles.rowCopy}>
                <Text style={appTheme.styles.sovereigntyTitle}>End-to-End Vault</Text>
                <Text style={appTheme.styles.sovereigntyDescription}>Your data remains encrypted and user-controlled.</Text>
              </View>
            </View>
            <SettingRow
              icon="download-lock-outline"
              title="Export Encrypted Dossier"
              description="Download all telemetry in encrypted JSON/CSV"
              value="Request"
              onPress={() => showPreview('Export encrypted dossier', 'Encrypted export is not connected in this local preview.')}
            />
            <View style={appTheme.styles.separator} />
            <SettingRow
              icon="broom"
              title="Flush Assistant Context"
              description="Purge transient command memory cache"
              value="Flush"
              onPress={() => Alert.alert(
                'Flush assistant context?',
                'This only clears the local preview state. No server or device cache is connected.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Flush Preview', style: 'destructive' },
                ],
              )}
            />
          </View>
        </View>

        <View style={appTheme.styles.dangerCard}>
          <View style={appTheme.styles.dangerHeading}>
            <MaterialCommunityIcons color={appTheme.colors.danger} name="alert-outline" size={20} />
            <Text style={appTheme.styles.dangerTitle}>Purge Account &amp; Vault Keys</Text>
          </View>
          <Text style={appTheme.styles.dangerDescription}>
            Permanently wipe personal models, enclave passkeys, and synchronized credentials. Irreversible.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert(
              'Sovereign Erasure',
              'This irreversible action is disabled in the preview. No account, vault, or key data is connected.',
              [{ text: 'Understood', style: 'cancel' }],
            )}
            style={({ pressed }) => [appTheme.styles.eraseButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.danger} name="delete-forever-outline" size={19} />
            <Text style={appTheme.styles.eraseButtonText}>Initialize Sovereign Erasure</Text>
          </Pressable>
        </View>
        <Text style={appTheme.styles.previewNote}>
          Privacy controls are a local preview and do not alter device security, account credentials, or stored data.
        </Text>
      </ScrollView>
      <MainBottomNavigation activeTab="settings" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

function AuditRow({
  icon,
  title,
  detail,
}: {
  icon: IconName;
  title: string;
  detail: string;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.auditRow}>
      <View style={appTheme.styles.auditIcon}>
        <MaterialCommunityIcons color={appTheme.colors.mintBright} name={icon} size={17} />
      </View>
      <View style={appTheme.styles.auditCopy}>
        <Text style={appTheme.styles.auditTitle}>{title}</Text>
        <Text style={appTheme.styles.auditDetail}>{detail}</Text>
      </View>
    </View>
  );
}
