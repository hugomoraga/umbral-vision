/**
 * Presets — persistencia de escenas y configuraciones en localStorage.
 *
 * Desde el genoma de escena, un preset es una escena guardada. La migración
 * de presets legados es perezosa e idempotente: conserva id, nombre, fecha y
 * parámetros originales, y agrega `state.scene` sin romper consumidores viejos.
 */

import {
  createScene,
  legacyStateToScene,
  migrateScene,
  sceneToEffectParams
} from '../scene/Scene.js';

const STORAGE_KEY = 'umbral-vision:presets';
const memoryFallback = { data: [], warned: false };

function newId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function migratePreset(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const state = raw.state && typeof raw.state === 'object' ? raw.state : {};
  let scene;
  try {
    scene = state.scene ? migrateScene(state.scene) : legacyStateToScene(state, {
      id: raw.id,
      name: raw.name,
      createdAt: raw.createdAt
    });
  } catch {
    return null;
  }
  const id = raw.id || scene.id;
  const migratedScene = createScene({
    ...scene,
    id,
    name: raw.name || scene.name,
    createdAt: raw.createdAt || scene.createdAt,
    updatedAt: scene.updatedAt || raw.createdAt || new Date().toISOString()
  });
  return {
    ...raw,
    id,
    name: raw.name || migratedScene.name,
    createdAt: raw.createdAt || migratedScene.createdAt,
    state: {
      ...state,
      effect: state.effect || migratedScene.effect,
      interval: state.interval ?? null,
      audioEnabled: !!state.audioEnabled,
      params: state.params === undefined ? null : state.params,
      scene: migratedScene
    }
  };
}

export function getPresets() {
  const arr = readPresets();
  return [...arr].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

/**
 * Guarda un preset. Acepta tanto el estado legado como un `state.scene`.
 */
export function savePreset(name, state) {
  if (!name || !state) return null;
  const trimmed = String(name).trim();
  if (!trimmed) return null;

  const list = readPresets();
  const id = state.presetId || newId();
  const base = state.scene
    ? migrateScene(state.scene)
    : legacyStateToScene(state, { id, name: trimmed });
  const scene = createScene({
    ...base,
    id,
    name: trimmed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const preset = {
    id,
    name: trimmed,
    state: {
      effect: state.effect || scene.effect,
      interval: state.interval ?? null,
      audioEnabled: !!state.audioEnabled,
      params: state.params === undefined ? null : state.params,
      scene
    },
    createdAt: scene.createdAt
  };
  const existingIndex = list.findIndex((item) => item.id === id);
  if (existingIndex >= 0) list[existingIndex] = preset;
  else list.push(preset);
  writePresets(list);
  return preset;
}

/**
 * Guarda una escena generada/mutada como preset, conservando su genoma.
 */
export function saveScene(name, scene, extra = {}) {
  if (!scene) return null;
  return savePreset(name, {
    effect: scene.effect,
    interval: extra.interval ?? null,
    audioEnabled: !!extra.audioEnabled,
    params: sceneToEffectParams(scene),
    scene,
    presetId: scene.id
  });
}

export function loadPreset(id) {
  const list = readPresets();
  return list.find(p => p.id === id) || null;
}

export function deletePreset(id) {
  const list = readPresets();
  const idx = list.findIndex(p => p.id === id);
  if (idx < 0) return false;
  list.splice(idx, 1);
  writePresets(list);
  return true;
}

export function renamePreset(id, name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return false;
  const list = readPresets();
  const p = list.find(x => x.id === id);
  if (!p) return false;
  p.name = trimmed;
  if (p.state?.scene) p.state.scene.name = trimmed;
  writePresets(list);
  return true;
}

export function duplicatePreset(id) {
  const list = readPresets();
  const p = list.find(x => x.id === id);
  if (!p) return null;
  const copyId = newId();
  const copyName = `${p.name} (copia)`;
  const scene = p.state?.scene
    ? createScene({
        ...p.state.scene,
        id: copyId,
        name: copyName,
        origin: 'mutated',
        parentId: p.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    : legacyStateToScene(p.state || {}, { id: copyId, name: copyName });
  const copy = {
    ...p,
    id: copyId,
    name: copyName,
    state: {
      ...p.state,
      scene
    },
    createdAt: new Date().toISOString()
  };
  list.push(copy);
  writePresets(list);
  return copy;
}

/**
 * Devuelve las escenas de todos los presets, migradas.
 */
export function getPresetScenes() {
  return readPresets().map((preset) => preset.state?.scene).filter(Boolean);
}

/**
 * Promociona una escena a preset (sin duplicar si ya tiene el mismo id).
 */
export function promoteScene(scene, name) {
  const existing = loadPreset(scene.id);
  if (existing) {
    renamePreset(existing.id, name || existing.name);
    return loadPreset(existing.id);
  }
  return saveScene(name || scene.name || 'Escena', scene);
}

function readPresets() {
  let rawList = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) rawList = parsed;
    }
  } catch {
    return memoryFallback.data.slice();
  }

  const migrated = rawList.map(migratePreset).filter(Boolean);
  // Persistir la migración una sola vez; si falla, seguir usando la copia en memoria.
  try {
    const before = JSON.stringify(rawList);
    const after = JSON.stringify(migrated);
    if (rawList.length && before !== after) {
      writePresets(migrated);
    }
  } catch { /* noop */ }
  memoryFallback.data = migrated.slice();
  return migrated;
}

function writePresets(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    memoryFallback.data = list.slice();
    memoryFallback.warned = false;
  } catch {
    memoryFallback.data = list.slice();
    if (!memoryFallback.warned) {
      memoryFallback.warned = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('uv:toast', {
          detail: { text: 'Los presets no persistirán al cerrar esta ventana', duration: 3500 }
        }));
      }
    }
  }
}
