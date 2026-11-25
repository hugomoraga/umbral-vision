import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  initAudio,
  stopAudio,
  tickAudio,
  getAudioFeatures,
  getWaveformData
} from '../src/AudioReactive.js';
import { resetAudioOverrides } from '../src/audio/audioConfig.js';

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
        smoothingTimeConstant: 0.2,
        frequencyBinCount: 512,
        connect: () => {},
        disconnect: () => {},
        getByteFrequencyData: (arr) => {
          arr.fill(4);
          if (tick >= 3 && tick < 6) {
            arr[1] = 255;
            arr[2] = 240;
            arr[3] = 220;
          }
          for (let i = 8; i < 40; i += 2) arr[i] = 60;
          for (let i = 60; i < 200; i += 8) arr[i] = 30;
          tick++;
        },
        getByteTimeDomainData: (arr) => {
          arr.fill(128);
          if (tick > 1 && tick < 6) {
            for (let i = 0; i < arr.length; i += 4) {
              arr[i] = 128 + (i % 8 === 0 ? 90 : -70);
            }
          }
        }
      };
    }
    createMediaStreamSource() {
      return { connect: () => {}, disconnect: () => {} };
    }
    resume() { return Promise.resolve(); }
    close() { this.state = 'closed'; return Promise.resolve(); }
  };
  return () => { tick = 0; };
}

describe('audio fast/slow signals', () => {
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

  it('expone fast y slow por banda', () => {
    for (let i = 0; i < 3; i++) tickAudio(1 / 60);
    const f = getAudioFeatures();
    expect(f.bassFast).toBeGreaterThan(0);
    expect(f.bassSlow).toBeGreaterThan(0);
    expect(f.midFast).toBeGreaterThan(0);
    expect(f.highFast).toBeGreaterThan(0);
    // AGC independiente: un grave fuerte no debe anular los agudos.
    expect(f.highFast).toBeGreaterThan(0.02);
    expect(typeof f.bassOnset).toBe('boolean');
  });

  it('el fast decae antes que el slow', () => {
    for (let i = 0; i < 4; i++) tickAudio(1 / 60);
    const peakFast = getAudioFeatures().bassFast;
    for (let i = 0; i < 18; i++) tickAudio(1 / 60);
    const f = getAudioFeatures();
    expect(peakFast).toBeGreaterThan(0);
    expect(f.bassFast).toBeLessThan(f.bassSlow);
  });

  it('analiza la forma de onda y reporta transiente', () => {
    for (let i = 0; i < 6; i++) tickAudio(1 / 60);
    const f = getAudioFeatures();
    expect(f.waveRms).toBeGreaterThan(0);
    expect(f.transient).toBeGreaterThan(0);
    expect(getWaveformData()).toBe(getWaveformData());
    expect(getWaveformData().length).toBe(2048);
  });

  it('dispara onset de graves al menos una vez', () => {
    let onsets = 0;
    for (let i = 0; i < 30; i++) {
      tickAudio(1 / 60);
      if (getAudioFeatures().bassOnset) onsets++;
    }
    expect(onsets).toBeGreaterThanOrEqual(1);
  });
});
