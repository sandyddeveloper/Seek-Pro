import { HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold } from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter, type Href } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainBottomNavigation from '../components/MainBottomNavigation';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import { useThemedStyles } from '../lib/theme-context';
import { createStyles } from '../styles/assistant-hub.style';

const quickActions = [
  { label: 'Executive Brief', icon: 'auto-fix', prompt: 'Prepare my executive brief' },
  { label: 'Generate Report', icon: 'lightning-bolt', prompt: 'Generate a report' },
  { label: 'Web Research', icon: 'web', prompt: 'Research a topic on the web' },
] as const;

const recentSessions = [
  {
    title: 'Prepare Q3 strategic budget & brief',
    detail: 'Text session · Today, 10:45 AM',
    icon: 'message-text-outline',
  },
  {
    title: 'Voice briefing with SeekPro concierge',
    detail: 'Voice transcription · Yesterday, 4:15 PM',
    icon: 'waveform',
  },
] as const;

export default function AssistantHubScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
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
      console.error('Unable to load Assistant Hub fonts.', fontError);
    }
  }, [fontError]);

  const showPreview = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const submitPrompt = () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      showPreview('Ask SeekPro', 'Enter a question or brief to preview this action.');
      return;
    }

    Keyboard.dismiss();
    showPreview('Assistant preview', `“${trimmedPrompt}” is ready to send when the assistant service is connected.`);
  };

  const handleTabPress = (tab: MainNavigationTab) => {
    if (tab === 'today') {
      router.replace('/dashboard');
    } else if (tab === 'settings') {
      router.replace('/profile' as Href);
    } else if (tab === 'assistant') {
      return;
    } else {
      showPreview(tab === 'focus' ? 'Focus' : 'Insights', 'This destination is not available in the current preview.');
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={appTheme.styles.topBar}>
          <Pressable
            accessibilityLabel="Recent activity"
            accessibilityRole="button"
            onPress={() => showPreview('Recent activity', 'Your assistant activity will appear here.')}
            style={appTheme.styles.topBarButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="time-outline" size={21} />
          </Pressable>
          <Pressable
            accessibilityLabel="Assistant availability"
            accessibilityRole="button"
            onPress={() => showPreview('Assistant status', 'SeekPro AI is ready to assist.')}
            style={appTheme.styles.statusPill}
          >
            <View style={appTheme.styles.onlineDot} />
            <Text style={appTheme.styles.statusPillText}>ONLINE</Text>
          </Pressable>
          <View style={appTheme.styles.topBarSpacer} />
          <Image
            source={require('../../assets/seekpro-mark.png')}
            contentFit="contain"
            style={appTheme.styles.headerLogo}
          />
        </View>

        <View style={appTheme.styles.greetingActions}>
          <View style={appTheme.styles.greetingIdentity}>
            <View style={appTheme.styles.avatar}>
              <Ionicons color={appTheme.colors.mintBright} name="person" size={23} />
              <View style={appTheme.styles.avatarStatus} />
            </View>
            <View style={appTheme.styles.greetingCopy}>
              <Text style={appTheme.styles.eyebrow}>Welcome back</Text>
              <Text style={appTheme.styles.greeting}>Hey, SRK</Text>
            </View>
          </View>
          <View style={appTheme.styles.greetingActions}>
            <Pressable
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              onPress={() => showPreview('Notifications', 'You are all caught up.')}
              style={appTheme.styles.roundAction}
            >
              <Ionicons color={appTheme.colors.mutedBright} name="notifications-outline" size={19} />
            </Pressable>
            <Pressable
              accessibilityLabel="Assistant preferences"
              accessibilityRole="button"
              onPress={() => router.push('/assistant-preferences' as Href)}
              style={appTheme.styles.roundAction}
            >
              <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="tune-variant" size={20} />
            </Pressable>
          </View>
        </View>

        <View style={appTheme.styles.composer}>
          <Ionicons color={appTheme.colors.muted} name="search" size={18} />
          <TextInput
            accessibilityLabel="Ask SeekPro a question"
            onChangeText={setPrompt}
            onSubmitEditing={submitPrompt}
            placeholder="Ask a question or brief..."
            placeholderTextColor={appTheme.colors.muted}
            returnKeyType="send"
            style={appTheme.styles.composerInput}
            value={prompt}
          />
          <Pressable
            accessibilityLabel="Attach a file"
            accessibilityRole="button"
            onPress={() => showPreview('Attachments', 'File attachments are not available in this preview.')}
            style={appTheme.styles.composerAction}
          >
            <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="image-multiple-outline" size={20} />
          </Pressable>
          <Pressable
            accessibilityLabel="Send prompt"
            accessibilityRole="button"
            onPress={submitPrompt}
            style={appTheme.styles.composerAction}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="arrow-up" size={22} />
          </Pressable>
          <Pressable
            accessibilityLabel="Start voice input"
            accessibilityRole="button"
            onPress={() => router.push('/voice-listening' as Href)}
            style={appTheme.styles.voiceButton}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintOn} name="microphone" size={20} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={appTheme.styles.quickActions}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {quickActions.map((action, index) => (
            <Pressable
              accessibilityRole="button"
              key={action.label}
              onPress={() => setPrompt(action.prompt)}
              style={[
                appTheme.styles.quickAction,
                index === 0 && appTheme.styles.quickActionPrimary,
              ]}
            >
              <MaterialCommunityIcons
                color={index === 0 ? appTheme.colors.mintBright : appTheme.colors.mutedBright}
                name={action.icon}
                size={16}
              />
              <Text
                style={[
                  appTheme.styles.quickActionText,
                  index === 0 && appTheme.styles.quickActionTextPrimary,
                ]}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={appTheme.styles.featureGrid}>
          <View style={appTheme.styles.featureColumn}>
            <View style={appTheme.styles.companionCard}>
              <View style={appTheme.styles.orbWrap}>
                <View style={appTheme.styles.orbGlow} />
                <View style={appTheme.styles.orb}>
                  <Image
                    source={require('../../assets/seekpro-mark.png')}
                    contentFit="contain"
                    style={appTheme.styles.orbLogo}
                  />
                </View>
              </View>
              <Text style={appTheme.styles.companionTitle}>Meet your executive AI companion</Text>
              <Text numberOfLines={2} style={appTheme.styles.companionDescription}>
                Orchestrate focus blocks, synthesize schedules, and...
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/voice-listening' as Href)}
                style={({ pressed }) => [appTheme.styles.startButton, pressed && appTheme.styles.pressed]}
              >
                <Text style={appTheme.styles.startButtonText}>Start Talking</Text>
                <Ionicons color={appTheme.colors.mintOn} name="arrow-forward" size={17} />
              </Pressable>
            </View>
          </View>

          <View style={appTheme.styles.featureColumn}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/assistant-conversation' as Href)}
              style={({ pressed }) => [appTheme.styles.toolCard, appTheme.styles.chatCard, pressed && appTheme.styles.pressed]}
            >
              <View style={appTheme.styles.toolCardTop}>
                <View style={appTheme.styles.toolIcon}>
                  <Ionicons color={appTheme.colors.mintBright} name="chatbubble-outline" size={19} />
                </View>
                <View style={appTheme.styles.toolArrow}>
                  <Ionicons color={appTheme.colors.mutedBright} name="arrow-forward" size={17} />
                </View>
              </View>
              <Text style={appTheme.styles.toolTitle}>Start New Chat</Text>
              <Text style={appTheme.styles.toolDescription}>Instant synthesis</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => showPreview('AI Translation', 'Real-time voice translation is not connected in this preview.')}
              style={({ pressed }) => [appTheme.styles.toolCard, appTheme.styles.translationCard, pressed && appTheme.styles.pressed]}
            >
              <View style={appTheme.styles.toolCardTop}>
                <View style={appTheme.styles.toolIcon}>
                  <MaterialCommunityIcons color={appTheme.colors.mintBright} name="translate" size={19} />
                </View>
                <View style={appTheme.styles.toolArrow}>
                  <Ionicons color={appTheme.colors.mutedBright} name="arrow-forward" size={17} />
                </View>
              </View>
              <Text style={appTheme.styles.toolTitle}>AI Translation</Text>
              <Text style={appTheme.styles.toolDescription}>Real-time voice</Text>
            </Pressable>
          </View>
        </View>

        <View style={appTheme.styles.sessionsHeader}>
          <Text style={appTheme.styles.sessionsTitle}>Recent Sessions</Text>
          <View style={appTheme.styles.activeSessionsBadge}>
            <Text style={appTheme.styles.activeSessionsText}>2 active</Text>
          </View>
          <View style={appTheme.styles.sessionsSpacer} />
          <Pressable
            accessibilityRole="button"
            onPress={() => showPreview('Recent sessions', 'Your full session history will appear here.')}
            style={appTheme.styles.viewAllButton}
          >
            <Text style={appTheme.styles.viewAllText}>View all</Text>
            <Ionicons color={appTheme.colors.mutedBright} name="chevron-forward" size={14} />
          </Pressable>
        </View>

        <View style={appTheme.styles.sessionsList}>
          {recentSessions.map((session) => (
            <Pressable
              accessibilityRole="button"
              key={session.title}
              onPress={() => showPreview(session.title, 'This saved session is a local design preview.')}
              style={({ pressed }) => [appTheme.styles.sessionCard, pressed && appTheme.styles.pressed]}
            >
              <View style={appTheme.styles.sessionIcon}>
                <MaterialCommunityIcons color={appTheme.colors.mintBright} name={session.icon} size={20} />
              </View>
              <View style={appTheme.styles.sessionCopy}>
                <Text numberOfLines={1} style={appTheme.styles.sessionTitle}>{session.title}</Text>
                <Text style={appTheme.styles.sessionDescription}>{session.detail}</Text>
              </View>
              <Ionicons color={appTheme.colors.muted} name="arrow-forward" size={18} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <MainBottomNavigation activeTab="assistant" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
