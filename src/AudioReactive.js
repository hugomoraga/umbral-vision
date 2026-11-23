/**
 * AudioReactive — análisis de audio reactivo con cleanup completo.
 *
 * - US4 FR-004: stopAudio cierra AudioContext completamente (no suspended reteniendo memoria).
 * - US4 FR-005: lectura de level/FFT ocurre en el renderLoop unificado, no en rAF separado.
 * - ponytail: getFrequencyData() retorna el mismo Uint8Array (no copia) — el consumidor debe
 *   leerlo antes del próximo frame. Documentado en JSDoc.
 *
 * v0.4: se añade análisis por bandas (bass/mid/high), RMS y beat detection con
 * smoothing asimétrico (attack/release). Las features se exponen en un objeto
 * reutilizado por frame (getAudioFeatures) para no generar basura.
 */

let audioContext = null;
let analyser = null;
let microphone = null;
let audioStream = null;
let dataArray = null;
let audioLevel = 0;
let audioEnabled = false;
const smoothing = 0.8;

const FFT_SIZE = 1024;

// ---------------------------------------------------------------------------
// Feature analysis (v0.4)
// ---------------------------------------------------------------------------

/** Bandas en Hz. */
const BANDS = {
  bass: [20, 250],
  mid: [250, 2000],
  high: [2000, 12000]
};

const ATTACK = 0.45;
const RELEASE = 0.09;
const BEAT_HISTORY = 43; // ~0.7s a 60fps
const BEAT_THRESHOLD = 1.35;
const BEAT_MIN_ENERGY = 0.08;

const features = {
  enabled: false,
  level: 0,
  rms: 0,
  bass: 0,
  mid: 0,
  high: 0,
  beat: 0,
  energy: 0
};

const energyHistory = new Float32Array(BEAT_HISTORY);
let historyIndex = 0;
let historyFilled = 0;
let beatEnvelope = 0;

function smooth(current, target, attack = ATTACK, release = RELEASE) {
  const coeff = target > current ? attack : release;
  return current + (target - current) * coeff;
}

/**
 * Calcula el promedio normalizado [0..1] de un rango de bins.
 * @param {Uint8Array} data
 * @param {number} from
 * @param {number} to
 */
function averageRange(data, from, to) {
  const start = Math.max(0, Math.floor(from));
  const end = Math.min(data.length, Math.max(start + 1, Math.ceil(to)));
  let sum = 0;
  for (let i = start; i < end; i++) sum += data[i];
  return sum / (end - start) / 255;
}

/**
 * Calcula bandas a partir del FFT crudo. Función pura (testeable).
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

  // Si el mock/analyser no reporta sampleRate, caemos a fracciones del espectro.
  const validHz = Number.isFinite(sampleRate) && sampleRate > 0;
  const ranges = validHz
    ? {
        bass: [idx(BANDS.bass[0]), idx(BANDS.bass[1])],
        mid: [idx(BANDS.mid[0]), idx(BANDS.mid[1])],
        high: [idx(BANDS.high[0]), idx(BANDS.high[1])]
      }
    : { bass: [0, binCount * 0.08], mid: [binCount * 0.08, binCount * 0.35], high: [binCount * 0.35, binCount * 0.85] };

  return {
    bass: averageRange(data, ranges.bass[0], ranges.bass[1]),
    mid: averageRange(data, ranges.mid[0], ranges.mid[1]),
    high: averageRange(data, ranges.high[0], ranges.high[1]),
    rms: Math.min(1, rms)
  };
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
  beatEnvelope = 0;
  historyIndex = 0;
  historyFilled = 0;
  energyHistory.fill(0);
}

function updateFeatures(raw) {
  features.enabled = true;
  features.level = audioLevel;

  features.rms = smooth(features.rms, raw.rms);
  features.bass = smooth(features.bass, Math.min(1, raw.bass * 1.15));
  features.mid = smooth(features.mid, Math.min(1, raw.mid * 1.25));
  features.high = smooth(features.high, Math.min(1, raw.high * 1.45));

  const energy = raw.bass * 0.6 + raw.mid * 0.3 + raw.high * 0.1;
  features.energy = smooth(features.energy, energy);

  // Beat detection: energía instantánea vs media móvil.
  energyHistory[historyIndex] = energy;
  historyIndex = (historyIndex + 1) % BEAT_HISTORY;
  if (historyFilled < BEAT_HISTORY) historyFilled++;

  let sum = 0;
  for (let i = 0; i < historyFilled; i++) sum += energyHistory[i];
  const avg = historyFilled > 0 ? sum / historyFilled : 0;

  let detected = false;
  if (historyFilled === BEAT_HISTORY) {
    detected = energy > avg * BEAT_THRESHOLD && energy > BEAT_MIN_ENERGY;
  }

  beatEnvelope = detected ? 1 : beatEnvelope * 0.9;
  if (beatEnvelope < 0.001) beatEnvelope = 0;
  features.beat = beatEnvelope;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Inicializar análisis de audio del micrófono.
 * Lanza si getUserMedia no está disponible o si el permiso es denegado.
 */
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
  analyser.smoothingTimeConstant = smoothing;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);

  audioEnabled = true;
  audioLevel = 0;
  resetFeatures();
  return true;
}

/**
 * Tick de audio — debe llamarse desde el renderLoop unificado (no en rAF separado).
 * Actualiza `audioLevel`, el buffer `dataArray` y las features por bandas.
 */
export function tickAudio() {
  if (!audioEnabled || !analyser || !dataArray) {
    audioLevel = 0;
    resetFeatures();
    return;
  }
  try {
    analyser.getByteFrequencyData(dataArray);
    const focusRange = Math.min(64, dataArray.length);
    let sum = 0;
    for (let i = 0; i < focusRange; i++) sum += dataArray[i];
    const raw = (sum / focusRange / 255) * 2;
    audioLevel = raw < 0.05 ? 0 : Math.min(1, raw);

    const sampleRate = analyser.context?.sampleRate || 44100;
    updateFeatures(computeBands(dataArray, sampleRate, analyser.fftSize || FFT_SIZE));
  } catch {
    audioLevel = 0;
    resetFeatures();
  }
}

/**
 * Detener análisis y liberar TODOS los recursos.
 * US4 FR-004: AudioContext.close() evita leak (no queda suspended).
 */
export async function stopAudio() {
  audioEnabled = false;
  audioLevel = 0;
  resetFeatures();

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
}

/**
 * Snapshot del estado del audio para los efectos.
 */
export function getAudioState() {
  return { enabled: audioEnabled, level: audioLevel };
}

/**
 * Features de audio para el motor GPU.
 * Retorna el MISMO objeto cada frame (no copiar; consumir dentro del frame).
 * @returns {{enabled:boolean, level:number, rms:number, bass:number, mid:number, high:number, beat:number, energy:number}}
 */
export function getAudioFeatures() {
  return features;
}

/**
 * Buffer de frecuencias FFT (Uint8Array, length 512).
 * US4: retorna el MISMO buffer cada frame — no copia — para evitar GC pressure.
 * El consumidor debe consumir los datos dentro del mismo frame, antes del próximo tickAudio().
 * Retorna null si el audio no está activo.
 */
export function getFrequencyData() {
  return dataArray;
}
