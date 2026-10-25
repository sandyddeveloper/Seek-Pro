import type { PropsWithChildren } from 'react';
import { useThemedStyles } from '../../lib/theme-context';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { createStyles } from '../../styles/card.style';

type CardWidgetProps = PropsWithChildren<{
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}>;

export default function CardWidget({
  accessibilityLabel,
  children,
  style,
}: CardWidgetProps) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[appTheme.styles.card, style]}
    >
      {children}
    </View>
  );
}
