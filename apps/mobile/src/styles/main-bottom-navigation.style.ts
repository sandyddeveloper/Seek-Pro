import { type ThemeColors, type ThemeFonts, type ThemeOverlays } from './theme.style';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors, overlays: ThemeOverlays, fontFamilies: ThemeFonts) => StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: overlays.mintBright15,
    backgroundColor: colors.background,
  },
  item: {
    minHeight: 52,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    color: colors.muted,
    fontFamily: fontFamilies.hankenGroteskMedium,
    fontSize: 11,
  },
  activeLabel: {
    color: colors.mintBright,
    fontFamily: fontFamilies.hankenGroteskSemiBold,
    fontSize: 11,
  },
  assistantIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: overlays.mint35,
    backgroundColor: overlays.mintBright10,
  },
  assistantLogo: {
    width: 29,
    height: 29,
  },
  assistantLabel: {
    color: colors.mint,
    fontFamily: fontFamilies.hankenGroteskSemiBold,
    fontSize: 11,
  },
});
