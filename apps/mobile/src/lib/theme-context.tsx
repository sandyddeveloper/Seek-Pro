import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getThemePreference, saveThemePreference } from './theme-storage';
import {
  getThemePalette,
  type ThemeFonts,
  type ResolvedThemeMode,
  type ThemeColors,
  type ThemeMode,
  type ThemeOverlays,
} from '../styles/theme.style';

const THEME_MODE_STORAGE_KEY = 'seekpro.theme-mode';

type ThemeContextValue = {
  colors: ThemeColors;
  overlays: ThemeOverlays;
  fontFamilies: ThemeFonts;
  mode: ResolvedThemeMode;
  preference: ThemeMode;
  setPreference: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemeMode>('system');
  const hasUserSelectedPreference = useRef(false);
  const mode =
    preference === 'system'
      ? systemColorScheme === 'light'
        ? 'light'
        : 'dark'
      : preference;
  const palette = useMemo(() => getThemePalette(mode), [mode]);

  useEffect(() => {
    let isMounted = true;

    const loadPreference = async () => {
      try {
        const storedPreference = await getThemePreference(THEME_MODE_STORAGE_KEY);
        if (
          isMounted &&
          !hasUserSelectedPreference.current &&
          (storedPreference === 'system' ||
            storedPreference === 'light' ||
            storedPreference === 'dark')
        ) {
          setPreferenceState(storedPreference);
        }
      } catch (error) {
        console.error('Unable to load the saved appearance preference.', error);
      }
    };

    void loadPreference();
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = useCallback((nextPreference: ThemeMode) => {
    hasUserSelectedPreference.current = true;
    setPreferenceState(nextPreference);
    void saveThemePreference(THEME_MODE_STORAGE_KEY, nextPreference).catch((error: unknown) => {
      console.error('Unable to save the appearance preference.', error);
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...palette,
      mode,
      preference,
      setPreference,
    }),
    [palette, mode, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }
  return theme;
}

export function useThemedStyles<T>(
  createStyles: (
    colors: ThemeColors,
    overlays: ThemeOverlays,
    fontFamilies: ThemeFonts,
  ) => T,
) {
  const theme = useTheme();
  const styles = useMemo(
    () => createStyles(theme.colors, theme.overlays, theme.fontFamilies),
    [createStyles, theme.colors, theme.overlays, theme.fontFamilies],
  );

  return { ...theme, styles };
}
