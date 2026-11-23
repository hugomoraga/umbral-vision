/**
 * Fluid Fields — GPU particle simulation (ping-pong state textures).
 *
 * Each texel is one particle:
 *   uPos  : xyz = position, w = life [0..1]
 *   uVel  : xyz = velocity, w = deterministic seed
 *   uHome : xyz = surface home, w = surface parameter (for color)
 */

import { FRAG_HEADER, HASH, SIMPLEX, CURL, PALETTE } from './common.js';

export const UPDATE_FRAG = `${FRAG_HEADER}
${HASH}
${SIMPLEX}
${CURL}
${PALETTE}

uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uHome;

uniform float uTime;
uniform float uDt;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uComplexity;
uniform float uTurbulence;

uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uBeat;
uniform float uAudioAmount;

layout(location = 0) out vec4 outPos;
layout(location = 1) out vec4 outVel;

void main() {
  ivec2 texel = ivec2(gl_FragCoord.xy);
  vec4 posData = texelFetch(uPos, texel, 0);
  vec4 velData = texelFetch(uVel, texel, 0);
  vec4 homeData = texelFetch(uHome, texel, 0);

  vec3 pos = posData.xyz;
  vec3 vel = velData.xyz;
  float life = posData.w;
  float seed = velData.w;

  float bass = uAudioBass * uAudioAmount;
  float mid = uAudioMid * uAudioAmount;
  float high = uAudioHigh * uAudioAmount;
  float beat = uBeat * uAudioAmount;

  float t = uTime;

  // La superficie respira / se deforma: mantiene el tejido coherente.
  vec3 home = homeData.xyz;
  vec3 breathe = vec3(
    snoise(home * 1.15 + vec3(t * 0.14, 0.0, 0.0)),
    snoise(home * 1.30 + vec3(0.0, t * 0.11, 0.0)),
    snoise(home * 1.05 + vec3(0.0, 0.0, t * 0.12))
  );
  home += breathe * (0.10 + uAmplitude * 0.22 + bass * 0.22);
  float pulse = 1.0 + 0.035 * sin(t * 0.35 + homeData.w * 6.2831) + bass * 0.09;
  home.xz *= pulse;

  // Dominio deformado: el flujo se calcula sobre un espacio que respira.
  vec3 warp = vec3(
    snoise(home * 1.7 + t * 0.08),
    snoise(home * 1.9 - t * 0.06),
    snoise(home * 1.5 + t * 0.07)
  ) * (0.18 + mid * 0.25);
  vec3 flowPos = (pos + warp) * (0.55 + uComplexity * 0.75);

  vec3 flow = organicFlow(flowPos + vec3(0.0, t * 0.05, 0.0), t, uComplexity);
  flow *= uAmplitude * (0.85 + uTurbulence * 0.9) * (1.0 + mid * 1.4);
  flow += curlNoise(pos * 4.2 + t * 0.21) * high * 0.35;

  vec3 delta = home - pos;
  float dist = length(delta);
  float spring = 2.4 + uComplexity * 1.8;

  vec3 accel = flow * 3.2 + delta * spring;
  // Beat: impulso radial que atraviesa la membrana.
  accel += normalize(pos + vec3(0.0001)) * beat * 4.2;

  vel = vel * 0.94 + accel * uDt;

  float vlen = length(vel);
  if (vlen > 6.0) vel *= 6.0 / vlen;

  float speedMul = uSpeed * (1.0 + bass * 1.9);
  pos += vel * uDt * speedMul;

  life += uDt * (0.05 + seed * 0.025 + high * 0.03);

  // Respawn en la superficie: vida cíclica sin saltos visibles (fade in/out).
  if (life >= 1.0 || dist > 3.5 || any(greaterThan(abs(pos), vec3(9.0)))) {
    vec3 rnd = hash33(home * 37.1 + seed * 19.7 + t * 0.001);
    pos = home + (rnd - 0.5) * (0.04 + 0.05 * hash11(seed + t));
    vel = (rnd - 0.5) * 0.22;
    life = 0.0;
  }

  outPos = vec4(pos, life);
  outVel = vec4(vel, seed);
}
`;

export const RENDER_VERT = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

layout(location = 0) in vec2 aCorner;

uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uHome;
uniform mat4 uViewProj;
uniform vec2 uResolution;

uniform float uTime;
uniform float uPointSize;
uniform float uOpacity;
uniform float uGlow;
uniform float uHue;
uniform float uSaturation;
uniform float uStretch;
uniform vec3 uLightPos;
uniform float uLightPower;

uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uBeat;
uniform float uAudioAmount;

out vec2 vLocal;
out vec3 vColor;
out float vAlpha;

${HASH}
${SIMPLEX}
${PALETTE}

