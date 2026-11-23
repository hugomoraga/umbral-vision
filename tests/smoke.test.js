import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

const stubSketch = () => {
  const noop = () => {};
  return new Proxy({
    width: 800,
    height: 600,
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    HSB: 0,
    RGB: 1,
    DEGREES: 'degrees',
    RADIANS: 'radians'
  }, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return noop;
    }
  });
};

describe('package metadata', () => {
  it('has correct name and version', () => {
    expect(pkg.name).toBe('@kndl/umbral-vision');
    expect(pkg.version).toBe('0.3.3');
  });

  it('has main, module and exports', () => {
    expect(pkg.main).toBe('./dist/index.cjs');
    expect(pkg.module).toBe('./dist/index.mjs');
    expect(pkg.exports['.']).toBeDefined();
  });

  it('declares p5 as peer dependency', () => {
    expect(pkg.peerDependencies.p5).toBeDefined();
  });

  it('targets node >= 18', () => {
    expect(pkg.engines.node).toBe('>=18');
  });

  it('publishConfig is public with provenance', () => {
    expect(pkg.publishConfig.access).toBe('public');
    expect(pkg.publishConfig.provenance).toBe(true);
  });
});

describe('umbral-vision API surface', () => {
  it('exports Visualizer functions', async () => {
    const uv = await import('../src/index.js');
    expect(typeof uv.startVisualizer).toBe('function');
    expect(typeof uv.changeEffect).toBe('function');
    expect(typeof uv.getCurrentEffect).toBe('function');
    expect(typeof uv.getAvailableEffects).toBe('function');
    expect(typeof uv.stopVisualizer).toBe('function');
  });

  it('exports AudioReactive functions', async () => {
    const uv = await import('../src/index.js');
    expect(typeof uv.initAudio).toBe('function');
    expect(typeof uv.stopAudio).toBe('function');
    expect(typeof uv.getAudioState).toBe('function');
    expect(typeof uv.getFrequencyData).toBe('function');
  });

  it('exports Transition functions', async () => {
    const uv = await import('../src/index.js');
    expect(typeof uv.startAutoTransition).toBe('function');
    expect(typeof uv.stopAutoTransition).toBe('function');
    expect(typeof uv.isAutoTransitionEnabled).toBe('function');
  });

  it('exports Effects object with all 15 effects', async () => {
    const uv = await import('../src/index.js');
    expect(uv.Effects).toBeDefined();
    const names = Object.keys(uv.Effects).sort();
    expect(names).toEqual([
      'biomech', 'dune', 'fractal', 'fractalGlitch', 'glitch',
      'mandala', 'matrix', 'melt', 'particles', 'sacredGeometry',
      'spiral', 'tunnel', 'waveGlitch', 'waves', 'yinYang'
    ]);
  });

  it('exports Utils helpers', async () => {
    const uv = await import('../src/index.js');
    expect(typeof uv.getInputValue).toBe('function');
    expect(typeof uv.normalize).toBe('function');
    expect(typeof uv.map).toBe('function');
    expect(typeof uv.constrain).toBe('function');
    expect(typeof uv.lerp).toBe('function');
  });
});

describe('Effect factories', () => {
  it('tunnel factory returns draw that does not throw', async () => {
    const uv = await import('../src/index.js');
    const sk = stubSketch();
    const fx = uv.Effects.tunnel(sk);
    expect(typeof fx.draw).toBe('function');
    expect(() => fx.draw()).not.toThrow();
  });

  it('all effect factories produce draw() that does not throw', async () => {
    const uv = await import('../src/index.js');
    for (const [name, factory] of Object.entries(uv.Effects)) {
      const sk = stubSketch();
      const fx = factory(sk);
      expect(typeof fx.draw, `${name}.draw is not a function`).toBe('function');
      expect(() => fx.draw(), `${name}.draw() threw`).not.toThrow();
    }
  });
});
