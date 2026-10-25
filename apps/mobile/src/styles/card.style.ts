import { type ThemeColors, type ThemeOverlays } from './theme.style';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors, overlays: ThemeOverlays) => StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: overlays.mintBright06,
    backgroundColor: colors.surface,
  },
});
