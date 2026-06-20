import { describe, it, expect } from 'vitest';
import { createFpsCounter } from '../src/perf/fpsCounter.js';
import { ObjectPool } from '../src/perf/objectPool.js';
import { detectProfile, getLiteMode, setLiteMode } from '../src/perf/deviceProfile.js';

describe('fpsCounter', () => {
  it('reports 0 when no ticks', () => {
    const c = createFpsCounter();
    expect(c.getInstant()).toBe(0);
    expect(c.getAvg()).toBe(0);
    expect(c.getLow1Percent()).toBe(0);
  });

  it('computes instant fps from delta', () => {
    const c = createFpsCounter();
    c.tick(16.67);
    expect(c.getInstant()).toBeCloseTo(60, 0);
    expect(c.getFrameMs()).toBeCloseTo(16.67, 1);
  });

  it('computes average over multiple ticks', () => {
    const c = createFpsCounter();
    c.tick(16);
    c.tick(20);
    c.tick(24);
    const avgMs = (16 + 20 + 24) / 3;
    expect(c.getAvg()).toBeCloseTo(1000 / avgMs, 0);
  });

  it('computes 1% low (worst frame)', () => {
    const c = createFpsCounter();
    for (let i = 0; i < 50; i++) c.tick(16);
    c.tick(100); // spike
    const low = c.getLow1Percent();
    // worst sample = 100ms → 10 fps
    expect(low).toBeLessThanOrEqual(15);
  });

  it('reset clears state', () => {
    const c = createFpsCounter();
    c.tick(16);
    c.reset();
    expect(c.getInstant()).toBe(0);
    expect(c.getAvg()).toBe(0);
  });
});

describe('ObjectPool', () => {
  it('creates initial pool', () => {
    const p = new ObjectPool(() => ({ x: 0 }), (o) => { o.x = 0; }, 5);
    expect(p.size()).toBe(5);
  });

  it('acquire returns object from pool', () => {
    let counter = 0;
    const p = new ObjectPool(() => ({ id: counter++ }), (_o) => {}, 5);
    const a = p.acquire();
    const b = p.acquire();
    expect(a.id).not.toBe(b.id);
    expect(p.size()).toBe(3);
  });

  it('release returns object to pool after reset', () => {
    const p = new ObjectPool(() => ({ value: 0 }), (o) => { o.value = 42; }, 1);
    const a = p.acquire();
    expect(a.value).toBe(0);
    a.value = 99;
    p.release(a);
    expect(p.size()).toBe(1);
    const b = p.acquire();
    expect(b.value).toBe(42); // reset aplicado
  });

  it('factory called when pool is empty', () => {
    let count = 0;
    const p = new ObjectPool(() => ({ id: count++ }), (_o) => {}, 1);
    p.acquire();
    p.acquire(); // pool vacío → crea nuevo
    p.acquire();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

describe('deviceProfile', () => {
  it('detectProfile returns expected fields', () => {
    const p = detectProfile();
    expect(p).toHaveProperty('hardwareConcurrency');
    expect(p).toHaveProperty('isMobile');
    expect(p).toHaveProperty('isLiteRecommended');
    expect(p).toHaveProperty('dpr');
    expect(p.dpr).toBeLessThanOrEqual(1.5);
    expect(p.dpr).toBeGreaterThan(0);
  });

  it('lite mode toggle persists in localStorage', () => {
    setLiteMode(true);
    expect(getLiteMode()).toBe(true);
    setLiteMode(false);
    expect(getLiteMode()).toBe(false);
    // cleanup
    localStorage.removeItem('umbral-vision:lite-mode');
  });

  it('getLiteMode falls back to detectProfile.isLiteRecommended when no override', () => {
    localStorage.removeItem('umbral-vision:lite-mode');
    const profile = detectProfile();
    expect(getLiteMode()).toBe(profile.isLiteRecommended);
  });
});
