import { describe, it, expect, beforeEach } from 'vitest';
import { createPlaylist } from '../src/scene/playlist.js';
import { sampleScene } from '../src/scene/sampler.js';
import { createScene, sceneFingerprint } from '../src/scene/Scene.js';
import { saveScene, getPresetScenes, deletePreset } from '../src/ui/presets.js';
import { buildShareURL, parseShareURL } from '../src/ui/share.js';
import { exportPack, importPack, serializePack } from '../src/scene/packs.js';

function scene(id, extra = {}) {
  return createScene({ id, effect: 'fluidFields', variant: 'membrane', seed: 1, ...extra });
}

describe('end-to-end de escenas', () => {
  beforeEach(() => {
    localStorage.clear();
    for (const p of getPresetScenes()) deletePreset(p.id);
  });

  it('modo curado usa solo escenas guardadas', () => {
    const playlist = createPlaylist({ mode: 'curated', scenes: [scene('a'), scene('b')], noRepeatWindow: 1 });
    for (let i = 0; i < 10; i++) {
      expect(['a', 'b']).toContain(playlist.next().id);
    }
  });

  it('genera, guarda, comparte y reconstruye', () => {
    const generated = sampleScene({ familyId: 'fluidFields', seed: 2024 });
    const preset = saveScene('E2E', generated);
    expect(preset).toBeTruthy();
    expect(getPresetScenes().some((s) => s.seed === 2024)).toBe(true);

    const url = buildShareURL({ effect: generated.effect, scene: generated, audio: false });
    const parsed = parseShareURL(new URL(url).search);
    expect(parsed.scene).toBeTruthy();
    expect(sceneFingerprint(parsed.scene)).toBe(sceneFingerprint(generated));
  });

  it('modo híbrido usa el repertorio guardado y el sampler', () => {
    const saved = saveScene('Guardada', sampleScene({ familyId: 'organicStructures', seed: 7 }));
    const playlist = createPlaylist({
      mode: 'hybrid',
      scenes: [saved.state.scene],
      weights: { curated: 0.5, generated: 0.5 },
      noRepeatWindow: 2
    });
    const ids = new Set();
    for (let i = 0; i < 30; i++) ids.add(playlist.next().id);
    expect(ids.size).toBeGreaterThan(1);
  });

  it('exporta, importa y evita duplicados', () => {
    const a = sampleScene({ familyId: 'fluidFields', seed: 1 });
    const b = sampleScene({ familyId: 'fluidFields', seed: 2 });
    const pack = serializePack(exportPack([a, b], { name: 'E2E pack' }));
    const result = importPack(pack, [a.id]);
    expect(result.added).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.failed).toBe(0);
    expect(result.scenes[0].seed).toBe(2);
  });
});
