/**
 * Presets — save/load named configurations in localStorage.
 *
 * Schema:
 *   { id, name, state: { effect, interval, audioEnabled }, createdAt }
 *
 * Storage key: 'umbral-vision:presets' (JSON array).
 * En modo incógnito (Safari) cae a memoria volátil y muestra toast.
 */

const STORAGE_KEY = 'umbral-vision:presets';
const memoryFallback = { data: [], warned: false };

export function getPresets() {
  const arr = readPresets();
  return [...arr].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function savePreset(name, state) {
  if (!name || !state) return null;
  const trimmed = String(name).trim();
  if (!trimmed) return null;

  const list = readPresets();
  const preset = {
    id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: trimmed,
    state: {
      effect: state.effect,
      interval: state.interval,
      audioEnabled: !!state.audioEnabled
    },
    createdAt: new Date().toISOString()
  };
  list.push(preset);
  writePresets(list);
  return preset;
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
  writePresets(list);
  return true;
}

export function duplicatePreset(id) {
  const list = readPresets();
  const p = list.find(x => x.id === id);
  if (!p) return null;
  const copy = {
    ...p,
    id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: `${p.name} (copia)`,
    createdAt: new Date().toISOString()
  };
  list.push(copy);
  writePresets(list);
  return copy;
}

function readPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryFallback.data.slice();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : memoryFallback.data.slice();
  } catch {
    return memoryFallback.data.slice();
  }
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
      window.dispatchEvent(new CustomEvent('uv:toast', {
        detail: { text: 'Los presets no persistirán al cerrar esta ventana', duration: 3500 }
      }));
    }
  }
}
