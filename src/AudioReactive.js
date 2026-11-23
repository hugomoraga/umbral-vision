/**
 * AudioReactive — análisis de audio reactivo con cleanup completo.
 *
 * v0.7: análisis pensado para reactividad visible:
 *  - bandas graves / medios / agudos con auto-ganancia por banda
 *  - RMS global (volumen) y nivel normalizado
 *  - spectral flux + beat detection
 *  - smoothing independiente del framerate (attack/release en segundos)
 *
 * `getAudioFeatures()` retorna el MISMO objeto cada frame; consumirlo dentro
 * del frame. `getFrequencyData()` también reutiliza el buffer.
 */

let audioContext = null;
let analyser = null;
let microphone = null;
let audioStream = null;
let dataArray = null;
let prevSpectrum = null;
let audioEnabled = false;

const FFT_SIZE = 2048;
const ANALYSER_SMOOTHING = 0.35;
const ATTACK_TAU = 0.045;
const RELEASE_TAU = 0.22;
const LEVEL_ATTACK_TAU = 0.035;
const LEVEL_RELEASE_TAU = 0.16;
const BEAT_HISTORY = 30;
const BEAT_COOLDOWN = 0.12;

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
  flux: 0
};

let gainPeak = 0.12;
const fluxHistory = new Float32Array(BEAT_HISTORY);
let fluxIndex = 0;
let fluxFilled = 0;
let beatEnvelope = 0;
let lastBeatAt = -10;
let audioClock = 0;

// ---------------------------------------------------------------------------
// Funciones puras (testeables)
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
 * @returns {{bass:number, mid:number, high:number, rms:number}}
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
  const rms = Math.sqrt(squareSum / binCount) * 1.6;

  const validHz = Number.isFinite(sampleRate) && sampleRate > 0;
  const ranges = validHz
    ? {
        bass: [idx(BANDS.bass[0]), idx(BANDS.bass[1])],
        mid: [idx(BANDS.mid[0]), idx(BANDS.mid[1])],
        high: [idx(BANDS.high[0]), idx(BANDS.high[1])]
      }
    : {
        bass: [0, binCount * 0.05],
        mid: [binCount * 0.05, binCount * 0.4],
        high: [binCount * 0.4, binCount * 0.9]
      };

  return {
    bass: averageRange(data, ranges.bass[0], ranges.bass[1]),
    mid: averageRange(data, ranges.mid[0], ranges.mid[1]),
    high: averageRange(data, ranges.high[0], ranges.high[1]),
    rms: Math.min(1, rms)
  };
}

// ---------------------------------------------------------------------------
// Análisis
// ---------------------------------------------------------------------------

function smooth(current, target, dt, attackTau = ATTACK_TAU, releaseTau = RELEASE_TAU) {
  const tau = target > current ? attackTau : releaseTau;
  const alpha = 1 - Math.exp(-Math.max(0, dt) / tau);
  return current + (target - current) * alpha;
}

function autoGain(rawMax, dt) {
  const decay = Math.pow(0.996, Math.max(0, dt) * 60);
  gainPeak = Math.max(rawMax, gainPeak * decay);
  return Math.max(gainPeak * 0.88, 0.045);
}

function resetFeatures() {
  features.enabled = false;
  features.level = 0;
  features.rms = 0;
  features.bass = 0;
  features.mid = 0;
  features.high = 0;
  features.beat = 0;
  features.energy = 0;
  features.flux = 0;
  beatEnvelope = 0;
  lastBeatAt = -10;
  audioClock = 0;
  fluxIndex = 0;
  fluxFilled = 0;
  fluxHistory.fill(0);
  gainPeak = 0.12;
  if (prevSpectrum) prevSpectrum.fill(0);
}

function analyze(dt) {
  const sampleRate = analyser.context?.sampleRate || 44100;
  const raw = computeBands(dataArray, sampleRate, analyser.fftSize || FFT_SIZE);

  const volumeTarget = Math.min(1.5, raw.rms * 2.6);
  // Una ganancia global (no por banda) conserva la relación graves/medios/agudos.
  const gain = autoGain(Math.max(raw.bass, raw.mid, raw.high), dt);
  const nbass = Math.min(1.5, raw.bass / gain);
  const nmid = Math.min(1.5, raw.mid / gain);
  const nhigh = Math.min(1.5, raw.high / gain);

  features.rms = smooth(features.rms, volumeTarget, dt, LEVEL_ATTACK_TAU, LEVEL_RELEASE_TAU);
  features.bass = smooth(features.bass, nbass, dt);
  features.mid = smooth(features.mid, nmid, dt);
  features.high = smooth(features.high, nhigh, dt);

  features.energy = features.bass * 0.55 + features.mid * 0.3 + features.high * 0.15;
  features.level = Math.min(1, features.rms * 1.15 + features.energy * 0.22);

  // Spectral flux: onsets reales (cambios positivos del espectro).
  let flux = 0;
  const n = dataArray.length;
  if (prevSpectrum && prevSpectrum.length === n) {
    for (let i = 0; i < n; i++) {
      const delta = dataArray[i] - prevSpectrum[i];
      if (delta > 0) flux += delta;
      prevSpectrum[i] = dataArray[i];
    }
    flux = (flux / n / 255) * 3.2;
  } else {
    prevSpectrum = new Float32Array(n);
    for (let i = 0; i < n; i++) prevSpectrum[i] = dataArray[i];
  }

  fluxHistory[fluxIndex] = flux;
  fluxIndex = (fluxIndex + 1) % BEAT_HISTORY;
  if (fluxFilled < BEAT_HISTORY) fluxFilled++;

  let avg = 0;
  for (let i = 0; i < fluxFilled; i++) avg += fluxHistory[i];
  avg = fluxFilled > 0 ? avg / fluxFilled : 0;

  beatEnvelope *= Math.exp(-dt / 0.14);
  if (beatEnvelope < 0.001) beatEnvelope = 0;

  if (fluxFilled === BEAT_HISTORY
      && flux > avg * 1.55
      && flux > 0.012
      && audioClock - lastBeatAt > BEAT_COOLDOWN) {
    beatEnvelope = 1;
    lastBeatAt = audioClock;
  }
  features.beat = beatEnvelope;
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
  prevSpectrum = null;

  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);

  audioEnabled = true;
  resetFeatures();
  return true;
}

/**
 * Tick de audio — llamar desde el render loop activo.
 * @param {number} [dt] segundos desde el frame anterior
 */
export function tickAudio(dt = 1 / 60) {
  if (!audioEnabled || !analyser || !dataArray) {
    if (features.enabled) resetFeatures();
    return;
  }
  try {
    analyser.getByteFrequencyData(dataArray);
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
  prevSpectrum = null;
  resetFeatures();
}

export function getAudioState() {
  return { enabled: audioEnabled, level: features.level };
}

/**
 * Features de audio para el motor GPU.
 * Mismo objeto cada frame; no copiar.
 * @returns {{enabled:boolean, level:number, rms:number, bass:number, mid:number, high:number, beat:number, energy:number, flux:number}}
 */
export function getAudioFeatures() {
  return features;
}

/**
 * Buffer FFT reutilizado. Consumir dentro del frame.
 * @returns {Uint8Array|null}
 */
export function getFrequencyData() {
  return dataArray;
}
