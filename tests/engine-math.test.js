import { describe, it, expect } from 'vitest';
import { mulberry32, hash2 } from '../src/engine/math/random.js';
import { identity, multiply, perspective, lookAt, translation } from '../src/engine/math/mat4.js';
import { QUALITY_PROFILES, createAdaptiveResolution, getQualityProfile } from '../src/engine/core/Quality.js';
import { Effect } from '../src/engine/effects/Effect.js';
import { ENGINE_EFFECTS, isEngineEffect, drawFluidPreview } from '../src/engine/registry.js';

describe('deterministic random', () => {
  it('mulberry32 es reproducible con la misma seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 6 }, () => a());
    const seqB = Array.from({ length: 6 }, () => b());
    expect(seqA).toEqual(seqB);
    expect(seqA.every((v) => v >= 0 && v < 1)).toBe(true);
  });

  it('seeds distintas producen secuencias distintas', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });

  it('hash2 es estable y determinista', () => {
    expect(hash2(3, 7, 11)).toBe(hash2(3, 7, 11));
    expect(hash2(3, 7, 11)).not.toBe(hash2(3, 8, 11));
  });
});

describe('matrices', () => {
  it('identity no altera un vector', () => {
    const m = identity();
    expect(Array.from(m)).toEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  });

  it('translation aplica al multiplicar', () => {
    const m = translation(2, -3, 5);
    expect([m[12], m[13], m[14]]).toEqual([2, -3, 5]);
  });

  it('perspective produce w = -z (convención WebGL)', () => {
    const p = perspective(Math.PI / 3, 16 / 9, 0.1, 100);
    // El punto (0,0,-5) debe quedar a w = 5.
    const w = p[11] * -5 + p[15];
    expect(w).toBe(5);
    expect(p[11]).toBe(-1);
  });

  it('lookAt mira desde eye hacia el origen', () => {
    const view = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);
    // El origen en view-space queda en z = -5.
    const z = view[14];
    expect(z).toBeCloseTo(-5, 5);
  });

  it('multiply respeta el orden column-major', () => {
    const t = translation(1, 2, 3);
    const m = multiply(t, identity());
    expect([m[12], m[13], m[14]]).toEqual([1, 2, 3]);
  });
});

describe('quality profiles + adaptive resolution', () => {
  it('expone lite/high/ultra con densidades crecientes', () => {
    expect(QUALITY_PROFILES.lite.particleSize).toBeLessThan(QUALITY_PROFILES.high.particleSize);
    expect(QUALITY_PROFILES.high.particleSize).toBeLessThan(QUALITY_PROFILES.ultra.particleSize);
    expect(getQualityProfile('nope')).toBe(QUALITY_PROFILES.high);
  });

  it('baja la escala tras frames lentos y se recupera tras frames rápidos', () => {
    const profile = { ...QUALITY_PROFILES.high, renderScale: 1.0, minRenderScale: 0.5, targetFrameMs: 19, minFrameMs: 11 };
    const adaptive = createAdaptiveResolution(profile);
    expect(adaptive.scale).toBe(1.0);

    for (let i = 0; i < 44; i++) adaptive.sample(30);
    expect(adaptive.scale).toBe(1.0);
    adaptive.sample(30);
    expect(adaptive.scale).toBeCloseTo(0.9, 5);

    for (let i = 0; i < 180; i++) adaptive.sample(5);
    expect(adaptive.scale).toBeCloseTo(0.95, 5);
  });
});

class DummyEffect extends Effect {
  static schema = {
    speed: { type: 'number', default: 1, min: 0, max: 2 },
    count: { type: 'int', default: 4, min: 1, max: 10 },
    enabled: { type: 'boolean', default: false }
  };

  render() {}
}

describe('Effect parameter contract', () => {
  it('aplica defaults del schema', () => {
    const fx = new DummyEffect();
    expect(fx.getParameters()).toEqual({ speed: 1, count: 4, enabled: false });
  });

  it('clampea, redondea e ignora parámetros desconocidos', () => {
    const fx = new DummyEffect();
    const changed = fx.setParameters({ speed: 99, count: 7.8, enabled: 1, nope: 3 });
    expect(changed).toEqual(['speed', 'count', 'enabled']);
    expect(fx.getParameters()).toEqual({ speed: 2, count: 8, enabled: true });
  });

  it('solo reporta cambios reales y devuelve copia serializable', () => {
    const fx = new DummyEffect({ speed: 0.5 });
    expect(fx.setParameters({ speed: 0.5 })).toEqual([]);
    const copy = fx.getParameters();
    copy.speed = 0;
    expect(fx.getParameters().speed).toBe(0.5);
  });
});

describe('engine registry', () => {
  it('registra fluidFields y su schema', () => {
    expect(isEngineEffect('fluidFields')).toBe(true);
    expect(isEngineEffect('tunnel')).toBe(false);
    const entry = ENGINE_EFFECTS.fluidFields;
    expect(entry.family).toBe('fluid');
    expect(entry.schema.density.default).toBeGreaterThan(0);
    expect(entry.schema.speed.default).toBe(1);
  });

  it('la preview 2D dibuja sin WebGL', () => {
    const calls = [];
    const ctx = new Proxy({}, {
      get(target, prop) {
        if (prop === 'createRadialGradient') return () => ({ addColorStop: () => {} });
        return (...args) => { calls.push([prop, args]); };
      },
      set() { return true; }
    });
    expect(() => drawFluidPreview(ctx, 80, 80, 1.5)).not.toThrow();
    expect(calls.length).toBeGreaterThan(10);
    expect(calls.some(([name]) => name === 'arc')).toBe(true);
  });
});
