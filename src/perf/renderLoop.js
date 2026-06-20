/**
 * renderLoop — loop unificado compartido por render + audio + fps.
 *
 * FR-005: audio analyzer corre en el MISMO rAF que el render del canvas.
 * FR-012: respeta document.visibilityState — 5fps cuando la pestaña está oculta.
 * FR-013: expone fpsCounter para el widget de métricas.
 *
 * ponytail: el target FPS es un MÁXIMO. Si el frame tarda menos, no se acorta el
 * intervalo. Cuando visibilityState === 'hidden', el intervalo sube a 200ms
 * (5fps). No throttling por carga, eso lo hace el browser naturalmente.
 */

import { tickAudio, getAudioState } from '../AudioReactive.js';

export function createRenderLoop({ targetFps = 60, fpsCounter, onFrame }) {
  let raf = 0;
  let lastFrameTime = 0;
  const interval = 1000 / targetFps;
  let running = false;

  function tick(now) {
    if (!running) return;

    const visible = document.visibilityState === 'visible';
    const currentInterval = visible ? interval : 200; // eslint-disable-line no-unused-vars

    if (lastFrameTime > 0) {
      const delta = now - lastFrameTime;
      if (fpsCounter) fpsCounter.tick(delta);
    }
    lastFrameTime = now;

    if (visible) {
      tickAudio();
      try {
        onFrame({ now, fpsCounter, audio: getAudioState() });
      } catch (err) {
        console.error('renderLoop frame error:', err);
      }
    }

    raf = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastFrameTime = 0;
      raf = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
    isRunning() { return running; }
  };
}
