import { describe, it, expect } from 'vitest';
import { createFluidHomeData, FLUID_VARIANTS } from '../src/engine/effects/FluidFields.js';
import { sampleScene, validateSample } from '../src/scene/sampler.js';
import { resolveVariant } from '../src/scene/families.js';
import { MATH_FRAG } from '../src/engine/shaders/mathematical.js';
import { TEMPORAL_FRAG } from '../src/engine/shaders/temporal.js';

function signature(data) {
  let sum = 0;
  let weighted = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Math.abs(data[i]);
    weighted += data[i] * ((i % 7) + 1);
  }
  return { sum: Math.round(sum * 1e4), weighted: Math.round(weighted * 1e4) };
}

describe('Fluid Fields variants', () => {
  it('expone las variantes declaradas', () => {
    expect(FLUID_VARIANTS).toEqual(['membrane', 'torus', 'ribbon', 'smoke', 'swarm']);
  });

  it('membrane, torus, ribbon, smoke y swarm son estructuralmente distintas', () => {
    const signatures = [0, 1, 2, 3, 4].map((variant) => signature(createFluidHomeData(variant, 12, 42).home));
    for (let i = 0; i < signatures.length; i++) {
      for (let j = i + 1; j < signatures.length; j++) {
        expect(signatures[i], `variantes ${i}/${j}`).not.toEqual(signatures[j]);
      }
    }
  });

  it('la misma variante y seed produce la misma geometría', () => {
    const a = createFluidHomeData(1, 8, 7);
    const b = createFluidHomeData(1, 8, 7);
    expect(a.home).toEqual(b.home);
    expect(a.pos).toEqual(b.pos);
  });

  it('el sampler puede generar todas las variantes de Fluid Fields', () => {
    for (const variant of ['membrane', 'torus', 'ribbon', 'smoke', 'swarm']) {
      const scene = sampleScene({ familyId: 'fluidFields', variantId: variant, seed: 5 });
      expect(scene.variant).toBe(variant);
      expect(scene.effect).toBe('fluidFields');
      expect(validateSample(scene)).toEqual([]);
      expect(resolveVariant('fluidFields', variant).entry.structural.topology).toBeTruthy();
    }
  });
});

describe('GPU variant coverage', () => {
  const gpuVariants = {
    fluidFields: ['membrane', 'torus', 'ribbon', 'smoke', 'swarm'],
    organicStructures: ['knot', 'cell', 'coral', 'biomech'],
    mathematicalForms: ['mandelbulb', 'knot', 'lattice', 'orb'],
    temporalSystems: ['veil', 'echo', 'smear', 'tunnel']
  };

  it('el sampler puede generar todas las variantes GPU', () => {
    for (const [familyId, variants] of Object.entries(gpuVariants)) {
      for (const variantId of variants) {
        const scene = sampleScene({ familyId, variantId, seed: 11 });
        expect(scene.variant).toBe(variantId);
        expect(validateSample(scene), `${familyId}/${variantId}`).toEqual([]);
      }
    }
  });

  it('los shaders exponen los branches de variantes', () => {
    expect(MATH_FRAG).toContain('uniform int uVariant');
    expect(MATH_FRAG).toContain('sdTorus');
    expect(MATH_FRAG).toContain('sdBox');
    expect(MATH_FRAG).toContain('uVariant == 3');
    expect(TEMPORAL_FRAG).toContain('uniform int uVariant');
    expect(TEMPORAL_FRAG).toContain('uVariant == 1');
    expect(TEMPORAL_FRAG).toContain('uVariant == 2');
    expect(TEMPORAL_FRAG).toContain('uVariant == 3');
  });
});
