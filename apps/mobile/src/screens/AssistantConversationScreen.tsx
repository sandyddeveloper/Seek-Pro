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
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '../lib/theme-context';
import { createStyles } from '../styles/assistant-conversation.style';

type ConversationMessage = {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
};

const suggestedPrompts = [
  'What can you do?',
  'Trending UI design?',
  'Here to make AI feel human?',
] as const;

const toolActions = [
  { label: 'Homework', icon: 'checkbox-marked-circle-outline' },
  { label: 'AI Image', icon: 'image-outline' },
  { label: 'Edit Image', icon: 'auto-fix' },
] as const;

const additionalPrompts = [
  'Help me plan my day',
  'Summarize my priorities',
  'Draft a thoughtful reply',
] as const;

export default function AssistantConversationScreen() {
  const appTheme = useThemedStyles(createStyles);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [showMorePrompts, setShowMorePrompts] = useState(false);
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
      console.error('Unable to load Assistant Conversation fonts.', fontError);
    }
  }, [fontError]);

  const showPreview = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const sendMessage = (message = prompt) => {
    const text = message.trim();
    if (!text) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), text, sender: 'user' },
      {
        id: Date.now() + 1,
        text: 'I’m ready to help. Connect the assistant service to get a personalized response.',
        sender: 'assistant',
      },
    ]);
    setPrompt('');
    Keyboard.dismiss();
  };

  if (!fontsLoaded && !fontError) {
    return <View style={appTheme.styles.safeArea} />;
  }

  return (
    <SafeAreaView style={appTheme.styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style={appTheme.mode === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={appTheme.styles.screen}
      >
        <View style={appTheme.styles.header}>
          <View style={appTheme.styles.headerBrand}>
            <Image
              source={require('../../assets/seekpro-mark.png')}
              contentFit="contain"
              style={appTheme.styles.headerLogo}
            />
          </View>
          <Pressable
            accessibilityLabel="Conversation options"
            accessibilityRole="button"
            onPress={() => showPreview('Conversation options', 'Conversation settings are not connected in this preview.')}
            style={appTheme.styles.headerButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="ellipsis-horizontal" size={21} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={appTheme.styles.conversationContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={appTheme.styles.welcome}>
              <View style={appTheme.styles.orbStage}>
                <View style={appTheme.styles.orbGlow} />
                <View style={appTheme.styles.orb}>
                  <View style={appTheme.styles.orbCore}>
                    <View style={appTheme.styles.orbHighlight} />
                    <View style={appTheme.styles.orbWave} />
                  </View>
                </View>
              </View>
              <Text style={appTheme.styles.title}>Hi, I&apos;m SeekPro</Text>
              <Text style={appTheme.styles.subtitle}>Let&apos;s talk, imagine, and grow together.</Text>

              <View style={appTheme.styles.promptSuggestions}>
                {suggestedPrompts.slice(0, 2).map((suggestion) => (
                  <Pressable
                    accessibilityRole="button"
                    key={suggestion}
                    onPress={() => sendMessage(suggestion)}
                    style={({ pressed }) => [appTheme.styles.promptChip, pressed && appTheme.styles.pressed]}
                  >
                    <Text style={appTheme.styles.promptChipText}>{suggestion}</Text>
                  </Pressable>
                ))}
                <View style={appTheme.styles.promptRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => sendMessage(suggestedPrompts[2])}
                    style={({ pressed }) => [appTheme.styles.promptChip, pressed && appTheme.styles.pressed]}
                  >
                    <Text style={appTheme.styles.promptChipText}>{suggestedPrompts[2]}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: showMorePrompts }}
                    onPress={() => setShowMorePrompts((visible) => !visible)}
                    style={appTheme.styles.moreChip}
                  >
                    <Text style={appTheme.styles.moreChipText}>{showMorePrompts ? 'Less' : 'More'}</Text>
                    <Ionicons
                      color={appTheme.colors.mintBright}
                      name={showMorePrompts ? 'chevron-up' : 'chevron-down'}
                      size={14}
                    />
                  </Pressable>
                </View>
                {showMorePrompts
                  ? additionalPrompts.map((suggestion) => (
                      <Pressable
                        accessibilityRole="button"
                        key={suggestion}
                        onPress={() => sendMessage(suggestion)}
                        style={({ pressed }) => [appTheme.styles.promptChip, pressed && appTheme.styles.pressed]}
                      >
                        <Text style={appTheme.styles.promptChipText}>{suggestion}</Text>
                      </Pressable>
                    ))
                  : null}
              </View>

              <View style={appTheme.styles.toolActions}>
                {toolActions.map((tool) => (
                  <Pressable
                    accessibilityRole="button"
                    key={tool.label}
                    onPress={() => showPreview(tool.label, `${tool.label} is not connected in this preview.`)}
                    style={({ pressed }) => [appTheme.styles.toolChip, pressed && appTheme.styles.pressed]}
                  >
                    <MaterialCommunityIcons
                      color={appTheme.colors.mintBright}
                      name={tool.icon}
                      size={17}
                    />
                    <Text style={appTheme.styles.toolChipText}>{tool.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={appTheme.styles.messageList}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    appTheme.styles.messageRow,
                    message.sender === 'user' && appTheme.styles.userMessageRow,
                  ]}
                >
                  {message.sender === 'assistant' ? (
                    <View style={appTheme.styles.messageAvatar}>
                      <Image
                        source={require('../../assets/seekpro-mark.png')}
                        contentFit="contain"
                        style={appTheme.styles.messageAvatarLogo}
                      />
                    </View>
                  ) : null}
                  <View
                    style={[
                      appTheme.styles.messageBubble,
                      message.sender === 'user' ? appTheme.styles.userBubble : appTheme.styles.assistantBubble,
                    ]}
                  >
                    <Text
                      style={[
                        appTheme.styles.messageText,
                        message.sender === 'user' && appTheme.styles.userMessageText,
                      ]}
                    >
                      {message.text}
                    </Text>
                    {message.sender === 'assistant' ? (
                      <Text style={appTheme.styles.demoLabel}>Preview response · not connected</Text>
                    ) : null}
                  </View>
                </View>
              ))}
              <View style={appTheme.styles.followUpSection}>
                <Text style={appTheme.styles.followUpTitle}>Suggested follow-ups</Text>
                {additionalPrompts.slice(0, 2).map((suggestion) => (
                  <Pressable
                    accessibilityRole="button"
                    key={suggestion}
                    onPress={() => sendMessage(suggestion)}
                    style={appTheme.styles.followUpChip}
                  >
                    <Text style={appTheme.styles.promptChipText}>{suggestion}</Text>
                    <Ionicons color={appTheme.colors.mintBright} name="arrow-up" size={15} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={appTheme.styles.composer}>
          <Pressable
            accessibilityLabel="Add attachment"
            accessibilityRole="button"
            onPress={() => showPreview('Attachments', 'Attachments are not available in this preview.')}
            style={appTheme.styles.composerIconButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="add" size={24} />
          </Pressable>
          <TextInput
            accessibilityLabel="Type your message"
            multiline
            onChangeText={setPrompt}
            onSubmitEditing={() => sendMessage()}
            placeholder="Type your message..."
            placeholderTextColor={appTheme.colors.muted}
            returnKeyType="send"
            style={appTheme.styles.composerInput}
            value={prompt}
          />
          <Pressable
            accessibilityLabel="Open voice listening"
            accessibilityRole="button"
            onPress={() => router.push('/voice-listening' as Href)}
            style={appTheme.styles.composerIconButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="mic-outline" size={21} />
          </Pressable>
          <Pressable
            accessibilityLabel="Send message"
            accessibilityRole="button"
            disabled={!prompt.trim()}
            onPress={() => sendMessage()}
            style={({ pressed }) => [
              appTheme.styles.sendButton,
              !prompt.trim() && appTheme.styles.sendButtonDisabled,
              pressed && appTheme.styles.pressed,
            ]}
          >
            <MaterialCommunityIcons color={appTheme.colors.mintOn} name="waveform" size={21} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}
