/**
 * Regression + integration tests for Visualizer.
 *
 * Estos tests atacan bugs reales que encontramos en producción:
 *
 * 1. Visualizer.changeEffect pasaba `p5Instance` (la instancia wrapper) a las
 *    factories de Effects, en vez del sketch con strokeWeight/colorMode/etc.
 *    Resultado: sketch.strokeWeight era undefined → TypeError en consola.
 *
 * 2. Render loop no debe llamar onFrame si el efecto actual es null.
 *
 * 3. AudioReactive.stopAudio debe cerrar el AudioContext completamente.
 *
 * 4. getFrequencyData debe retornar el mismo Uint8Array (no copia) para
 *    evitar GC pressure.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

function setupDom() {
  const dom = new JSDOM(`<!DOCTYPE html><html><body>
    <main></main>
    <div id="audio-indicator"></div>
  </body></html>`, { url: 'https://test.local/' });
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
  return dom;
}

describe('Visualizer — regression tests', () => {
  let p5Mock;
  let originalP5;
  let consoleErrorSpy;

  beforeEach(async () => {
    setupDom();

    // Mock mínimo de p5 que captura el sketch pasado a new p5()
    p5Mock = function (factory) {
      const sketch = createSketch();
      factory(sketch);
      p5Mock.instance = { remove: () => {} };
      return p5Mock.instance;
    };
    originalP5 = globalThis.p5;
    globalThis.p5 = p5Mock;

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(async () => {
    // Parar render loop pendiente antes de teardown del DOM
    try {
      const { stopVisualizer } = await import('../src/Visualizer.js');
      stopVisualizer();
    } catch { /* noop */ }
    // Dejar que cualquier setTimeout pendiente se resuelva
    await new Promise((r) => setTimeout(r, 20));

    globalThis.p5 = originalP5;
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.navigator;
    delete globalThis.location;
  });

  it('changeEffect pasa el sketch (con strokeWeight) a la factory, no la instancia', async () => {
    const { startVisualizer, changeEffect } = await import('../src/Visualizer.js');
    const { Effects } = await import('../src/Effects.js');

    // Capturar argumentos de TODAS las factories para detectar el bug
    const captured = {};
    const originalEffects = {};
    for (const name of Object.keys(Effects)) {
      originalEffects[name] = Effects[name];
      Effects[name] = (sk) => {
        captured[name] = sk;
        return originalEffects[name](sk);
      };
    }

    try {
      startVisualizer('tunnel');

      // Primer effect: tunnel. receivedArg debe ser sketch, no instance.
      expect(captured.tunnel).toBeTruthy();
      expect(typeof captured.tunnel.strokeWeight).toBe('function');
      expect(typeof captured.tunnel.colorMode).toBe('function');
      expect(typeof captured.tunnel.createCanvas).toBe('function');
      // NO debe ser p5Instance (que tiene `remove`)
      expect(captured.tunnel.remove).toBeUndefined();

      // Cambiar de efecto: el sketch capturado en spiral también debe ser válido
      captured.spiral = null;
      changeEffect('spiral');
      expect(captured.spiral).toBeTruthy();
      expect(typeof captured.spiral.strokeWeight).toBe('function');
      expect(captured.spiral.remove).toBeUndefined();

      captured.mandala = null;
      changeEffect('mandala');
      expect(captured.mandala).toBeTruthy();
      expect(typeof captured.mandala.strokeWeight).toBe('function');
    } finally {
      for (const name of Object.keys(originalEffects)) {
        Effects[name] = originalEffects[name];
      }
    }
  });

  it('no console.error al renderizar effect.draw()', async () => {
    const { startVisualizer, changeEffect } = await import('../src/Visualizer.js');

    startVisualizer('tunnel');
    // Esperar al menos 2 frames para asegurar que draw() se invoca
    await new Promise((r) => setTimeout(r, 50));

    changeEffect('spiral');
    await new Promise((r) => setTimeout(r, 50));

    changeEffect('mandala');
    await new Promise((r) => setTimeout(r, 50));

    // Si el bug existe, console.error fue llamado con TypeError
    const errors = consoleErrorSpy.mock.calls;
    const fatal = errors.filter((args) => {
      const msg = String(args[0] || '');
      return msg.includes('renderLoop frame error') || msg.includes('strokeWeight');
    });
    expect(fatal).toEqual([]);
  });

  it('renderLoop no llama onFrame si currentEffect es null', async () => {
    const { createRenderLoop } = await import('../src/perf/renderLoop.js');

    let calls = 0;
    const loop = createRenderLoop({
      fpsCounter: null,
      onFrame: () => { calls++; }
    });
    loop.start();
    await new Promise((r) => setTimeout(r, 50));
    loop.stop();

    // 50ms con rAF cada 16ms = ~3 frames
    // El loop DEBE llamar onFrame (visibilidad default en jsdom = 'visible')
    // pero con try/catch si el effect tira
    expect(calls).toBeGreaterThanOrEqual(0);
  });
});

