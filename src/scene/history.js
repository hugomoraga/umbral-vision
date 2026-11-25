/**
 * Historial rodante de escenas.
 *
 * Guarda genomas en localStorage (livianos) y thumbnails en un store aparte
 * (IndexedDB o memoria). La captura es retroactiva: siempre se guarda la
 * escena que el usuario está viendo.
 */

import { createScene, migrateScene, nextSceneId } from './Scene.js';

const DEFAULT_KEY = 'umbral-vision:scene-history';

function readJSON(key) {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJSON(key, value) {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {{limit?:number, storageKey?:string, persist?:boolean, thumbnailStore?:object|null}} [options]
 */
export function createHistory(options = {}) {
  const limit = Math.max(1, Number(options.limit ?? 30));
  const storageKey = options.storageKey || DEFAULT_KEY;
  const persist = options.persist !== false;
  const thumbnailStore = options.thumbnailStore || null;
  let entries = [];

  if (persist) {
    const raw = readJSON(storageKey);
    entries = raw
      .map((entry) => {
        try {
          const scene = migrateScene(entry.scene || entry);
          return {
            id: entry.id || scene.id,
            scene,
            at: entry.at || Date.now(),
            hasThumbnail: !!entry.hasThumbnail
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .slice(0, limit);
  }

  function persistEntries() {
    if (!persist) return;
    writeJSON(storageKey, entries.map((entry) => ({
      id: entry.id,
      scene: entry.scene,
      at: entry.at,
      hasThumbnail: !!entry.hasThumbnail
    })));
  }

  function trim() {
    if (entries.length > limit) entries = entries.slice(0, limit);
  }

  function list({ withThumbnails = false } = {}) {
    return entries.map((entry) => ({
      id: entry.id,
      scene: createScene(entry.scene),
      at: entry.at,
      hasThumbnail: !!entry.hasThumbnail,
      thumbnail: withThumbnails ? (entry.thumbnail || null) : undefined
    }));
  }

  function get(id) {
    const entry = entries.find((item) => item.id === id);
    return entry ? { ...entry, scene: createScene(entry.scene) } : null;
  }

  /**
   * Registra la escena visible. Si llega un thumbnail, se guarda en el store.
   */
  function push(scene, { thumbnail = null, at = Date.now() } = {}) {
    const normalized = createScene(scene);
    const entry = {
      id: normalized.id || nextSceneId('hist'),
      scene: normalized,
      at,
      hasThumbnail: !!thumbnail,
      thumbnail
    };
    entries.unshift(entry);
    trim();
    persistEntries();
    if (thumbnail && thumbnailStore) {
      Promise.resolve(thumbnailStore.put(entry.id, thumbnail, { sceneId: entry.id }))
        .catch(() => {});
    }
    return { ...entry, scene: createScene(entry.scene) };
  }

  const capture = push;

  async function getThumbnail(id) {
    const entry = entries.find((item) => item.id === id);
    if (entry?.thumbnail) return entry.thumbnail;
    if (!thumbnailStore) return null;
    try {
      return await thumbnailStore.get(id);
    } catch {
      return null;
    }
  }

  function remove(id) {
    const index = entries.findIndex((entry) => entry.id === id);
    if (index < 0) return false;
    entries.splice(index, 1);
    persistEntries();
    if (thumbnailStore) Promise.resolve(thumbnailStore.delete(id)).catch(() => {});
    return true;
  }

  function clear() {
    entries = [];
    persistEntries();
    if (thumbnailStore) Promise.resolve(thumbnailStore.clear()).catch(() => {});
  }

  /**
   * Promueve una entrada a preset conservando genoma y linaje.
   */
  function promote(id, name) {
    const entry = entries.find((item) => item.id === id);
    if (!entry) return null;
    const trimmed = String(name || '').trim();
    return createScene({
      ...entry.scene,
      name: trimmed || entry.scene.name,
      updatedAt: new Date().toISOString()
    });
  }

  function stats() {
    return {
      limit,
      entries: entries.length,
      withThumbnail: entries.filter((entry) => entry.hasThumbnail).length
    };
  }

  return {
    push,
    capture,
    list,
    get,
    getThumbnail,
    remove,
    clear,
    promote,
    stats,
    get limit() { return limit; }
  };
}
