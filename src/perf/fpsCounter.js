/**
 * fpsCounter — métricas de FPS con ring buffer.
 *
 * Retorna instantáneo, avg y 1% low sobre los últimos N frames.
 * ponytail: ring buffer fijo (60 samples), no Array.shift() que es O(n).
 */

const SAMPLE_SIZE = 60;

export function createFpsCounter() {
  const samples = new Float32Array(SAMPLE_SIZE);
  let head = 0;
  let filled = 0;
  let instantFps = 0;
  let frameTimeMs = 0;

  return {
    tick(deltaMs) {
      frameTimeMs = deltaMs;
      instantFps = deltaMs > 0 ? 1000 / deltaMs : 0;
      samples[head] = deltaMs;
      head = (head + 1) % SAMPLE_SIZE;
      if (filled < SAMPLE_SIZE) filled++;
    },
    getInstant() { return instantFps; },
    getFrameMs() { return frameTimeMs; },
    getAvg() {
      if (filled === 0) return 0;
      let sum = 0;
      for (let i = 0; i < filled; i++) sum += samples[i];
      const avgMs = sum / filled;
      return avgMs > 0 ? 1000 / avgMs : 0;
    },
    getLow1Percent() {
      if (filled === 0) return 0;
      // Copia temporal (SAMPLE_SIZE es pequeño, está OK)
      const arr = Array.from(samples.subarray(0, filled)).sort((a, b) => b - a);
      const idx = Math.max(0, Math.floor(arr.length * 0.01) - 1);
      const worstMs = arr[idx];
      return worstMs > 0 ? 1000 / worstMs : 0;
    },
    reset() {
      head = 0; filled = 0; instantFps = 0; frameTimeMs = 0;
    }
  };
}
