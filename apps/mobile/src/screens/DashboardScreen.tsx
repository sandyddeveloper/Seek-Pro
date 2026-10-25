import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainBottomNavigation from '../components/MainBottomNavigation';
import { createStyles } from '../styles/dashboard.style';
import { useThemedStyles } from '../lib/theme-context';
import CardWidget from '../widgets/common/card.widget';
import MetricCardWidget from '../widgets/dashboard/MetricCard.widget';

function SectionHeading({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.sectionHeading}>
      <Text style={appTheme.styles.sectionTitle}>{title}</Text>
      {meta ? <Text style={appTheme.styles.sectionMeta}>{meta}</Text> : null}
    </View>
  );
}

export default function DashboardScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [fontsLoaded, fontError] = useFonts({
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    HankenGrotesk: HankenGrotesk_400Regular,
    HankenGroteskMedium: HankenGrotesk_500Medium,
    HankenGroteskSemiBold: HankenGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load dashboard fonts.', fontError);
    }
  }, [fontError]);

  const showDemoMessage = (feature: string) => {
    Alert.alert(feature, 'This dashboard preview is not connected to live data yet.');
  };

  if (!fontsLoaded && !fontError) {
    return <View style={appTheme.styles.safeArea} />;
  }

  return (
    <SafeAreaView style={appTheme.styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style={appTheme.mode === 'dark' ? 'light' : 'dark'} />
      <View style={appTheme.styles.header}>
        <View style={appTheme.styles.headerBrand}>
          <Image
            source={require('../../assets/seekpro-mark.png')}
            contentFit="contain"
            style={appTheme.styles.headerLogo}
          />
          <Text style={appTheme.styles.brandEyebrow}>SeekPro</Text>
        </View>
        <View style={appTheme.styles.headerActions}>
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            onPress={() => showDemoMessage('Notifications')}
            style={appTheme.styles.notificationButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="notifications-outline" size={22} />
            <View style={appTheme.styles.notificationDot} />
          </Pressable>
          <Pressable
            accessibilityLabel="Profile"
            accessibilityRole="button"
            onPress={() => showDemoMessage('Profile')}
            style={appTheme.styles.profileButton}
          >
            <Ionicons color={appTheme.colors.mintDark} name="person-outline" size={19} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={appTheme.styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={appTheme.styles.greeting}>
          <Text style={appTheme.styles.dateLabel}>Today · Tuesday, Oct 24</Text>
          <Text style={appTheme.styles.greetingTitle}>Good morning, SRK</Text>
        </View>

        <CardWidget style={appTheme.styles.synthesisCard}>
          <View style={appTheme.styles.synthesisHeader}>
            <View style={appTheme.styles.synthesisTitleGroup}>
              <View style={appTheme.styles.synthesisIconWrap}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name="auto-fix" size={17} />
              </View>
              <Text style={appTheme.styles.synthesisTitle}>Executive Synthesis</Text>
            </View>
            <Text style={appTheme.styles.timeBadge}>06:45 AM</Text>
          </View>
          <Text style={appTheme.styles.synthesisBody}>
            SeekPro orchestrated your schedule: <Text style={appTheme.styles.bodyHighlight}>3 core focus blocks</Text>
            {' '}protected, 2 financial alerts triaged, and biometrics peaked at{' '}
            <Text style={appTheme.styles.bodyAccent}>92%</Text>. Your workspace is clear until{' '}
            <Text style={appTheme.styles.bodyStrong}>10:30 AM.</Text>
          </Text>
          <View style={appTheme.styles.synthesisFooter}>
            <Pressable
              accessibilityRole="button"
              onPress={() => showDemoMessage('Audio brief')}
              style={appTheme.styles.audioButton}
            >
              <View style={appTheme.styles.playCircle}>
                <Ionicons color={appTheme.colors.mintDark} name="play" size={12} />
              </View>
              <Text style={appTheme.styles.audioButtonText}>Listen to 90s Audio Brief</Text>
              <Feather color={appTheme.colors.mutedBright} name="headphones" size={14} />
            </Pressable>
            <Text style={appTheme.styles.calmLabel}>Calm state active</Text>
          </View>
        </CardWidget>

        <View style={appTheme.styles.section}>
          <View style={appTheme.styles.sectionHeader}>
            <SectionHeading title="Priority Focus Queue" meta="3 remaining" />
            <Pressable
              accessibilityLabel="Rearrange queue"
              accessibilityRole="button"
              onPress={() => showDemoMessage('Focus queue')}
              style={appTheme.styles.tuneButton}
            >
              <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="tune-variant" size={20} />
            </Pressable>
          </View>
          <CardWidget style={appTheme.styles.taskCard}>
            <View style={appTheme.styles.taskTop}>
              <View style={appTheme.styles.taskIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mint} name="target" size={17} />
              </View>
              <View style={appTheme.styles.taskContent}>
                <View style={appTheme.styles.taskMetaRow}>
                  <Text style={appTheme.styles.taskPriority}>Priority 1 · Deep Work</Text>
                  <Text style={appTheme.styles.taskTime}>10:30 AM – 12:00 PM</Text>
                </View>
                <Text style={appTheme.styles.taskTitle}>Finalize Q4 Product Roadmap &amp; Board Deck</Text>
                <View style={appTheme.styles.taskBadges}>
                  <View style={appTheme.styles.taskBadge}>
                    <MaterialCommunityIcons color={appTheme.colors.mintBright} name="lock-clock" size={13} />
                    <Text style={appTheme.styles.taskBadgeText}>Focus Lock</Text>
                  </View>
                  <View style={appTheme.styles.taskBadge}>
                    <MaterialCommunityIcons color={appTheme.colors.mintBright} name="calendar-check" size={13} />
                    <Text style={appTheme.styles.taskBadgeText}>Calendar Synced</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={appTheme.styles.taskFooter}>
              <Text style={appTheme.styles.initials}>F  K</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => showDemoMessage('Focus session')}
                style={appTheme.styles.startFocusButton}
              >
                <Ionicons color={appTheme.colors.mintDark} name="play-circle-outline" size={17} />
                <Text style={appTheme.styles.startFocusText}>Start Focus Session</Text>
              </Pressable>
            </View>
          </CardWidget>

          <CardWidget style={appTheme.styles.financeTaskCard}>
            <View style={appTheme.styles.financeTaskTop}>
              <View style={appTheme.styles.financeIcon}>
                <MaterialCommunityIcons color={appTheme.colors.amber} name="receipt-text-outline" size={17} />
              </View>
              <View style={appTheme.styles.financeContent}>
                <View style={appTheme.styles.taskMetaRow}>
                  <Text style={appTheme.styles.financeLabel}>Plaid Insight</Text>
                  <Text style={appTheme.styles.taskTime}>Due Tomorrow</Text>
                </View>
                <Text style={appTheme.styles.financeTitle}>Review $240 SaaS Renewal (Figma Enterprise)</Text>
                <Text style={appTheme.styles.financeDescription}>
                  Seat utilization dropped 18% over the last 30 days.
                </Text>
              </View>
            </View>
            <View style={appTheme.styles.financeActions}>
              <Pressable
                onPress={() => showDemoMessage('Snooze reminder')}
                style={appTheme.styles.smallAction}
              >
                <Text style={appTheme.styles.smallActionText}>Snooze 3d</Text>
              </Pressable>
              <Pressable
                onPress={() => showDemoMessage('Approve expense')}
                style={appTheme.styles.approveAction}
              >
                <Text style={appTheme.styles.approveActionText}>Approve &amp; Log</Text>
              </Pressable>
            </View>
          </CardWidget>

          <Pressable
            onPress={() => showDemoMessage('Health routine')}
            style={appTheme.styles.walkCard}
          >
            <View style={appTheme.styles.walkIcon}>
              <MaterialCommunityIcons color={appTheme.colors.mint} name="walk" size={17} />
            </View>
            <View style={appTheme.styles.walkContent}>
              <View style={appTheme.styles.walkMeta}>
                <Text style={appTheme.styles.walkProvider}>Apple Health Target</Text>
                <Text style={appTheme.styles.walkTime}>·  3:30 PM</Text>
              </View>
              <Text style={appTheme.styles.walkTitle}>Afternoon 30-min Recovery Walk</Text>
            </View>
            <View style={appTheme.styles.walkChevron}>
              <Ionicons color={appTheme.colors.mutedBright} name="chevron-forward" size={17} />
            </View>
          </Pressable>
        </View>

        <View style={appTheme.styles.section}>
          <SectionHeading title="Ecosystem Status" meta="Synced 2m ago" />
          <View style={appTheme.styles.metricsGrid}>
            <MetricCardWidget
              title="Focus Gauge"
              icon="timer-sand"
              value="4.5"
              unit="hrs"
              detail="Target: 6.0 hrs"
              progress={75}
              style={appTheme.styles.metricCard}
            />
            <MetricCardWidget
              title="Cash Flow"
              icon="wallet-outline"
              value="$18,420"
              detail="+$1,250 net week"
              accent
              sparkline={[10, 12, 18, 15, 24, 30, 26, 38, 47]}
              style={appTheme.styles.metricCard}
            />
            <MetricCardWidget
              title="Recovery"
              icon="heart-pulse"
              value="92%"
              unit="Prime"
              detail="8h 12m sleep · 58 bpm"
              footerLabel="Readiness peak"
              style={appTheme.styles.metricCard}
            />
            <MetricCardWidget
              title="Autonomous"
              icon="robot-outline"
              value="3 runs"
              detail="Next: Wrap-up at 6 PM"
              accent
              footerLabel="All nodes active"
              footerAccent
              style={appTheme.styles.metricCard}
            />
          </View>
        </View>

        <View style={appTheme.styles.assistantSection}>
          <View style={appTheme.styles.promptCard}>
            <View style={appTheme.styles.assistantMark}>
              <MaterialCommunityIcons color={appTheme.colors.mintBright} name="auto-fix" size={18} />
            </View>
            <TextInput
              accessibilityLabel="Ask SeekPro"
              onChangeText={setPrompt}
              onSubmitEditing={() => showDemoMessage('SeekPro assistant')}
              placeholder="Ask SeekPro to reschedule, draft, or analyze..."
              placeholderTextColor={appTheme.overlays.neutral60}
              returnKeyType="send"
              style={appTheme.styles.promptInput}
              value={prompt}
            />
            <Pressable
              accessibilityLabel="Voice input"
              onPress={() => showDemoMessage('Voice input')}
              style={appTheme.styles.promptIconButton}
            >
              <Ionicons color={appTheme.colors.mutedBright} name="mic-outline" size={17} />
            </Pressable>
            <Pressable
              accessibilityLabel="Send directive"
              onPress={() => showDemoMessage('SeekPro assistant')}
              style={appTheme.styles.sendButton}
            >
              <Ionicons color={appTheme.colors.mintDark} name="arrow-up" size={18} />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={appTheme.styles.suggestions}
          >
            <Pressable onPress={() => setPrompt('Reschedule 2 PM meeting')} style={appTheme.styles.suggestion}>
              <MaterialCommunityIcons color={appTheme.colors.mint} name="clock-outline" size={15} />
              <Text style={appTheme.styles.suggestionText}>Reschedule 2 PM meeting</Text>
            </Pressable>
            <Pressable onPress={() => setPrompt('Summarize unread pings')} style={appTheme.styles.suggestion}>
              <MaterialCommunityIcons color={appTheme.colors.mint} name="message-check-outline" size={15} />
              <Text style={appTheme.styles.suggestionText}>Summarize unread pings</Text>
            </Pressable>
            <Pressable onPress={() => setPrompt('Log espresso')} style={appTheme.styles.suggestion}>
              <MaterialCommunityIcons color={appTheme.colors.mint} name="coffee-outline" size={15} />
              <Text style={appTheme.styles.suggestionText}>Log espresso</Text>
            </Pressable>
          </ScrollView>
        </View>
      </ScrollView>

      <MainBottomNavigation
        activeTab="today"
        onTabPress={(tab) => {
          if (tab === 'settings') {
            router.push('/profile' as Href);
            return;
          }
          if (tab === 'assistant') {
            router.push('/assistant-hub' as Href);
            return;
          }
          const featureNames = {
            focus: 'Focus',
            assistant: 'SeekPro assistant',
            insights: 'Insights',
            settings: 'Settings',
            today: 'Today',
          };
          const featureName = featureNames[tab];
          showDemoMessage(featureName);
        }}
      />
    </SafeAreaView>
  );
}
