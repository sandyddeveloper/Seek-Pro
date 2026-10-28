import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

type VoiceSessionOrbProps = {
  level: SharedValue<number>;
  diameter: number;
  canvasStyle: StyleProp<ViewStyle>;
  coreStyle: StyleProp<ViewStyle>;
  shellStyle: StyleProp<ViewStyle>;
  webShellStyle: StyleProp<ViewStyle>;
};

export default function VoiceSessionOrb({ coreStyle, webShellStyle }: VoiceSessionOrbProps) {
  return (
    <View style={webShellStyle}>
      <View style={coreStyle} />
    </View>
  );
}
