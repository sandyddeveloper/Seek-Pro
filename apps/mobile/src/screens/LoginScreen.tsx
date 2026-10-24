import {
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/login.style';

const PASSKEY_LENGTH = 4;

export default function LoginScreen() {
  const router = useRouter();
  const [passkey, setPasskey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Manrope: Manrope_700Bold,
    ManropeSemiBold: Manrope_600SemiBold,
    HankenGrotesk: HankenGrotesk_500Medium,
    HankenGroteskSemiBold: HankenGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load login screen fonts.', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (passkey.length === PASSKEY_LENGTH) {
      router.replace('/dashboard');
    }
  }, [passkey, router]);

  const handlePasskeyChange = (value: string) => {
    setPasskey(value.replace(/\D/g, '').slice(0, PASSKEY_LENGTH));
  };

  const handleBiometricSignIn = async () => {
    if (isAuthenticating) {
      return;
    }

    setIsAuthenticating(true);
    try {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Biometrics unavailable',
          'Set up fingerprint or device biometrics in your system settings, or use your passkey.',
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Continue to SeekPro',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use passkey',
      });

      if (result.success) {
        router.replace('/dashboard');
      } else if (result.error === 'user_fallback') {
        setPasskey('');
      } else if (
        result.error !== 'user_cancel' &&
        result.error !== 'system_cancel' &&
        result.error !== 'app_cancel'
      ) {
        Alert.alert('Could not verify', 'Please try biometric sign-in again.');
      }
    } catch (error) {
      console.error('Biometric sign-in failed.', error);
      Alert.alert('Sign-in unavailable', 'Please try again or use your passkey.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!fontsLoaded && !fontError) {
    return <View style={styles.safeArea} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.heroLogoFrame}>
              <Image
                source={require('../../assets/seekpro-mark.png')}
                contentFit="contain"
                style={styles.heroLogo}
              />
            </View>
            <Text style={styles.title}>Welcome to SeekPro</Text>
            <Text style={styles.subtitle}>Your personal operating system awaits</Text>
          </View>

          <View style={styles.authCard}>
            <View style={styles.secureBadge}>
              <Ionicons color="#50df9c" name="shield-checkmark-outline" size={14} />
              <Text style={styles.secureBadgeText}>DEMO SIGN-IN</Text>
            </View>

            <View style={styles.passkeyHeading}>
              <Text style={styles.passkeyTitle}>Enter your passkey</Text>
              <Text style={styles.passkeyHint}>Type your 4-digit code to continue</Text>
            </View>

            <View
              style={styles.passkeyInputContainer}
            >
              <TextInput
                accessibilityLabel="Four-digit passkey"
                autoFocus
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={PASSKEY_LENGTH}
                onChangeText={handlePasskeyChange}
                placeholder="••••"
                placeholderTextColor="#89938c"
                secureTextEntry
                selectTextOnFocus
                style={styles.passkeyInput}
                value={passkey}
              />
            </View>

            <Text style={styles.demoHint}>Demo mode · any 4 digits will continue</Text>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerLabel}>OR USE BIOMETRICS</Text>
              <View style={styles.divider} />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isAuthenticating}
              onPress={handleBiometricSignIn}
              style={({ pressed }) => [
                styles.biometricButton,
                pressed && styles.pressed,
                isAuthenticating && styles.biometricButtonDisabled,
              ]}
            >
              <View style={styles.fingerprintIcon}>
                <MaterialCommunityIcons color="#50df9c" name="fingerprint" size={27} />
              </View>
              <View style={styles.biometricCopy}>
                <Text style={styles.biometricTitle}>
                  {isAuthenticating ? 'Verifying…' : 'Use fingerprint'}
                </Text>
                <Text style={styles.biometricHint}>Verify securely on this device</Text>
              </View>
              <Ionicons color="#89938c" name="chevron-forward" size={18} />
            </Pressable>
          </View>

          <Text style={styles.legalText}>
            Demo only · biometrics verify this device, not an account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
