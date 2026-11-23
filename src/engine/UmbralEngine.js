/**
 * UmbralEngine — motor de renderizado GPU.
 *
 * Responsabilidades:
 *  - crear/poseer el renderer y el pipeline de post-proceso
 *  - ciclo de vida del efecto activo (initialize/update/render/dispose)
 *  - loop propio con dt, audio, métricas y resolución adaptativa
 *  - API de parámetros agnóstica del efecto
 *
 * Es independiente de p5 y de la UI. `Visualizer` lo usa como backend cuando
 * el efecto seleccionado pertenece a `ENGINE_EFFECTS`.
 */

import { Renderer } from './core/Renderer.js';
import { PostPipeline } from './core/PostPipeline.js';
import { createFullscreenQuad } from './core/Geometry.js';
import { supportsRenderFormat } from './core/RenderTarget.js';
import { createEngineEffect, isEngineEffect } from './registry.js';
import { tickAudio, getAudioFeatures } from '../AudioReactive.js';
import { createFpsCounter } from '../perf/fpsCounter.js';
import { getLiteMode } from '../perf/deviceProfile.js';

const DEFAULT_EFFECT = 'fluidFields';

function clampDt(dt) {
  if (!Number.isFinite(dt) || dt <= 0) return 1 / 60;
  return Math.min(dt, 0.05);
}

function resolveQuality(requested) {
  if (requested && requested !== 'auto') return requested;
  if (getLiteMode()) return 'lite';
  return 'high';
}

