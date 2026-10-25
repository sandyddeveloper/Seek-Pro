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
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainBottomNavigation from '../components/MainBottomNavigation';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import { createStyles } from '../styles/connected-apps.style';
import { useThemedStyles } from '../lib/theme-context';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type ServiceState = 'connected' | 'expired' | 'available';
type ServiceId =
  | 'google-calendar'
  | 'icloud-calendar'
  | 'gmail'
  | 'outlook'
  | 'plaid'
  | 'stripe'
  | 'apple-health'
  | 'whoop'
  | 'notion'
  | 'linear';

type Service = {
  id: ServiceId;
  name: string;
  account: string;
  icon: IconName;
  state: ServiceState;
  lastSuccess?: string;
  attempt?: string;
  cadence?: string;
  detail: string;
  scopes?: string;
  warning?: string;
};

type ServiceGroup = {
  title: string;
  icon: IconName;
  services: ServiceId[];
};

const serviceGroups: ServiceGroup[] = [
  {
    title: 'Calendar & Scheduling',
    icon: 'calendar-month',
    services: ['google-calendar', 'icloud-calendar'],
  },
  {
    title: 'Executive Email Suite',
    icon: 'email-outline',
    services: ['gmail', 'outlook'],
  },
  {
    title: 'Financial & Banking Feeds',
    icon: 'bank-outline',
    services: ['plaid', 'stripe'],
  },
  {
    title: 'Health & Biometrics',
    icon: 'heart-pulse',
    services: ['apple-health', 'whoop'],
  },
  {
    title: 'Tasks & Knowledge Base',
    icon: 'checkbox-marked-circle-outline',
    services: ['notion', 'linear'],
  },
];

const initialServices: Service[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    account: 'Primary Work & Personal accounts (2 synced)',
    icon: 'calendar-month',
    state: 'connected',
    lastSuccess: '3m ago',
    attempt: '3m ago',
    cadence: 'Real-time',
    detail: 'Read events & free/busy slots (No write permissions)',
    scopes: 'Calendar event titles, attendees, free/busy status, and availability windows. No write access.',
  },
  {
    id: 'icloud-calendar',
    name: 'Apple iCloud Calendar',
    account: 'Executive family calendar',
    icon: 'calendar-blank-outline',
    state: 'connected',
    lastSuccess: '12m ago',
    attempt: '12m ago',
    detail: '48 events cached · Guarded privacy filter active',
    scopes: 'Calendar events are filtered to the configured executive and family calendar scopes.',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    account: 'Google Workspace (sandy@apex.corp)',
    icon: 'gmail',
    state: 'connected',
    lastSuccess: '5m ago',
    attempt: '5m ago',
    cadence: '5 min',
    detail: 'Flight itineraries, hotel passes & invoices scoped',
    scopes: 'Read-only message headers and explicitly scoped travel confirmations, invoices, and receipts.',
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook 365',
    account: 'Enterprise Azure AD Tenant',
    icon: 'microsoft-outlook',
    state: 'expired',
    lastSuccess: '2h ago',
    attempt: 'Failed (Token Expired)',
    detail: 'OAuth refresh token expired. Automated briefings and priority sender triage are suspended until re-authenticated.',
    warning: 'OAuth refresh token expired',
    scopes: 'Read-only message headers, priority sender metadata, and travel logistics.',
  },
  {
    id: 'plaid',
    name: 'Plaid Enterprise Link',
    account: 'Chase Sapphire & Amex Platinum',
    icon: 'bank-outline',
    state: 'connected',
    lastSuccess: '18m ago',
    attempt: '18m ago',
    detail: '23 transactions analyzed · Transfers strictly blocked',
    scopes: 'Read-only transaction and balance telemetry. Initiating transfers and writing to ledgers are blocked.',
  },
  {
    id: 'stripe',
    name: 'Stripe Revenue & Billing',
    account: 'SaaS metrics & invoice tracking',
    icon: 'credit-card-outline',
    state: 'available',
    detail: 'Surface daily MRR updates, failed payment flags, and executive revenue digests.',
    scopes: 'Revenue, invoice, and subscription analytics for reporting. No payment actions.',
  },
  {
    id: 'apple-health',
    name: 'Apple HealthKit',
    account: 'Apple Watch Ultra',
    icon: 'heart-pulse',
    state: 'connected',
    lastSuccess: '1m ago',
    attempt: '1m ago',
    cadence: 'Continuous',
    detail: 'Secure Enclave Pipe (HRV, Sleep stages, Resting HR, VO2 Max)',
    scopes: 'Read-only health telemetry including HRV, sleep stages, resting heart rate, and VO2 Max.',
  },
  {
    id: 'whoop',
    name: 'Whoop 4.0',
    account: 'Recovery & Strain Index',
    icon: 'heart-flash',
    state: 'available',
    detail: 'Harmonize focus mode recommendations with daily somatic recovery score.',
    scopes: 'Recovery score, strain, and sleep insights for focus recommendations.',
  },
  {
    id: 'notion',
    name: 'Notion Workspace',
    account: 'Personal OKRs & Executive Vault',
    icon: 'notebook-outline',
    state: 'connected',
    lastSuccess: '22m ago',
    attempt: '22m ago',
    detail: '4 Databases mapped · Tasks DB, Second Brain pages, Daily Journal capture',
    scopes: 'Access to selected OKR, task, knowledge, and journal databases.',
  },
  {
    id: 'linear',
    name: 'Linear Issues',
    account: 'Engineering sprints & roadmap tracking',
    icon: 'chart-timeline-variant',
    state: 'available',
    detail: 'Automatically reconcile assigned sprint milestones into executive timeblocks.',
    scopes: 'Assigned issues, sprint milestones, and roadmap metadata.',
  },
];

