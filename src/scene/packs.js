/**
 * Packs — exportación e importación de repertorios de escenas.
 *
 * El pack es JSON portable. No incluye thumbnails por defecto para mantenerlo
 * liviano; el import hace merge por id y nunca duplica.
 */

import { createScene, migrateScene, nextSceneId } from './Scene.js';

export const PACK_FORMAT = 'umbral-vision-pack';
export const PACK_VERSION = 1;

export function exportPack(scenes, { name = 'Umbral Vision', includeThumbnails = false } = {}) {
  const list = (scenes || []).map((scene) => {
    const s = createScene(scene);
    const item = { id: s.id, scene: s };
    if (includeThumbnails && scene.thumbnail) item.thumbnail = scene.thumbnail;
    return item;
  });
  return {
    format: PACK_FORMAT,
    version: PACK_VERSION,
    name: String(name || 'Umbral Vision'),
    createdAt: new Date().toISOString(),
    count: list.length,
    scenes: list
  };
}

export function serializePack(pack) {
  return JSON.stringify(pack, null, 2);
}

export function parsePack(input) {
  const parsed = typeof input === 'string' ? JSON.parse(input) : input;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Pack inválido: se esperaba un objeto');
  }
  if (parsed.format !== PACK_FORMAT) {
    throw new Error(`Pack inválido: formato "${parsed.format || 'desconocido'}"`);
  }
  if (Number(parsed.version) > PACK_VERSION) {
    throw new Error(`Pack con versión ${parsed.version} no soportada`);
  }
  if (!Array.isArray(parsed.scenes)) throw new Error('Pack inválido: falta la lista de escenas');
  return parsed;
}

/**
 * Importa un pack y devuelve las escenas nuevas, omitidas y fallidas.
 * @param {string|object} input
 * @param {string[]} existingIds
 */
export function importPack(input, existingIds = []) {
  const pack = parsePack(input);
  const seen = new Set(existingIds.map(String));
  const added = [];
  const skipped = [];
  const failed = [];
  for (const item of pack.scenes) {
    try {
      const raw = item && item.scene ? item.scene : item;
      const scene = migrateScene(raw);
      const id = scene.id || nextSceneId('imp');
      if (seen.has(String(id))) {
        skipped.push(id);
        continue;
      }
      const normalized = createScene({ ...scene, id, thumbnail: undefined });
      added.push(normalized);
      seen.add(String(id));
    } catch (error) {
      failed.push({ item, error: error.message });
    }
  }
  return {
    pack: { name: pack.name, version: pack.version },
    added: added.length,
    skipped: skipped.length,
    failed: failed.length,
    scenes: added,
    skippedIds: skipped,
    errors: failed
  };
}
