/**
 * Mathematical Forms — Mandelbulb raymarched en fragment shader.
 *
 * Familia: Mathematical Forms.
 * Técnicas: SDF, ray marching, geometría iterativa (Mandelbulb), simetría,
 * gradiente para normales y acumulación volumétrica de glow.
 */

import { FRAG_HEADER, PALETTE } from './common.js';
import { FULLSCREEN_VERT } from './post.js';

export const MATH_VERT = FULLSCREEN_VERT;

export const MATH_FRAG = `${FRAG_HEADER}

in vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uPower;
uniform float uWarp;
uniform float uHue;
uniform float uSaturation;
uniform float uGlow;
uniform float uKick;
uniform float uSeed;
uniform int uVariant;
uniform int uSteps;
uniform int uIterations;

uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamForward;
uniform float uTanHalfFov;

uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uAudioAmount;

out vec4 outColor;

${PALETTE}

mat2 rot2(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float mandelbulb(vec3 p) {
  vec3 z = p;
  float dr = 1.0;
  float r = 0.0;
  float power = uPower + uAudioBass * uAudioAmount * 1.8 + uKick * 0.7;

  for (int i = 0; i < 8; i++) {
    if (i >= uIterations) break;
    r = length(z);
    if (r > 2.0) break;

    float theta = acos(clamp(z.z / r, -1.0, 1.0));
    float phi = atan(z.y, z.x);

    dr = pow(r, power - 1.0) * power * dr + 1.0;
    float zr = pow(r, power);
    theta *= power;
    phi *= power;

    z = zr * vec3(
      sin(theta) * cos(phi),
      sin(theta) * sin(phi),
      cos(theta)
    ) + p;
  }

  return 0.5 * log(max(r, 0.0001)) * r / max(dr, 0.0001);
}

float map(vec3 p) {
  vec3 q = p;

  // Simetría rotacional + domain warp temporal.
  q.xz = rot2(uTime * 0.05 * uSpeed + uSeed) * q.xz;
  q.xy = rot2(sin(uTime * 0.07) * 0.18) * q.xy;
  q += (uWarp + uAudioMid * uAudioAmount * 0.9 + uAudioHigh * uAudioAmount * 0.45 + uKick * 0.04) * 0.10 * vec3(
    sin(q.y * 2.1 + uTime * 0.31),
    sin(q.z * 2.3 - uTime * 0.27),
    sin(q.x * 2.5 + uTime * 0.23)
  );

  if (uVariant == 1) {
    // Nudo: toro deformado con ondas angulares.
    float a = atan(q.z, q.x);
    float radius = 0.78 + 0.09 * sin(a * 3.0 + uTime * 0.35) + uWarp * 0.05;
    q.y += 0.10 * sin(a * 5.0 - uTime * 0.4);
    return sdTorus(q.xzy, vec2(radius, 0.20));
  }

  if (uVariant == 2) {
    // Retícula: celdas repetidas con tamaño modulado.
    vec3 cell = mod(q + 0.5, 1.0) - 0.5;
    float size = 0.20 + 0.035 * sin(uTime * 0.5 + q.x * 2.0);
    return sdBox(cell, vec3(size));
  }

  if (uVariant == 3) {
    // Orbe: esfera con desplazamiento de baja frecuencia.
    float r = 0.95
      + 0.075 * sin(q.x * 4.0 + uTime * 0.3)
      + 0.055 * sin(q.y * 5.0 - uTime * 0.2)
      + 0.045 * sin(q.z * 6.0 + uTime * 0.25);
    return length(q) - r;
  }

  return mandelbulb(q * 1.05) * 0.9;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0016, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / max(1.0, uResolution.y);

  vec3 ro = uCamPos;
  vec3 rd = normalize(
    uCamForward +
    uCamRight * uv.x * uTanHalfFov +
    uCamUp * uv.y * uTanHalfFov
  );

  float travel = 0.0;
  float dist = 1.0;
  int marched = 0;
  vec3 glow = vec3(0.0);
  vec3 glowColor = fluidColor(fract(uHue + 0.11), uSaturation);

  for (int i = 0; i < 128; i++) {
    if (i >= uSteps) break;
    vec3 p = ro + rd * travel;
    marched = i;
    dist = map(p);
    if (dist < 0.0015) break;

    // Aura volumétrica: acumula luz alrededor de la superficie.
    float halo = exp(-dist * 5.5);
    glow += halo * 0.0022 * glowColor * (1.0 + uAudioHigh * uAudioAmount * 0.9);

    travel += dist * 0.92;
    if (travel > 12.0) break;
  }

  vec3 color;
  if (dist < 0.002 && travel < 12.0) {
    vec3 p = ro + rd * travel;
    vec3 n = calcNormal(p);

    vec3 lightDir = normalize(vec3(0.55, 0.9, 0.45));
    float diffuse = clamp(dot(n, lightDir), 0.0, 1.0);
    float rim = pow(1.0 - clamp(abs(dot(n, -rd)), 0.0, 1.0), 2.3);
    float pulse = 0.5 + 0.5 * sin(travel * 18.0 - uTime * 2.0 + uKick * 4.0);
    float spec = pow(clamp(dot(normalize(lightDir - rd), n), 0.0, 1.0), 42.0);

    // Oclusión aproximada: cavidades profundas tardan más en marchar.
    float ao = clamp(1.0 - float(marched) / float(uSteps), 0.0, 1.0);
    ao = 0.30 + 0.70 * ao;

    float hueT = fract(uHue + travel * 0.030 + n.y * 0.07 + uTime * 0.002);
    vec3 base = fluidColor(hueT, uSaturation);
    vec3 accent = fluidColor(fract(uHue + 0.10), min(1.0, uSaturation + 0.05));
    base = mix(base, accent, pow(rim, 1.4) * 0.55);

    color = base * (0.055 + diffuse * diffuse * 1.25 + rim * 1.7 + pulse * 0.12) * ao;
    color += vec3(0.72, 0.86, 1.0) * spec * 0.55;
    color += glow * 1.25;
    color *= 1.0 + uKick * 0.7 + uAudioRms * uAudioAmount * 0.4;
  } else {
    // Fondo: casi negro, con el aura volumétrica del fractal.
    color = vec3(0.0015, 0.003, 0.008) + glow * 1.05;
  }

  color *= uGlow;
  outColor = vec4(color, 1.0);
}
`;
