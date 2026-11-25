import { describe, it, expect } from 'vitest';
import { sampleScene, mutateScene } from '../src/scene/sampler.js';
import { sceneFingerprint } from '../src/scene/Scene.js';
import { listFamilies } from '../src/scene/families.js';

describe('sampler performance and determinism', () => {
  it('genera y muta escenas dentro de un presupuesto razonable', () => {
    const start = performance.now();
    const scenes = [];
    for (let i = 0; i < 1000; i++) {
      scenes.push(sampleScene({ familyId: 'fluidFields', seed: i }));
    }
    for (let i = 0; i < 500; i++) {
      mutateScene(scenes[i], { seed: 10000 + i, genes: ['hue', 'amplitude'] });
    }
    const elapsed = performance.now() - start;
    expect(scenes).toHaveLength(1000);
    expect(elapsed).toBeLessThan(2000);
  });

  it('las familias principales son deterministas con seed fija', () => {
    for (const family of listFamilies({ includeClassics: false })) {
      const a = sampleScene({ familyId: family.id, seed: 123 });
      const b = sampleScene({ familyId: family.id, seed: 123 });
      expect(sceneFingerprint(a), family.id).toBe(sceneFingerprint(b));
    }
  });
});
