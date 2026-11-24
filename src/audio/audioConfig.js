/**
 * Audio map — configuración de la reacción musical.
 *
 * Fuente de verdad: `audio-map.json` (editable sin tocar código).
 * Capas de override, de menor a mayor prioridad:
 *   1. defaults embebidos (fallback si el fetch falla)
 *   2. audio-map.json
 *   3. window.UV_AUDIO_MAP (inyección desde backend)
 *   4. overrides de la UI en localStorage
 */

export const DEFAULT_AUDIO_MAP = {
  sync: {
    mode: 'grid',
    bpm: 'auto',
    fallbackBpm: 128,
    minBpm: 80,
    maxBpm: 180,
    visualLatencyMs: 28
  },
  kick: {
    rangeHz: [35, 120],
    refractoryMs: 180,
    threshold: 1.55,
    minFlux: 0.006,
    sensitivity: 1.0,
    depth: 0.7,
    decaySec: 1.5,
    spring: 18,
    damping: 4.5,
    cameraDolly: 0.03,
    bloomPulse: 0.18
  },
  bassBody: { attackMs: 80, releaseMs: 800, scale: 0.05 },
  midFlow: { attackMs: 120, releaseMs: 600, twist: 0.22, waveSpeed: 0.8, waveAmp: 0.12 },
  highShimmer: { attackMs: 15, releaseMs: 180, porosity: 0.5, microDisplace: 0.012 },
  volume: { exposure: 0.2, bloom: 0.15 },
  dynamics: { autoGain: 0.6, floor: 0.04 },
  effects: {
    fluidFields: { kick: 1.0, body: 0.7, mid: 0.9, high: 1.0 },
    organicStructures: { kick: 1.0, body: 0.8, mid: 1.0, high: 1.0 },
    mathematicalForms: { kick: 1.0, body: 0.5, mid: 0.8, high: 0.8 },
    temporalVeil: { kick: 1.0, body: 0.6, mid: 0.9, high: 0.8 }
  }
};

const STORAGE_KEY = 'umbral-vision:audio-map';
let map = clone(DEFAULT_AUDIO_MAP);
let overrides = readOverrides();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, patch) {
  if (!isPlainObject(patch)) return base;
  for (const [key, value] of Object.entries(patch)) {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      deepMerge(base[key], value);
    } else if (value !== undefined) {
      base[key] = Array.isArray(value) ? value.slice() : value;
    }
  }
  return base;
}

function readOverrides() {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeOverrides() {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch { /* noop */ }
}

function rebuild() {
  map = clone(DEFAULT_AUDIO_MAP);
  deepMerge(map, overrides);
  return map;
}

rebuild();

/**
 * Carga `audio-map.json` y aplica los overrides. Sin bloquear el arranque.
 * @param {string} [url]
 */
export async function loadAudioMap(url = null) {
  let fileMap = null;
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    try {
      const target = url || new URL('./audio-map.json', import.meta.url).href;
      const response = await window.fetch(target, { cache: 'no-cache' });
      if (response.ok) fileMap = await response.json();
    } catch { /* fallback a defaults */ }
  }

  const backend = typeof window !== 'undefined' ? window.UV_AUDIO_MAP : null;
  overrides = readOverrides();

  map = clone(DEFAULT_AUDIO_MAP);
  if (isPlainObject(fileMap)) deepMerge(map, fileMap);
  if (isPlainObject(backend)) deepMerge(map, backend);
  deepMerge(map, overrides);
  return map;
}

export function getAudioMap() {
  return map;
}

/**
 * Override en vivo desde la UI.
 * @param {string} path ej. "kick.depth"
 * @param {unknown} value
 */
export function setAudioOverride(path, value) {
  const parts = String(path).split('.');
  let cursor = overrides;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!isPlainObject(cursor[key])) cursor[key] = {};
    cursor = cursor[key];
  }
  cursor[parts[parts.length - 1]] = value;
  writeOverrides();
  return rebuild();
}

export function getAudioOverrides() {
  return clone(overrides);
}

export function resetAudioOverrides() {
  overrides = {};
  writeOverrides();
  return rebuild();
}

/** Expuesto para tests / inspección. */
export function mergeAudioMap(base, patch) {
  return deepMerge(clone(base), patch);
}

// Carga temprana en el browser; el primer tick usa defaults si aún no llegó.
if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  loadAudioMap();
}
