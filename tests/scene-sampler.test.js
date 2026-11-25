import { describe, it, expect } from 'vitest';
import {
  sampleScene,
  sampleMany,
  mutateScene,
  crossoverScenes,
  ensureConstraints,
  validateSample,
  familyIdForScene,
  getSamplerSpec
} from '../src/scene/sampler.js';
import { createScene, sceneFingerprint } from '../src/scene/Scene.js';

describe('scene sampler', () => {
  it('genera 100 escenas válidas por familia GPU', () => {
    for (const familyId of ['fluidFields', 'organicStructures', 'mathematicalForms', 'temporalSystems']) {
      const scenes = sampleMany(100, { familyId });
      expect(scenes).toHaveLength(100);
      for (const scene of scenes) {
        expect(validateSample(scene), `${familyId} inválida`).toEqual([]);
        expect(scene.origin).toBe('generated');
      }
    }
  });

  it('es determinista por seed', () => {
    const a = sampleScene({ familyId: 'fluidFields', seed: 12345 });
    const b = sampleScene({ familyId: 'fluidFields', seed: 12345 });
    expect(sceneFingerprint(a)).toBe(sceneFingerprint(b));
    expect(a.variant).toBe(b.variant);
  });

  it('genera variantes distintas dentro de Fluid Fields', () => {
    const variants = new Set();
    for (let seed = 0; seed < 40; seed++) {
      variants.add(sampleScene({ familyId: 'fluidFields', seed }).variant);
    }
    expect(variants.size).toBeGreaterThan(1);
  });

  it('muta conservando familia y variante por defecto', () => {
    const parent = sampleScene({ familyId: 'fluidFields', seed: 77 });
    const child = mutateScene(parent, {
      seed: 88,
      genes: ['hue', 'amplitude'],
      allowVariantChange: false
    });
    expect(child.origin).toBe('mutated');
    expect(child.parentId).toBe(parent.id);
    expect(child.variant).toBe(parent.variant);
    expect(child.effect).toBe(parent.effect);
    expect(validateSample(child)).toEqual([]);
  });

  it('puede cambiar de variante cuando se habilita', () => {
    const parent = sampleScene({ familyId: 'fluidFields', seed: 1 });
    let changed = false;
    for (let seed = 0; seed < 60 && !changed; seed++) {
      const child = mutateScene(parent, { seed, allowVariantChange: true });
      if (child.variant !== parent.variant) changed = true;
    }
    expect(changed).toBe(true);
  });

  it('repara parámetros fuera de rango', () => {
    const repaired = ensureConstraints(createScene({
      effect: 'fluidFields',
      variant: 'membrane',
      params: { density: 99, hue: -5, saturation: 0, exposure: 0.01, bloom: 0 }
    }));
    expect(repaired.params.density).toBeLessThanOrEqual(1);
    expect(repaired.params.hue).toBeGreaterThanOrEqual(0);
    expect(repaired.params.saturation).toBeGreaterThanOrEqual(0.2);
    expect(validateSample(repaired)).toEqual([]);
  });

  it('hace cruce tomando la paleta del segundo', () => {
    const a = sampleScene({ familyId: 'fluidFields', seed: 10 });
    const b = sampleScene({ familyId: 'fluidFields', seed: 20 });
    const mix = crossoverScenes(a, b, { seed: 30 });
    expect(mix.parentId).toBe(a.id);
    expect(mix.palette.hue).toBe(b.palette.hue);
    expect(mix.origin).toBe('mutated');
  });

  it('resuelve familias p5 por variante', () => {
    const scene = sampleScene({ familyId: 'kineticGeometry', variantId: 'spiral', seed: 4 });
    expect(scene.effect).toBe('spiral');
    expect(familyIdForScene(scene)).toBe('kineticGeometry');
    expect(validateSample(scene)).toEqual([]);
  });

  it('expone specs de sampler por familia', () => {
    expect(getSamplerSpec('fluidFields').params.density.max).toBe(1);
    expect(getSamplerSpec('nope')).toBeNull();
  });
});
