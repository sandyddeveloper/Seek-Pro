import { HankenGrotesk_400Regular, HankenGrotesk_500Medium, HankenGrotesk_600SemiBold } from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioStream, requestRecordingPermissionsAsync, type AudioStreamBuffer } from 'expo-audio';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useFrameCallback, useSharedValue, type SharedValue } from 'react-native-reanimated';
import VoiceSessionOrb from '../components/VoiceSessionOrb';
import { useThemedStyles } from '../lib/theme-context';
import { createStyles } from '../styles/voice-listening.style';

const waveformHeights = [13, 23, 33, 19, 28, 12] as const;

function WaveformBar({
  height,
  index,
  isListening,
  level,
  style,
}: {
  height: number;
  index: number;
  isListening: boolean;
  level: SharedValue<number>;
  style: object;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isListening ? 1 : 0.35,
    transform: [{
      scaleY: isListening ? 0.35 + level.get() * (0.4 + (index % 3) * 0.18) : 0.35,
    }],
  }));

  return <Animated.View style={[style, { height }, animatedStyle]} />;
}

export default function VoiceListeningScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const orbDiameter = Math.min(320, windowWidth - 40) * 0.9;
  const [sessionStatus, setSessionStatus] = useState<
    'starting' | 'listening' | 'paused' | 'denied' | 'error' | 'unsupported'
  >(Platform.OS === 'web' ? 'unsupported' : 'paused');
  const isMounted = useRef(false);
  const sessionAttempt = useRef(0);
  const targetLevel = useSharedValue(0);
  const smoothedLevel = useSharedValue(0);
  const { stream } = useAudioStream({
    sampleRate: 24000,
    channels: 1,
    encoding: 'float32',
    onBuffer: useCallback((buffer: AudioStreamBuffer) => {
      const samples = new Float32Array(buffer.data);
      let energy = 0;
      let count = 0;
      for (let index = 0; index < samples.length; index += 8) {
        energy += samples[index] * samples[index];
        count += 1;
      }
      const rms = count > 0 ? Math.sqrt(energy / count) : 0;
      targetLevel.set(Math.min(1, Math.max(0, (rms - 0.006) * 13)));
    }, [targetLevel]),
  });
  const [fontsLoaded, fontError] = useFonts({
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
    HankenGrotesk: HankenGrotesk_400Regular,
    HankenGroteskMedium: HankenGrotesk_500Medium,
    HankenGroteskSemiBold: HankenGrotesk_600SemiBold,
  });

  const startListening = useCallback(async () => {
    if (Platform.OS === 'web') {
      return;
    }

    const attempt = ++sessionAttempt.current;
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!isMounted.current || attempt !== sessionAttempt.current) {
        return;
      }
      if (!permission.granted) {
        setSessionStatus('denied');
        return;
      }

      await stream.start();
      if (!isMounted.current || attempt !== sessionAttempt.current) {
        stream.stop();
        return;
      }
      setSessionStatus('listening');
    } catch (error) {
      if (!isMounted.current || attempt !== sessionAttempt.current) {
        return;
      }
      console.error('Unable to start voice microphone stream.', error);
      stream.stop();
      setSessionStatus('error');
    }
  }, [stream]);

  useFrameCallback(({ timeSincePreviousFrame }) => {
    'worklet';
    const elapsed = Math.min((timeSincePreviousFrame ?? 16) / 1000, 0.05);
    const easing = 1 - Math.exp(-elapsed * 9);
    smoothedLevel.set(smoothedLevel.get() + (targetLevel.get() - smoothedLevel.get()) * easing);
  });

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load Voice Listening fonts.', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      sessionAttempt.current += 1;
      targetLevel.set(0);
      if (Platform.OS !== 'web') {
        stream.stop();
      }
    };
  }, [startListening, stream, targetLevel]);

  const isListening = sessionStatus === 'listening';
  const statusText = {
    starting: 'Connecting to microphone…',
    listening: 'Microphone active · audio stays on this device',
    paused: 'Tap the microphone to begin listening.',
    denied: 'Microphone access is needed to start a voice session.',
    error: 'The microphone could not be started. Tap the microphone to retry.',
    unsupported: 'Live microphone input is available in the native app.',
  }[sessionStatus];

  const toggleListening = () => {
    if (Platform.OS === 'web') {
      return;
    }
    if (sessionStatus === 'listening' || sessionStatus === 'starting') {
      sessionAttempt.current += 1;
      stream.stop();
      targetLevel.set(0);
      setSessionStatus('paused');
      return;
    }
    setSessionStatus('starting');
    void startListening();
  };

  const showPreview = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  if (!fontsLoaded && !fontError) {
    return <View style={appTheme.styles.safeArea} />;
  }

  return (
    <SafeAreaView style={appTheme.styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style={appTheme.mode === 'dark' ? 'light' : 'dark'} />
      <View style={appTheme.styles.screen}>
        <View style={appTheme.styles.header}>
          <Pressable
            accessibilityLabel="Back to Assistant Hub"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={appTheme.styles.headerButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="chevron-back" size={23} />
          </Pressable>
          <Text style={appTheme.styles.headerTitle}>VOICE SESSION</Text>
          <Pressable
            accessibilityLabel="Voice session options"
            accessibilityRole="button"
            onPress={() => showPreview('Voice options', 'Voice settings are not connected in this preview.')}
            style={appTheme.styles.headerButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="ellipsis-horizontal" size={22} />
          </Pressable>
        </View>

        <View style={appTheme.styles.mainContent}>
          <Text style={appTheme.styles.listeningTitle}>
            {isListening ? "Go ahead, I'm listening…" : sessionStatus === 'starting' ? 'Starting voice session…' : 'Listening paused'}
          </Text>

          <View
            accessibilityLabel={isListening ? 'Microphone-reactive AI voice orb' : 'AI voice orb'}
            accessibilityRole="image"
            style={appTheme.styles.orbStage}
          >
            <View pointerEvents="none" style={appTheme.styles.orbGlowOuter} />
            <VoiceSessionOrb
              level={smoothedLevel}
              diameter={orbDiameter}
              canvasStyle={appTheme.styles.orbCanvas}
              coreStyle={appTheme.styles.orbWebCore}
              shellStyle={appTheme.styles.orbShell}
              webShellStyle={appTheme.styles.orbWebShell}
            />
          </View>

          <View style={appTheme.styles.waveform} accessibilityLabel="Microphone input level">
            {waveformHeights.map((height, index) => (
              <WaveformBar
                key={`${height}-${index}`}
                height={height}
                index={index}
                isListening={isListening}
                level={smoothedLevel}
                style={appTheme.styles.waveformBar}
              />
            ))}
          </View>

          <View style={appTheme.styles.transcriptBlock}>
            <Text style={appTheme.styles.transcript}>
              {isListening ? 'Speak naturally. I’m listening.' : 'Your voice session is ready when you are.'}
            </Text>
            <View style={appTheme.styles.agentStatus}>
              <MaterialCommunityIcons
                color={isListening ? appTheme.colors.mintBright : appTheme.colors.mutedBright}
                name="waveform"
                size={16}
              />
              <Text style={appTheme.styles.agentStatusText}>{statusText}</Text>
            </View>
          </View>

          <View style={appTheme.styles.suggestions}>
            {[
              { title: 'Refine fidelity', prompt: 'Refine fidelity' },
              { title: 'Export layout', prompt: 'Export layout' },
              { title: 'Switch model', prompt: 'Switch model' },
            ].map(({ title, prompt }) => (
              <Pressable
                accessibilityRole="button"
                key={title}
                onPress={() => showPreview(title, `“${prompt}” is a suggested action in this voice-session design preview.`)}
                style={({ pressed }) => [appTheme.styles.suggestionChip, pressed && appTheme.styles.pressed]}
              >
                <Text style={appTheme.styles.suggestionText}>{title}</Text>
              </Pressable>
            ))}
          </View>

          <View style={appTheme.styles.controls}>
            <Pressable
              accessibilityLabel="More voice tools"
              accessibilityRole="button"
              onPress={() => showPreview('Voice tools', 'Additional voice tools are not connected in this preview.')}
              style={({ pressed }) => [appTheme.styles.secondaryControl, pressed && appTheme.styles.pressed]}
            >
              <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="view-grid-outline" size={23} />
            </Pressable>
            <Pressable
              accessibilityLabel={isListening ? 'Pause voice listening' : 'Start voice listening'}
              accessibilityRole="button"
              accessibilityState={{ selected: isListening, disabled: sessionStatus === 'starting' }}
              disabled={sessionStatus === 'starting'}
              onPress={toggleListening}
              style={({ pressed }) => [
                appTheme.styles.primaryControl,
                !isListening && appTheme.styles.primaryControlPaused,
                pressed && appTheme.styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                color={appTheme.colors.mintOn}
                name={isListening ? 'microphone' : 'microphone-off'}
                size={29}
              />
            </Pressable>
            <Pressable
              accessibilityLabel="Open keyboard"
              accessibilityRole="button"
              onPress={() => showPreview('Keyboard input', 'Text chat is available from the Assistant Hub.')}
              style={({ pressed }) => [appTheme.styles.secondaryControl, pressed && appTheme.styles.pressed]}
            >
              <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="keyboard-outline" size={23} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
