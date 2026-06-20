import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

function setupDom() {
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { url: 'https://test.local/' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.localStorage = dom.window.localStorage;
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  Object.defineProperty(globalThis, 'navigator', {
    value: dom.window.navigator, configurable: true
  });
  Object.defineProperty(globalThis, 'location', {
    value: dom.window.location, configurable: true
  });
}

/**
 * Mock completo de p5 sketch que cuenta pushes/pops anidados.
 * Si el stack NO está en 0 al final de un draw, hay un leak de transformaciones.
 */
function createBalanceSpy() {
  let stackDepth = 0;
  let maxDepth = 0;
  let pushCount = 0;
  let popCount = 0;
  const noop = () => {};

  return {
    spy: {
      push() { pushCount++; stackDepth++; if (stackDepth > maxDepth) maxDepth = stackDepth; },
      pop() { popCount++; stackDepth = Math.max(0, stackDepth - 1); },
      depth: () => stackDepth,
      maxDepth: () => maxDepth,
      pushCount: () => pushCount,
      popCount: () => popCount,
      reset() { stackDepth = 0; maxDepth = 0; pushCount = 0; popCount = 0; }
    },
    sketch: {
      width: 800, height: 600,
      PI: Math.PI, TWO_PI: Math.PI * 2, HALF_PI: Math.PI / 2,
      HSB: 'HSB', RGB: 'RGB', CLOSE: 'close',
      // transform stack tracking
      push: () => { pushCount++; stackDepth++; if (stackDepth > maxDepth) maxDepth = stackDepth; },
      pop: () => { popCount++; stackDepth = Math.max(0, stackDepth - 1); },
      translate: noop, rotate: noop,
      // drawing API
      background: noop, fill: noop, noFill: noop, stroke: noop, noStroke: noop,
      strokeWeight: noop, colorMode: noop,
      beginShape: noop, vertex: noop, endShape: noop,
      ellipse: noop, line: noop, point: noop, rect: noop,
      // p5 utils
      constrain: (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
      map: (v, a, b, c, d) => c + (v - a) * (d - c) / (b - a),
      random: Math.random,
      noise: () => 0,
      createCanvas: () => ({}),
      pixelDensity: noop,
      resizeCanvas: noop,
      // timers
      millis: () => 0
    }
  };
}

describe('Effects — transform balance tests', () => {
  beforeEach(setupDom);
  afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.navigator;
    delete globalThis.location;
  });

  it('mandala: stack de transformaciones en 0 después de cada draw (no drift)', async () => {
    const { Effects } = await import('../src/Effects.js');
    const { spy, sketch } = createBalanceSpy();
    const fx = Effects.mandala(sketch);

    fx.draw();
    expect(spy.depth(), 'después de 1 draw, stack debe ser 0').toBe(0);

    for (let i = 0; i < 60; i++) fx.draw();
    expect(spy.depth(), 'después de 60 draws, stack debe ser 0').toBe(0);

    // El max depth alcanzado da una idea del coste de transformaciones
    // (no es assertion dura, es métrica informativa)
    expect(spy.maxDepth()).toBeGreaterThan(0);
  });

  it('mandala: pushes y pops balanceados tras N frames', async () => {
    const { Effects } = await import('../src/Effects.js');
    const { spy, sketch } = createBalanceSpy();
    const fx = Effects.mandala(sketch);
    for (let i = 0; i < 30; i++) fx.draw();
    expect(spy.pushCount()).toBe(spy.popCount());
  });

  it('todos los effects que no requieren API extendida: pushes y pops balanceados', async () => {
    const { Effects } = await import('../src/Effects.js');
    // effects con API adicional de p5 (textSize, circle, dist) se excluyen —
    // el bug que testea este test es desbalance de push/pop, no cobertura de API.
    const EXCLUDED = new Set(['particles', 'matrix', 'yinYang']);
    const failures = [];

    for (const name of Object.keys(Effects)) {
      if (EXCLUDED.has(name)) continue;
      const { spy, sketch } = createBalanceSpy();
      const fx = Effects[name](sketch);
      for (let i = 0; i < 30; i++) fx.draw();
      if (spy.depth() !== 0) {
        failures.push(`${name}: depth=${spy.depth()} (push=${spy.pushCount()}, pop=${spy.popCount()})`);
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
});
