import { describe, it, expect } from 'vitest';
import {
  SCENE_SCHEMA_VERSION,
  createScene,
  validateScene,
  serializeScene,
  deserializeScene,
  sceneFingerprint,
  encodeSceneCompact,
  decodeSceneCompact,
  legacyStateToScene,
  sceneToEffectParams,
  sceneToLegacyState
} from '../src/scene/Scene.js';

describe('scene model', () => {
  it('crea una escena normalizada con defaults', () => {
    const scene = createScene({ effect: 'fluidFields', variant: 'torus', seed: 42 });
    expect(scene.schemaVersion).toBe(SCENE_SCHEMA_VERSION);
    expect(scene.effect).toBe('fluidFields');
    expect(scene.variant).toBe('torus');
    expect(scene.seed).toBe(42);
    expect(scene.params).toEqual({});
    expect(scene.palette.hue).toBeGreaterThanOrEqual(0);
    expect(scene.post.feedback).toBeGreaterThan(0);
    expect(validateScene(scene).valid).toBe(true);
  });

  it('serializa y deserializa sin pérdida', () => {
    const scene = createScene({
      effect: 'organicStructures',
      variant: 'knot',
      seed: 7,
      params: { amplitude: 0.3, hue: 0.4 },
      palette: { mode: 'procedural', hue: 0.2, saturation: 0.8 },
      moment: { timeOffset: 12.5 },
      tags: ['test']
    });
    const round = deserializeScene(serializeScene(scene));
    expect(sceneFingerprint(round)).toBe(sceneFingerprint(scene));
    expect(round.moment.timeOffset).toBe(12.5);
    expect(round.tags).toEqual(['test']);
  });

  it('fingerprint es determinista y cambia con la seed', () => {
    const a = createScene({ effect: 'fluidFields', variant: 'membrane', seed: 1 });
    const b = createScene({ effect: 'fluidFields', variant: 'membrane', seed: 1 });
    const c = createScene({ effect: 'fluidFields', variant: 'membrane', seed: 2 });
    expect(sceneFingerprint(a)).toBe(sceneFingerprint(b));
    expect(sceneFingerprint(a)).not.toBe(sceneFingerprint(c));
  });

  it('codifica y decodifica el genoma compacto', () => {
    const scene = createScene({
      effect: 'fluidFields',
      variant: 'ribbon',
      seed: 1234,
      params: { density: 0.8, hue: 0.3 },
      palette: { hue: 0.1, saturation: 0.7 }
    });
    const encoded = encodeSceneCompact(scene);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    const decoded = decodeSceneCompact(encoded);
    expect(decoded.effect).toBe(scene.effect);
    expect(decoded.variant).toBe(scene.variant);
    expect(decoded.seed).toBe(scene.seed);
    expect(decoded.params).toEqual(scene.params);
    expect(decoded.palette.hue).toBe(scene.palette.hue);
  });

  it('decodeSceneCompact tolera basura', () => {
    expect(decodeSceneCompact('')).toBeNull();
    expect(decodeSceneCompact('no-es-base64')).toBeNull();
  });

  it('migra presets legados conservando id y nombre', () => {
    const scene = legacyStateToScene(
      { effect: 'tunnel', params: { seed: 33, hue: 0.2 } },
      { id: 'p_1', name: 'Viejo', createdAt: '2024-01-01T00:00:00.000Z' }
    );
    expect(scene.id).toBe('p_1');
    expect(scene.name).toBe('Viejo');
    expect(scene.effect).toBe('tunnel');
    expect(scene.variant).toBe('tunnel');
    expect(scene.seed).toBe(33);
    expect(scene.params.hue).toBe(0.2);
  });

  it('convierte escena a estado legado sin perder params', () => {
    const scene = createScene({ effect: 'fluidFields', variant: 'torus', seed: 9, params: { hue: 0.5 } });
    const legacy = sceneToLegacyState(scene, { interval: 12, audioEnabled: true });
    expect(legacy.effect).toBe('fluidFields');
    expect(legacy.interval).toBe(12);
    expect(legacy.audioEnabled).toBe(true);
    expect(legacy.params.seed).toBe(9);
    expect(legacy.params.hue).toBe(0.5);
    expect(legacy.scene.effect).toBe('fluidFields');
  });

  it('sceneToEffectParams incluye seed y excluye metadatos', () => {
    const scene = createScene({ effect: 'fluidFields', variant: 'torus', seed: 11, params: { hue: 0.3 } });
    expect(sceneToEffectParams(scene)).toEqual({ hue: 0.3, seed: 11 });
  });

  it('rechaza una versión futura', () => {
    expect(() => deserializeScene(JSON.stringify({ schemaVersion: 99, effect: 'x' })))
      .toThrow(/no soportada/);
  });

  it('marca escenas inválidas', () => {
    expect(validateScene({}).valid).toBe(false);
    const bad = createScene({ effect: 'fluidFields' });
    bad.seed = -1;
    expect(validateScene(bad).errors.join(' ')).toContain('seed');
  });
});
