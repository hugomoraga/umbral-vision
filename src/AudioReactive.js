/**
 * AudioReactive — análisis musical con kick, tempo y bandas.
 *
 * v0.8:
 *  - bandas graves/medios/agudos con ganancia global (conserva la relación)
 *  - volumen RMS absoluto
 *  - envolventes lentas por banda para movimiento (bass body / mid flow / shimmer)
 *  - detección de kick por flux en la banda baja + refractario
 *  - tracking de BPM y fase; modo `grid` (4/4), `kick` o `off`
 *  - triggers visuales con latencia configurable
 *
 * getAudioFeatures() retorna el MISMO objeto cada frame.
 */

import { getAudioMap } from './audio/audioConfig.js';

let audioContext = null;
let analyser = null;
let microphone = null;
let audioStream = null;
let dataArray = null;
let timeArray = null;
let prevSpectrum = null;
let prevWaveRms = 0;
let audioEnabled = false;

const FFT_SIZE = 2048;
const ANALYSER_SMOOTHING = 0.35;
const ATTACK_TAU = 0.045;
const RELEASE_TAU = 0.22;
const FAST_ATTACK_TAU = 0.012;
const FAST_RELEASE_TAU = 0.09;
const LEVEL_ATTACK_TAU = 0.035;
const LEVEL_RELEASE_TAU = 0.16;
const BEAT_HISTORY = 30;
const KICK_HISTORY = 32;

const BANDS = {
  bass: [20, 160],
  mid: [160, 2000],
  high: [2000, 12000]
};

const features = {
  enabled: false,
  level: 0,
  rms: 0,
  bass: 0,
  mid: 0,
  high: 0,
  beat: 0,
  energy: 0,
  flux: 0,
  bassBody: 0,
  midFlow: 0,
  highShimmer: 0,
  bassFast: 0,
  midFast: 0,
  highFast: 0,
  bassSlow: 0,
  midSlow: 0,
  highSlow: 0,
  waveRms: 0,
  transient: 0,
  bassOnset: false,
  midOnset: false,
  highOnset: false,
  kick: 0,
  kickFlash: 0,
  kickTrigger: false,
  kickStrength: 0,
  kickOnset: false,
  kickInterval: 0,
  kickFlux: 0,
  kickEnergy: 0,
  bpm: 0,
  beatPhase: 0,
  tempoConfidence: 0,
  syncMode: 'grid'
};

let gainPeak = 0.12;
const gainPeaks = { bass: 0.12, mid: 0.12, high: 0.12 };
const bandFluxAvg = { bass: 0.001, mid: 0.001, high: 0.001 };
let audioClock = 0;

const fluxHistory = new Float32Array(BEAT_HISTORY);
let fluxIndex = 0;
let fluxFilled = 0;
let beatEnvelope = 0;
let lastBeatAt = -10;

const kickFluxHistory = new Float32Array(KICK_HISTORY);
let kickFluxIndex = 0;
let kickFluxFilled = 0;

let lastOnsetAt = -10;
const lastBandOnsetAt = { bass: -10, mid: -10, high: -10 };
let lastOnsetStrength = 0;
let prevKickEnergy = 0;
let lastVisualKickAt = -10;
let kickEnvelope = 0;
let kickFlash = 0;
const onsetIntervals = [];
let bpmEstimate = 0;
let tempoConfidence = 0;
let gridNextAt = 0;
let pendingTriggers = [];
let lastMode = null;

// ---------------------------------------------------------------------------
// Utilidades puras
// ---------------------------------------------------------------------------

function averageRange(data, from, to) {
  const start = Math.max(0, Math.floor(from));
  const end = Math.min(data.length, Math.max(start + 1, Math.ceil(to)));
  let sum = 0;
  for (let i = start; i < end; i++) sum += data[i];
  return sum / (end - start) / 255;
}

/**
 * Bandas crudas a partir del FFT.
 * @param {Uint8Array} data
 * @param {number} sampleRate
 * @param {number} fftSize
 */
