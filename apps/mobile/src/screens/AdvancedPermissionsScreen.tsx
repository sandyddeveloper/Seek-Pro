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
import * as LocalAuthentication from 'expo-local-authentication';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainBottomNavigation from '../components/MainBottomNavigation';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import { createStyles } from '../styles/advanced-permissions.style';
import { useThemedStyles } from '../lib/theme-context';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
type PermissionTierKey = 'calendarRead' | 'calendarDraft' | 'calendarActions'
  | 'emailRead' | 'emailDraft' | 'emailDispatch'
  | 'financeRead' | 'financeDraft' | 'financeActions'
  | 'healthRead' | 'healthDraft' | 'healthActions';

type PermissionTier = {
  key: PermissionTierKey;
  title: string;
  badge: string;
  description: string;
  locked?: boolean;
  prohibited?: boolean;
};

type Integration = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  status: IconName;
  tiers: PermissionTier[];
};

type Automation = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  schedule: string;
  trigger: string;
  scope: string;
  failure: string;
  lastRun: string;
};

const integrations: Integration[] = [
  {
    id: 'calendar',
    title: 'Google Calendar & iCloud',
    subtitle: '2 accounts connected · Biometric Sync',
    icon: 'calendar-month',
    status: 'calendar-sync',
    tiers: [
      {
        key: 'calendarRead',
        title: 'Tier 1: Telemetry & Ingestion',
        badge: 'Read Only',
        description: 'Read event titles, attendees, free/busy status slots',
      },
      {
        key: 'calendarDraft',
        title: 'Tier 2: Draft Creation',
        badge: 'Staging',
        description: 'Stage schedule adjustments & draft invites locally',
      },
      {
        key: 'calendarActions',
        title: 'Tier 3: External System Actions',
        badge: 'Confirm First',
        description: 'Publish invites, delete meetings, reschedule calendar slots',
      },
    ],
  },
  {
    id: 'email',
    title: 'Executive Email Suite',
    subtitle: 'Exchange & Fastmail',
    icon: 'email-outline',
    status: 'lock-open-outline',
    tiers: [
      {
        key: 'emailRead',
        title: 'Tier 1: Telemetry & Ingestion',
        badge: 'Active',
        description: 'Headers, logistics confirmations, travel itineraries',
      },
      {
        key: 'emailDraft',
        title: 'Tier 2: Draft Creation',
        badge: 'Permitted',
        description: 'Draft replies and queue responses in local Drafts folder',
      },
      {
        key: 'emailDispatch',
        title: 'Tier 3: External System Actions',
        badge: 'Biometric Gate',
        description: 'Auto-dispatch outbound emails directly without review',
        locked: true,
      },
    ],
  },
  {
    id: 'finance',
    title: 'Financial & Banking Feeds',
    subtitle: 'Encrypted Plaid Link',
    icon: 'bank-outline',
    status: 'shield-check',
    tiers: [
      {
        key: 'financeActions',
        title: 'Tier 1: Telemetry & Ingestion',
        badge: 'Guarded Read',
        description: 'Transaction monitoring, SaaS billing, ledger ingestion',
      },
      {
        key: 'financeDraft',
        title: 'Tier 2: Draft Creation',
        badge: 'Expense Tagging',
        description: 'Stage expense classifications & tax line allocations',
      },
      {
        key: 'financeRead',
        title: 'Tier 3: External System Actions',
        badge: 'Strictly Prohibited',
        description: 'Initiating payments, ledger writes, or bank fund transfers',
        prohibited: true,
      },
    ],
  },
  {
    id: 'health',
    title: 'Apple Health & Biometrics',
    subtitle: 'HealthKit Sync Enabled',
    icon: 'heart-pulse',
    status: 'heart-pulse',
    tiers: [
      {
        key: 'healthActions',
        title: 'Tier 1: Telemetry & Ingestion',
        badge: 'Read Only',
        description: 'Sleep stages, HR variability to optimize deep-work agenda',
      },
      {
        key: 'healthDraft',
        title: 'Tier 2: Draft Creation',
        badge: 'Analytics',
        description: 'Generate local recovery insights and schedule proposals',
      },
      {
        key: 'healthRead',
        title: 'Tier 3: External System Actions',
        badge: 'Disabled',
        description: 'Write external health records or medication telemetry',
        prohibited: true,
      },
    ],
  },
];

