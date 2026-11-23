/**
 * Performance benchmark tests.
 *
 * Cada effect debe correr por debajo de MAX_MS_PER_FRAME en el mock
 * de sketch (1920×1080, 100 frames). Si un refactor futuro degrada
 * performance, este test falla en CI.
 *
 * ponytail: el threshold es de CPU puro (no GPU), por eso es generoso
 * (2ms). En el browser real con GPU el efecto es aún más rápido, pero
 * si un cambio hace que la lógica JS pase de 0.07ms a 5ms, es señal
 * de regresión que este test atrapa.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

const MAX_MS_PER_FRAME = 2.0; // ~120fps en hardware modesto

function setupDom() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'https://test.local/' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.localStorage = dom.window.localStorage;
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
  Object.defineProperty(globalThis, 'location', { value: dom.window.location, configurable: true });
}

function createSpySketch() {
  const noop = () => {};
  return {
    width: 1920, height: 1080,
    PI: Math.PI, TWO_PI: Math.PI * 2, HALF_PI: Math.PI / 2,
    HSB: 'HSB', RGB: 'RGB', CLOSE: 'close',
    push: noop, pop: noop, translate: noop, rotate: noop,
    background: noop, fill: noop, noFill: noop, stroke: noop, noStroke: noop,
    strokeWeight: noop, colorMode: noop,
    beginShape: noop, vertex: noop, endShape: noop,
    ellipse: noop, line: noop, point: noop, rect: noop, circle: noop, quad: noop, arc: noop,
    constrain: (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
    map: (v, a, b, c, d) => c + (v - a) * (d - c) / (b - a),
    random: () => 0.5, noise: () => 0.5,
    createCanvas: () => ({}), pixelDensity: noop, resizeCanvas: noop, millis: () => 0,
    textSize: noop, text: noop, textAlign: noop, textFont: noop,
    dist: () => 0, sin: () => 0, cos: () => 0, tan: () => 0, atan2: () => 0, sqrt: () => 0,
    abs: () => 0, floor: () => 0, ceil: () => 0, round: () => 0
  };
}

const ALL_EFFECTS = [
  'tunnel', 'spiral', 'mandala', 'particles', 'waves', 'fractal', 'matrix',
  'glitch', 'melt', 'fractalGlitch', 'waveGlitch', 'sacredGeometry',
  'biomech', 'dune', 'yinYang'
];

describe('Performance — bench regression (max 2ms/frame)', () => {
  beforeEach(setupDom);
  afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.navigator;
    delete globalThis.location;
  });

  for (const name of ALL_EFFECTS) {
    it(`${name}: <${MAX_MS_PER_FRAME}ms/frame (1920x1080, 100 frames avg)`, async () => {
      const { Effects } = await import('../src/Effects.js');
      const sketch = createSpySketch();
      const fx = Effects[name](sketch);

      for (let i = 0; i < 5; i++) fx.draw(); // warmup

      const N = 100;
      const t0 = performance.now();
      for (let i = 0; i < N; i++) fx.draw();
      const msPerFrame = (performance.now() - t0) / N;

      expect(msPerFrame, `${name}: ${msPerFrame.toFixed(3)}ms/frame`).toBeLessThan(MAX_MS_PER_FRAME);
    });
  }
});

describe('Performance — lite mode reduce elementos', () => {
  beforeEach(setupDom);
  afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.navigator;
    delete globalThis.location;
  });

  it('mandala: lite mode dibuja MENOS vértices que full mode', async () => {
    const { Effects } = await import('../src/Effects.js');
    let opsFull = 0;
    let opsLite = 0;
    const skFull = { ...createSpySketch(), beginShape: () => opsFull++, vertex: () => opsFull++ };
    const skLite = { ...createSpySketch(), beginShape: () => opsLite++, vertex: () => opsLite++ };

    const fxFull = Effects.mandala(skFull);
    const fxLite = Effects.mandala(skLite);

    for (let i = 0; i < 10; i++) fxFull.draw({ isLite: false });
    for (let i = 0; i < 10; i++) fxLite.draw({ isLite: true });

    expect(opsLite).toBeLessThan(opsFull);
    expect(opsLite).toBeLessThan(opsFull * 0.6);
  });

  it('fractal: lite mode dibuja MENOS líneas (≥50% reduction)', async () => {
    const { Effects } = await import('../src/Effects.js');
    let opsFull = 0;
    let opsLite = 0;
    const skFull = { ...createSpySketch(), line: () => opsFull++ };
    const skLite = { ...createSpySketch(), line: () => opsLite++ };

    const fxFull = Effects.fractal(skFull);
    const fxLite = Effects.fractal(skLite);

    for (let i = 0; i < 10; i++) fxFull.draw({ isLite: false });
    for (let i = 0; i < 10; i++) fxLite.draw({ isLite: true });

    expect(opsLite).toBeLessThan(opsFull);
    expect(opsLite).toBeLessThan(opsFull * 0.5);
  });

  it('dune: lite mode dibuja MENOS vértices que full mode', async () => {
    const { Effects } = await import('../src/Effects.js');
    let opsFull = 0;
    let opsLite = 0;
    const skFull = { ...createSpySketch(), vertex: () => opsFull++ };
    const skLite = { ...createSpySketch(), vertex: () => opsLite++ };

    const fxFull = Effects.dune(skFull);
    const fxLite = Effects.dune(skLite);

    for (let i = 0; i < 10; i++) fxFull.draw({ isLite: false });
    for (let i = 0; i < 10; i++) fxLite.draw({ isLite: true });

    expect(opsLite).toBeLessThan(opsFull);
  });

  it('waveGlitch: lite mode dibuja MENOS vértices que full mode', async () => {
    const { Effects } = await import('../src/Effects.js');
    let opsFull = 0;
    let opsLite = 0;
    const skFull = { ...createSpySketch(), vertex: () => opsFull++ };
    const skLite = { ...createSpySketch(), vertex: () => opsLite++ };

    const fxFull = Effects.waveGlitch(skFull);
    const fxLite = Effects.waveGlitch(skLite);

    for (let i = 0; i < 10; i++) fxFull.draw({ isLite: false });
    for (let i = 0; i < 10; i++) fxLite.draw({ isLite: true });

    expect(opsLite).toBeLessThan(opsFull);
  });
});
