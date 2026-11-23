import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  initAudio,
  stopAudio,
  tickAudio,
  getAudioFeatures
} from '../src/AudioReactive.js';
import { setAudioOverride, resetAudioOverrides } from '../src/audio/audioConfig.js';

const BEAT_TICKS = 24; // 60fps → 0.4s → 150 BPM

function installAudioMock() {
  let tick = 0;
  const fakeStream = { getTracks: () => [{ stop: () => {} }] };

  Object.defineProperty(globalThis, 'navigator', {
    value: { mediaDevices: { getUserMedia: async () => fakeStream } },
    configurable: true
  });

  globalThis.AudioContext = class {
    constructor() {
      this.state = 'running';
      this.sampleRate = 44100;
    }
    createAnalyser() {
      return {
        context: { sampleRate: 44100 },
        fftSize: 1024,
        smoothingTimeConstant: 0.35,
        frequencyBinCount: 512,
        connect: () => {},
        disconnect: () => {},
        getByteFrequencyData: (arr) => {
          arr.fill(4);
          const phase = tick % BEAT_TICKS;
          // Kick: bins 1-2 (≈43–86 Hz) con ataque y cuerpo.
          if (phase < 2) {
            arr[1] = 255;
            arr[2] = 235;
          } else if (phase < 4) {
            arr[1] = 90;
            arr[2] = 70;
          } else {
            arr[1] = 12;
            arr[2] = 8;
          }
          // Sostenido suave para que el RMS no sea cero.
          for (let i = 6; i < 40; i += 4) arr[i] = 18;
          tick++;
        }
      };
    }
    createMediaStreamSource() {
      return { connect: () => {}, disconnect: () => {} };
    }
    resume() { return Promise.resolve(); }
    close() { this.state = 'closed'; return Promise.resolve(); }
  };
}

describe('kick tracker + tempo', () => {
  beforeEach(async () => {
    installAudioMock();
    resetAudioOverrides();
    await initAudio();
  });

  afterEach(async () => {
    await stopAudio();
    resetAudioOverrides();
    if (globalThis.AudioContext) delete globalThis.AudioContext;
  });

  it('detecta kicks y estima un BPM cercano a 150', () => {
    let onsets = 0;
    const bpmSamples = [];
    for (let i = 0; i < 300; i++) {
      tickAudio(1 / 60);
      const f = getAudioFeatures();
      if (f.kickOnset) onsets++;
      if (f.bpm > 0) bpmSamples.push(f.bpm);
    }
    expect(onsets).toBeGreaterThanOrEqual(6);
    expect(onsets).toBeLessThanOrEqual(14);
    const bpm = bpmSamples.slice(-10).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(10, bpmSamples.length));
    expect(bpm).toBeGreaterThan(135);
    expect(bpm).toBeLessThan(165);
  });

  it('en modo grid dispara ~1 vez por negra', () => {
    setAudioOverride('sync.mode', 'grid');
    let triggers = 0;
    for (let i = 0; i < 300; i++) {
      tickAudio(1 / 60);
      if (getAudioFeatures().kickTrigger) triggers++;
    }
    expect(triggers).toBeGreaterThanOrEqual(6);
    expect(triggers).toBeLessThanOrEqual(14);
  });

  it('en modo off no dispara kicks', () => {
    setAudioOverride('sync.mode', 'off');
    let triggers = 0;
    for (let i = 0; i < 120; i++) {
      tickAudio(1 / 60);
      if (getAudioFeatures().kickTrigger) triggers++;
    }
    expect(triggers).toBe(0);
  });

  it('expone BPM y fase para la UI', () => {
    for (let i = 0; i < 180; i++) tickAudio(1 / 60);
    const f = getAudioFeatures();
    expect(f.bpm).toBeGreaterThan(0);
    expect(f.beatPhase).toBeGreaterThanOrEqual(0);
    expect(f.beatPhase).toBeLessThanOrEqual(1);
    expect(f.syncMode).toBeDefined();
  });
});
