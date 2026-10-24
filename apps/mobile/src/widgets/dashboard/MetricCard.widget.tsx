import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import CardWidget from '../common/card.widget';
import { styles } from '../../styles/dashboard-metric.style';

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
  return (
    <CardWidget style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <MaterialCommunityIcons
          color={accent ? '#50df9c' : '#a0e8c2'}
          name={icon}
          size={19}
        />
      </View>
      <View>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
        <Text style={[styles.detail, accent && styles.accentDetail]}>{detail}</Text>
      </View>
      {typeof progress === 'number' ? (
        <View
          accessibilityLabel={`${title} progress: ${progress}%`}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          style={styles.progressTrack}
        >
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      ) : null}
      {sparkline ? (
        <View accessibilityLabel={`${title} trend`} style={styles.sparkline}>
          {sparkline.map((height, index) => (
            <View key={index} style={[styles.sparkBar, { height }]} />
          ))}
        </View>
      ) : null}
      {footerLabel ? (
        <View style={styles.footer}>
          <View style={styles.footerDot} />
          <Text style={[styles.detail, footerAccent && styles.accentDetail]}>
            {footerLabel}
          </Text>
        </View>
      ) : null}
    </CardWidget>
  );
}