export function computeBands(data, sampleRate = 44100, fftSize = FFT_SIZE) {
  if (!data || data.length === 0) return { bass: 0, mid: 0, high: 0, rms: 0 };
  const binCount = data.length;
  const hzPerBin = sampleRate / fftSize;
  const idx = (hz) => hz / hzPerBin;

  let squareSum = 0;
  for (let i = 0; i < binCount; i++) {
    const v = data[i] / 255;
    squareSum += v * v;
  }
  const rms = Math.min(1, Math.sqrt(squareSum / binCount) * 1.6);

  const ranges = {
    bass: [idx(BANDS.bass[0]), idx(BANDS.bass[1])],
    mid: [idx(BANDS.mid[0]), idx(BANDS.mid[1])],
    high: [idx(BANDS.high[0]), idx(BANDS.high[1])]
  };

  return {
    bass: averageRange(data, ranges.bass[0], ranges.bass[1]),
    mid: averageRange(data, ranges.mid[0], ranges.mid[1]),
    high: averageRange(data, ranges.high[0], ranges.high[1]),
    rms
  };
}

function median(values) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mad(values, center) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + Math.abs(v - center), 0) / values.length;
}

function smooth(current, target, dt, attackTau = ATTACK_TAU, releaseTau = RELEASE_TAU) {
  const tau = target > current ? attackTau : releaseTau;
  const alpha = 1 - Math.exp(-Math.max(0, dt) / Math.max(0.001, tau));
  return current + (target - current) * alpha;
}