const automationRules: Automation[] = [
  {
    id: 'renewals',
    title: 'SaaS Renewal Hunter',
    subtitle: 'Autonomous spend monitor',
    icon: 'trending-up',
    schedule: 'Weekly Sun',
    trigger: '>10% Price Bump',
    scope: 'Ingestion & Alert',
    failure: 'Hold in Quarantine',
    lastRun: 'Yesterday, 03:00 AM',
  },
  {
    id: 'schedule',
    title: 'Morning Schedule De-conflicter',
    subtitle: 'Autonomous focus guardian',
    icon: 'timer-sand',
    schedule: 'Continuous (15m)',
    trigger: '2h Focus Conflict',
    scope: 'Buffer Rebalance',
    failure: 'Fallback to Draft',
    lastRun: '2 hours ago',
  },
  {
    id: 'travel',
    title: 'Travel Itinerary Synthesizer',
    subtitle: 'Flight & lodge briefing engine',
    icon: 'airplane',
    schedule: 'Event Triggered',
    trigger: 'Ingest Booking Ref',
    scope: 'Briefing & Gate',
    failure: 'Alert on Timeout',
    lastRun: '3 days ago',
  },
];

const initialPermissions: Record<PermissionTierKey, boolean> = {
  calendarRead: true,
  calendarDraft: true,
  calendarActions: true,
  emailRead: true,
  emailDraft: true,
  emailDispatch: false,
  financeRead: true,
  financeDraft: true,
  financeActions: false,
  healthRead: true,
  healthDraft: true,
  healthActions: false,
};

const guardrails = [
  {
    title: 'Financial Actions (> $50)',
    badge: 'FaceID Gate',
    description: 'Require explicit biometric prompt before authorizing invoice triage.',
    icon: 'cash-lock',
  },
  {
    title: 'Outbound Communications',
    badge: 'Always Confirm',
    description: 'Draft first. Slack messages and external emails remain pending until verified.',
    icon: 'email-check-outline',
  },
  {
    title: 'Schedule Shifts (> 30 min)',
    badge: 'Focus Aware',
    description: 'Autonomous shift allowed only within designated buffer slots.',
    icon: 'calendar-clock',
  },
  {
    title: 'Contact Deletion / Cleansing',
    badge: 'Audit Only',
    description: 'Irreversible pruning duplicate records requires step-up approval.',
    icon: 'account-remove-outline',
  },
] satisfies { title: string; badge: string; description: string; icon: IconName }[];