function ServiceStatus({ state }: { state: ServiceState }) {
  const appTheme = useThemedStyles(createStyles);
  const label = state === 'connected'
    ? 'Connected'
    : state === 'expired'
      ? 'Auth Expired'
      : 'Available';
  const icon = state === 'connected'
    ? 'check-circle'
    : state === 'expired'
      ? 'alert-circle'
      : 'plus-circle';
  const color = state === 'connected'
    ? appTheme.colors.mintBright
    : state === 'expired'
      ? appTheme.colors.danger
      : appTheme.colors.mutedBright;
  const badgeStyle = state === 'connected'
    ? appTheme.styles.connectedBadge
    : state === 'expired'
      ? appTheme.styles.expiredBadge
      : appTheme.styles.availableBadge;

  return (
    <View style={[appTheme.styles.statusBadge, badgeStyle]}>
      <MaterialCommunityIcons color={color} name={icon} size={14} />
      <Text style={[appTheme.styles.statusText, { color }]}>{label}</Text>
    </View>
  );
}

function IntegrationCard({
  service,
  onDetails,
  onConnect,
  onReauthenticate,
}: {
  service: Service;
  onDetails: () => void;
  onConnect: () => void;
  onReauthenticate: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  const isExpired = service.state === 'expired';

  return (
    <View style={[appTheme.styles.serviceCard, isExpired && appTheme.styles.serviceCardWarning]}>
      <View style={appTheme.styles.serviceHeader}>
        <View style={[appTheme.styles.serviceIcon, isExpired && appTheme.styles.serviceIconWarning]}>
          <MaterialCommunityIcons
            color={isExpired ? appTheme.colors.danger : appTheme.colors.mintBright}
            name={service.icon}
            size={21}
          />
        </View>
        <View style={appTheme.styles.serviceIdentity}>
          <Text style={appTheme.styles.serviceName}>{service.name}</Text>
          <Text style={appTheme.styles.serviceAccount}>{service.account}</Text>
        </View>
        <ServiceStatus state={service.state} />
        <Pressable
          accessibilityLabel={`More options for ${service.name}`}
          accessibilityRole="button"
          onPress={() => Alert.alert(service.name, 'Additional integration actions are not connected in this local preview.')}
          style={appTheme.styles.moreButton}
        >
          <MaterialCommunityIcons color={appTheme.colors.muted} name="dots-horizontal" size={20} />
        </Pressable>
      </View>

      {service.state === 'available' ? (
        <>
          <Text style={appTheme.styles.serviceDetail}>{service.detail}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onConnect}
            style={({ pressed }) => [appTheme.styles.connectButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintBright} name="plus" size={17} />
            <Text style={appTheme.styles.connectButtonText}>Connect {service.name.split(' ')[0]}</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={appTheme.styles.syncRow}>
            <Text style={[appTheme.styles.syncSummary, isExpired && appTheme.styles.warningSummary]}>
              {isExpired ? 'Last Success: 2h ago' : `Last Success: ${service.lastSuccess}`}
            </Text>
            <Text style={appTheme.styles.syncDivider}>·</Text>
            <Text style={[appTheme.styles.syncSummary, isExpired && appTheme.styles.warningSummary]}>
              {service.cadence ? `Cadence: ${service.cadence}` : `Attempt: ${service.attempt}`}
            </Text>
          </View>
          <Text style={[appTheme.styles.serviceDetail, isExpired && appTheme.styles.warningDetail]}>
            {isExpired ? service.warning : service.detail}
          </Text>
          {isExpired ? (
            <Text style={appTheme.styles.expiredDescription}>{service.detail}</Text>
          ) : null}
          <View style={appTheme.styles.serviceActions}>
            {isExpired ? (
              <Pressable
                accessibilityRole="button"
                onPress={onReauthenticate}
                style={({ pressed }) => [appTheme.styles.reauthenticateButton, pressed && appTheme.styles.pressed]}
              >
                <MaterialCommunityIcons color={appTheme.colors.danger} name="key-outline" size={16} />
                <Text style={appTheme.styles.reauthenticateText}>Re-authenticate Now</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={onDetails}
              style={({ pressed }) => [appTheme.styles.detailsButton, pressed && appTheme.styles.pressed]}
            >
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="tune-variant" size={16} />
              <Text style={appTheme.styles.detailsText}>Details &amp; Scopes</Text>
              <Ionicons color={appTheme.colors.mintBright} name="chevron-forward" size={14} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

export default function ConnectedAppsScreen() {
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
  const [services, setServices] = useState(initialServices);
  const [isSyncing, setIsSyncing] = useState(false);
  const linkedCount = useMemo(
    () => services.filter((service) => service.state === 'connected').length,
    [services],
  );
  const attentionCount = services.filter((service) => service.state === 'expired').length;

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load connected apps screen fonts.', fontError);
    }
  }, [fontError]);

  const updateService = (id: ServiceId, update: Partial<Service>) => {
    setServices((current) => current.map((service) => (
      service.id === id ? { ...service, ...update } : service
    )));
  };

  const showScopes = (service: Service) => {
    Alert.alert(
      `${service.name} scopes`,
      `${service.account}\n\n${service.scopes ?? service.detail}\n\nThis connected-apps screen is a local preview; no live account data is accessed.`,
    );
  };

  const connectService = (service: Service) => {
    Alert.alert(
      `Connect ${service.name}?`,
      'This is a local preview. No OAuth flow or account connection will start.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Preview Connected',
          onPress: () => updateService(service.id, {
            state: 'connected',
            lastSuccess: 'Just now',
            attempt: 'Just now',
            cadence: service.cadence ?? 'Manual',
          }),
        },
      ],
    );
  };

  const reauthenticate = (service: Service) => {
    Alert.alert(
      `Re-authenticate ${service.name}?`,
      'OAuth re-authentication is not connected in this preview. Mark the token as restored for preview purposes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Preview Re-authenticated',
          onPress: () => updateService(service.id, {
            state: 'connected',
            lastSuccess: 'Just now',
            attempt: 'Just now',
          }),
        },
      ],
    );
  };

  const syncAll = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    Alert.alert(
      'Sync preview',
      'Sync All Data Pipes is a UI preview. No connected services will be contacted.',
      [{ text: 'OK', onPress: () => setIsSyncing(false) }],
    );
  };

  const revokeAllKeys = () => {
    Alert.alert(
      'Revoke all keys?',
      'This local preview will mark connected services as available. No real keys or account connections will be revoked.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Preview Revocation',
          style: 'destructive',
          onPress: () => setServices((current) => current.map((service) => ({
            ...service,
            state: 'available',
          }))),
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
          <Pressable
            accessibilityLabel="Integration documentation and help"
            accessibilityRole="button"
            onPress={() => Alert.alert('Integration help', 'Integration documentation is not connected in this local preview.')}
            style={appTheme.styles.helpButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="help-outline" size={18} />
          </Pressable>
        </View>

        <View style={appTheme.styles.titleBlock}>
          <View style={appTheme.styles.linkedBadge}>
            <MaterialCommunityIcons color={appTheme.colors.mintBright} name="link-variant" size={15} />
            <Text style={appTheme.styles.linkedBadgeText}>{linkedCount} / 9 Services Linked</Text>
          </View>
          <Text style={appTheme.styles.pageTitle}>Connected Apps &amp; Integrations</Text>
          <Text style={appTheme.styles.pageSubtitle}>
            Manage data pipes, authentication tokens, and sync telemetry across your personal ecosystem.
          </Text>
        </View>

        <View style={appTheme.styles.telemetryCard}>
          <View style={appTheme.styles.telemetryHeader}>
            <View style={appTheme.styles.telemetryTitleRow}>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="hub" size={20} />
              <Text style={appTheme.styles.telemetryTitle}>Pipeline Telemetry</Text>
            </View>
            <View style={appTheme.styles.liveBadge}>
              <View style={appTheme.styles.liveDot} />
              <Text style={appTheme.styles.liveBadgeText}>Live Daemon</Text>
            </View>
          </View>
          <View style={appTheme.styles.telemetryStats}>
            <View style={appTheme.styles.telemetryStat}>
              <Text style={appTheme.styles.telemetryValue}>{linkedCount}/9</Text>
              <Text style={appTheme.styles.telemetryLabel}>Services Linked</Text>
            </View>
            <View style={appTheme.styles.telemetrySeparator} />
            <View style={appTheme.styles.telemetryStat}>
              <Text style={[appTheme.styles.telemetryValue, appTheme.styles.mintText]}>99.8%</Text>
              <Text style={appTheme.styles.telemetryLabel}>Sync Health</Text>
            </View>
            <View style={appTheme.styles.telemetrySeparator} />
            <View style={appTheme.styles.telemetryStat}>
              <Text style={[appTheme.styles.telemetryValue, attentionCount > 0 && appTheme.styles.warningText]}>
                {attentionCount}
              </Text>
              <Text style={appTheme.styles.telemetryLabel}>Attention</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isSyncing}
            onPress={syncAll}
            style={({ pressed }) => [appTheme.styles.syncAllButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintDark} name="sync" size={18} />
            <Text style={appTheme.styles.syncAllText}>{isSyncing ? 'Syncing Preview…' : 'Sync All Data Pipes'}</Text>
          </Pressable>
        </View>

        {serviceGroups.map((group) => {
          const groupServices = group.services.map((id) => (
            services.find((service) => service.id === id)
          )).filter((service): service is Service => service !== undefined);
          const connected = groupServices.filter((service) => service.state === 'connected').length;
          const expired = groupServices.filter((service) => service.state === 'expired').length;
          const available = groupServices.length - connected - expired;

          return (
            <View key={group.title} style={appTheme.styles.group}>
              <View style={appTheme.styles.groupHeader}>
                <View style={appTheme.styles.groupTitleRow}>
                  <MaterialCommunityIcons color={appTheme.colors.mintBright} name={group.icon} size={19} />
                  <Text style={appTheme.styles.groupTitle}>{group.title}</Text>
                </View>
                <View style={appTheme.styles.groupCounts}>
                  {connected > 0 ? <Text style={appTheme.styles.groupCountActive}>{connected} active</Text> : null}
                  {expired > 0 ? <Text style={appTheme.styles.groupCountAttention}>{expired} attention</Text> : null}
                  {available > 0 ? <Text style={appTheme.styles.groupCountIdle}>{available} idle</Text> : null}
                </View>
              </View>
              {groupServices.map((service) => (
                <IntegrationCard
                  key={service.id}
                  onConnect={() => connectService(service)}
                  onDetails={() => showScopes(service)}
                  onReauthenticate={() => reauthenticate(service)}
                  service={service}
                />
              ))}
            </View>
          );
        })}

        <View style={appTheme.styles.privacyCard}>
          <View style={appTheme.styles.privacyHeading}>
            <View style={appTheme.styles.privacyIcon}>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="shield-check" size={19} />
            </View>
            <View style={appTheme.styles.privacyCopy}>
              <Text style={appTheme.styles.privacyTitle}>Cryptographic Privacy Architecture</Text>
              <Text style={appTheme.styles.privacySubtitle}>On-device keys · Zero-knowledge processing</Text>
            </View>
          </View>
          <Text style={appTheme.styles.privacyDescription}>
            OAuth tokens, biometric keys, and refresh secrets are stored exclusively in the device Secure Enclave. Ephemeral processing avoids permanent retention on shared intermediary servers.
          </Text>
          <View style={appTheme.styles.privacyStandards}>
            <Text style={appTheme.styles.standardPill}>CalDAV</Text>
            <Text style={appTheme.styles.standardPill}>Plaid Read-Only</Text>
            <Text style={appTheme.styles.standardPill}>FHIR</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Integration audit', 'Audit logs and enclave attestation are not connected in this local preview.')}
            style={({ pressed }) => [appTheme.styles.auditButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintBright} name="text-box-search-outline" size={16} />
            <Text style={appTheme.styles.auditButtonText}>Audit Integration Logs &amp; Enclave Attestation</Text>
            <Ionicons color={appTheme.colors.mintBright} name="chevron-forward" size={15} />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={revokeAllKeys}
          style={({ pressed }) => [appTheme.styles.revokeButton, pressed && appTheme.styles.pressed]}
        >
          <MaterialCommunityIcons color={appTheme.colors.danger} name="lock-reset" size={18} />
          <Text style={appTheme.styles.revokeButtonText}>Revoke All Keys</Text>
        </Pressable>
        <Text style={appTheme.styles.previewNotice}>
          Demo state only. No accounts, OAuth tokens, keys, or live data are connected by this screen.
        </Text>
      </ScrollView>
      <MainBottomNavigation activeTab="settings" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
