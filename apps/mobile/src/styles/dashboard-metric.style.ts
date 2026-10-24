import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    color: '#bfc9c1',
    fontFamily: 'HankenGroteskSemiBold',
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  value: {
    color: '#e1e3e1',
    fontFamily: 'ManropeSemiBold',
    fontSize: 25,
    letterSpacing: -0.5,
  },
  unit: {
    color: '#bfc9c1',
    fontFamily: 'HankenGrotesk',
    fontSize: 12,
  },
  detail: {
    color: '#bfc9c1',
    fontFamily: 'HankenGrotesk',
    fontSize: 11,
  },
  accentDetail: {
    color: '#50df9c',
    fontFamily: 'HankenGroteskSemiBold',
  },
  progressTrack: {
    height: 6,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#323534',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#a0e8c2',
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
    backgroundColor: 'rgba(80, 223, 156, 0.7)',
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
    backgroundColor: '#a0e8c2',
  },
});
