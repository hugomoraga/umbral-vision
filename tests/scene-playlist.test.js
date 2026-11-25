import { describe, it, expect, vi } from 'vitest';
import {
  createPlaylist,
  createSceneScheduler,
  quantizeDelay,
  pickWeighted,
  PLAYBACK_MODES
} from '../src/scene/playlist.js';
import { createScene } from '../src/scene/Scene.js';
import { mulberry32 } from '../src/engine/math/random.js';

function scene(id, extra = {}) {
  return createScene({ id, effect: 'fluidFields', variant: 'membrane', seed: 1, ...extra });
}

describe('playlist quantization', () => {
  it('calcula el próximo compás', () => {
    expect(quantizeDelay({ bpm: 120, beatPhase: 0 })).toBeCloseTo(2, 5);
    expect(quantizeDelay({ bpm: 120, beatPhase: 0.5 })).toBeCloseTo(1.75, 5);
    expect(quantizeDelay({ bpm: 120, beatPhase: 0.5, phraseBars: 2 })).toBeCloseTo(3.75, 5);
  });

  it('devuelve null sin BPM', () => {
    expect(quantizeDelay({ bpm: 0, beatPhase: 0 })).toBeNull();
    expect(quantizeDelay({})).toBeNull();
  });

  it('pickWeighted respeta los pesos', () => {
    const items = [{ w: 1 }, { w: 0 }];
    for (let i = 0; i < 20; i++) {
      expect(pickWeighted(items, (item) => item.w, Math.random)).toBe(items[0]);
    }
  });
});

describe('playlist modes', () => {
  it('expone los modos válidos', () => {
    expect(PLAYBACK_MODES).toEqual(['curated', 'generative', 'hybrid']);
  });

  it('en curado solo devuelve escenas guardadas y evita repetir la ventana', () => {
    const scenes = [scene('a'), scene('b'), scene('c'), scene('d')];
    const playlist = createPlaylist({
      mode: 'curated',
      scenes,
      noRepeatWindow: 2,
      rng: mulberry32(5)
    });
    const ids = scenes.map((s) => s.id);
    const history = [];
    for (let i = 0; i < 30; i++) {
      const next = playlist.next();
      expect(ids).toContain(next.id);
      const recent = history.slice(-2);
      expect(recent).not.toContain(next.id);
      history.push(next.id);
    }
    expect(playlist.getState().mode).toBe('curated');
  });

  it('favorece los favoritos en curado', () => {
    const scenes = [scene('fav', { favorite: true }), scene('plain')];
    const playlist = createPlaylist({
      mode: 'curated',
      scenes,
      noRepeatWindow: 0,
      rng: mulberry32(11)
    });
    let fav = 0;
    for (let i = 0; i < 200; i++) {
      if (playlist.next().id === 'fav') fav++;
    }
    expect(fav).toBeGreaterThan(100);
  });

  it('en generativo usa el sampler', () => {
    let calls = 0;
    const playlist = createPlaylist({
      mode: 'generative',
      scenes: [],
      rng: mulberry32(3),
      sampler: {
        sampleScene: ({ seed }) => {
          calls++;
          return scene(`gen-${calls}`, { seed });
        },
        mutateScene: () => scene('mut')
      }
    });
    const next = playlist.next();
    expect(calls).toBeGreaterThanOrEqual(1);
    expect(next.id).toMatch(/^gen-/);
  });

  it('en híbrido puede mezclar guardadas y generadas', () => {
    let generated = 0;
    const playlist = createPlaylist({
      mode: 'hybrid',
      scenes: [scene('saved')],
      weights: { curated: 0.5, generated: 0.5 },
      rng: mulberry32(9),
      sampler: {
        sampleScene: ({ seed }) => {
          generated++;
          return scene(`gen-${generated}`, { seed });
        },
        mutateScene: () => scene('mut')
      }
    });
    for (let i = 0; i < 30; i++) playlist.next();
    expect(generated).toBeGreaterThan(0);
    expect(generated).toBeLessThan(30);
  });

  it('en curado sin escenas no inventa una generada', () => {
    const playlist = createPlaylist({ mode: 'curated', scenes: [] });
    expect(playlist.next()).toBeNull();
  });

  it('cambia de modo y persiste la ventana', () => {
    const playlist = createPlaylist({ mode: 'curated', scenes: [scene('a')] });
    playlist.setMode('generative');
    expect(playlist.mode).toBe('generative');
    playlist.setNoRepeatWindow(4);
    expect(playlist.getState().noRepeatWindow).toBe(4);
  });
});

describe('scene scheduler', () => {
  it('agenda usando la cuantización musical', () => {
    const delays = [];
    const playlist = createPlaylist({
      mode: 'curated',
      scenes: [scene('a'), scene('b')],
      noRepeatWindow: 0,
      rng: mulberry32(1)
    });
    const scheduler = createSceneScheduler({
      playlist,
      onScene: vi.fn(),
      intervalMs: 9999,
      getAudio: () => ({ bpm: 120, beatPhase: 0.5 }),
      setTimeoutFn: (fn, delay) => { delays.push(delay); return 1; },
      clearTimeoutFn: () => {}
    });
    scheduler.start();
    expect(delays[0]).toBeCloseTo(1750, 5);
    scheduler.stop();
  });

  it('sin audio usa el intervalo de respaldo', () => {
    const delays = [];
    const playlist = createPlaylist({ mode: 'curated', scenes: [scene('a')], noRepeatWindow: 0 });
    const scheduler = createSceneScheduler({
      playlist,
      onScene: vi.fn(),
      intervalMs: 4321,
      getAudio: () => null,
      setTimeoutFn: (fn, delay) => { delays.push(delay); return 1; },
      clearTimeoutFn: () => {}
    });
    scheduler.start();
    expect(delays[0]).toBe(4321);
    scheduler.stop();
  });
});
