/**
 * Scene — genoma reproducible de una visualización.
 *
 * Un preset es una escena guardada. Una escena generada es una escena efímera
 * que puede promocionarse a preset. El genoma contiene todo lo necesario para
 * reconstruir la composición: efecto, variante, seed, parámetros, paleta,
 * post-proceso y drift temporal.
 */

import { getDefaultVariantForEffect } from './families.js';

export const SCENE_SCHEMA_VERSION = 2;
export const SCENE_ORIGINS = Object.freeze(['manual', 'generated', 'mutated']);

export const DEFAULT_PALETTE = Object.freeze({
  mode: 'procedural',
  hue: 0.56,
  saturation: 0.9
});

export const DEFAULT_POST = Object.freeze({
  bloom: 0.85,
  exposure: 0.98,
  vignette: 0.55,
  grain: 0.028,
  aberration: 0.014,
  feedback: 0.25,
  feedbackDecay: 0.92
});

export const DEFAULT_DRIFT = Object.freeze({
  enabled: true,
  rates: {
    hue: 0.01,
    warp: 0.015
  }
});

let idCounter = 0;

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function clone(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finite(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function randomSeed() {
  try {
    const c = globalThis.crypto;
    if (c && typeof c.getRandomValues === 'function') {
      const buf = new Uint32Array(1);
      c.getRandomValues(buf);
      return buf[0] >>> 0;
    }
  } catch { /* noop */ }
  return (Math.random() * 0xffffffff) >>> 0;
}

export function nextSceneId(prefix = 'sc') {
  idCounter = (idCounter + 1) % 0xffffff;
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}_${rand}`;
}

function normalizePalette(palette) {
  const input = isPlainObject(palette) ? palette : {};
  return {
    ...DEFAULT_PALETTE,
    ...input,
    hue: clamp(finite(input.hue, DEFAULT_PALETTE.hue), 0, 1),
    saturation: clamp(finite(input.saturation, DEFAULT_PALETTE.saturation), 0, 1)
  };
}

function normalizePost(post) {
  const input = isPlainObject(post) ? post : {};
  const out = { ...DEFAULT_POST, ...input };
  out.bloom = clamp(finite(out.bloom, DEFAULT_POST.bloom), 0, 3);
  out.exposure = clamp(finite(out.exposure, DEFAULT_POST.exposure), 0.1, 3);
  out.vignette = clamp(finite(out.vignette, DEFAULT_POST.vignette), 0, 1);
  out.grain = clamp(finite(out.grain, DEFAULT_POST.grain), 0, 0.2);
  out.aberration = clamp(finite(out.aberration, DEFAULT_POST.aberration), 0, 0.1);
  out.feedback = clamp(finite(out.feedback, DEFAULT_POST.feedback), 0, 1);
  out.feedbackDecay = clamp(finite(out.feedbackDecay, DEFAULT_POST.feedbackDecay), 0.5, 0.999);
  return out;
}

function normalizeDrift(drift) {
  const input = isPlainObject(drift) ? drift : {};
  const rates = isPlainObject(input.rates) ? input.rates : {};
  return {
    enabled: input.enabled !== false,
    rates: {
      ...DEFAULT_DRIFT.rates,
      ...rates
    }
  };
}

function normalizeMoment(moment) {
  if (!moment || !isPlainObject(moment)) return null;
  const offset = finite(moment.timeOffset, 0);
  return { timeOffset: Math.max(0, offset) };
}

/**
 * Construye una escena normalizada a partir de un objeto parcial.
 * @param {object} [input]
 * @returns {object}
 */
export function createScene(input = {}) {
  const effect = String(input.effect || 'fluidFields');
  const variant = String(input.variant || getDefaultVariantForEffect(effect));
  const seed = Math.max(0, Math.floor(finite(input.seed ?? input.params?.seed, 1))) >>> 0;
  const now = new Date().toISOString();
  const origin = SCENE_ORIGINS.includes(input.origin) ? input.origin : 'manual';

  return {
    schemaVersion: SCENE_SCHEMA_VERSION,
    id: String(input.id || nextSceneId()),
    name: String(input.name || ''),
    createdAt: input.createdAt || now,
    updatedAt: input.updatedAt || now,
    origin,
    parentId: input.parentId ? String(input.parentId) : null,
    effect,
    variant,
    seed,
    params: isPlainObject(input.params) ? clone(input.params) : {},
    palette: normalizePalette(input.palette),
    post: normalizePost(input.post),
    drift: normalizeDrift(input.drift),
    moment: normalizeMoment(input.moment),
    tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
    favorite: !!input.favorite
  };
}

/**
 * Migra una escena o un preset legado al schema actual.
 * @param {object} raw
 * @returns {object}
 */
export function migrateScene(raw) {
  if (!isPlainObject(raw)) throw new Error('Escena inválida: se esperaba un objeto');
  if (raw.scene && isPlainObject(raw.scene)) return migrateScene(raw.scene);
  if (!raw.state && !raw.effect) {
    throw new Error('Escena inválida: falta effect');
  }
  if (raw.state && isPlainObject(raw.state)) {
    return legacyStateToScene(raw.state, {
      id: raw.id,
      name: raw.name,
      createdAt: raw.createdAt
    });
  }
  const version = Number(raw.schemaVersion ?? 1);
  if (version > SCENE_SCHEMA_VERSION) {
    throw new Error(`schemaVersion ${version} no soportada (máxima ${SCENE_SCHEMA_VERSION})`);
  }
  return createScene(raw);
}

export function validateScene(scene) {
  const errors = [];
  if (!isPlainObject(scene)) return { valid: false, errors: ['La escena no es un objeto'] };
  if (scene.schemaVersion !== SCENE_SCHEMA_VERSION) {
    errors.push(`schemaVersion debe ser ${SCENE_SCHEMA_VERSION}`);
  }
  if (!scene.effect || typeof scene.effect !== 'string') errors.push('effect es obligatorio');
  if (!scene.variant || typeof scene.variant !== 'string') errors.push('variant es obligatorio');
  if (!Number.isInteger(scene.seed) || scene.seed < 0) errors.push('seed debe ser un entero no negativo');
  if (!isPlainObject(scene.params)) errors.push('params debe ser un objeto');
  if (!isPlainObject(scene.palette)) errors.push('palette debe ser un objeto');
  if (!isPlainObject(scene.post)) errors.push('post debe ser un objeto');
  if (!isPlainObject(scene.drift)) errors.push('drift debe ser un objeto');
  if (scene.moment != null && (!isPlainObject(scene.moment) || !Number.isFinite(scene.moment.timeOffset))) {
    errors.push('moment.timeOffset debe ser numérico');
  }
  return { valid: errors.length === 0, errors };
}

export function serializeScene(scene) {
  return JSON.stringify(createScene(scene));
}

export function deserializeScene(json) {
  const parsed = typeof json === 'string' ? JSON.parse(json) : json;
  const scene = migrateScene(parsed);
  const check = validateScene(scene);
  if (!check.valid) throw new Error(`Escena inválida: ${check.errors.join(', ')}`);
  return scene;
}

export function cloneScene(scene) {
  return createScene(clone(scene));
}

/**
 * Serialización estable para fingerprints y tests de determinismo.
 */
export function sceneFingerprint(scene) {
  const s = createScene(scene);
  return stableStringify({
    schemaVersion: s.schemaVersion,
    effect: s.effect,
    variant: s.variant,
    seed: s.seed,
    params: s.params,
    palette: s.palette,
    post: s.post,
    drift: s.drift,
    moment: s.moment
  });
}

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function legacyStateToScene(state = {}, extra = {}) {
  const effect = state.effect || 'fluidFields';
  const params = isPlainObject(state.params) ? state.params : {};
  const variant = state.variant
    || (isPlainObject(state.scene) && state.scene.variant)
    || getDefaultVariantForEffect(effect);
  const seed = state.seed ?? params.seed ?? (isPlainObject(state.scene) ? state.scene.seed : undefined);
  const base = isPlainObject(state.scene) ? state.scene : {};
  return createScene({
    ...base,
    effect,
    variant,
    seed,
    params,
    id: extra.id || base.id,
    name: extra.name || base.name,
    createdAt: extra.createdAt || base.createdAt,
    origin: base.origin || 'manual',
    parentId: base.parentId || null,
    palette: base.palette,
    post: base.post,
    drift: base.drift,
    moment: base.moment,
    tags: base.tags,
    favorite: base.favorite
  });
}

export function sceneToLegacyState(scene, extra = {}) {
  const s = createScene(scene);
  return {
    effect: s.effect,
    interval: extra.interval ?? null,
    audioEnabled: !!extra.audioEnabled,
    params: { ...s.params, seed: s.seed },
    scene: s
  };
}

/**
 * Parámetros que entiende el efecto para una escena.
 */
export function sceneToEffectParams(scene) {
  const s = createScene(scene);
  return { ...s.params, seed: s.seed };
}

// --- codificación compacta para share URLs --------------------------------

function utf8ToBase64Url(text) {
  const Encoder = globalThis.TextEncoder;
  const bytes = new Encoder().encode(text);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const encoder = globalThis.btoa;
  const NodeBuffer = globalThis.Buffer;
  const b64 = typeof encoder === 'function'
    ? encoder(binary)
    : NodeBuffer.from(binary, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToUtf8(value) {
  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const decoder = globalThis.atob;
  const NodeBuffer = globalThis.Buffer;
  const binary = typeof decoder === 'function'
    ? decoder(padded)
    : NodeBuffer.from(padded, 'base64').toString('binary');
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const Decoder = globalThis.TextDecoder;
  return new Decoder().decode(bytes);
}

/**
 * Codifica solo los campos necesarios para reconstruir una escena.
 */
export function encodeSceneCompact(scene) {
  const s = createScene(scene);
  const payload = {
    e: s.effect,
    r: s.variant,
    s: s.seed,
    p: s.params,
    l: s.palette,
    o: s.post,
    d: s.drift,
    m: s.moment,
    n: s.name || undefined
  };
  return utf8ToBase64Url(JSON.stringify(payload));
}

export function decodeSceneCompact(value) {
  if (!value) return null;
  try {
    const raw = JSON.parse(base64UrlToUtf8(value));
    if (!isPlainObject(raw) || !raw.e) return null;
    return createScene({
      effect: raw.e,
      variant: raw.r,
      seed: raw.s,
      params: raw.p,
      palette: raw.l,
      post: raw.o,
      drift: raw.d,
      moment: raw.m,
      name: raw.n
    });
  } catch {
    return null;
  }
}
