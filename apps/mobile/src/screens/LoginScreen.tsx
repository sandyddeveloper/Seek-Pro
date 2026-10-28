import {
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from '../styles/login.style';
import { useThemedStyles } from '../lib/theme-context';

const PASSKEY_LENGTH = 4;

export default function LoginScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const [passkey, setPasskey] = useState('');
  const [isPasskeyEntryVisible, setIsPasskeyEntryVisible] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Manrope: Manrope_700Bold,
    ManropeMedium: Manrope_500Medium,
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
        setIsPasskeyEntryVisible(true);
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

  const handlePasskeyPress = () => {
    setPasskey('');
    setIsPasskeyEntryVisible(true);
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
        <View style={appTheme.styles.content}>
          <View style={appTheme.styles.header}>
            <View style={appTheme.styles.brand}>
              <Image
                source={require('../../assets/seekpro-mark.png')}
                contentFit="contain"
                style={appTheme.styles.brandLogo}
              />
              <Text style={appTheme.styles.brandName}>SeekPro</Text>
            </View>
            <Text style={appTheme.styles.headerLabel}>PRIVATE ACCESS</Text>
          </View>

          <View style={appTheme.styles.mainContent}>
            <View style={appTheme.styles.hero}>
              <View style={appTheme.styles.heroLogoFrame}>
                <Image
                  source={require('../../assets/seekpro-mark.png')}
                  contentFit="contain"
                  style={appTheme.styles.heroLogo}
                />
              </View>
              <Text style={appTheme.styles.title}>SeekPro</Text>
              <Text style={appTheme.styles.subtitle}>Executive Intelligence OS</Text>
            </View>

            <View style={appTheme.styles.authentication}>
              <View style={appTheme.styles.biometricRings}>
                <View style={appTheme.styles.outerRing} />
                <View style={appTheme.styles.middleRing} />
                <View style={appTheme.styles.fingerprintRing}>
                  <MaterialCommunityIcons
                    color={appTheme.colors.mint}
                    name="fingerprint"
                    size={52}
                  />
                </View>
              </View>

              <Text style={appTheme.styles.biometricTitle}>Biometric Access</Text>
              <Text style={appTheme.styles.biometricHint}>Touch sensor or authenticate below</Text>

              <Pressable
                accessibilityRole="button"
                disabled={isAuthenticating}
                onPress={handleBiometricSignIn}
                style={({ pressed }) => [
                  appTheme.styles.biometricButton,
                  pressed && appTheme.styles.pressed,
                  isAuthenticating && appTheme.styles.buttonDisabled,
                ]}
              >
                <MaterialCommunityIcons color={appTheme.colors.mintOn} name="fingerprint" size={21} />
                <Text style={appTheme.styles.biometricButtonText}>
                  {isAuthenticating ? 'Authenticating…' : 'Authenticate with Biometrics'}
                </Text>
              </Pressable>

              <View style={appTheme.styles.dividerRow}>
                <View style={appTheme.styles.divider} />
                <Text style={appTheme.styles.dividerLabel}>OR</Text>
                <View style={appTheme.styles.divider} />
              </View>

              {isPasskeyEntryVisible ? (
                <View style={appTheme.styles.passkeyPanel}>
                  <Text style={appTheme.styles.passkeyTitle}>Enter your passkey</Text>
                  <TextInput
                    accessibilityLabel="Four-digit passkey"
                    autoCapitalize="none"
                    autoFocus
                    keyboardType="number-pad"
                    maxLength={PASSKEY_LENGTH}
                    onChangeText={handlePasskeyChange}
                    placeholder="••••"
                    placeholderTextColor={appTheme.colors.muted}
                    secureTextEntry
                    selectTextOnFocus
                    style={appTheme.styles.passkeyInput}
                    value={passkey}
                  />
                  <Text style={appTheme.styles.demoHint}>Demo mode · any 4 digits will continue</Text>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  onPress={handlePasskeyPress}
                  style={({ pressed }) => [
                    appTheme.styles.passkeyButton,
                    pressed && appTheme.styles.pressed,
                  ]}
                >
                  <Ionicons color={appTheme.colors.mint} name="key-outline" size={20} />
                  <Text style={appTheme.styles.passkeyButtonText}>Use Passkey</Text>
                </Pressable>
              )}
            </View>
          </View>

          <View style={appTheme.styles.footer}>
            <View style={appTheme.styles.securityNote}>
              <Ionicons color={appTheme.colors.mint} name="shield-checkmark-outline" size={15} />
              <Text style={appTheme.styles.securityText}>Biometrics verified on this device · Demo access</Text>
            </View>
            <Text style={appTheme.styles.legalText}>
              Demo only · Biometrics verify this device, not an account.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