void main() {
  int id = gl_InstanceID;
  int width = textureSize(uPos, 0).x;
  ivec2 texel = ivec2(id % width, id / width);

  vec4 posData = texelFetch(uPos, texel, 0);
  vec4 velData = texelFetch(uVel, texel, 0);
  vec4 homeData = texelFetch(uHome, texel, 0);

  vec3 pos = posData.xyz;
  vec3 vel = velData.xyz;
  float life = posData.w;
  float param = homeData.w;

  vec4 clipPos = uViewProj * vec4(pos, 1.0);
  if (clipPos.w <= 0.05) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vLocal = vec2(0.0);
    vColor = vec3(0.0);
    vAlpha = 0.0;
    return;
  }

  float high = uAudioHigh * uAudioAmount;
  float rms = uAudioRms * uAudioAmount;
  float beat = uBeat * uAudioAmount;

  vec4 prevClip = uViewProj * vec4(pos - vel * 0.055, 1.0);
  vec2 ndc = clipPos.xy / clipPos.w;
  vec2 prevNdc = prevClip.w > 0.0 ? prevClip.xy / prevClip.w : ndc;
  vec2 motion = ndc - prevNdc;
  float motionLen = length(motion);

  // Tangente de la membrana (alrededor de Y): da dirección de fibra incluso
  // cuando la velocidad instantánea es baja.
  vec3 tangent = normalize(vec3(-homeData.z, 0.0, homeData.x) + vec3(0.0001));
  vec4 tangentClip = uViewProj * vec4(pos + tangent * 0.12, 1.0);
  vec2 tangentNdc = tangentClip.w > 0.0 ? tangentClip.xy / tangentClip.w : ndc;
  vec2 tangentDir = normalize(tangentNdc - ndc + vec2(0.00001));

  vec2 motionDir = motionLen > 1e-5 ? motion / motionLen : tangentDir;
  vec2 dir = normalize(mix(tangentDir, motionDir, 0.7) + vec2(0.00001));
  vec2 perp = vec2(-dir.y, dir.x);

  // Máscara de tejido: bandas coherentes en la superficie, no ruido uniforme.
  float band = snoise(homeData.xyz * 1.15 + vec3(0.0, uTime * 0.04, 0.0));
  float fine = snoise(homeData.xyz * 3.1 - vec3(uTime * 0.05, 0.0, 0.0));
  float tissue = smoothstep(-0.25, 0.55, band) * (0.62 + 0.38 * smoothstep(-0.45, 0.5, fine));

  float depth = max(clipPos.w, 0.25);
  float speed = length(vel);

  float sizePx = uPointSize * (5.0 / depth) * (0.60 + param * 0.75);
  sizePx *= (0.75 + 0.55 * tissue) * (1.0 + high * 1.1 + rms * 0.5);
  sizePx = max(sizePx, 0.9);

  float stretch = 1.0 + uStretch * (0.12 + 0.30 * tissue) + min(motionLen, 0.30) * uStretch * 12.0;
  vec2 offsetPx = (perp * aCorner.x + dir * aCorner.y * stretch) * sizePx;
  vec2 offsetNdc = offsetPx / uResolution * 2.0;

  clipPos.xy += offsetNdc * clipPos.w;
  gl_Position = clipPos;

  vLocal = aCorner * vec2(1.0, 1.0 / max(stretch, 0.001));

  float hueT = fract(uHue + param * 0.055 + depth * 0.012 + speed * 0.012 + uTime * 0.003);
  vColor = fluidColor(hueT, uSaturation);
  vColor = mix(vColor, vec3(0.85, 0.92, 1.0), 0.06 + high * 0.12);
  float depthLight = 1.0 - smoothstep(2.8, 7.6, depth);
  vColor *= 0.36 + 0.64 * depthLight;

  // Luz viajera: ilumina la membrana según posición, no solo profundidad.
  float lightDist = length(pos - uLightPos);
  float light = uLightPower / (0.55 + lightDist * lightDist * 0.75);
  vColor *= 0.62 + clamp(light, 0.0, 1.8) * 0.9;
  vColor *= 1.0 + beat * 0.7;

  float fadeIn = smoothstep(0.0, 0.06, life);
  float fadeOut = 1.0 - smoothstep(0.74, 1.0, life);
  float depthFade = smoothstep(0.0, 0.9, depth) * (1.0 - smoothstep(8.0, 13.0, depth));
  vAlpha = fadeIn * fadeOut * depthFade * uOpacity * (0.32 + 0.68 * tissue) * (0.7 + rms * 0.5);
}
`;

export const RENDER_FRAG = `${FRAG_HEADER}

in vec2 vLocal;
in vec3 vColor;
in float vAlpha;

uniform float uGlow;

out vec4 outColor;

void main() {
  float r2 = dot(vLocal, vLocal);
  // Sprite elíptico con núcleo brillante y halo suave.
  float core = exp(-r2 * 5.2);
  float halo = exp(-r2 * 1.15) * 0.55;
  float alpha = (core * 1.15 + halo) * vAlpha;
  if (alpha < 0.002) discard;
  outColor = vec4(vColor * alpha * uGlow, 1.0);
}
`;
