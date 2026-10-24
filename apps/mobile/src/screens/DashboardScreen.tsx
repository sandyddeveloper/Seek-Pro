import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
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
import { styles } from '../styles/dashboard.style';
import CardWidget from '../widgets/common/card.widget';
import MetricCardWidget from '../widgets/dashboard/MetricCard.widget';

function SectionHeading({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {meta ? <Text style={styles.sectionMeta}>{meta}</Text> : null}
    </View>
  );
}

export default function DashboardScreen() {
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
    return <View style={styles.safeArea} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <Image
            source={require('../../assets/seekpro-mark.png')}
            contentFit="contain"
            style={styles.headerLogo}
          />
          <Text style={styles.brandEyebrow}>SeekPro</Text>
          <Text style={styles.headerTitle}>Today</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            onPress={() => showDemoMessage('Notifications')}
            style={styles.notificationButton}
          >
            <Ionicons color="#bfc9c1" name="notifications-outline" size={22} />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable
            accessibilityLabel="Profile"
            accessibilityRole="button"
            onPress={() => showDemoMessage('Profile')}
            style={styles.profileButton}
          >
            <Ionicons color="#003824" name="person-outline" size={19} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <Text style={styles.dateLabel}>Tuesday, Oct 24</Text>
          <Text style={styles.greetingTitle}>Good morning, Alex</Text>
        </View>

        <CardWidget style={styles.synthesisCard}>
          <View style={styles.synthesisHeader}>
            <View style={styles.synthesisTitleGroup}>
              <View style={styles.synthesisIconWrap}>
                <MaterialCommunityIcons color="#a0e8c2" name="auto-fix" size={17} />
              </View>
              <Text style={styles.synthesisTitle}>Executive Synthesis</Text>
            </View>
            <Text style={styles.timeBadge}>06:45 AM</Text>
          </View>
          <Text style={styles.synthesisBody}>
            SeekPro orchestrated your schedule: <Text style={styles.bodyHighlight}>3 core focus blocks</Text>
            {' '}protected, 2 financial alerts triaged, and biometrics peaked at{' '}
            <Text style={styles.bodyAccent}>92%</Text>. Your workspace is clear until{' '}
            <Text style={styles.bodyStrong}>10:30 AM.</Text>
          </Text>
          <View style={styles.synthesisFooter}>
            <Pressable
              accessibilityRole="button"
              onPress={() => showDemoMessage('Audio brief')}
              style={styles.audioButton}
            >
              <View style={styles.playCircle}>
                <Ionicons color="#003824" name="play" size={12} />
              </View>
              <Text style={styles.audioButtonText}>Listen to 90s Audio Brief</Text>
              <Feather color="#bfc9c1" name="headphones" size={14} />
            </Pressable>
            <Text style={styles.calmLabel}>Calm state active</Text>
          </View>
        </CardWidget>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionHeading title="Priority Focus Queue" meta="3 remaining" />
            <Pressable
              accessibilityLabel="Rearrange queue"
              accessibilityRole="button"
              onPress={() => showDemoMessage('Focus queue')}
              style={styles.tuneButton}
            >
              <MaterialCommunityIcons color="#bfc9c1" name="tune-variant" size={20} />
            </Pressable>
          </View>
          <CardWidget style={styles.taskCard}>
            <View style={styles.taskTop}>
              <View style={styles.taskIcon}>
                <MaterialCommunityIcons color="#50df9c" name="target" size={17} />
              </View>
              <View style={styles.taskContent}>
                <View style={styles.taskMetaRow}>
                  <Text style={styles.taskPriority}>Priority 1 · Deep Work</Text>
                  <Text style={styles.taskTime}>10:30 AM – 12:00 PM</Text>
                </View>
                <Text style={styles.taskTitle}>Finalize Q4 Product Roadmap &amp; Board Deck</Text>
                <View style={styles.taskBadges}>
                  <View style={styles.taskBadge}>
                    <MaterialCommunityIcons color="#a0e8c2" name="lock-clock" size={13} />
                    <Text style={styles.taskBadgeText}>Focus Lock</Text>
                  </View>
                  <View style={styles.taskBadge}>
                    <MaterialCommunityIcons color="#a0e8c2" name="calendar-check" size={13} />
                    <Text style={styles.taskBadgeText}>Calendar Synced</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.taskFooter}>
              <Text style={styles.initials}>F  K</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => showDemoMessage('Focus session')}
                style={styles.startFocusButton}
              >
                <Ionicons color="#003824" name="play-circle-outline" size={17} />
                <Text style={styles.startFocusText}>Start Focus Session</Text>
              </Pressable>
            </View>
          </CardWidget>

          <CardWidget style={styles.financeTaskCard}>
            <View style={styles.financeTaskTop}>
              <View style={styles.financeIcon}>
                <MaterialCommunityIcons color="#ffdeaa" name="receipt-text-outline" size={17} />
              </View>
              <View style={styles.financeContent}>
                <View style={styles.taskMetaRow}>
                  <Text style={styles.financeLabel}>Plaid Insight</Text>
                  <Text style={styles.taskTime}>Due Tomorrow</Text>
                </View>
                <Text style={styles.financeTitle}>Review $240 SaaS Renewal (Figma Enterprise)</Text>
                <Text style={styles.financeDescription}>
                  Seat utilization dropped 18% over the last 30 days.
                </Text>
              </View>
            </View>
            <View style={styles.financeActions}>
              <Pressable
                onPress={() => showDemoMessage('Snooze reminder')}
                style={styles.smallAction}
              >
                <Text style={styles.smallActionText}>Snooze 3d</Text>
              </Pressable>
              <Pressable
                onPress={() => showDemoMessage('Approve expense')}
                style={styles.approveAction}
              >
                <Text style={styles.approveActionText}>Approve &amp; Log</Text>
              </Pressable>
            </View>
          </CardWidget>

          <Pressable
            onPress={() => showDemoMessage('Health routine')}
            style={styles.walkCard}
          >
            <View style={styles.walkIcon}>
              <MaterialCommunityIcons color="#50df9c" name="walk" size={17} />
            </View>
            <View style={styles.walkContent}>
              <View style={styles.walkMeta}>
                <Text style={styles.walkProvider}>Apple Health Target</Text>
                <Text style={styles.walkTime}>·  3:30 PM</Text>
              </View>
              <Text style={styles.walkTitle}>Afternoon 30-min Recovery Walk</Text>
            </View>
            <View style={styles.walkChevron}>
              <Ionicons color="#bfc9c1" name="chevron-forward" size={17} />
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeading title="Ecosystem Status" meta="Synced 2m ago" />
          <View style={styles.metricsGrid}>
            <MetricCardWidget
              title="Focus Gauge"
              icon="timer-sand"
              value="4.5"
              unit="hrs"
              detail="Target: 6.0 hrs"
              progress={75}
              style={styles.metricCard}
            />
            <MetricCardWidget
              title="Cash Flow"
              icon="wallet-outline"
              value="$18,420"
              detail="+$1,250 net week"
              accent
              sparkline={[10, 12, 18, 15, 24, 30, 26, 38, 47]}
              style={styles.metricCard}
            />
            <MetricCardWidget
              title="Recovery"
              icon="heart-pulse"
              value="92%"
              unit="Prime"
              detail="8h 12m sleep · 58 bpm"
              footerLabel="Readiness peak"
              style={styles.metricCard}
            />
            <MetricCardWidget
              title="Autonomous"
              icon="robot-outline"
              value="3 runs"
              detail="Next: Wrap-up at 6 PM"
              accent
              footerLabel="All nodes active"
              footerAccent
              style={styles.metricCard}
            />
          </View>
        </View>

        <View style={styles.assistantSection}>
          <View style={styles.promptCard}>
            <View style={styles.assistantMark}>
              <MaterialCommunityIcons color="#a0e8c2" name="auto-fix" size={18} />
            </View>
            <TextInput
              accessibilityLabel="Ask SeekPro"
              onChangeText={setPrompt}
              onSubmitEditing={() => showDemoMessage('SeekPro assistant')}
              placeholder="Ask SeekPro to reschedule, draft, or analyze..."
              placeholderTextColor="rgba(191, 201, 193, 0.6)"
              returnKeyType="send"
              style={styles.promptInput}
              value={prompt}
            />
            <Pressable
              accessibilityLabel="Voice input"
              onPress={() => showDemoMessage('Voice input')}
              style={styles.promptIconButton}
            >
              <Ionicons color="#bfc9c1" name="mic-outline" size={17} />
            </Pressable>
            <Pressable
              accessibilityLabel="Send directive"
              onPress={() => showDemoMessage('SeekPro assistant')}
              style={styles.sendButton}
            >
              <Ionicons color="#003824" name="arrow-up" size={18} />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestions}
          >
            <Pressable onPress={() => setPrompt('Reschedule 2 PM meeting')} style={styles.suggestion}>
              <MaterialCommunityIcons color="#50df9c" name="clock-outline" size={15} />
              <Text style={styles.suggestionText}>Reschedule 2 PM meeting</Text>
            </Pressable>
            <Pressable onPress={() => setPrompt('Summarize unread pings')} style={styles.suggestion}>
              <MaterialCommunityIcons color="#50df9c" name="message-check-outline" size={15} />
              <Text style={styles.suggestionText}>Summarize unread pings</Text>
            </Pressable>
            <Pressable onPress={() => setPrompt('Log espresso')} style={styles.suggestion}>
              <MaterialCommunityIcons color="#50df9c" name="coffee-outline" size={15} />
              <Text style={styles.suggestionText}>Log espresso</Text>
            </Pressable>
          </ScrollView>
        </View>
      </ScrollView>

      <MainBottomNavigation
        activeTab="today"
        onTabPress={(tab) => {
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
