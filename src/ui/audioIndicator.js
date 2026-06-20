/**
 * Audio indicator — pulsating circle + FFT bars.
 *
 * Recibe un `level` (0–1) y un array de bins FFT (16 valores) por frame.
 * ponytail: las barras comparten un loop con el render — no hay timers separados.
 */

const BAR_COUNT = 16;

export function initAudioIndicator(container) {
  if (!container) return null;

  container.classList.add('audio-indicator');

  const ring = document.createElement('div');
  ring.id = 'audio-ring';
  container.appendChild(ring);

  const barsEl = document.createElement('div');
  barsEl.id = 'audio-bars';
  container.appendChild(barsEl);

  const bars = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'audio-bar';
    bar.style.height = '2px';
    barsEl.appendChild(bar);
    bars.push(bar);
  }

  return {
    show() {
      container.classList.add('active');
    },
    hide() {
      container.classList.remove('active');
    },
    update(level, bins) {
      if (!container.classList.contains('active')) return;
      const scale = 1 + Math.min(level, 1) * 0.8;
      ring.style.transform = `scale(${scale})`;
      ring.classList.toggle('peak', level > 0.85);
      const data = bins || [];
      const step = Math.max(1, Math.floor(data.length / BAR_COUNT));
      for (let i = 0; i < BAR_COUNT; i++) {
        const v = (data[i * step] || 0) / 255;
        const h = Math.max(2, v * 36);
        bars[i].style.height = `${h}px`;
      }
    }
  };
}
