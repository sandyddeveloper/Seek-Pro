import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import { Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainBottomNavigation from '../components/MainBottomNavigation';
import type { MainNavigationTab } from '../constants/main-navigation.constants';
import { createStyles } from '../styles/ai-memory.style';
import { useThemedStyles } from '../lib/theme-context';

type MemoryCategory = 'Communication' | 'Schedule' | 'Travel & Spend' | 'Habits';
type MemoryBadge = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type MemoryFact = {
  id: string;
  category: MemoryCategory;
  text: string;
  confidence: string;
  source: string;
  badge: MemoryBadge;
};

const initialFacts: MemoryFact[] = [
  {
    id: 'communication-1',
    category: 'Communication',
    text: 'Prefers bulleted executive summaries before 10:00 AM.',
    confidence: 'High Confidence (99%)',
    source: 'Learned via Calendar sync',
    badge: 'sync',
  },
  {
    id: 'communication-2',
    category: 'Communication',
    text: 'Prefers direct tone; skips conversational pleasantries in morning briefings.',
    confidence: 'User Stated Rule',
    source: 'Learned from feedback',
    badge: 'thumb-up-outline',
  },
  {
    id: 'schedule-1',
    category: 'Schedule',
    text: 'Deep focus blocks daily between 08:30 AM – 11:30 AM (no meeting interrupts).',
    confidence: 'Confirmed Rule',
    source: 'Hard constraint',
    badge: 'shield-check',
  },
  {
    id: 'schedule-2',
    category: 'Schedule',
    text: 'Gym workout scheduled Mon, Wed, Fri at 06:30 PM.',
    confidence: '94% Regularity',
    source: 'Apple Health & Calendar',
    badge: 'heart-pulse',
  },
  {
    id: 'travel-1',
    category: 'Travel & Spend',
    text: 'Flags any SaaS subscriptions renewing over $100.',
    confidence: 'Guarded Rule',
    source: 'Audited monthly',
    badge: 'shield-outline',
  },
  {
    id: 'travel-2',
    category: 'Travel & Spend',
    text: 'Prefers aisle seats and morning flights for regional travel.',
    confidence: 'Pattern Extracted',
    source: 'Extracted from receipts',
    badge: 'airplane',
  },
  {
    id: 'habits-1',
    category: 'Habits',
    text: 'Usually takes a short walk after lunch.',
    confidence: 'Pattern Extracted',
    source: 'Learned from routine',
    badge: 'walk',
  },
];

const categories = ['All', 'Communication', 'Schedule', 'Travel & Spend', 'Habits'] as const;
type CategoryFilter = (typeof categories)[number];

function IconBadge({
  name,
  color,
  style,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color?: string;
  style?: object;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={[appTheme.styles.iconBadge, style]}>
      <MaterialCommunityIcons color={color ?? appTheme.colors.mintBright} name={name} size={19} />
    </View>
  );
}

function MemoryFactCard({
  fact,
  onEdit,
  onDelete,
}: {
  fact: MemoryFact;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View style={appTheme.styles.factCard}>
      <Text style={appTheme.styles.factText}>{fact.text}</Text>
      <View style={appTheme.styles.factActions}>
        <View style={appTheme.styles.factMetadata}>
          <Text style={appTheme.styles.confidenceBadge}>{fact.confidence}</Text>
          <View style={appTheme.styles.sourceRow}>
            <MaterialCommunityIcons color={appTheme.colors.mintBright} name={fact.badge} size={13} />
            <Text style={appTheme.styles.sourceText}>{fact.source}</Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel="Edit memory"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onEdit}
          style={appTheme.styles.iconButton}
        >
          <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="pencil-outline" size={18} />
        </Pressable>
        <Pressable
          accessibilityLabel="Delete memory"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onDelete}
          style={appTheme.styles.iconButton}
        >
          <MaterialCommunityIcons color={appTheme.colors.mutedBright} name="trash-can-outline" size={18} />
        </Pressable>
      </View>
    </View>
  );
}

