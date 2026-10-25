import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../lib/theme-context';

function AppStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 320,
        contentStyle: {
          backgroundColor: colors.backgroundProfile,
        },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}
