/**
 * Post-processing shaders: bright pass, separable blur and final composite.
 */

import { FRAG_HEADER, HASH, TONEMAP } from './common.js';

export const FULLSCREEN_VERT = `#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const BRIGHT_FRAG = `${FRAG_HEADER}
in vec2 vUv;
uniform sampler2D uScene;
uniform float uThreshold;
uniform float uKnee;
uniform float uIntensity;
out vec4 outColor;

void main() {
  vec3 c = texture(uScene, vUv).rgb;
  float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float soft = clamp(luma - uThreshold + uKnee, 0.0, 2.0 * uKnee);
  soft = soft * soft / (4.0 * uKnee + 0.0001);
  float contrib = max(soft, luma - uThreshold) / max(luma, 0.0001);
  outColor = vec4(c * contrib * uIntensity, 1.0);
}
`;

export const BLUR_FRAG = `${FRAG_HEADER}
in vec2 vUv;
uniform sampler2D uSource;
uniform vec2 uDirection;
uniform int uQuality;
out vec4 outColor;

void main() {
  // 9-tap gaussian separado, con pesos simétricos.
  float weights[5] = float[5](0.2270270270, 0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162);
  vec3 sum = texture(uSource, vUv).rgb * weights[0];
  for (int i = 1; i < 5; i++) {
    if (i > uQuality) break;
    vec2 off = uDirection * float(i);
    sum += texture(uSource, vUv + off).rgb * weights[i];
    sum += texture(uSource, vUv - off).rgb * weights[i];
  }
  outColor = vec4(sum, 1.0);
}
`;

export const MIX_FRAG = `${FRAG_HEADER}
in vec2 vUv;
uniform sampler2D uSceneA;
uniform sampler2D uSceneB;
uniform float uMix;
uniform int uMode;
out vec4 outColor;

float lumaOf(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec3 a = texture(uSceneA, vUv).rgb;
  vec3 b = texture(uSceneB, vUv).rgb;
  float m = clamp(uMix, 0.0, 1.0);
  if (uMode == 1) {
    // Mezcla ponderada por luminancia: evita el doble expuesto plano.
    float la = lumaOf(a);
    float lb = lumaOf(b);
    m = clamp(m + (lb - la) * 0.12, 0.0, 1.0);
  }
  m = smoothstep(0.0, 1.0, m);
  outColor = vec4(mix(a, b, m), 1.0);
}
`;

export const FEEDBACK_FRAG = `${FRAG_HEADER}
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uPrev;
uniform vec2 uResolution;
uniform float uTime;
uniform float uFeedback;
uniform float uDecay;
uniform float uZoom;
uniform float uRotation;
uniform float uWarp;
out vec4 outColor;

mat2 rot2(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 c = vUv - 0.5;
  float angle = uRotation * 0.006 + sin(uTime * 0.07) * 0.0015;
  float zoom = 1.0 - uZoom * 0.0045;
  vec2 warped = 0.5 + rot2(angle) * (c * zoom);
  // Warp barato (sin simplex): el feedback corre en media resolución y no
  // necesita ruido de alta frecuencia para dar la sensación de arrastre.
  warped += uWarp * 0.0012 * vec2(
    sin(vUv.y * 8.0 + uTime * 0.7),
    cos(vUv.x * 7.0 - uTime * 0.6)
  );

  vec3 prev = texture(uPrev, warped).rgb * uDecay;
  vec3 scene = texture(uScene, vUv).rgb;
  vec3 color = prev + scene * uFeedback;

  // Techo suave para evitar acumulación infinita y lavado.
  color = color / (1.0 + color * 0.55);
  color = min(color, vec3(2.2));
  outColor = vec4(color, 1.0);
}
`;

export const COPY_FRAG = `${FRAG_HEADER}
in vec2 vUv;
uniform sampler2D uSource;
out vec4 outColor;
void main() {
  outColor = texture(uSource, vUv);
}
`;

export const COMPOSITE_FRAG = `${FRAG_HEADER}
${HASH}
${TONEMAP}

in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom0;
uniform sampler2D uBloom1;
uniform sampler2D uBloom2;
uniform vec3 uBloomWeights;
uniform float uBloomStrength;
uniform float uExposure;
uniform float uVignette;
uniform float uGrain;
uniform float uAberration;
uniform float uTime;
uniform vec2 uResolution;
out vec4 outColor;

void main() {
  vec2 dir = vUv - 0.5;
  float ab = uAberration * dot(dir, dir);

  vec3 col;
  col.r = texture(uScene, vUv + dir * ab).r;
  col.g = texture(uScene, vUv).g;
  col.b = texture(uScene, vUv - dir * ab).b;

  vec3 bloom =
    texture(uBloom0, vUv).rgb * uBloomWeights.x +
    texture(uBloom1, vUv).rgb * uBloomWeights.y +
    texture(uBloom2, vUv).rgb * uBloomWeights.z;

  // Atmósfera: gradiente profundo detrás del tejido.
  float radial = length(dir);
  vec3 atmosphere = mix(vec3(0.016, 0.026, 0.055), vec3(0.002, 0.004, 0.010), smoothstep(0.0, 0.75, radial));
  col += atmosphere;
  col += bloom * uBloomStrength;
  col *= uExposure;
  col = acesFilm(col);
  col = pow(max(col, vec3(0.0)), vec3(1.0 / 2.2));

  float vig = smoothstep(1.05, 0.25, length(dir) * 1.35);
  col *= mix(1.0, vig, uVignette);

  float grain = hash12(vUv * uResolution + vec2(uTime * 37.0, uTime * 53.0)) - 0.5;
  col += grain * uGrain;

  outColor = vec4(col, 1.0);
}
`;
