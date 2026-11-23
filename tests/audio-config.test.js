import { describe, it, expect, afterEach } from 'vitest';
import {
  DEFAULT_AUDIO_MAP,
  mergeAudioMap,
  getAudioMap,
  setAudioOverride,
  resetAudioOverrides,
  loadAudioMap
} from '../src/audio/audioConfig.js';

describe('audio map', () => {
  afterEach(() => {
    resetAudioOverrides();
    delete window.UV_AUDIO_MAP;
  });

  it('hace merge profundo sin mutar los defaults', () => {
    const merged = mergeAudioMap(DEFAULT_AUDIO_MAP, {
      kick: { depth: 0.2, rangeHz: [40, 100] },
      sync: { mode: 'kick' }
    });
    expect(merged.kick.depth).toBe(0.2);
    expect(merged.kick.rangeHz).toEqual([40, 100]);
    expect(merged.sync.mode).toBe('kick');
    expect(merged.sync.fallbackBpm).toBe(DEFAULT_AUDIO_MAP.sync.fallbackBpm);
    expect(DEFAULT_AUDIO_MAP.kick.depth).toBe(0.7);
  });

  it('aplica overrides por path y los resetea', () => {
    setAudioOverride('kick.depth', 0.33);
    setAudioOverride('midFlow.twist', 0.5);
    expect(getAudioMap().kick.depth).toBe(0.33);
    expect(getAudioMap().midFlow.twist).toBe(0.5);

    resetAudioOverrides();
    expect(getAudioMap().kick.depth).toBe(DEFAULT_AUDIO_MAP.kick.depth);
    expect(getAudioMap().midFlow.twist).toBe(DEFAULT_AUDIO_MAP.midFlow.twist);
  });

  it('acepta inyección desde window.UV_AUDIO_MAP', async () => {
    window.UV_AUDIO_MAP = { sync: { mode: 'off', bpm: 140 }, kick: { depth: 0.9 } };
    const map = await loadAudioMap('http://invalid.test/no.json');
    expect(map.sync.mode).toBe('off');
    expect(map.sync.bpm).toBe(140);
    expect(map.kick.depth).toBe(0.9);
  });

  it('fallback si el fetch falla', async () => {
    const map = await loadAudioMap('http://invalid.test/no.json');
    expect(map.sync.mode).toBe(DEFAULT_AUDIO_MAP.sync.mode);
    expect(map.kick.decaySec).toBe(DEFAULT_AUDIO_MAP.kick.decaySec);
  });
});
