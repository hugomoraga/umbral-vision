import { describe, it, expect, beforeEach } from 'vitest';
import { createHistory } from '../src/scene/history.js';
import { createThumbnailStore } from '../src/scene/storage.js';
import { exportPack, importPack, parsePack, serializePack } from '../src/scene/packs.js';
import { createScene } from '../src/scene/Scene.js';

function scene(id, extra = {}) {
  return createScene({ id, name: `Escena ${id}`, effect: 'fluidFields', variant: 'membrane', seed: 1, ...extra });
}

describe('rolling history', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('conserva solo las N más recientes', () => {
    const history = createHistory({ limit: 3, persist: false });
    for (let i = 0; i < 5; i++) history.push(scene(`s${i}`));
    const list = history.list();
    expect(list).toHaveLength(3);
    expect(list.map((entry) => entry.id)).toEqual(['s4', 's3', 's2']);
  });

  it('la captura guarda la escena visible y promueve con nombre', () => {
    const history = createHistory({ limit: 5, persist: false });
    const visible = scene('visible', { name: '' });
    history.capture(visible, { thumbnail: 'data:image/webp;base64,xx' });
    const entry = history.get('visible');
    expect(entry.scene.effect).toBe('fluidFields');
    const preset = history.promote('visible', 'Mi hallazgo');
    expect(preset.name).toBe('Mi hallazgo');
    expect(preset.id).toBe('visible');
    expect(preset.origin).toBe('manual');
  });

  it('persiste genomas y los recupera en otra instancia', () => {
    const first = createHistory({ limit: 5, persist: true, storageKey: 'uv-test-history' });
    first.push(scene('persisted'));
    const second = createHistory({ limit: 5, persist: true, storageKey: 'uv-test-history' });
    expect(second.list().map((entry) => entry.id)).toContain('persisted');
  });

  it('tolera entradas corruptas al cargar', () => {
    localStorage.setItem('uv-corrupt-history', JSON.stringify([{ scene: { schemaVersion: 99 } }, { nope: true }]));
    const history = createHistory({ limit: 5, persist: true, storageKey: 'uv-corrupt-history' });
    expect(history.list()).toEqual([]);
  });
});

describe('thumbnail store', () => {
  it('usa fallback en memoria sin IndexedDB', async () => {
    const store = createThumbnailStore({ indexedDB: null, maxBytes: 1000 });
    expect(await store.put('a', 'x'.repeat(10))).toBe(true);
    expect(await store.get('a')).toBe('x'.repeat(10));
    const stats = await store.stats();
    expect(stats.available).toBe(false);
    expect(stats.entries).toBe(1);
  });

  it('rechaza una imagen que excede el presupuesto', async () => {
    const store = createThumbnailStore({ indexedDB: null, maxBytes: 10 });
    expect(await store.put('big', 'x'.repeat(100))).toBe(false);
    expect(await store.get('big')).toBeNull();
  });

  it('respeta el máximo de entradas', async () => {
    const store = createThumbnailStore({ indexedDB: null, maxBytes: 100000, maxEntries: 2 });
    await store.put('a', 'aaa');
    await store.put('b', 'bbb');
    await store.put('c', 'ccc');
    expect((await store.stats()).entries).toBeLessThanOrEqual(2);
  });
});

describe('scene packs', () => {
  it('exporta e importa sin duplicar', () => {
    const pack = exportPack([scene('a'), scene('b')], { name: 'Mi pack' });
    expect(pack.format).toBe('umbral-vision-pack');
    expect(pack.count).toBe(2);
    const json = serializePack(pack);
    const parsed = parsePack(json);
    expect(parsed.scenes).toHaveLength(2);

    const result = importPack(json, ['a']);
    expect(result.added).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.failed).toBe(0);
    expect(result.scenes[0].id).toBe('b');
  });

  it('cuenta escenas fallidas sin abortar el resto', () => {
    const pack = {
      format: 'umbral-vision-pack',
      version: 1,
      name: 'roto',
      scenes: [
        { scene: { schemaVersion: 99 } },
        { scene: scene('ok') }
      ]
    };
    const result = importPack(pack, []);
    expect(result.failed).toBe(1);
    expect(result.added).toBe(1);
  });

  it('rechaza formatos desconocidos', () => {
    expect(() => parsePack({ format: 'otro', scenes: [] })).toThrow(/formato/);
  });
});
