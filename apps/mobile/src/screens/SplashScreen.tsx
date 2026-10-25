import {
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from '../styles/splash.style';
import { useThemedStyles } from '../lib/theme-context';

export default function SplashScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    Manrope: Manrope_700Bold,
    ManropeMedium: Manrope_500Medium,
    HankenGrotesk: HankenGrotesk_500Medium,
    HankenGroteskSemiBold: HankenGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load splash screen fonts.', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (!fontsLoaded && !fontError) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [fontError, fontsLoaded, router]);

  if (!fontsLoaded && !fontError) {
    return <View style={appTheme.styles.safeArea} />;
  }

  return (
    <SafeAreaView style={appTheme.styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar hidden />
      <View style={appTheme.styles.screen}>
        <View pointerEvents="none" style={appTheme.styles.ambientGlow}>
          <Image
            source={require('../../assets/ambient-glow.png')}
            contentFit="contain"
            style={appTheme.styles.glowImage}
          />
        </View>

        <View style={appTheme.styles.topBreathingRoom} />

        <View style={appTheme.styles.brandGroup}>
          <View accessible accessibilityLabel="SeekPro logo" style={appTheme.styles.logoOrbit}>
            <View style={appTheme.styles.outerOrbit} />
            <View style={appTheme.styles.orbitDot} />
            <View style={appTheme.styles.innerOrbit} />
            <View style={appTheme.styles.logoTile}>
              <Image
                source={require('../../assets/seekpro-mark.png')}
                contentFit="contain"
                style={appTheme.styles.logoImage}
              />
            </View>
          </View>

          <View style={appTheme.styles.wordmark}>
            <Text style={appTheme.styles.brandName}>Seek</Text>
            <Text style={appTheme.styles.brandAccent}>Pro</Text>
            <View style={appTheme.styles.wordmarkDot} />
          </View>
          <Text style={appTheme.styles.tagline}>Intelligent Executive Operating System</Text>
        </View>

        <View style={appTheme.styles.statusGroup}>
          <View style={appTheme.styles.statusLabel}>
            <View style={appTheme.styles.statusDot} />
            <Text style={appTheme.styles.statusText}>Neural Enclave Initialized</Text>
          </View>

          <View
            accessible
            accessibilityLabel="Initialization complete"
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: 100 }}
            style={appTheme.styles.progressTrack}
          >
            <View style={appTheme.styles.progressFill} />
          </View>

          <View style={appTheme.styles.versionRow}>
            <Text style={appTheme.styles.versionText}>SeekPro OS v2.4</Text>
            <Text style={appTheme.styles.separator}>·</Text>
            <Text style={appTheme.styles.versionText}>Hardware Enclave</Text>
          </View>
          <Text style={appTheme.styles.securityCaption}>
            Zero-Trace Architecture · Sovereign Layer
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}