export function createEngine(options = {}) {
  const {
    container = null,
    canvas = null,
    autoStart = true,
    effectName = DEFAULT_EFFECT,
    params = {},
    onStats = null
  } = options;

  const quality = resolveQuality(options.quality);
  const fpsCounter = createFpsCounter();

  let renderer = null;
  let quad = null;
  let post = null;
  let effect = null;
  let currentName = null;
  let running = false;
  let raf = 0;
  let lastRaf = 0;
  let disposed = false;
  let lastStatsAt = 0;
  const postOverrides = {};

  function buildResources(name, initialParams) {
    if (effect) {
      effect.dispose();
      effect = null;
    }
    if (post) {
      post.dispose();
      post = null;
    }
    if (!quad) quad = createFullscreenQuad(renderer.gl);
    const hdr = supportsRenderFormat(renderer.gl, 'rgba16f');
    post = new PostPipeline(renderer.gl, quad, {
      mips: renderer.quality.bloomMips,
      hdr,
      bloomQuality: renderer.quality.bloomQuality
    });
    post.resize(renderer.width, renderer.height);

    currentName = name;
    effect = createEngineEffect(name, renderer, initialParams || params);
    effect.initialize();
    effect.onResize(renderer.width, renderer.height);
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    if (document.visibilityState === 'hidden') {
      lastRaf = now;
      return;
    }

    const deltaMs = lastRaf === 0 ? 16.67 : now - lastRaf;
    lastRaf = now;
    fpsCounter.tick(deltaMs);

    const dt = clampDt(deltaMs / 1000);
    tickAudio();
    const audio = getAudioFeatures();

    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();

    try {
      renderFrame(dt, audio);
    } catch (error) {
      console.error('UmbralEngine frame error:', error);
      stop();
      return;
    }

    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    renderer.cpuMs = end - start;
    const resized = renderer.sampleFrame(deltaMs);
    if (resized) effect.onResize(renderer.width, renderer.height);

    if (onStats && now - lastStatsAt > 500) {
      lastStatsAt = now;
      onStats(getStats());
    }
  }

  /**
   * Ejecuta un frame de simulación + render + post sin tocar el rAF.
   * Útil para tests, capturas deterministas y benchmarks.
   * @param {number} dt segundos
   * @param {object} [audio]
   */
  function renderFrame(dt, audio = getAudioFeatures()) {
    effect.setAudioFeatures?.(audio);
    effect.update(dt, audio);
    effect.render(renderer);
    post.render(effect.getSceneTarget(), renderer.output, {
      ...effect.getPostParams(),
      ...postOverrides
    });
  }

  function start() {
    if (disposed || running) return;
    running = true;
    lastRaf = 0;
    // Primer frame síncrono: evita un canvas negro hasta el próximo rAF
    // (también ayuda a capturas headless / screenshots).
    frame(typeof performance !== 'undefined' ? performance.now() : Date.now());
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function setEffect(name, nextParams) {
    if (!isEngineEffect(name)) throw new Error(`Efecto GPU desconocido: ${name}`);
    if (name === currentName) {
      if (nextParams) effect.setParameters(nextParams);
      return effect;
    }
    buildResources(name, { ...params, ...(nextParams || {}) });
    return effect;
  }

  function setParameters(patch) {
    if (!effect) return [];
    return effect.setParameters(patch);
  }

  function getParameters() {
    return effect ? effect.getParameters() : {};
  }

  function getSchema() {
    return effect ? effect.getSchema() : {};
  }

  function setQuality(name) {
    if (!renderer.setQuality(name)) return;
    const preserve = effect ? effect.getParameters() : params;
    buildResources(currentName, preserve);
  }

  function setPostParams(patch) {
    Object.assign(postOverrides, patch || {});
  }

  function getStats() {
    const stats = renderer.getStats();
    return {
      ...stats,
      effect: currentName,
      particleSize: effect?.particleSize || 0,
      particleCount: effect?.particleCount || 0,
      activeParticles: effect ? Math.floor(effect.particleCount * (effect.params.density ?? 1)) : 0,
      renderer: 'webgl2'
    };
  }

  function show() {
    if (!renderer) return;
    renderer.canvas.style.display = 'block';
    start();
  }

  function hide() {
    if (!renderer) return;
    stop();
    renderer.canvas.style.display = 'none';
  }

  function handleContextLost(event) {
    event.preventDefault();
    stop();
    renderer.contextLost = true;
    renderer.canvas.dispatchEvent(new CustomEvent('uv:engine-context-lost'));
  }

  function handleContextRestored() {
    renderer.contextLost = false;
    const preserve = effect ? effect.getParameters() : params;
    buildResources(currentName, preserve);
    renderer.resize();
    effect.onResize(renderer.width, renderer.height);
    start();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    stop();
    removeLiteListener();
    if (effect) effect.dispose();
    effect = null;
    if (post) post.dispose();
    post = null;
    if (quad) quad.dispose();
    quad = null;
    if (renderer) {
      renderer.canvas.removeEventListener('webglcontextlost', handleContextLost);
      renderer.canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      renderer.dispose();
    }
    renderer = null;
  }

  renderer = new Renderer({
    container,
    canvas,
    quality,
    onScaleChange: (w, h) => {
      if (post) post.resize(w, h);
      if (effect) effect.onResize(w, h);
    }
  });

  renderer.canvas.addEventListener('webglcontextlost', handleContextLost, false);
  renderer.canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

  function handleLiteMode(event) {
    const lite = event?.detail?.lite ?? getLiteMode();
    setQuality(lite ? 'lite' : 'high');
  }
  window.addEventListener('uv:lite-mode', handleLiteMode);
  const removeLiteListener = () => window.removeEventListener('uv:lite-mode', handleLiteMode);

  try {
    buildResources(effectName || DEFAULT_EFFECT, params);
  } catch (error) {
    if (post) post.dispose();
    post = null;
    if (quad) quad.dispose();
    quad = null;
    window.removeEventListener('uv:lite-mode', handleLiteMode);
    renderer.dispose();
    renderer = null;
    throw error;
  }
  if (autoStart) start();

  return {
    get canvas() { return renderer?.canvas || null; },
    get gl() { return renderer?.gl || null; },
    get renderer() { return renderer; },
    get effect() { return effect; },
    get currentEffect() { return currentName; },
    get running() { return running; },
    get fpsCounter() { return fpsCounter; },
    start,
    stop,
    show,
    hide,
    renderFrame,
    setEffect,
    setParameters,
    getParameters,
    getSchema,
    setQuality,
    setPostParams,
    getStats,
    dispose
  };
}

export { DEFAULT_EFFECT };
