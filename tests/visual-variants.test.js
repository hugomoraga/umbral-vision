import { describe, it, expect } from 'vitest';
import { createFluidHomeData, FLUID_VARIANTS } from '../src/engine/effects/FluidFields.js';
import { sampleScene, validateSample } from '../src/scene/sampler.js';
import { resolveVariant } from '../src/scene/families.js';

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

  it('membrane, torus y ribbon son estructuralmente distintas', () => {
    const membrane = createFluidHomeData(0, 12, 42);
    const torus = createFluidHomeData(1, 12, 42);
    const ribbon = createFluidHomeData(2, 12, 42);
    const a = signature(membrane.home);
    const b = signature(torus.home);
    const c = signature(ribbon.home);
    expect(a).not.toEqual(b);
    expect(a).not.toEqual(c);
    expect(b).not.toEqual(c);
  });

  it('la misma variante y seed produce la misma geometría', () => {
    const a = createFluidHomeData(1, 8, 7);
    const b = createFluidHomeData(1, 8, 7);
    expect(a.home).toEqual(b.home);
    expect(a.pos).toEqual(b.pos);
  });

  it('el sampler puede generar torus y ribbon válidos', () => {
    for (const variant of ['torus', 'ribbon']) {
      const scene = sampleScene({ familyId: 'fluidFields', variantId: variant, seed: 5 });
      expect(scene.variant).toBe(variant);
      expect(scene.effect).toBe('fluidFields');
      expect(validateSample(scene)).toEqual([]);
      expect(resolveVariant('fluidFields', variant).entry.structural.topology).toBeTruthy();
    }
  });
});
