import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160, 232, 194, 0.15)',
    backgroundColor: '#111413',
  },
  item: {
    minHeight: 52,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    color: '#89938c',
    fontFamily: 'HankenGroteskMedium',
    fontSize: 9,
  },
  activeLabel: {
    color: '#a0e8c2',
    fontFamily: 'HankenGroteskSemiBold',
    fontSize: 9,
  },
  assistantIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(80, 223, 156, 0.35)',
    backgroundColor: 'rgba(160, 232, 194, 0.1)',
  },
  assistantLabel: {
    color: '#50df9c',
    fontFamily: 'HankenGroteskSemiBold',
    fontSize: 9,
  },
});
