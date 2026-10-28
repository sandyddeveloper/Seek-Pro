import { type ThemeColors, type ThemeFonts, type ThemeOverlays } from './theme.style';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: ThemeColors, overlays: ThemeOverlays, fontFamilies: ThemeFonts) => StyleSheet.create({
  card: {
    minHeight: 148,
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    color: colors.mutedBright,
    fontFamily: fontFamilies.hankenGroteskSemiBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  value: {
    color: colors.text,
    fontFamily: fontFamilies.manropeSemiBold,
    fontSize: 25,
    letterSpacing: -0.5,
  },
  unit: {
    color: colors.mutedBright,
    fontFamily: fontFamilies.hankenGrotesk,
    fontSize: 12,
  },
  detail: {
    color: colors.mutedBright,
    fontFamily: fontFamilies.hankenGrotesk,
    fontSize: 12,
  },
  accentDetail: {
    color: colors.mint,
    fontFamily: fontFamilies.hankenGroteskSemiBold,
  },
  progressTrack: {
    height: 6,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: colors.surfaceHigher,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.mintBright,
  },
  sparkline: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sparkBar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: overlays.mint70,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mintBright,
  },
});
