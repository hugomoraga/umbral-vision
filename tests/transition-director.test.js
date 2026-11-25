import { describe, it, expect } from 'vitest';
import {
  TRANSITION_TYPES,
  chooseTransition,
  easeTransition,
  transitionMode,
  cssEasing,
  transitionFeedbackBoost
} from '../src/scene/transitionDirector.js';
import { createScene } from '../src/scene/Scene.js';

const from = createScene({ effect: 'fluidFields', variant: 'membrane', seed: 1 });
const otherFamily = createScene({ effect: 'organicStructures', variant: 'knot', seed: 2 });
const sameFamily = createScene({ effect: 'fluidFields', variant: 'torus', seed: 3 });

describe('transition director', () => {
  it('es determinista con seed', () => {
    const a = chooseTransition({ from, to: otherFamily, seed: 123 });
    const b = chooseTransition({ from, to: otherFamily, seed: 123 });
    expect(a).toEqual(b);
    expect(TRANSITION_TYPES).toContain(a.type);
  });

  it('respeta el rango de duración', () => {
    for (let seed = 0; seed < 50; seed++) {
      const t = chooseTransition({ from, to: otherFamily, seed });
      expect(t.durationMs).toBeGreaterThanOrEqual(900);
      expect(t.durationMs).toBeLessThanOrEqual(3800);
      expect(t.direction).toHaveLength(2);
    }
  });

  it('evita repetir el último tipo cuando hay alternativas', () => {
    for (let seed = 0; seed < 40; seed++) {
      const t = chooseTransition({ from, to: otherFamily, seed, lastType: 'zoom' });
      expect(t.type).not.toBe('zoom');
    }
  });

  it('en la misma familia prefiere transiciones suaves', () => {
    for (let seed = 0; seed < 30; seed++) {
      const t = chooseTransition({ from, to: sameFamily, seed, sameBackend: true });
      expect(['dissolve', 'zoom', 'luma']).toContain(t.type);
      expect(t.sameFamily).toBe(true);
    }
  });

  it('entre backends usa transiciones de overlay', () => {
    for (let seed = 0; seed < 30; seed++) {
      const t = chooseTransition({ from, to: otherFamily, seed, sameBackend: false });
      expect(['luma', 'dissolve', 'wipe']).toContain(t.type);
      expect(t.sameBackend).toBe(false);
    }
  });

  it('la energía musical acorta la transición', () => {
    const calm = chooseTransition({ from, to: otherFamily, seed: 7, audio: { level: 0 } });
    const loud = chooseTransition({
      from,
      to: otherFamily,
      seed: 7,
      audio: { level: 1, kickFlash: 1, bassFast: 1 }
    });
    expect(loud.durationMs).toBeLessThan(calm.durationMs);
    expect(loud.energy).toBeGreaterThan(calm.energy);
  });

  it('easing llega a 0 y 1 y es monótono', () => {
    for (const name of ['smooth', 'cubic', 'expo', 'linear']) {
      expect(easeTransition(name, 0)).toBe(0);
      expect(easeTransition(name, 1)).toBe(1);
      let prev = -1;
      for (let i = 0; i <= 20; i++) {
        const value = easeTransition(name, i / 20);
        expect(value).toBeGreaterThanOrEqual(prev - 1e-9);
        prev = value;
      }
    }
  });

  it('mapea tipos a modos de shader y feedback', () => {
    expect(transitionMode('dissolve')).toBe(0);
    expect(transitionMode('luma')).toBe(1);
    expect(transitionMode('zoom')).toBe(2);
    expect(transitionMode('wipe')).toBe(3);
    expect(transitionMode('feedback')).toBe(1);
    expect(cssEasing('cubic')).toContain('cubic-bezier');
    expect(transitionFeedbackBoost('feedback').amount).toBeGreaterThan(0);
    expect(transitionFeedbackBoost('zoom').zoom).toBeGreaterThan(0);
    expect(transitionFeedbackBoost('dissolve')).toBeNull();
  });
});