function tauFromMs(ms, fallback) {
  const value = Number(ms);
  return Number.isFinite(value) && value > 0 ? value / 1000 / 3 : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function autoGain(rawMax, dt, map) {
  const decay = Math.pow(0.996, Math.max(0, dt) * 60);
  gainPeak = Math.max(rawMax, gainPeak * decay);
  const auto = clamp(Number(map.dynamics?.autoGain ?? 0.6), 0, 1);
  const floor = Math.max(0.01, Number(map.dynamics?.floor ?? 0.04));
  return Math.max(gainPeak * (1 - auto * 0.35), floor);
}

/**
 * Ganancia automática independiente por banda. Evita que un grave muy fuerte
 * aplaste la respuesta de medios y agudos.
 */
function autoGainBand(key, rawMax, dt, map) {
  const decayRate = Number(map.agc?.decay ?? 0.996);
  const decay = Math.pow(decayRate, Math.max(0, dt) * 60);
  gainPeaks[key] = Math.max(rawMax, gainPeaks[key] * decay);
  const auto = clamp(Number(map.agc?.autoGain ?? map.dynamics?.autoGain ?? 0.6), 0, 1);
  const floor = Math.max(0.008, Number(map.agc?.floor ?? map.dynamics?.floor ?? 0.03));
  return Math.max(gainPeaks[key] * (1 - auto * 0.35), floor);
}

function resetFeatures() {
  features.enabled = false;
  for (const key of Object.keys(features)) {
    if (key === 'syncMode') features[key] = 'grid';
    else if (key === 'kickTrigger' || key === 'kickOnset' || key === 'enabled' || key.endsWith('Onset')) {
      features[key] = false;
    } else features[key] = 0;
  }
  gainPeak = 0.12;
  gainPeaks.bass = 0.12;
  gainPeaks.mid = 0.12;
  gainPeaks.high = 0.12;
  bandFluxAvg.bass = 0.001;
  bandFluxAvg.mid = 0.001;
  bandFluxAvg.high = 0.001;
  prevWaveRms = 0;
  if (timeArray) timeArray.fill(128);
  audioClock = 0;
  fluxIndex = 0;
  fluxFilled = 0;
  fluxHistory.fill(0);
  beatEnvelope = 0;
  lastBeatAt = -10;
  kickFluxIndex = 0;
  kickFluxFilled = 0;
  kickFluxHistory.fill(0);
  lastOnsetAt = -10;
  lastBandOnsetAt.bass = -10;
  lastBandOnsetAt.mid = -10;
  lastBandOnsetAt.high = -10;
  lastOnsetStrength = 0;
  prevKickEnergy = 0;
  lastVisualKickAt = -10;
  kickEnvelope = 0;
  kickFlash = 0;
  onsetIntervals.length = 0;
  bpmEstimate = 0;
  tempoConfidence = 0;
  gridNextAt = 0;
  pendingTriggers = [];
  lastMode = null;
  if (prevSpectrum) prevSpectrum.fill(0);
}

// ---------------------------------------------------------------------------
// Kick + tempo
// ---------------------------------------------------------------------------

function updateTempo(now, interval) {
  const map = getAudioMap();
  const minBpm = Number(map.sync?.minBpm ?? 80);
  const maxBpm = Number(map.sync?.maxBpm ?? 180);
  const minInterval = 60 / maxBpm;
  const maxInterval = 60 / minBpm;

  if (interval < minInterval || interval > maxInterval) return;

  onsetIntervals.push(interval);
  if (onsetIntervals.length > 8) onsetIntervals.shift();

  const med = median(onsetIntervals);
  bpmEstimate = med > 0 ? clamp(60 / med, minBpm, maxBpm) : 0;
  const deviation = med > 0 ? mad(onsetIntervals, med) / med : 1;
  const countConfidence = clamp(onsetIntervals.length / 4, 0, 1);
  tempoConfidence = clamp((1 - deviation * 7) * countConfidence, 0, 1);
}

function effectiveBpm(map) {
  const manual = map.sync?.bpm;
  if (typeof manual === 'number' && Number.isFinite(manual)) {
    return clamp(manual, Number(map.sync?.minBpm ?? 80), Number(map.sync?.maxBpm ?? 180));
  }
  return bpmEstimate || Number(map.sync?.fallbackBpm ?? 128);
}

function scheduleKick(strength, at, map) {
  const latency = Math.max(0, Number(map.sync?.visualLatencyMs ?? 28)) / 1000;
  pendingTriggers.push({ at: at + latency, strength: clamp(strength, 0, 1) });
  if (pendingTriggers.length > 8) pendingTriggers.shift();
}

function fireKick(strength, now) {
  lastVisualKickAt = now;
  kickEnvelope = strength;
  kickFlash = 1;
  features.kick = strength;
  features.kickFlash = 1;
  features.kickTrigger = true;
  features.kickStrength = strength;
}

function processTriggers(now) {
  if (!pendingTriggers.length) return;
  const due = [];
  pendingTriggers = pendingTriggers.filter((item) => {
    if (item.at <= now) {
      due.push(item);
      return false;
    }
    return true;
  });
  if (due.length) {
    const strongest = due.reduce((a, b) => (b.strength > a.strength ? b : a));
    fireKick(strongest.strength, now);
  }
}

// ---------------------------------------------------------------------------
// Análisis por frame
// ---------------------------------------------------------------------------

function analyze(dt) {
  const map = getAudioMap();
  const sampleRate = analyser.context?.sampleRate || 44100;
  const fftSize = analyser.fftSize || FFT_SIZE;
  const raw = computeBands(dataArray, sampleRate, fftSize);

  features.syncMode = map.sync?.mode || 'grid';
  features.kickTrigger = false;
  features.kickOnset = false;

  if (features.syncMode !== lastMode) {
    pendingTriggers = [];
    gridNextAt = 0;
    lastMode = features.syncMode;
  }

  // Bandas normalizadas con ganancia independiente por banda.
  const n = dataArray.length;
  const hzPerBin = sampleRate / fftSize;
  const rangeOf = (from, to) => [
    Math.max(1, Math.floor(from / hzPerBin)),
    Math.min(n - 1, Math.ceil(to / hzPerBin))
  ];
  const bassRange = rangeOf(BANDS.bass[0], BANDS.bass[1]);
  const midRange = rangeOf(BANDS.mid[0], BANDS.mid[1]);
  const highRange = rangeOf(BANDS.high[0], BANDS.high[1]);

  const gainBass = autoGainBand('bass', raw.bass, dt, map);
  const gainMid = autoGainBand('mid', raw.mid, dt, map);
  const gainHigh = autoGainBand('high', raw.high, dt, map);
  // Mezcla la normalización por banda con una referencia global: conserva la
  // respuesta independiente sin aplanar la relación entre bandas.
  const globalGain = autoGain(Math.max(raw.bass, raw.mid, raw.high), dt, map);
  const blendBand = (value, gainBand) => Math.min(1.5,
    (value / gainBand) * 0.7 + (value / globalGain) * 0.3);
  const nbass = blendBand(raw.bass, gainBass);
  const nmid = blendBand(raw.mid, gainMid);
  const nhigh = blendBand(raw.high, gainHigh);

  features.rms = smooth(features.rms, Math.min(1.5, raw.rms * 2.6), dt, LEVEL_ATTACK_TAU, LEVEL_RELEASE_TAU);
  features.bass = smooth(features.bass, nbass, dt);
  features.mid = smooth(features.mid, nmid, dt);
  features.high = smooth(features.high, nhigh, dt);

  // Señales rápidas: el golpe, sin las envolventes lentas.
  features.bassFast = smooth(features.bassFast, nbass, dt, FAST_ATTACK_TAU, FAST_RELEASE_TAU);
  features.midFast = smooth(features.midFast, nmid, dt, FAST_ATTACK_TAU, FAST_RELEASE_TAU);
  features.highFast = smooth(features.highFast, nhigh, dt, FAST_ATTACK_TAU, FAST_RELEASE_TAU);

  // Envolventes lentas para gestos (no para tiritar).
  features.bassBody = smooth(features.bassBody, nbass, dt,
    tauFromMs(map.bassBody?.attackMs, 0.06), tauFromMs(map.bassBody?.releaseMs, 0.6));
  features.midFlow = smooth(features.midFlow, nmid, dt,
    tauFromMs(map.midFlow?.attackMs, 0.08), tauFromMs(map.midFlow?.releaseMs, 0.5));
  features.highShimmer = smooth(features.highShimmer, nhigh, dt,
    tauFromMs(map.highShimmer?.attackMs, 0.02), tauFromMs(map.highShimmer?.releaseMs, 0.18));
  features.bassSlow = features.bassBody;
  features.midSlow = features.midFlow;
  features.highSlow = features.highShimmer;

  // Forma de onda: energía temporal y transiente.
  let waveRms = 0;
  let wavePeak = 0;
  if (timeArray && timeArray.length) {
    let sum = 0;
    for (let i = 0; i < timeArray.length; i++) {
      const v = (timeArray[i] - 128) / 128;
      sum += v * v;
      const abs = Math.abs(v);
      if (abs > wavePeak) wavePeak = abs;
    }
    waveRms = Math.sqrt(sum / timeArray.length);
  }
  const waveRise = Math.max(0, waveRms - prevWaveRms);
  prevWaveRms = waveRms;
  features.waveRms = smooth(features.waveRms, Math.min(1, waveRms * 3.5), dt, 0.02, 0.12);
  features.transient = smooth(features.transient, Math.min(1, waveRise * 18 + wavePeak * 0.08), dt, 0.01, 0.1);

  features.energy = features.bass * 0.55 + features.mid * 0.3 + features.high * 0.15;
  features.level = Math.min(1, features.rms * 1.15 + features.energy * 0.22);

  // --- spectral flux global, por banda y de la banda de kick ---
  let flux = 0;
  let kickFlux = 0;
  let kickEnergy = 0;
  let bassFlux = 0;
  let midFlux = 0;
  let highFlux = 0;
  const lowA = Number(map.kick?.rangeHz?.[0] ?? 35);
  const lowB = Number(map.kick?.rangeHz?.[1] ?? 120);
  const lowStart = Math.max(1, Math.floor(lowA / hzPerBin));
  const lowEnd = Math.min(n - 1, Math.ceil(lowB / hzPerBin));

  if (prevSpectrum && prevSpectrum.length === n) {
    for (let i = 0; i < n; i++) {
      const delta = dataArray[i] - prevSpectrum[i];
      if (delta > 0) {
        flux += delta;
        if (i >= lowStart && i <= lowEnd) kickFlux += delta;
        if (i >= bassRange[0] && i <= bassRange[1]) bassFlux += delta;
        else if (i >= midRange[0] && i <= midRange[1]) midFlux += delta;
        else if (i >= highRange[0] && i <= highRange[1]) highFlux += delta;
      }
      prevSpectrum[i] = dataArray[i];
    }
  } else {
    prevSpectrum = new Float32Array(n);
    for (let i = 0; i < n; i++) prevSpectrum[i] = dataArray[i];
  }

  // Onsets por banda con promedio móvil y refractario independiente.
  const bandOnsetThreshold = Math.max(1.25, Number(map.agc?.onsetThreshold ?? 1.6));
  const bandMinFlux = Math.max(0.0005, Number(map.agc?.onsetMinFlux ?? 0.0015));
  const bandRefractory = Math.max(0.06, Number(map.agc?.refractoryMs ?? 140) / 1000);
  const bandFluxValues = {
    bass: (bassFlux / Math.max(1, bassRange[1] - bassRange[0] + 1) / 255) * 5.5,
    mid: (midFlux / Math.max(1, midRange[1] - midRange[0] + 1) / 255) * 4.2,
    high: (highFlux / Math.max(1, highRange[1] - highRange[0] + 1) / 255) * 4.8
  };
  for (const key of ['bass', 'mid', 'high']) {
    const value = bandFluxValues[key];
    const avg = bandFluxAvg[key];
    const fired = value > avg * bandOnsetThreshold
      && value > bandMinFlux
      && audioClock - lastBandOnsetAt[key] > bandRefractory;
    features[`${key}Onset`] = fired;
    if (fired) lastBandOnsetAt[key] = audioClock;
    bandFluxAvg[key] = avg * 0.92 + value * 0.08;
  }

  for (let i = lowStart; i <= lowEnd; i++) kickEnergy += dataArray[i];
  kickEnergy = kickEnergy / Math.max(1, lowEnd - lowStart + 1) / 255;
  const kickRise = kickEnergy - prevKickEnergy;
  prevKickEnergy = kickEnergy;
  flux = (flux / n / 255) * 3.2;
  kickFlux = (kickFlux / Math.max(1, lowEnd - lowStart + 1) / 255) * 6.5;

  // Beat global (compatibilidad / p5).
  fluxHistory[fluxIndex] = flux;
  fluxIndex = (fluxIndex + 1) % BEAT_HISTORY;
  if (fluxFilled < BEAT_HISTORY) fluxFilled++;
  let fluxAvg = 0;
  for (let i = 0; i < fluxFilled; i++) fluxAvg += fluxHistory[i];
  fluxAvg = fluxFilled > 0 ? fluxAvg / fluxFilled : 0;

  beatEnvelope *= Math.exp(-dt / 0.14);
  if (beatEnvelope < 0.001) beatEnvelope = 0;
  if (fluxFilled === BEAT_HISTORY && flux > fluxAvg * 1.55 && flux > 0.012
      && audioClock - lastBeatAt > 0.12) {
    beatEnvelope = 1;
    lastBeatAt = audioClock;
  }
  features.beat = beatEnvelope;

  // Kick onset.
  kickFluxHistory[kickFluxIndex] = kickFlux;
  kickFluxIndex = (kickFluxIndex + 1) % KICK_HISTORY;
  if (kickFluxFilled < KICK_HISTORY) kickFluxFilled++;
  let kickAvg = 0;
  for (let i = 0; i < kickFluxFilled; i++) kickAvg += kickFluxHistory[i];
  kickAvg = kickFluxFilled > 0 ? kickAvg / kickFluxFilled : 0;

  const threshold = Math.max(1.05, Number(map.kick?.threshold ?? 1.55));
  const minFlux = Math.max(0.001, Number(map.kick?.minFlux ?? 0.006));
  const beatInterval = bpmEstimate > 0 ? 60 / effectiveBpm(map) : 0;
  const refractory = Math.max(
    Math.max(0.05, Number(map.kick?.refractoryMs ?? 180) / 1000),
    beatInterval * 0.85
  );
  const sensitivity = clamp(Number(map.kick?.sensitivity ?? 1), 0.2, 4);

  const isOnset = kickFluxFilled >= 6
    && kickFlux > kickAvg * threshold / sensitivity
    && kickFlux > minFlux
    && kickEnergy > 0.04
    && kickRise > 0.025
    && audioClock - lastOnsetAt > refractory;

  if (isOnset) {
    const strength = clamp(
      0.35 + kickFlux / Math.max(0.001, kickAvg * threshold) * 0.45 + kickEnergy * 0.5,
      0.35,
      1
    );
    let interval = audioClock - lastOnsetAt;
    if (lastOnsetAt >= 0) {
      // Pliega intervalos al rango musical: evita que un onset extra (medio
      // tiempo) duplique el BPM. 80–180 BPM ⇒ 0.333–0.75 s.
      const minInterval = 60 / Number(map.sync?.maxBpm ?? 180);
      const maxInterval = 60 / Number(map.sync?.minBpm ?? 80);
      let folded = interval;
      while (folded > 0 && folded < minInterval) folded *= 2;
      while (folded > maxInterval) folded /= 2;
      interval = folded;
      features.kickInterval = interval;
      updateTempo(audioClock, interval);
    }
    features.kickOnset = true;
    lastOnsetAt = audioClock;
    lastOnsetStrength = strength;

    if (map.sync?.mode === 'kick') {
      scheduleKick(strength, audioClock, map);
    } else if (map.sync?.mode === 'grid' && !bpmEstimate) {
      // Sin BPM todavía: fallback al kick real.
      scheduleKick(strength, audioClock, map);
    }
  }

  // Trigger de grilla 4/4.
  if (map.sync?.mode === 'grid' && (bpmEstimate > 0 || typeof map.sync?.bpm === 'number')) {
    const interval = 60 / effectiveBpm(map);
    if (!gridNextAt || gridNextAt < audioClock - interval * 2) {
      gridNextAt = (lastOnsetAt >= 0 ? lastOnsetAt : audioClock) + interval;
    }
    let guard = 0;
    while (audioClock >= gridNextAt && guard < 2) {
      const recent = audioClock - lastOnsetAt;
      const strength = recent < interval * 1.45
        ? Math.max(0.4, lastOnsetStrength * (1 - recent / (interval * 2)))
        : 0.35;
      scheduleKick(strength, gridNextAt, map);
      gridNextAt += interval;
      guard++;
    }
  }

  // Envelope de kick + triggers con latencia visual.
  const kickDecay = Math.max(0.15, Number(map.kick?.decaySec ?? 1.5));
  kickEnvelope *= Math.exp(-dt / kickDecay);
  if (kickEnvelope < 0.001) kickEnvelope = 0;
  kickFlash *= Math.exp(-dt / 0.18);
  if (kickFlash < 0.001) kickFlash = 0;
  processTriggers(audioClock);
  features.kick = kickEnvelope;
  features.kickFlash = kickFlash;
  features.kickFlux = kickFlux;
  features.kickEnergy = kickEnergy;

  const bpm = effectiveBpm(map);
  features.bpm = bpmEstimate > 0 || typeof map.sync?.bpm === 'number' ? Math.round(bpm * 10) / 10 : 0;
  features.tempoConfidence = typeof map.sync?.bpm === 'number' ? 1 : tempoConfidence;
  features.beatPhase = features.bpm > 0 && lastVisualKickAt >= 0
    ? ((audioClock - lastVisualKickAt) / (60 / features.bpm)) % 1
    : 0;

  features.flux = flux;
  features.enabled = true;
  audioClock += dt;
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export async function initAudio() {
  if (audioEnabled) return true;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('getUserMedia no está disponible en este navegador');
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    }
  });

  audioStream = stream;

  if (!audioContext || audioContext.state === 'closed') {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    audioContext = new Ctor();
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  analyser = audioContext.createAnalyser();
  analyser.fftSize = FFT_SIZE;
  analyser.smoothingTimeConstant = ANALYSER_SMOOTHING;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  timeArray = new Uint8Array(analyser.fftSize || FFT_SIZE);
  prevSpectrum = null;
  prevWaveRms = 0;

  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);

  audioEnabled = true;
  resetFeatures();
  return true;
}

