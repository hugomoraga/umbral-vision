/**
 * Organic Structures — mesh paramétrico con displacement orgánico.
 *
 * v0.8: audio desacoplado por gestos:
 *  - uKick: impulso físico (spring) del kick
 *  - uBody: respiración lenta de graves
 *  - uMidFlow: ondulación/torsión fluida de medios
 *  - uHighShimmer: porosidad y micro-shimmer de agudos
 */

import { FRAG_HEADER, SIMPLEX, PALETTE } from './common.js';

export const ORGANIC_VERT = `#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUv;

uniform mat4 uViewProj;
uniform mat4 uModel;
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uSeed;
uniform float uScale;

uniform float uKick;
uniform float uBody;
uniform float uMidFlow;
uniform float uHighShimmer;
uniform float uFlowPhase;
uniform float uWaveAmp;
uniform float uTwist;
uniform float uMicroDisplace;

out vec3 vWorld;
out vec3 vNormal;
out vec2 vUv;
out float vDisp;

${SIMPLEX}

void main() {
  vec3 p = aPosition;

  // Base orgánica + respiración de graves + empuje del kick.
  float n = fbm3(p * uFrequency + vec3(0.0, uTime * 0.18, uSeed), 3);
  float n2 = snoise(p * 3.1 - vec3(uTime * 0.24, 0.0, uSeed * 0.5));
  float body = uBody * 0.11;
  float kickDisp = uKick * 0.22;
  p += aNormal * (n * uAmplitude + n2 * uAmplitude * 0.38 + body + kickDisp);

  // Onda de kick que recorre la estructura.
  float kickWave = sin(aUv.x * 9.4248 - uFlowPhase * 1.4 + uSeed) * uKick * 0.10;
  p += aNormal * kickWave;

  // Medios: ondulación lateral + torsión viajera.
  vec3 lateral = normalize(cross(aNormal, normalize(vec3(0.0, 1.0, 0.0))) + vec3(0.0001));
  float flowWave = sin(aUv.x * 18.0 - uFlowPhase + uSeed + uTwist) * uWaveAmp * (0.35 + uMidFlow * 0.9);
  p += lateral * flowWave;
  p += lateral * sin(aUv.y * 6.2831 + uFlowPhase * 0.7) * uMidFlow * 0.045;

  // Agudos: micro-desplazamiento coherente, sin jitter.
  float shimmer = sin(aUv.x * 150.0 + aUv.y * 62.0 - uTime * 6.0) * uHighShimmer * uMicroDisplace;
  p += aNormal * shimmer;

  vec4 world = uModel * vec4(p * uScale, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(uModel) * aNormal);
  vUv = aUv;
  vDisp = n * uAmplitude + body + kickDisp;
  gl_Position = uViewProj * world;
}
`;

export const ORGANIC_FRAG = `${FRAG_HEADER}
in vec3 vWorld;
in vec3 vNormal;
in vec2 vUv;
in float vDisp;

uniform float uTime;
uniform float uHue;
uniform float uSaturation;
uniform float uGlow;
uniform float uOpacity;
uniform vec3 uCamPos;

uniform float uKick;
uniform float uBody;
uniform float uMidFlow;
uniform float uHighShimmer;

${SIMPLEX}
${PALETTE}

out vec4 outColor;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorld);
  float fresnel = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 2.4);

  // Tejido base.
  float vein = 0.5 + 0.5 * sin(vUv.x * 150.0 + vUv.y * 18.8495
              + snoise(vWorld * 2.2 + uTime * 0.22) * 4.5);
  float micro = 0.5 + 0.5 * snoise(vWorld * 5.5 - vec3(uTime * 0.30));
  float bands = smoothstep(0.62, 0.96, vein) * 0.9 + micro * 0.28;

  // Porosidad y shimmer de agudos.
  float grain = snoise(vWorld * 8.5 + vec3(0.0, uTime * 0.18, 0.0));
  float pores = smoothstep(0.42, 0.95, grain) * uHighShimmer;
  float sparkle = pow(max(0.0, snoise(vWorld * 24.0 - uTime * 1.4)), 5.0) * uHighShimmer;

  vec3 lightDir = normalize(vec3(sin(uTime * 0.21) * 1.3, 0.9, cos(uTime * 0.19) * 1.2));
  float diffuse = clamp(dot(N, lightDir), 0.0, 1.0);
  float backLight = clamp(dot(-N, lightDir), 0.0, 1.0) * 0.6;

  float hueT = fract(uHue + vUv.x * 0.045 + vDisp * 0.09 + vUv.y * 0.03 + uTime * 0.002);
  vec3 color = fluidColor(hueT, uSaturation);
  color = mix(color, vec3(0.78, 0.89, 1.0), fresnel * 0.22 + sparkle * 0.35);

  float bright = 0.12 + diffuse * 0.62 + backLight * 0.30 + fresnel * 1.25
               + bands * 0.62
               + uKick * 0.55 + uBody * 0.35
               + pores * 0.55 + sparkle * 0.65;
  color *= bright * uGlow;

  float alpha = uOpacity * (0.08 + fresnel * 0.46 + bands * 0.30 + pores * 0.20);
  outColor = vec4(color, clamp(alpha, 0.0, 0.95));
}
`;
