import { describe, it, expect } from 'vitest';
import { Effects } from '../src/Effects.js';

function stubSketch() {
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

describe('p5 visual variants', () => {
  const cases = [
    ['mandala', 'flower'],
    ['waves', 'interference'],
    ['biomech', 'coral'],
    ['biomech', 'tendril']
  ];

  it('dibujan sin errores con su variante', () => {
    for (const [effect, variant] of cases) {
      const sketch = stubSketch();
      const fx = Effects[effect](sketch);
      expect(() => fx.draw({ isLite: false, variant }), `${effect}/${variant}`).not.toThrow();
    }
  });

  it('siguen funcionando con config vacío', () => {
    for (const [effect] of cases) {
      const sketch = stubSketch();
      const fx = Effects[effect](sketch);
      expect(() => fx.draw({})).not.toThrow();
    }
  });
});
