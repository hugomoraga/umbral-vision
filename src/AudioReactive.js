/**
 * AudioReactive — análisis de audio reactivo con cleanup completo.
 *
 * - US4 FR-004: stopAudio cierra AudioContext completamente (no suspended reteniendo memoria).
 * - US4 FR-005: lectura de level/FFT ocurre en el renderLoop unificado, no en rAF separado.
 * - ponytail: getFrequencyData() retorna el mismo Uint8Array (no copia) — el consumidor debe
 *   leerlo antes del próximo frame. Documentado en JSDoc.
 */

let audioContext = null;
let analyser = null;
let microphone = null;
let audioStream = null;
let dataArray = null;
let audioLevel = 0;
let audioEnabled = false;
const smoothing = 0.8;

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
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = smoothing;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);

  audioEnabled = true;
  audioLevel = 0;
  return true;
}

/**
 * Tick de audio — debe llamarse desde el renderLoop unificado (no en rAF separado).
 * Actualiza `audioLevel` y el buffer `dataArray` para `getFrequencyData`.
 */
export function tickAudio() {
  if (!audioEnabled || !analyser || !dataArray) {
    audioLevel = 0;
    return;
  }
  try {
    analyser.getByteFrequencyData(dataArray);
    const focusRange = Math.min(64, dataArray.length);
    let sum = 0;
    for (let i = 0; i < focusRange; i++) sum += dataArray[i];
    const raw = (sum / focusRange / 255) * 2;
    audioLevel = raw < 0.05 ? 0 : Math.min(1, raw);
  } catch {
    audioLevel = 0;
  }
}

/**
 * Detener análisis y liberar TODOS los recursos.
 * US4 FR-004: AudioContext.close() evita leak (no queda suspended).
 */
export async function stopAudio() {
  audioEnabled = false;
  audioLevel = 0;

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
 * Buffer de frecuencias FFT (Uint8Array, length 128).
 * US4: retorna el MISMO buffer cada frame — no copia — para evitar GC pressure.
 * El consumidor debe consumir los datos dentro del mismo frame, antes del próximo tickAudio().
 * Retorna null si el audio no está activo.
 */
export function getFrequencyData() {
  return dataArray;
}
