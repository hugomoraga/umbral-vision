/**
 * Spectrum — visualizador de bandas en vivo (canvas 2D).
 *
 * Colorea los bins por región (graves / medios / agudos) y mantiene un peak
 * cap por barra. Consume el buffer FFT reutilizado de AudioReactive.
 */

import { getFrequencyData, getAudioFeatures } from '../AudioReactive.js';

const BARS = 42;

export function createSpectrum(canvas) {
  if (!canvas) return { start() {}, stop() {} };

  const cssWidth = 156;
  const cssHeight = 34;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return { start() {}, stop() {} };
  ctx.scale(dpr, dpr);

  const peaks = new Float32Array(BARS);
  let raf = 0;
  let running = false;
  let last = 0;

  function colorAt(t) {
    if (t < 0.3) return '187, 140, 255';   // graves
    if (t < 0.68) return '137, 176, 255';  // medios
    return '226, 221, 242';                // agudos
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (now - last < 24) return; // ~40fps, suficiente para el ojo
    last = now;

    const data = getFrequencyData();
    const features = getAudioFeatures();
    const active = !!data && features.enabled;
    const width = cssWidth;
    const height = cssHeight;
    ctx.clearRect(0, 0, width, height);

    const gap = 1.4;
    const barWidth = (width - gap * (BARS - 1)) / BARS;
    const baseline = height - 1;

    for (let i = 0; i < BARS; i++) {
      const t = i / (BARS - 1);
      const norm = Math.pow(t, 1.9);
      const idx = data ? Math.min(data.length - 1, Math.floor(norm * data.length * 0.58) + 1) : 0;
      let value = data ? data[idx] / 255 : 0;
      if (active) value = Math.pow(value, 0.78);

      peaks[i] = Math.max(value, peaks[i] * 0.9);

      const barHeight = Math.max(active ? 1.2 : 0.8, value * (height - 4));
      const x = i * (barWidth + gap);
      const rgb = colorAt(t);

      ctx.fillStyle = `rgba(${rgb}, ${active ? 0.78 : 0.22})`;
      ctx.fillRect(x, baseline - barHeight, barWidth, barHeight);

      if (active && peaks[i] > 0.04) {
        const py = baseline - peaks[i] * (height - 4);
        ctx.fillStyle = `rgba(${rgb}, 0.95)`;
        ctx.fillRect(x, Math.max(0, py - 1), barWidth, 1);
      }
    }

    // Medidores de banda (B / M / A) en el pie del espectro.
    const meterY = height - 4;
    const meterColors = ['187, 140, 255', '137, 176, 255', '226, 221, 242'];
    const bands = [features.bass, features.mid, features.high];
    const segW = width / 3;
    for (let b = 0; b < 3; b++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(b * segW, meterY, segW - 2, 2);
      const amount = active ? Math.min(1, bands[b] / 1.2) : 0;
      ctx.fillStyle = `rgba(${meterColors[b]}, ${active ? 0.95 : 0.2})`;
      ctx.fillRect(b * segW, meterY, Math.max(0, (segW - 2) * amount), 2);
    }
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
    destroy() {
      this.stop();
      ctx.clearRect(0, 0, cssWidth, cssHeight);
    }
  };
}
