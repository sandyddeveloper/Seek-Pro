import {
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/splash.style';

export default function SplashScreen() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    Manrope: Manrope_700Bold,
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
    return <View style={styles.safeArea} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar hidden />
      <View style={styles.screen}>
        <View pointerEvents="none" style={styles.ambientGlow}>
          <Image
            source={require('../../assets/ambient-glow.png')}
            contentFit="contain"
            style={styles.glowImage}
          />
        </View>

        <View style={styles.topBreathingRoom} />

        <View style={styles.brandGroup}>
          <View accessible accessibilityLabel="SeekPro logo" style={styles.logoOrbit}>
            <View style={styles.outerOrbit} />
            <View style={styles.orbitDot} />
            <View style={styles.innerOrbit} />
            <View style={styles.logoTile}>
              <Image
                source={require('../../assets/seekpro-mark.png')}
                contentFit="contain"
                style={styles.logoImage}
              />
            </View>
          </View>

          <View style={styles.wordmark}>
            <Text style={styles.brandName}>Seek</Text>
            <Text style={styles.brandAccent}>Pro</Text>
            <View style={styles.wordmarkDot} />
          </View>
          <Text style={styles.tagline}>Intelligent Executive Operating System</Text>
        </View>

        <View style={styles.statusGroup}>
          <View style={styles.statusLabel}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Neural Enclave Initialized</Text>
          </View>

          <View
            accessible
            accessibilityLabel="Initialization complete"
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: 100 }}
            style={styles.progressTrack}
          >
            <View style={styles.progressFill} />
          </View>

          <View style={styles.versionRow}>
            <Text style={styles.versionText}>SeekPro OS v2.4</Text>
            <Text style={styles.separator}>·</Text>
            <Text style={styles.versionText}>Hardware Enclave</Text>
          </View>
          <Text style={styles.securityCaption}>
            Zero-Trace Architecture · Sovereign Layer
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}