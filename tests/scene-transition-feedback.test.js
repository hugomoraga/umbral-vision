import { describe, it, expect, afterEach } from 'vitest';
import { resolveTransitionMs } from '../src/engine/UmbralEngine.js';
import { MIX_FRAG, FEEDBACK_FRAG } from '../src/engine/shaders/post.js';
import {
  DEFAULT_AUDIO_MAP,
  getAudioMap,
  setAudioOverride,
  resetAudioOverrides
} from '../src/audio/audioConfig.js';

describe('transition duration', () => {
  it('acepta duración fija', () => {
    expect(resolveTransitionMs(1000)).toBe(1000);
    expect(resolveTransitionMs(0)).toBe(0);
    expect(resolveTransitionMs(undefined)).toBe(0);
  });

  it('auto varía dentro de 1.5–4 s', () => {
    expect(resolveTransitionMs('auto', () => 0)).toBe(1500);
    expect(resolveTransitionMs('auto', () => 1)).toBe(4000);
    const value = resolveTransitionMs('auto', () => 0.5);
    expect(value).toBeGreaterThan(1500);
    expect(value).toBeLessThan(4000);
  });
});

describe('post shaders', () => {
  it('el mix soporta modo luma', () => {
    expect(MIX_FRAG).toContain('uMode');
    expect(MIX_FRAG).toContain('lumaOf');
  });

  it('el feedback tiene zoom, rotación, warp, decay y clamp', () => {
    expect(FEEDBACK_FRAG).toContain('uPrev');
    expect(FEEDBACK_FRAG).toContain('uFeedback');
    expect(FEEDBACK_FRAG).toContain('uDecay');
    expect(FEEDBACK_FRAG).toContain('uZoom');
    expect(FEEDBACK_FRAG).toContain('uRotation');
    expect(FEEDBACK_FRAG).toContain('uWarp');
    expect(FEEDBACK_FRAG).toContain('min(color, vec3(2.2))');
  });
});

describe('audio map feedback/agc', () => {
  afterEach(() => resetAudioOverrides());

  it('expone defaults seguros', () => {
    expect(DEFAULT_AUDIO_MAP.feedback.amount).toBeGreaterThan(0);
    expect(DEFAULT_AUDIO_MAP.feedback.amount).toBeLessThan(0.6);
    expect(DEFAULT_AUDIO_MAP.feedback.decay).toBeGreaterThan(0.8);
    expect(DEFAULT_AUDIO_MAP.agc.onsetThreshold).toBeGreaterThan(1);
  });

  it('permite override en runtime sin recargar', () => {
    setAudioOverride('agc.onsetThreshold', 2.1);
    setAudioOverride('feedback.amount', 0.4);
    expect(getAudioMap().agc.onsetThreshold).toBe(2.1);
    expect(getAudioMap().feedback.amount).toBe(0.4);
  });
});
