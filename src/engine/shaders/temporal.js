/**
 * Temporal Veil — sistema temporal con feedback de framebuffer.
 *
 * Familia: Temporal Systems.
 * Técnica propia: ping-pong de buffers, acumulación temporal, zoom/rotación
 * del frame anterior, distorsión procedural y emisores de filamentos. Genera
 * estelas que evolucionan a partir de su propio historial.
 */

import { FRAG_HEADER, SIMPLEX, PALETTE } from './common.js';
import { FULLSCREEN_VERT } from './post.js';

export const TEMPORAL_VERT = FULLSCREEN_VERT;

export const TEMPORAL_FRAG = `${FRAG_HEADER}
in vec2 vUv;

uniform sampler2D uPrev;
uniform vec2 uResolution;
uniform float uTime;
uniform float uDt;
uniform float uDecay;
uniform float uZoom;
uniform float uRotation;
uniform float uWarp;
uniform float uDensity;
uniform float uHue;
uniform float uSaturation;
uniform float uGlow;
uniform float uSeed;

uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uBeat;
uniform float uAudioAmount;

out vec4 outColor;

${SIMPLEX}
${PALETTE}

mat2 rot2(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 c = vUv - 0.5;
  float t = uTime;
  float a = uAudioAmount;

  vec3 previous = texture(uPrev, vUv).rgb;

  // Campo procedural: filamentos radiales deformados por ruido.
  vec2 q = c * (2.0 + uZoom * 0.6);
  q = rot2(t * 0.035 + uRotation * 0.4 + uSeed) * q;
  float f = fbm3(vec3(q * 1.7, t * 0.06), 4) + snoise(vec3(q * 4.0, t * 0.11)) * 0.35;
  q += uWarp * 0.09 * vec2(sin(q.y * 4.0 + t * 0.5), cos(q.x * 4.0 - t * 0.4));
  float r = length(q);

  float ring = 0.5 + 0.5 * sin(r * 19.0 - t * 1.25 + f * 5.0 + uAudioMid * a * 4.0);
  float filaments = pow(ring, 9.0);
  filaments *= 1.0 + uAudioBass * a * 0.9;
  filaments *= smoothstep(1.25, 0.1, r);
  filaments *= 0.4 + 0.6 * smoothstep(-0.4, 0.7, f);

  float glowMask = exp(-r * 2.8) * (0.08 + uAudioRms * a * 0.25);
  vec3 hueColor = fluidColor(fract(uHue + r * 0.22 + f * 0.08 + t * 0.004), uSaturation);
  vec3 emission = hueColor * (filaments * uDensity + glowMask * 0.04) * uGlow;
  emission *= 0.7 + uBeat * a * 1.6 + uAudioHigh * a * 0.35;

  // El frame anterior se zoom-ea, rota y distorsiona suavemente.
  float zoom = 1.0 - uZoom * 0.0045 - uAudioBass * a * 0.009 - uBeat * a * 0.004;
  float angle = uRotation * 0.006 + sin(t * 0.07) * 0.0015;
  vec2 warped = 0.5 + rot2(angle) * (c * zoom);
  warped += uWarp * 0.0012 * vec2(
    snoise(vec3(vUv * 3.0, t * 0.13)),
    snoise(vec3(vUv * 3.0 + 11.3, t * 0.11))
  );
  float aberration = 0.0009 + uAudioHigh * a * 0.0016;
  vec3 prev;
  prev.r = texture(uPrev, warped + c * aberration).r;
  prev.g = texture(uPrev, warped).g;
  prev.b = texture(uPrev, warped - c * aberration).b;

  vec3 color = prev * uDecay + emission;
  // Techo suave para evitar acumulación infinita.
  color = color / (1.0 + color * 0.55);
  color = min(color, vec3(2.2));

  outColor = vec4(color, 1.0);
}
`;
