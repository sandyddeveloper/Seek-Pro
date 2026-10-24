import type { PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from '../../styles/card.style';

type CardWidgetProps = PropsWithChildren<{
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}>;

export default function CardWidget({
  accessibilityLabel,
  children,
  style,
}: CardWidgetProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, style]}
    >
      {children}
    </View>
  );
}
