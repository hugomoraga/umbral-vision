import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPresets,
  savePreset,
  saveScene,
  loadPreset,
  duplicatePreset,
  getPresetScenes,
  promoteScene,
  deletePreset
} from '../src/ui/presets.js';
import { buildShareURL, parseShareURL, sceneFromShareURL } from '../src/ui/share.js';
import { createScene } from '../src/scene/Scene.js';

const STORAGE_KEY = 'umbral-vision:presets';

describe('preset scene migration', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('guarda un preset con genoma v2', () => {
    const created = savePreset('Fluido', {
      effect: 'fluidFields',
      interval: 12,
      audioEnabled: true,
      params: { density: 0.7, hue: 0.5, seed: 3 }
    });
    expect(created.state.scene.schemaVersion).toBe(2);
    expect(created.state.scene.seed).toBe(3);
    expect(created.state.params).toEqual({ density: 0.7, hue: 0.5, seed: 3 });
  });

  it('migra un preset legado sin perder id, nombre, fecha ni params', () => {
    const legacy = [{
      id: 'p_legacy',
      name: 'Viejo',
      state: { effect: 'tunnel', interval: 9, audioEnabled: false, params: { seed: 12, hue: 0.1 } },
      createdAt: '2024-02-03T00:00:00.000Z'
    }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    const list = getPresets();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('p_legacy');
    expect(list[0].name).toBe('Viejo');
    expect(list[0].createdAt).toBe('2024-02-03T00:00:00.000Z');
    expect(list[0].state.params).toEqual({ seed: 12, hue: 0.1 });
    expect(list[0].state.scene.effect).toBe('tunnel');
    expect(list[0].state.scene.variant).toBe('tunnel');
    expect(list[0].state.scene.seed).toBe(12);
  });

  it('la migración es idempotente', () => {
    const legacy = [{
      id: 'p_legacy',
      name: 'Viejo',
      state: { effect: 'tunnel', params: { seed: 1 } },
      createdAt: '2024-02-03T00:00:00.000Z'
    }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    const first = JSON.stringify(getPresets());
    const second = JSON.stringify(getPresets());
    expect(second).toBe(first);
    expect(getPresets()[0].id).toBe('p_legacy');
  });

  it('saveScene conserva el genoma generado', () => {
    const scene = createScene({
      effect: 'fluidFields',
      variant: 'ribbon',
      seed: 77,
      params: { hue: 0.4 },
      origin: 'generated'
    });
    const preset = saveScene('Hallazgo', scene);
    expect(preset.state.scene.variant).toBe('ribbon');
    expect(preset.state.scene.seed).toBe(77);
    expect(preset.state.scene.origin).toBe('generated');
    expect(getPresetScenes().some((s) => s.variant === 'ribbon')).toBe(true);
  });

  it('duplicar conserva linaje y genoma', () => {
    const created = savePreset('Base', { effect: 'fluidFields', params: { seed: 5 } });
    const copy = duplicatePreset(created.id);
    expect(copy.state.scene.parentId).toBe(created.id);
    expect(copy.state.scene.effect).toBe('fluidFields');
    expect(copy.id).not.toBe(created.id);
  });

  it('promociona una escena y evita duplicados por id', () => {
    const scene = createScene({ effect: 'fluidFields', seed: 8, variant: 'torus' });
    const first = promoteScene(scene, 'Promo');
    const second = promoteScene(scene, 'Promo 2');
    expect(first.id).toBe(second.id);
    expect(loadPreset(first.id).name).toBe('Promo 2');
    deletePreset(first.id);
  });
});

describe('share with scene genome', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reconstruye una escena exacta desde la URL', () => {
    const scene = createScene({
      effect: 'fluidFields',
      variant: 'ribbon',
      seed: 4321,
      params: { density: 0.6, hue: 0.2 },
      palette: { hue: 0.3, saturation: 0.8 }
    });
    const url = buildShareURL({ effect: scene.effect, interval: 8, audio: true, scene });
    const parsed = parseShareURL(new URL(url).search);
    expect(parsed.scene).toBeTruthy();
    expect(parsed.scene.variant).toBe('ribbon');
    expect(parsed.scene.seed).toBe(4321);
    expect(parsed.scene.params).toEqual(scene.params);
    expect(parsed.params).toMatchObject({ density: 0.6, hue: 0.2, seed: 4321 });

    const rebuilt = sceneFromShareURL(new URL(url).search);
    expect(rebuilt.variant).toBe('ribbon');
    expect(rebuilt.seed).toBe(4321);
  });

  it('mantiene compatibilidad con el formato legado', () => {
    const parsed = parseShareURL('?effect=tunnel&interval=15&audio=1&p=%7B%22seed%22%3A3%7D');
    expect(parsed.scene).toBeNull();
    expect(parsed.effect).toBe('tunnel');
    expect(parsed.params).toEqual({ seed: 3 });
    const rebuilt = sceneFromShareURL('?effect=tunnel&p=%7B%22seed%22%3A3%7D');
    expect(rebuilt.effect).toBe('tunnel');
    expect(rebuilt.seed).toBe(3);
  });
});
