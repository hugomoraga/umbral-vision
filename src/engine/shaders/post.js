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
out vec4 outColor;
void main() {
  outColor = mix(texture(uSceneA, vUv), texture(uSceneB, vUv), uMix);
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