export function tickAudio(dt = 1 / 60) {
  if (!audioEnabled || !analyser || !dataArray) {
    if (features.enabled) resetFeatures();
    return;
  }
  try {
    analyser.getByteFrequencyData(dataArray);
    if (timeArray && typeof analyser.getByteTimeDomainData === 'function') {
      analyser.getByteTimeDomainData(timeArray);
    }
    analyze(Math.min(0.1, Math.max(0.001, dt)));
  } catch {
    resetFeatures();
  }
}

export async function stopAudio() {
  audioEnabled = false;

  if (microphone) {
    try { microphone.disconnect(); } catch { /* noop */ }
    microphone = null;
  }
  if (analyser) {
    try { analyser.disconnect(); } catch { /* noop */ }
    analyser = null;
  }
  if (audioStream) {
    try { audioStream.getTracks().forEach(track => track.stop()); } catch { /* noop */ }
    audioStream = null;
  }
  if (audioContext && audioContext.state !== 'closed') {
    try { await audioContext.close(); } catch { /* noop */ }
  }
  audioContext = null;
  dataArray = null;
  timeArray = null;
  prevSpectrum = null;
  prevWaveRms = 0;
  resetFeatures();
}

export function getAudioState() {
  return {
    enabled: audioEnabled,
    level: features.level,
    kick: features.kick,
    bpm: features.bpm,
    mode: features.syncMode
  };
}

export function getAudioFeatures() {
  return features;
}

export function getFrequencyData() {
  return dataArray;
}

export function getWaveformData() {
  return timeArray;
}
