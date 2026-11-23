import { describe, it, expect } from 'vitest';
import {
  computeBands,
  getAudioFeatures,
  getAudioState,
  initAudio,
  tickAudio,
  stopAudio
} from '../src/AudioReactive.js';

function fillSpectrum({ bass = 0, mid = 0, high = 0 } = {}) {
  const data = new Uint8Array(512);
  // 48kHz / 1024 fft → ~46.9 Hz por bin.
  for (let i = 0; i < 6; i++) data[i] = bass;       // 20–280 Hz
  for (let i = 6; i < 43; i++) data[i] = mid;        // 280–2 kHz
  for (let i = 43; i < 256; i++) data[i] = high;     // 2–12 kHz
  return data;
}

describe('computeBands', () => {
  it('separa bajos, medios y agudos', () => {
    const bands = computeBands(fillSpectrum({ bass: 240, mid: 120, high: 60 }), 48000, 1024);
    expect(bands.bass).toBeGreaterThan(bands.mid);
    expect(bands.mid).toBeGreaterThan(bands.high);
    expect(bands.bass).toBeCloseTo(240 / 255, 2);
    expect(bands.rms).toBeGreaterThan(0);
  });

  it('silencio produce ceros', () => {
    const bands = computeBands(new Uint8Array(512), 48000, 1024);
    expect(bands).toEqual({ bass: 0, mid: 0, high: 0, rms: 0 });
  });

  it('tolera input vacío o nulo', () => {
    expect(computeBands(null)).toEqual({ bass: 0, mid: 0, high: 0, rms: 0 });
    expect(computeBands(new Uint8Array(0))).toEqual({ bass: 0, mid: 0, high: 0, rms: 0 });
  });
});

describe('audio features (motor GPU)', () => {
  it('getAudioFeatures retorna el mismo objeto (sin allocations)', () => {
    expect(getAudioFeatures()).toBe(getAudioFeatures());
  });

  it('sin audio las features están en cero', () => {
    const f = getAudioFeatures();
    expect(f.enabled).toBe(false);
    expect(f.bass).toBe(0);
    expect(f.mid).toBe(0);
    expect(f.high).toBe(0);
    expect(f.beat).toBe(0);
    expect(getAudioState().enabled).toBe(false);
  });

  it('tickAudio calcula bandas y beat con smoothing', async () => {
    const fakeStream = { getTracks: () => [{ stop: () => {} }] };
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      value: { mediaDevices: { getUserMedia: async () => fakeStream } },
      configurable: true
    });
    const originalAudioContext = globalThis.AudioContext;
    globalThis.AudioContext = class {
      constructor() {
        this.state = 'running';
        this.sampleRate = 48000;
      }
      createAnalyser() {
        return {
          fftSize: 1024,
          smoothingTimeConstant: 0.8,
          frequencyBinCount: 512,
          connect: () => {},
          disconnect: () => {},
          getByteFrequencyData: (arr) => { arr.set(fillSpectrum({ bass: 255, mid: 180, high: 90 })); }
        };
      }
      createMediaStreamSource() {
        return { connect: () => {}, disconnect: () => {} };
      }
      resume() { return Promise.resolve(); }
      close() { this.state = 'closed'; return Promise.resolve(); }
    };

    await initAudio();
    const features = getAudioFeatures();
    for (let i = 0; i < 50; i++) tickAudio();

    expect(features.enabled).toBe(true);
    expect(features.bass).toBeGreaterThan(0.8);
    expect(features.mid).toBeGreaterThan(features.high);
    expect(features.high).toBeGreaterThan(0.05);
    expect(features.rms).toBeGreaterThan(0);
    // La energía constante no debe disparar beats infinitos.
    expect(features.beat).toBeGreaterThanOrEqual(0);
    expect(features.beat).toBeLessThanOrEqual(1);

    await stopAudio();
    expect(features.enabled).toBe(false);
    expect(features.bass).toBe(0);

    if (originalAudioContext === undefined) delete globalThis.AudioContext;
    else globalThis.AudioContext = originalAudioContext;
    Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, configurable: true });
  });
});

describe('dinámica de bandas', () => {
  it('distingue graves, medios y agudos sin aplanar las bandas', () => {
    const bass = computeBands(fillSpectrum({ bass: 255, mid: 20, high: 10 }), 48000, 1024);
    const mid = computeBands(fillSpectrum({ bass: 10, mid: 255, high: 10 }), 48000, 1024);
    const high = computeBands(fillSpectrum({ bass: 10, mid: 20, high: 255 }), 48000, 1024);

    expect(bass.bass).toBeGreaterThan(bass.mid);
    expect(bass.bass).toBeGreaterThan(bass.high);
    expect(mid.mid).toBeGreaterThan(mid.bass);
    expect(mid.mid).toBeGreaterThan(mid.high);
    expect(high.high).toBeGreaterThan(high.bass);
    expect(high.high).toBeGreaterThan(high.mid);
  });

  it('expone flujo espectral y beat en las features', () => {
    const f = getAudioFeatures();
    expect('flux' in f).toBe(true);
    expect(typeof f.flux).toBe('number');
    expect(f.beat).toBeGreaterThanOrEqual(0);
    expect(f.beat).toBeLessThanOrEqual(1);
  });
});
