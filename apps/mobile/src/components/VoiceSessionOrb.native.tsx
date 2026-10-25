import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

const orbShaderSource = `
uniform float2 uResolution;
uniform float uTime;
uniform float uLevel;

half4 main(float2 fragCoord) {
  float2 uv = (fragCoord - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float time = uTime;
  float level = clamp(uLevel, 0.0, 1.0);
  float radius = 0.435 + 0.006 * sin(time * 0.72) + level * 0.014;
  float distanceFromCenter = length(uv);
  float sphereMask = 1.0 - smoothstep(radius - 0.003, radius + 0.003, distanceFromCenter);
  if (distanceFromCenter > radius + 0.01) {
    return half4(0.0);
  }
  float2 spherePoint = uv / max(radius, 0.001);
  float sphereDepth = sqrt(max(0.0, 1.0 - dot(spherePoint, spherePoint)));
  float3 normal = normalize(float3(spherePoint, sphereDepth));
  float3 lightDirection = normalize(float3(-0.48, -0.58, 0.92));
  float diffuse = max(dot(normal, lightDirection), 0.0);

  float movement = 0.022 + level * 0.026;
  float2 flow = uv + float2(
    sin(uv.y * 7.6 + time * 0.62),
    cos(uv.x * 6.8 - time * 0.48)
  ) * movement;
  float ribbonA = sin(flow.x * 13.0 + sin(flow.y * 7.2 + time * 0.58) * 2.1 + time * 0.3);
  float ribbonB = cos(flow.y * 10.0 - sin(flow.x * 8.1 - time * 0.44) * 1.7);
  float liquid = smoothstep(-0.45, 1.25, ribbonA + ribbonB);
  float2 corePosition = float2(
    0.018 * sin(time * 0.42),
    0.024 * cos(time * 0.35)
  );
  float core = exp(-dot(flow - corePosition, flow - corePosition) * 76.0);
  float innerGlow = exp(-distanceFromCenter * distanceFromCenter * 16.0);
  float rim = smoothstep(radius * 0.68, radius * 0.99, distanceFromCenter);
  float2 highlightPoint = uv - float2(-0.17, -0.22);
  float2 highlightShape = highlightPoint * float2(2.2, 2.8);
  float highlight = exp(-dot(highlightShape, highlightShape) * 8.0);
  float specular = pow(max(dot(reflect(-lightDirection, normal), float3(0.0, 0.0, 1.0)), 0.0), 20.0);

  float3 deepGlass = float3(0.008, 0.022, 0.021);
  float3 teal = float3(0.035, 0.24, 0.19);
  float3 mint = float3(0.42, 0.95, 0.72);
  float3 pearl = float3(0.9, 1.0, 0.96);
  float3 color = mix(deepGlass, teal, liquid * (0.3 + 0.42 * diffuse));
  color += mint * (0.12 * innerGlow + 0.22 * rim + 0.46 * core + 0.18 * liquid * diffuse);
  color += pearl * (0.34 * highlight + 0.2 * specular);
  color *= 0.76 + 0.3 * diffuse + 0.35 * level * core;

  float alpha = sphereMask * (0.88 + 0.12 * diffuse);
  return half4(half3(color * alpha), half(alpha));
}
`;

type VoiceSessionOrbProps = {
  level: SharedValue<number>;
  diameter: number;
  canvasStyle: StyleProp<ViewStyle>;
  coreStyle: StyleProp<ViewStyle>;
  shellStyle: StyleProp<ViewStyle>;
  webShellStyle: StyleProp<ViewStyle>;
};

export default function VoiceSessionOrb({ level, diameter, canvasStyle, shellStyle }: VoiceSessionOrbProps) {
  const clock = useClock();
  const uniforms = useDerivedValue(() => ({
    uResolution: [diameter, diameter],
    uTime: clock.get() / 1000,
    uLevel: level.get(),
  }));
  const effect = useMemo(() => {
    const compiledEffect = Skia.RuntimeEffect.Make(orbShaderSource);
    if (!compiledEffect) {
      throw new Error('Unable to compile the voice orb shader.');
    }
    return compiledEffect;
  }, []);

  return (
    <View style={shellStyle}>
      <Canvas
        android={{ surfaceType: 'TextureView' }}
        opaque={false}
        style={[{ backgroundColor: 'transparent' }, canvasStyle]}
      >
        <Fill>
          <Shader source={effect} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}