function MemorySection({
  category,
  facts,
  onEdit,
  onDelete,
}: {
  category: MemoryCategory;
  facts: MemoryFact[];
  onEdit: (fact: MemoryFact) => void;
  onDelete: (fact: MemoryFact) => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  if (facts.length === 0) {
    return null;
  }
  return (
    <View style={appTheme.styles.memorySection}>
      <View style={appTheme.styles.memorySectionHeader}>
        <View style={appTheme.styles.memorySectionTitleGroup}>
          <MaterialCommunityIcons color={appTheme.colors.mint} name="database-outline" size={18} />
          <Text style={appTheme.styles.memorySectionTitle}>{category} Preferences</Text>
        </View>
        <Text style={appTheme.styles.factCount}>{facts.length} facts</Text>
      </View>
      <View style={appTheme.styles.factsList}>
        {facts.map((fact) => (
          <MemoryFactCard
            key={fact.id}
            fact={fact}
            onDelete={() => onDelete(fact)}
            onEdit={() => onEdit(fact)}
          />
        ))}
      </View>
    </View>
  );
}

export default function AIMemoryScreen() {
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
  const [facts, setFacts] = useState(initialFacts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [isPaused, setIsPaused] = useState(false);
  const [retention, setRetention] = useState('Keep indefinitely');
  const [isRuleModalVisible, setRuleModalVisible] = useState(false);
  const [ruleText, setRuleText] = useState('');
  const [ruleCategory, setRuleCategory] = useState<MemoryCategory>('Communication');
  const [editingFact, setEditingFact] = useState<MemoryFact | null>(null);

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load AI memory screen fonts.', fontError);
    }
  }, [fontError]);

  const filteredFacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return facts.filter((fact) => {
      const matchesCategory = categoryFilter === 'All' || fact.category === categoryFilter;
      const matchesSearch = !query
        || fact.text.toLowerCase().includes(query)
        || fact.category.toLowerCase().includes(query)
        || fact.source.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, facts, search]);

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

  const handleDeleteFact = (fact: MemoryFact) => {
    Alert.alert('Delete memory?', 'This removes the selected fact from this local preview.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setFacts((current) => current.filter((item) => item.id !== fact.id)),
      },
    ]);
  };

  const saveRule = () => {
    const content = ruleText.trim();
    if (!content) {
      Alert.alert('Add a memory rule', 'Enter a short fact or preference to save.');
      return;
    }
    if (editingFact) {
      setFacts((current) => current.map((fact) => (
        fact.id === editingFact.id
          ? { ...fact, text: content, category: ruleCategory, confidence: 'User Stated Rule' }
          : fact
      )));
    } else {
      setFacts((current) => [
        ...current,
        {
          id: `custom-${Date.now()}`,
          category: ruleCategory,
          text: content,
          confidence: 'User Stated Rule',
          source: 'Added manually',
          badge: 'account-edit-outline',
        },
      ]);
    }
    setRuleText('');
    setEditingFact(null);
    setRuleModalVisible(false);
  };

  const openEditFact = (fact: MemoryFact) => {
    setEditingFact(fact);
    setRuleText(fact.text);
    setRuleCategory(fact.category);
    setRuleModalVisible(true);
  };

  const exportArchive = () => {
    Alert.alert('Export preview', 'Encrypted memory archive export is not connected yet.');
  };

  if (!fontsLoaded && !fontError) {
    return <View style={appTheme.styles.safeArea} />;
  }

  const factGroups = categories
    .filter((category): category is MemoryCategory => category !== 'All')
    .map((category) => ({
      category,
      items: filteredFacts.filter((fact) => fact.category === category),
    }));

  return (
    <SafeAreaView style={appTheme.styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style={appTheme.mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={appTheme.styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={appTheme.styles.topBar}>
          <View style={appTheme.styles.brand}>
            <View style={appTheme.styles.brandLogoWrap}>
              <ImageLogo />
            </View>
            <Text style={appTheme.styles.brandTitle}>AI Assistant</Text>
          </View>
          <View style={appTheme.styles.activeBadge}>
            <View style={appTheme.styles.activeDot} />
            <Text style={appTheme.styles.activeText}>Active</Text>
          </View>
        </View>

        <View style={appTheme.styles.screenMetaRow}>
          <Pressable
            accessibilityLabel="Back to assistant preferences"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={appTheme.styles.backButton}
          >
            <Ionicons color={appTheme.colors.mutedBright} name="arrow-back" size={20} />
          </Pressable>
          <View style={appTheme.styles.memoryActiveBadge}>
            <View style={appTheme.styles.activeDot} />
            <Text style={appTheme.styles.memoryActiveText}>{facts.length} Memories Active</Text>
          </View>
        </View>

        <View style={appTheme.styles.titleBlock}>
          <Text style={appTheme.styles.pageTitle}>Manage AI Memory</Text>
          <Text style={appTheme.styles.subtitle}>
            Review, edit, or purge what SeekPro remembers across your workflows and habits.
          </Text>
        </View>

        <View style={appTheme.styles.statsCard}>
          <View style={appTheme.styles.statsRow}>
            <View style={appTheme.styles.statItem}>
              <Text style={appTheme.styles.statValue}>{facts.length}</Text>
              <Text style={appTheme.styles.statLabel}>Saved Facts</Text>
            </View>
            <View style={appTheme.styles.statItem}>
              <Text style={[appTheme.styles.statValue, appTheme.styles.confidenceValue]}>98.4%</Text>
              <Text style={appTheme.styles.statLabel}>Confidence</Text>
            </View>
            <View style={appTheme.styles.statItem}>
              <Text style={appTheme.styles.capacityValue}>
                {facts.length}<Text style={appTheme.styles.capacityTotal}>/500</Text>
              </Text>
              <Text style={appTheme.styles.statLabel}>Capacity</Text>
            </View>
          </View>
          <View style={appTheme.styles.indexLabels}>
            <Text style={appTheme.styles.indexLabel}>Memory Synaptic Index</Text>
            <Text style={appTheme.styles.indexPercent}>{((facts.length / 500) * 100).toFixed(1)}% Allocated</Text>
          </View>
          <View
            accessibilityLabel={`Memory capacity ${facts.length} of 500`}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 500, now: facts.length }}
            style={appTheme.styles.progressTrack}
          >
            <View style={[appTheme.styles.progressFill, { width: `${Math.min(facts.length / 5, 100)}%` }]} />
          </View>
        </View>

        <View style={appTheme.styles.searchBox}>
          <Ionicons color={appTheme.colors.muted} name="search" size={19} />
          <TextInput
            accessibilityLabel="Search AI memories"
            onChangeText={setSearch}
            placeholder="Search memories, facts, or habits..."
            placeholderTextColor={appTheme.colors.muted}
            returnKeyType="search"
            style={appTheme.styles.searchInput}
            value={search}
          />
          {search ? (
            <Pressable
              accessibilityLabel="Clear search"
              onPress={() => setSearch('')}
              style={appTheme.styles.clearSearch}
            >
              <Ionicons color={appTheme.colors.muted} name="close-circle" size={18} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={appTheme.styles.filterList}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityState={{ selected: categoryFilter === category }}
              onPress={() => setCategoryFilter(category)}
              style={[appTheme.styles.filterChip, categoryFilter === category && appTheme.styles.filterChipActive]}
            >
              <Text
                style={[
                  appTheme.styles.filterText,
                  categoryFilter === category && appTheme.styles.filterTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={appTheme.styles.controlsCard}>
          <View style={appTheme.styles.controlRow}>
            <IconBadge name="pause-circle-outline" />
            <View style={appTheme.styles.controlCopy}>
              <Text style={appTheme.styles.controlTitle}>Pause Memory Collection</Text>
              <Text style={appTheme.styles.controlDescription}>
                Temporarily stop recording prompts, routines, and contextual facts.
              </Text>
            </View>
            <ToggleSwitch value={isPaused} onToggle={() => setIsPaused((value) => !value)} />
          </View>
          <View style={appTheme.styles.divider} />
          <View style={appTheme.styles.controlRow}>
            <IconBadge name="history" />
            <View style={appTheme.styles.retentionCopy}>
              <Text style={appTheme.styles.controlTitle}>Retention Window</Text>
              <Text style={appTheme.styles.controlDescription}>
                Auto-archive inactive context to preserve relevance.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                const options = ['Keep indefinitely', '90 Days', '180 Days', '1 Year'];
                const current = options.indexOf(retention);
                setRetention(options[(current + 1) % options.length]);
              }}
              style={appTheme.styles.retentionSelector}
            >
              <Text style={appTheme.styles.retentionValue}>{retention}</Text>
              <Ionicons color={appTheme.colors.mutedBright} name="chevron-down" size={15} />
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setEditingFact(null);
            setRuleText('');
            setRuleCategory('Communication');
            setRuleModalVisible(true);
          }}
          style={({ pressed }) => [appTheme.styles.addRuleButton, pressed && appTheme.styles.pressed]}
        >
          <MaterialCommunityIcons color={appTheme.colors.mintBright} name="plus-circle-outline" size={19} />
          <Text style={appTheme.styles.addRuleText}>Teach SeekPro a Custom Rule</Text>
        </Pressable>

        {factGroups.map(({ category, items }) => (
          <MemorySection
            key={category}
            category={category}
            facts={items}
            onDelete={handleDeleteFact}
            onEdit={openEditFact}
          />
        ))}
        {filteredFacts.length === 0 ? (
          <View style={appTheme.styles.emptyState}>
            <MaterialCommunityIcons color={appTheme.colors.muted} name="text-search" size={26} />
            <Text style={appTheme.styles.emptyTitle}>No matching memories</Text>
            <Text style={appTheme.styles.emptyText}>Try another search or choose a different category.</Text>
          </View>
        ) : null}

        <View style={appTheme.styles.archiveSection}>
          <Text style={appTheme.styles.sectionLabel}>Synaptic Archive &amp; Reset</Text>
          <Pressable
            accessibilityRole="button"
            onPress={exportArchive}
            style={({ pressed }) => [appTheme.styles.archiveCard, pressed && appTheme.styles.pressed]}
          >
            <IconBadge name="download-outline" />
            <View style={appTheme.styles.archiveCopy}>
              <Text style={appTheme.styles.archiveTitle}>Export Memory Archive</Text>
              <Text style={appTheme.styles.controlDescription}>Download encrypted JSON bundle (1.2 MB)</Text>
            </View>
            <Text style={appTheme.styles.exportLabel}>Export</Text>
          </Pressable>
          <View style={appTheme.styles.purgeCard}>
            <View style={appTheme.styles.purgeHeading}>
              <IconBadge
                name="alert-outline"
                color={appTheme.colors.dangerBright}
                style={appTheme.styles.warningIcon}
              />
              <View style={appTheme.styles.archiveCopy}>
                <Text style={appTheme.styles.archiveTitle}>Purge Memory Vault</Text>
                <Text style={appTheme.styles.controlDescription}>
                  Irreversibly wipe all {facts.length} facts across personal, habit, and workflow intelligence vectors.
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert(
                'Purge Synaptic Memory?',
                `This demo will permanently remove all ${facts.length} visible facts.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: `Wipe All ${facts.length} Facts`,
                    style: 'destructive',
                    onPress: () => setFacts([]),
                  },
                ],
              )}
              style={({ pressed }) => [appTheme.styles.clearAllButton, pressed && appTheme.styles.pressed]}
            >
              <MaterialCommunityIcons color={appTheme.colors.dangerText} name="delete-forever-outline" size={18} />
              <Text style={appTheme.styles.clearAllText}>Clear All Memories</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <MainBottomNavigation
        activeTab="assistant"
        onTabPress={handleTabPress}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setRuleModalVisible(false)}
        transparent
        visible={isRuleModalVisible}
      >
        <View style={appTheme.styles.modalOverlay}>
          <View style={appTheme.styles.modalCard}>
            <View style={appTheme.styles.modalHeader}>
              <Text style={appTheme.styles.modalTitle}>
                {editingFact ? 'Edit Memory Rule' : 'Teach New Rule'}
              </Text>
              <Pressable
                accessibilityLabel="Close"
                onPress={() => setRuleModalVisible(false)}
                style={appTheme.styles.iconButton}
              >
                <Ionicons color={appTheme.colors.mutedBright} name="close" size={21} />
              </Pressable>
            </View>
            <Text style={appTheme.styles.modalDescription}>
              Type what you would like SeekPro to remember about your schedule, habits, or preferences.
            </Text>
            <Text style={appTheme.styles.modalFieldLabel}>Memory Rule</Text>
            <TextInput
              accessibilityLabel="Memory rule"
              multiline
              onChangeText={setRuleText}
              placeholder="e.g. Keep Fridays free of meetings"
              placeholderTextColor={appTheme.colors.muted}
              style={appTheme.styles.ruleInput}
              value={ruleText}
            />
            <Text style={appTheme.styles.modalFieldLabel}>Category</Text>
            <View style={appTheme.styles.modalCategories}>
              {categories.filter((item) => item !== 'All').map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setRuleCategory(item)}
                  style={[
                    appTheme.styles.modalCategory,
                    ruleCategory === item && appTheme.styles.modalCategoryActive,
                  ]}
                >
                  <Text
                    style={[
                      appTheme.styles.modalCategoryText,
                      ruleCategory === item && appTheme.styles.modalCategoryTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={appTheme.styles.modalActions}>
              <Pressable onPress={() => setRuleModalVisible(false)} style={appTheme.styles.cancelButton}>
                <Text style={appTheme.styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveRule} style={appTheme.styles.saveButton}>
                <Text style={appTheme.styles.saveText}>Save Rule</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ToggleSwitch({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <Pressable
      accessibilityLabel={`Memory collection ${value ? 'paused' : 'active'}`}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={onToggle}
      style={[appTheme.styles.switchTrack, value ? appTheme.styles.switchOn : appTheme.styles.switchOff]}
    >
      <View style={[appTheme.styles.switchThumb, value && appTheme.styles.switchThumbOn]} />
    </Pressable>
  );
}

function ImageLogo() {
  const appTheme = useThemedStyles(createStyles);
  return (
    <Image
      contentFit="contain"
      source={require('../../assets/seekpro-mark.png')}
      style={appTheme.styles.brandLogo}
    />
  );
}
