/**
 * Organic Structures — mesh paramétrico con displacement orgánico.
 *
 * Familia: Organic Structures.
 * Técnicas: superficie paramétrica (torus knot), vertex displacement con simplex
 * noise, shading Fresnel + venas procedurales, iluminación viajera y capas
 * translúcidas aditivas.
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
uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioAmount;

out vec3 vWorld;
out vec3 vNormal;
out vec2 vUv;
out float vDisp;

${SIMPLEX}

void main() {
  float bass = uAudioBass * uAudioAmount;
  float mid = uAudioMid * uAudioAmount;

  vec3 p = aPosition;
  float n = fbm3(p * uFrequency + vec3(0.0, uTime * 0.18, uSeed), 3);
  float n2 = snoise(p * 3.1 - vec3(uTime * 0.24, 0.0, uSeed * 0.5));
  float disp = n * uAmplitude + n2 * uAmplitude * 0.38 + bass * (0.28 + mid * 0.2);

  p += aNormal * disp;

  vec4 world = uModel * vec4(p, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(uModel) * aNormal);
  vUv = aUv;
  vDisp = disp;
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
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uBeat;
uniform float uAudioAmount;
uniform vec3 uCamPos;

${SIMPLEX}
${PALETTE}

out vec4 outColor;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorld);
  float fresnel = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 2.4);

  // Venas: bandas longitudinales + ruido; dan lectura de tejido.
  float vein = 0.5 + 0.5 * sin(vUv.x * 150.0 + vUv.y * 18.8495
              + snoise(vWorld * 2.2 + uTime * 0.22) * 4.5);
  float micro = 0.5 + 0.5 * snoise(vWorld * 5.5 - vec3(uTime * 0.30));
  float bands = smoothstep(0.62, 0.96, vein) * 0.9 + micro * 0.28;

  vec3 lightDir = normalize(vec3(sin(uTime * 0.21) * 1.3, 0.9, cos(uTime * 0.19) * 1.2));
  float diffuse = clamp(dot(N, lightDir), 0.0, 1.0);
  float backLight = clamp(dot(-N, lightDir), 0.0, 1.0) * 0.6;

  float hueT = fract(uHue + vUv.x * 0.045 + vDisp * 0.09 + vUv.y * 0.03 + uTime * 0.002);
  vec3 color = fluidColor(hueT, uSaturation);
  color = mix(color, vec3(0.78, 0.89, 1.0), fresnel * 0.22 + uAudioHigh * uAudioAmount * 0.10);

  float bright = 0.12 + diffuse * 0.62 + backLight * 0.30 + fresnel * 1.25
               + bands * 0.62 + uBeat * uAudioAmount * 0.45 + uAudioRms * uAudioAmount * 0.25;
  color *= bright * uGlow;

  float alpha = uOpacity * (0.08 + fresnel * 0.46 + bands * 0.30);
  outColor = vec4(color, clamp(alpha, 0.0, 0.95));
}
`;