function Switch({
  value,
  onToggle,
  label,
  small = false,
  disabled = false,
}: {
  value: boolean;
  onToggle: () => void;
  label: string;
  small?: boolean;
  disabled?: boolean;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={onToggle}
      style={[
        appTheme.styles.switchTrack,
        small && appTheme.styles.smallSwitchTrack,
        value ? appTheme.styles.switchOn : appTheme.styles.switchOff,
        disabled && appTheme.styles.switchDisabled,
      ]}
    >
      <View style={[appTheme.styles.switchThumb, small && appTheme.styles.smallSwitchThumb, value && appTheme.styles.switchThumbOn]} />
    </Pressable>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  trailing?: string;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.sectionHeader}>
      <View style={appTheme.styles.sectionHeadingGroup}>
        <MaterialCommunityIcons color={appTheme.colors.mintBright} name={icon} size={19} />
        <View style={appTheme.styles.sectionHeadingCopy}>
          <Text style={appTheme.styles.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={appTheme.styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {trailing ? <Text style={appTheme.styles.sectionTrailing}>{trailing}</Text> : null}
    </View>
  );
}

function PermissionCard({
  integration,
  values,
  onToggle,
  onUnlock,
}: {
  integration: Integration;
  values: Record<PermissionTierKey, boolean>;
  onToggle: (key: PermissionTierKey) => void;
  onUnlock: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  const badgeStyle = (badge: string) => {
    if (badge === 'Strictly Prohibited' || badge === 'Disabled') return appTheme.styles.badgeDanger;
    if (badge === 'FaceID Gate' || badge === 'Biometric Gate') return appTheme.styles.badgeWarning;
    if (badge === 'Confirm First') return appTheme.styles.badgeConfirm;
    return appTheme.styles.badgeActive;
  };

  return (
    <View style={appTheme.styles.permissionCard}>
      <View style={appTheme.styles.integrationHeader}>
        <View style={appTheme.styles.integrationIcon}>
          <MaterialCommunityIcons color={appTheme.colors.mintBright} name={integration.icon} size={21} />
        </View>
        <View style={appTheme.styles.integrationCopy}>
          <Text style={appTheme.styles.integrationTitle}>{integration.title}</Text>
          <Text style={appTheme.styles.integrationSubtitle}>{integration.subtitle}</Text>
        </View>
        <MaterialCommunityIcons color={appTheme.colors.muted} name={integration.status} size={17} />
      </View>

      {integration.tiers.map((tier, index) => {
        const isEnabled = values[tier.key];
        const isBiometricGate = tier.locked;
        return (
          <View
            key={`${integration.id}-${tier.title}`}
            style={[
              appTheme.styles.tierRow,
              index === integration.tiers.length - 1 && appTheme.styles.lastTierRow,
              (tier.prohibited || isBiometricGate) && appTheme.styles.restrictedTierRow,
            ]}
          >
            <View style={appTheme.styles.tierCopy}>
              <View style={appTheme.styles.tierHeading}>
                <Text style={[appTheme.styles.tierTitle, tier.prohibited && appTheme.styles.disabledTierTitle]}>
                  {tier.title}
                </Text>
                <View style={[appTheme.styles.tierBadge, badgeStyle(tier.badge)]}>
                  <Text style={[appTheme.styles.tierBadgeText, tier.prohibited && appTheme.styles.badgeDangerText]}>
                    {tier.badge}
                  </Text>
                </View>
              </View>
              <Text style={[appTheme.styles.tierDescription, tier.prohibited && appTheme.styles.disabledTierTitle]}>
                {tier.description}
              </Text>
            </View>
            {tier.prohibited ? (
              <MaterialCommunityIcons color={appTheme.colors.danger} name="lock" size={18} />
            ) : (
              <Switch
                disabled={false}
                label={`${integration.title}: ${tier.title} ${isEnabled ? 'enabled' : 'disabled'}`}
                onToggle={() => (isBiometricGate ? onUnlock() : onToggle(tier.key))}
                small
                value={isEnabled}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

function AutomationCard({
  rule,
  enabled,
  disabled,
  onToggle,
  onConfigure,
}: {
  rule: Automation;
  enabled: boolean;
  disabled: boolean;
  onToggle: () => void;
  onConfigure: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.automationCard}>
      <View style={appTheme.styles.automationHeader}>
        <View style={appTheme.styles.automationIcon}>
          <MaterialCommunityIcons color={appTheme.colors.mint} name={rule.icon} size={18} />
        </View>
        <View style={appTheme.styles.automationCopy}>
          <Text style={appTheme.styles.automationTitle}>{rule.title}</Text>
          <Text style={appTheme.styles.automationSubtitle}>{rule.subtitle}</Text>
        </View>
        <Switch
          disabled={disabled}
          label={`${rule.title} ${enabled ? 'enabled' : 'disabled'}`}
          onToggle={onToggle}
          small
          value={enabled}
        />
      </View>
      <View style={appTheme.styles.ruleMetadata}>
        <View style={appTheme.styles.metadataPill}><Text style={appTheme.styles.metadataText}>Schedule: {rule.schedule}</Text></View>
        <View style={appTheme.styles.metadataPill}><Text style={appTheme.styles.metadataText}>Trigger: {rule.trigger}</Text></View>
        <View style={appTheme.styles.metadataPill}><Text style={appTheme.styles.metadataText}>Scope: {rule.scope}</Text></View>
        <View style={appTheme.styles.metadataPill}><Text style={appTheme.styles.metadataText}>Failure: {rule.failure}</Text></View>
      </View>
      <View style={appTheme.styles.ruleFooter}>
        <Text style={appTheme.styles.lastRunText}>Last run: {rule.lastRun}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onConfigure}
          style={({ pressed }) => [appTheme.styles.configureButton, pressed && appTheme.styles.pressed]}
        >
          <MaterialCommunityIcons color={appTheme.colors.mintBright} name="cog-outline" size={15} />
          <Text style={appTheme.styles.configureText}>Configure Rule</Text>
          <Ionicons color={appTheme.colors.mintBright} name="chevron-forward" size={13} />
        </Pressable>
      </View>
    </View>
  );
}

export default function AdvancedPermissionsScreen() {
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
  const [permissions, setPermissions] = useState(initialPermissions);
  const [daemonStates, setDaemonStates] = useState<Record<string, boolean>>({
    renewals: true,
    schedule: true,
    travel: true,
  });
  const [isHalted, setIsHalted] = useState(false);
  const [haltedDaemonStates, setHaltedDaemonStates] = useState<Record<string, boolean> | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const activeDaemonCount = Object.values(daemonStates).filter(Boolean).length;

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load automation permissions fonts.', fontError);
    }
  }, [fontError]);

  const authenticate = async (purpose: 'resume automations' | 'unlock email dispatch') => {
    if (isAuthenticating) return false;
    setIsAuthenticating(true);
    try {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Biometrics unavailable',
          'Set up Face ID or fingerprint authentication in device settings. These permissions remain a local preview.',
        );
        return false;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: purpose === 'resume automations'
          ? 'Verify to resume automations'
          : 'Verify to unlock email dispatch',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Cancel',
      });
      if (result.success) return true;
      if (!['user_cancel', 'system_cancel', 'app_cancel'].includes(result.error ?? '')) {
        Alert.alert('Verification failed', 'The protected permission was not changed.');
      }
      return false;
    } catch (error) {
      console.error('Biometric permission verification failed.', error);
      Alert.alert('Verification unavailable', 'The protected permission was not changed. Please try again.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const togglePermission = (key: PermissionTierKey) => {
    setPermissions((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleHalt = () => {
    if (!isHalted) {
      setHaltedDaemonStates(daemonStates);
      setIsHalted(true);
      setDaemonStates({ renewals: false, schedule: false, travel: false });
      return;
    }
    Alert.alert(
      'Confirm Engine Resume',
      'Resuming reactivates the autonomous background daemons. Device biometric verification is required.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify & Resume',
          onPress: () => {
            void (async () => {
              if (await authenticate('resume automations')) {
                setIsHalted(false);
                setDaemonStates(haltedDaemonStates ?? { renewals: true, schedule: true, travel: true });
                setHaltedDaemonStates(null);
              }
            })();
          },
        },
      ],
    );
  };

  const unlockEmailDispatch = () => {
    Alert.alert(
      'Unlock high-risk action?',
      'Email auto-dispatch is a local preview. Biometric verification is required to enable this permission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          onPress: () => {
            void (async () => {
              if (await authenticate('unlock email dispatch')) {
                togglePermission('emailDispatch');
              }
            })();
          },
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
          <View style={appTheme.styles.brand}>
            <View style={appTheme.styles.brandMark}>
              <Image
                contentFit="contain"
                source={require('../../assets/seekpro-mark.png')}
                style={appTheme.styles.brandMarkImage}
              />
            </View>
            <Text style={appTheme.styles.brandTitle}>AI Assistant</Text>
          </View>
          <View style={appTheme.styles.activeBadge}>
            <MaterialCommunityIcons color={appTheme.colors.mintBright} name="shield-check" size={14} />
            <Text style={appTheme.styles.activeBadgeText}>Active</Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Back to AI Assistant Preferences"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={appTheme.styles.backLink}
        >
          <Ionicons color={appTheme.colors.mintBright} name="arrow-back" size={17} />
          <Text style={appTheme.styles.backLinkText}>AI Assistant Preferences</Text>
        </Pressable>

        <View style={appTheme.styles.titleBlock}>
          <View style={appTheme.styles.titleIcon}>
            <MaterialCommunityIcons color={appTheme.colors.danger} name="shield-lock-outline" size={21} />
          </View>
          <View style={appTheme.styles.titleCopy}>
            <Text style={appTheme.styles.pageTitle}>Autonomous Engine Control</Text>
            <Text style={appTheme.styles.pageSubtitle}>Advanced Automation &amp; Permissions</Text>
          </View>
        </View>

        <View style={appTheme.styles.killSwitchCard}>
          <View style={appTheme.styles.cardGlow} />
          <View style={appTheme.styles.killSwitchHeader}>
            <View style={appTheme.styles.killSwitchIcon}>
              <MaterialCommunityIcons color={appTheme.colors.danger} name="shield-check" size={21} />
            </View>
            <View style={appTheme.styles.killSwitchCopy}>
              <Text style={appTheme.styles.cardTitle}>Kill-Switch</Text>
              <Text style={appTheme.styles.cardDescription}>
                Master override switch. Instantly halts all background daemons, scheduled tasks, and outbound action queues across integrations.
              </Text>
            </View>
          </View>
          <View style={appTheme.styles.enclaveBadge}>
            <MaterialCommunityIcons color={appTheme.colors.mintBright} name="fingerprint" size={16} />
            <Text style={appTheme.styles.enclaveText}>Secure Enclave: FaceID Armed</Text>
            <View style={appTheme.styles.zeroTrustBadge}><Text style={appTheme.styles.zeroTrustText}>Zero-Trust</Text></View>
          </View>
          <View style={appTheme.styles.masterSwitchRow}>
            <View style={appTheme.styles.masterSwitchCopy}>
              <Text style={appTheme.styles.masterSwitchTitle}>{isHalted ? 'All Daemons Halted' : 'Automations Operational'}</Text>
              <Text style={appTheme.styles.masterSwitchDescription}>
                {isHalted ? 'Outbound triggers paused · Authorization required' : `${activeDaemonCount} daemons active · 0 held actions`}
              </Text>
            </View>
            <Switch
              label={isHalted ? 'Resume automations' : 'Halt all automations'}
              onToggle={toggleHalt}
              value={isHalted}
            />
          </View>
          {isHalted ? (
            <View style={appTheme.styles.haltBanner}>
              <MaterialCommunityIcons color={appTheme.colors.danger} name="pause-circle" size={19} />
              <View style={appTheme.styles.bannerCopy}>
                <Text style={appTheme.styles.bannerTitle}>All Daemons Halted</Text>
                <Text style={appTheme.styles.bannerDescription}>
                  Outbound triggers paused. Queueing events for user authorization.
                </Text>
              </View>
              <Pressable onPress={toggleHalt} style={appTheme.styles.resumeButton}>
                <Text style={appTheme.styles.resumeButtonText}>Resume</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeader
            icon="layers-triple-outline"
            title="3-Tier Permission Matrices"
            subtitle="Strict tiering by connected integration"
          />
          {integrations.map((integration) => (
            <PermissionCard
              key={integration.id}
              integration={integration}
              onToggle={togglePermission}
              onUnlock={unlockEmailDispatch}
              values={permissions}
            />
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert(
              'High-risk actions locked',
              'Financial writes and transfers are strictly prohibited. No bank action can be enabled from this screen.',
            )}
            style={({ pressed }) => [appTheme.styles.unlockButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="fingerprint" size={17} />
            <Text style={appTheme.styles.unlockButtonText}>Unlock High-Risk Actions (Requires Multi-Factor &amp; Biometric Setup)</Text>
          </Pressable>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeader
            icon="shield-check-outline"
            title="Action Guardrails"
            subtitle="Zero Trust Baseline"
          />
          <View style={appTheme.styles.guardrailsCard}>
            {guardrails.map((guardrail, index) => (
              <View
                key={guardrail.title}
                style={[appTheme.styles.guardrailRow, index === guardrails.length - 1 && appTheme.styles.lastGuardrailRow]}
              >
                <View style={appTheme.styles.guardrailIcon}>
                  <MaterialCommunityIcons color={appTheme.colors.mintBright} name={guardrail.icon} size={18} />
                </View>
                <View style={appTheme.styles.guardrailCopy}>
                  <View style={appTheme.styles.guardrailHeading}>
                    <Text style={appTheme.styles.guardrailTitle}>{guardrail.title}</Text>
                    <Text style={appTheme.styles.guardrailBadge}>{guardrail.badge}</Text>
                  </View>
                  <Text style={appTheme.styles.guardrailDescription}>{guardrail.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeader
            icon="robot-outline"
            title="Active Daemon Rules"
            subtitle="Managed local preview rules"
            trailing={`${activeDaemonCount} Running`}
          />
          {automationRules.map((rule) => (
            <AutomationCard
              key={rule.id}
              enabled={daemonStates[rule.id] && !isHalted}
              disabled={isHalted}
              onConfigure={() => Alert.alert(rule.title, 'Rule configuration is a local preview and is not saved or executed.')}
              onToggle={() => setDaemonStates((current) => ({
                ...current,
                [rule.id]: !current[rule.id],
              }))}
              rule={rule}
            />
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Custom daemon rule', 'Creating and saving daemon rules is not connected yet.')}
            style={({ pressed }) => [appTheme.styles.addRuleButton, pressed && appTheme.styles.pressed]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintBright} name="plus-circle-outline" size={19} />
            <Text style={appTheme.styles.addRuleText}>Add Custom Daemon Rule</Text>
          </Pressable>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeader
            icon="history"
            title="Activity &amp; Audit Log"
            subtitle="Immutable Ledger · Local preview entries"
          />
          <View style={appTheme.styles.auditCard}>
            <AuditEntry
              icon="check-circle"
              title="Rescheduled 1:1 Sync with Sarah M."
              time="2h ago"
              description="Shifted +45m to prevent deep-focus fragmentation."
              trigger="Morning Buffer Policy"
              result="Success (Synced)"
              resultIcon="check-decagram"
            />
            <AuditEntry
              icon="bell-alert"
              title="Flagged AWS Overcharge ($142.50)"
              time="Yesterday"
              description="SaaS Hunter detected unexpected compute spike. Dispatched alert."
              trigger="SaaS Renewal Rule"
              result="Alert Dispatched"
              resultIcon="bell-alert"
            />
            <AuditEntry
              icon="shield-lock"
              title="Blocked Outbound Auto-Dispatch"
              time="Oct 12"
              description="Attempted auto-dispatch to external partner. Intercepted by Policy."
              trigger="Unverified Recipient"
              result="Intercepted & Quarantined"
              resultIcon="shield-check"
              warning
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert('Audit log', 'The full audit log is not connected in this local preview.')}
              style={appTheme.styles.fullAuditLink}
            >
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="receipt-text-outline" size={16} />
              <Text style={appTheme.styles.fullAuditText}>View Full Audit Log (18 entries)</Text>
              <Ionicons color={appTheme.colors.mintBright} name="arrow-forward" size={15} />
            </Pressable>
          </View>
        </View>
        <Text style={appTheme.styles.disclaimer}>
          Settings on this screen are a local UI preview only. They do not change connected accounts or run background automations.
        </Text>
      </ScrollView>
      <MainBottomNavigation activeTab="assistant" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

function AuditEntry({
  icon,
  title,
  time,
  description,
  trigger,
  result,
  resultIcon,
  warning = false,
}: {
  icon: IconName;
  title: string;
  time: string;
  description: string;
  trigger: string;
  result: string;
  resultIcon: IconName;
  warning?: boolean;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.auditEntry}>
      <View style={[appTheme.styles.auditIcon, warning && appTheme.styles.auditIconWarning]}>
        <MaterialCommunityIcons color={warning ? appTheme.colors.danger : appTheme.colors.mintBright} name={icon} size={18} />
      </View>
      <View style={appTheme.styles.auditCopy}>
        <View style={appTheme.styles.auditTitleRow}>
          <Text style={appTheme.styles.auditTitle}>{title}</Text>
          <Text style={appTheme.styles.auditTime}>{time}</Text>
        </View>
        <Text style={appTheme.styles.auditDescription}>{description}</Text>
        <Text style={appTheme.styles.auditTrigger}>Trigger: {trigger}</Text>
        <View style={appTheme.styles.auditResult}>
          <MaterialCommunityIcons color={warning ? appTheme.colors.danger : appTheme.colors.mintBright} name={resultIcon} size={13} />
          <Text style={[appTheme.styles.auditResultText, warning && appTheme.styles.auditWarningText]}>{result}</Text>
        </View>
      </View>
    </View>
  );
}
