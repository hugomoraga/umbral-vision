/**
 * Quality — perfiles de calidad del motor GPU.
 *
 * Los valores son conservadores: el motor puede bajar resolución en runtime
 * (adaptive) si el frame excede el presupuesto medido.
 */

export const QUALITY_PROFILES = {
  lite: {
    name: 'lite',
    particleSize: 128,        // 16,384 partículas
    maxDpr: 1.0,
    renderScale: 0.7,
    minRenderScale: 0.5,
    bloomMips: 1,
    bloomQuality: 5,
    simSteps: 1,
    trailLength: 1.0,
    targetFrameMs: 22,
    minFrameMs: 12
  },
  high: {
    name: 'high',
    particleSize: 256,        // 65,536 partículas
    maxDpr: 1.5,
    renderScale: 0.9,
    minRenderScale: 0.55,
    bloomMips: 2,
    bloomQuality: 9,
    simSteps: 1,
    trailLength: 1.35,
    targetFrameMs: 19,
    minFrameMs: 11
  },
  ultra: {
    name: 'ultra',
    particleSize: 512,        // 262,144 partículas
    maxDpr: 2.0,
    renderScale: 1.0,
    minRenderScale: 0.6,
    bloomMips: 3,
    bloomQuality: 11,
    simSteps: 1,
    trailLength: 1.6,
    targetFrameMs: 15,
    minFrameMs: 8
  }
};

export function getQualityProfile(name) {
  return QUALITY_PROFILES[name] || QUALITY_PROFILES.high;
}

/**
 * Adaptive resolution controller.
 * Hysteresis: reduce after sustained slow frames, recover slowly after fast ones.
 */
export function createAdaptiveResolution(profile) {
  let scale = profile.renderScale;
  let slowFrames = 0;
  let fastFrames = 0;

  return {
    get scale() {
      return scale;
    },
    reset() {
      scale = profile.renderScale;
      slowFrames = 0;
      fastFrames = 0;
    },
    /**
     * @param {number} frameMs
     * @returns {boolean} true when the scale changed
     */
    sample(frameMs) {
      if (!Number.isFinite(frameMs) || frameMs <= 0) return false;
      if (frameMs > profile.targetFrameMs) {
        slowFrames++;
        fastFrames = 0;
      } else if (frameMs < profile.minFrameMs) {
        fastFrames++;
        slowFrames = 0;
      } else {
        slowFrames = 0;
        fastFrames = 0;
      }

      let next = scale;
      if (slowFrames >= 45 && scale > profile.minRenderScale) {
        next = Math.max(profile.minRenderScale, scale - 0.1);
        slowFrames = 0;
      } else if (fastFrames >= 180 && scale < 1.0) {
        next = Math.min(1.0, scale + 0.05);
        fastFrames = 0;
      }

      if (next !== scale) {
        scale = next;
        return true;
      }
      return false;
    }
  };
}
