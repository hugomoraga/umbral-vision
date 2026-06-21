/**
 * Micro-benchmark de coste por effect (CPU only — sin GPU/render real).
 * Mide ms/frame promediando 100 frames con un mock de sketch que cuenta operaciones.
 */

import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'https://test.local/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.defineProperty(globalThis, 'location', { value: dom.window.location, configurable: true });

// Sketch spy que cuenta operaciones (no GPU pero aproxima CPU cost)
function createSpy() {
  let drawCalls = 0;
  let mathCalls = 0;
  const noop = () => { drawCalls++; };
  const mathFn = () => { mathCalls++; return 0; };
  return {
    spy: { drawCalls: () => drawCalls, mathCalls: () => mathCalls },
    sketch: {
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
      dist: (x1, y1) => x1 + y1,
      sin: mathFn, cos: mathFn, tan: mathFn, atan2: mathFn, sqrt: mathFn,
      abs: mathFn, floor: mathFn, ceil: mathFn, round: mathFn
    }
  };
}

const { Effects } = await import('./src/Effects.js');

const results = [];
for (const name of Object.keys(Effects).sort()) {
  const { spy, sketch } = createSpy();
  const fx = Effects[name](sketch);
  // Warmup
  for (let i = 0; i < 5; i++) fx.draw();
  // Measure
  const N = 100;
  const t0 = performance.now();
  for (let i = 0; i < N; i++) fx.draw();
  const elapsed = performance.now() - t0;
  const msPerFrame = elapsed / N;
  const opsPerFrame = spy.drawCalls();
  results.push({ name, msPerFrame: msPerFrame.toFixed(3), opsPerFrame, mathCalls: spy.mathCalls() });
}

console.log('\n=== Effects cost benchmark (1920x1080 mock, 100 frames avg) ===\n');
console.log('effect'.padEnd(20), 'ms/frame'.padEnd(12), 'drawOps'.padEnd(12), 'mathOps');
console.log('-'.repeat(60));
for (const r of results) {
  console.log(r.name.padEnd(20), r.msPerFrame.padEnd(12), String(r.opsPerFrame).padEnd(12), r.mathCalls);
}
console.log('\nTarget: <8.3ms/frame para 120fps, <16.7ms para 60fps');
process.exit(0);
