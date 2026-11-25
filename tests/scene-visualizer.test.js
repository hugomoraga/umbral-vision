import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

function setupDom() {
  const dom = new JSDOM('<!DOCTYPE html><html><body><main></main></body></html>', {
    url: 'https://test.local/'
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.localStorage = dom.window.localStorage;
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
  Object.defineProperty(globalThis, 'location', { value: dom.window.location, configurable: true });
  return dom;
}

function createSketch() {
  const noop = () => {};
  return new Proxy({
    width: 800,
    height: 600,
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    HSB: 0,
    RGB: 1,
    CLOSE: 'close',
    PIE: 'pie'
  }, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return noop;
    }
  });
}

describe('Visualizer scene bridge (p5)', () => {
  let originalP5;

  beforeEach(() => {
    setupDom();
    originalP5 = globalThis.p5;
    globalThis.p5 = function (factory) {
      const sketch = createSketch();
      factory(sketch);
      return { remove: () => {} };
    };
  });

  afterEach(async () => {
    const { stopVisualizer } = await import('../src/Visualizer.js');
    stopVisualizer();
    globalThis.p5 = originalP5;
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.navigator;
    delete globalThis.location;
  });

  it('getScene devuelve la escena p5 activa', async () => {
    const { startVisualizer, getScene } = await import('../src/Visualizer.js');
    startVisualizer('tunnel');
    const scene = getScene();
    expect(scene.effect).toBe('tunnel');
    expect(scene.variant).toBe('tunnel');
    expect(scene.schemaVersion).toBe(2);
  });

  it('setScene cambia de efecto p5 y conserva seed y variante', async () => {
    const { startVisualizer, setScene, getScene, getCurrentEffect } = await import('../src/Visualizer.js');
    const { createScene } = await import('../src/scene/Scene.js');
    startVisualizer('tunnel');
    const scene = createScene({ effect: 'spiral', variant: 'spiral', seed: 123 });
    setScene(scene);
    expect(getCurrentEffect()).toBe('spiral');
    const active = getScene();
    expect(active.effect).toBe('spiral');
    expect(active.variant).toBe('spiral');
    expect(active.seed).toBe(123);
  });
});
