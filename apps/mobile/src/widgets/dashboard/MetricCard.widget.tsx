import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemedStyles } from '../../lib/theme-context';
import type { ComponentProps } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import CardWidget from '../common/card.widget';
import { createStyles } from '../../styles/dashboard-metric.style';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type MetricCardWidgetProps = {
  title: string;
  icon: IconName;
  value: string;
  unit?: string;
  detail: string;
  accent?: boolean;
  progress?: number;
  sparkline?: number[];
  footerLabel?: string;
  footerAccent?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function MetricCardWidget({
  title,
  icon,
  value,
  unit,
  detail,
  accent = false,
  progress,
  sparkline,
  footerLabel,
  footerAccent = false,
  style,
}: MetricCardWidgetProps) {
  const appTheme = useThemedStyles(createStyles);
  return (
    <CardWidget style={[appTheme.styles.card, style]}>
      <View style={appTheme.styles.header}>
        <Text style={appTheme.styles.title}>{title}</Text>
        <MaterialCommunityIcons
          color={accent ? appTheme.colors.mint : appTheme.colors.mintBright}
          name={icon}
          size={19}
        />
      </View>
      <View>
        <View style={appTheme.styles.valueRow}>
          <Text style={appTheme.styles.value}>{value}</Text>
          {unit ? <Text style={appTheme.styles.unit}>{unit}</Text> : null}
        </View>
        <Text style={[appTheme.styles.detail, accent && appTheme.styles.accentDetail]}>{detail}</Text>
      </View>
      {typeof progress === 'number' ? (
        <View
          accessibilityLabel={`${title} progress: ${progress}%`}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          style={appTheme.styles.progressTrack}
        >
          <View style={[appTheme.styles.progressFill, { width: `${progress}%` }]} />
        </View>
      ) : null}
      {sparkline ? (
        <View accessibilityLabel={`${title} trend`} style={appTheme.styles.sparkline}>
          {sparkline.map((height, index) => (
            <View key={index} style={[appTheme.styles.sparkBar, { height }]} />
          ))}
        </View>
      ) : null}
      {footerLabel ? (
        <View style={appTheme.styles.footer}>
          <View style={appTheme.styles.footerDot} />
          <Text style={[appTheme.styles.detail, footerAccent && appTheme.styles.accentDetail]}>
            {footerLabel}
          </Text>
        </View>
      ) : null}
    </CardWidget>
  );
}