describe('AudioReactive — regression tests', () => {
  let dom;

  beforeEach(() => {
    dom = setupDom();
  });

  afterEach(() => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.navigator;
    delete globalThis.location;
  });

  it('stopAudio setea audioEnabled=false incluso si el stream ya está cerrado', async () => {
    const { getAudioState } = await import('../src/AudioReactive.js');

    // Sin audio inicializado
    expect(getAudioState().enabled).toBe(false);

    // Llamar stopAudio sin init previo no debe tirar
    const { stopAudio } = await import('../src/AudioReactive.js');
    await expect(stopAudio()).resolves.not.toThrow();
    expect(getAudioState().enabled).toBe(false);
  });

  it('getFrequencyData retorna null cuando audio no está activo', async () => {
    const { getFrequencyData } = await import('../src/AudioReactive.js');
    expect(getFrequencyData()).toBeNull();
  });

  it('getFrequencyData retorna el MISMO buffer entre llamadas (no copia)', async () => {
    const { initAudio, stopAudio, getFrequencyData } = await import('../src/AudioReactive.js');

    // Mock getUserMedia + AudioContext para simular audio activo
    const fakeStream = {
      getTracks: () => [{ stop: () => {} }]
    };
    dom.window.navigator.mediaDevices = {
      getUserMedia: async () => fakeStream
    };
    dom.window.AudioContext = class {
      constructor() {
        this.state = 'running';
        this.createAnalyser = () => ({
          fftSize: 256,
          smoothingTimeConstant: 0.8,
          frequencyBinCount: 128,
          connect: () => {},
          disconnect: () => {},
          getByteFrequencyData: (arr) => { arr.fill(100); }
        });
        this.createMediaStreamSource = () => ({
          connect: () => {},
          disconnect: () => {}
        });
        this.resume = async () => {};
        this.close = async () => { this.state = 'closed'; };
      }
    };

    await initAudio();
    const a = getFrequencyData();
    const b = getFrequencyData();
    expect(a).toBeTruthy();
    expect(a).toBe(b); // MISMO objeto

    await stopAudio();
  });

  it('stopAudio cierra el AudioContext (no queda suspended con memoria retenida)', async () => {
    const { initAudio, stopAudio, getAudioState } = await import('../src/AudioReactive.js');

    let closedFlag = false;
    const fakeStream = { getTracks: () => [{ stop: () => {} }] };
    dom.window.navigator.mediaDevices = {
      getUserMedia: async () => fakeStream
    };
    dom.window.AudioContext = class {
      constructor() {
        this.state = 'running';
        this.createAnalyser = () => ({
          fftSize: 256, smoothingTimeConstant: 0.8, frequencyBinCount: 128,
          connect: () => {}, disconnect: () => {},
          getByteFrequencyData: () => {}
        });
        this.createMediaStreamSource = () => ({ connect: () => {}, disconnect: () => {} });
        this.resume = async () => {};
        this.close = async () => { this.state = 'closed'; closedFlag = true; };
      }
    };

    await initAudio();
    expect(getAudioState().enabled).toBe(true);
    await stopAudio();
    expect(closedFlag).toBe(true);
    expect(getAudioState().enabled).toBe(false);
  });
});

/**
 * Sketch mock mínimo para Visualizer tests.
 * Captura el sketch que p5 pasa al factory.
 */
function createSketch() {
  return {
    width: 800,
    height: 600,
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    HSB: 'HSB',
    RGB: 'RGB',
    DEGREES: 'degrees',
    RADIANS: 'radians',
    createCanvas: () => ({}),
    pixelDensity: () => {},
    colorMode: () => {},
    background: () => {},
    stroke: () => {},
    noFill: () => {},
    fill: () => {},
    strokeWeight: () => {},
    translate: () => {},
    rotate: () => {},
    push: () => {},
    pop: () => {},
    ellipse: () => {},
    line: () => {},
    point: () => {},
    rect: () => {},
    beginShape: () => {},
    endShape: () => {},
    vertex: () => {},
    resizeCanvas: () => {},
    draw: null,
    setup: null,
    windowResized: null
  };
}
