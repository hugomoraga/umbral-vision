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
  let outgoing = null;
  let transition = null;
  let currentName = null;
  let running = false;
  let raf = 0;
  let lastRaf = 0;
  let disposed = false;
  let lastStatsAt = 0;
  const postOverrides = {};
  const savedParams = {};

  function createPost() {
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
  }

  function createEffect(name, initialParams) {
    const next = createEngineEffect(name, renderer, initialParams || params);
    next.initialize();
    next.onResize(renderer.width, renderer.height);
    return next;
  }

  function buildResources(name, initialParams) {
    if (effect) {
      effect.dispose();
      effect = null;
    }
    if (outgoing) {
      outgoing.dispose();
      outgoing = null;
    }
    transition = null;
    createPost();
    currentName = name;
    effect = createEffect(name, initialParams);
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
    tickAudio(dt);
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
    if (resized) {
      effect.onResize(renderer.width, renderer.height);
      if (outgoing) outgoing.onResize(renderer.width, renderer.height);
    }

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
    let mix = 1;

    if (outgoing && transition) {
      transition.elapsed += dt;
      const raw = Math.min(1, transition.elapsed / Math.max(0.001, transition.duration));
      mix = raw * raw * (3 - 2 * raw); // smoothstep: entrada/salida suave

      outgoing.setAudioFeatures?.(audio);
      outgoing.update(dt, audio);
      outgoing.render(renderer);
    }

    effect.setAudioFeatures?.(audio);
    effect.update(dt, audio);
    effect.render(renderer);

    const sceneFrom = outgoing ? outgoing.getSceneTarget() : null;
    const sceneTo = effect.getSceneTarget();
    const basePost = effect.getPostParams();
    const audioAmount = audio.enabled ? (effect.params?.audio ?? 1) : 0;
    const audioPost = {
      exposure: (basePost.exposure ?? 1) * (1 + (audio.rms * 0.35 + audio.beat * 0.15) * audioAmount),
      bloomStrength: (basePost.bloomStrength ?? 1) * (1 + (audio.high * 0.42 + audio.beat * 0.5 + audio.rms * 0.2) * audioAmount)
    };
    post.render(sceneFrom || sceneTo, renderer.output, {
      ...basePost,
      ...audioPost,
      ...postOverrides
    }, sceneFrom ? sceneTo : null, mix);

    if (outgoing && transition && transition.elapsed >= transition.duration) {
      outgoing.dispose();
      outgoing = null;
      transition = null;
    }
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

  /**
   * @param {string} name
   * @param {Record<string, number|boolean>} [nextParams]
   * @param {{transitionMs?:number}} [options]
   */
  function setEffect(name, nextParams, options = {}) {
    if (!isEngineEffect(name)) throw new Error(`Efecto GPU desconocido: ${name}`);
    if (name === currentName) {
      if (nextParams) effect.setParameters(nextParams);
      return effect;
    }

    if (currentName && effect) savedParams[currentName] = effect.getParameters();

    const transitionMs = Math.max(0, options.transitionMs ?? 0);
    const previous = effect;
    const previousName = currentName;
    const next = createEffect(name, {
      ...params,
      ...(savedParams[name] || {}),
      ...(nextParams || {})
    });

    if (previous && transitionMs > 0) {
      if (outgoing) outgoing.dispose();
      outgoing = previous;
      transition = {
        from: previousName,
        to: name,
        elapsed: 0,
        duration: transitionMs / 1000
      };
    } else if (previous) {
      previous.dispose();
      transition = null;
      outgoing = null;
    }

    effect = next;
    currentName = name;
    return effect;
  }

  function setParameters(patch) {
    if (!effect) return [];
    const changed = effect.setParameters(patch);
    if (outgoing) outgoing.setParameters(patch);
    return changed;
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
      activeParticles: effect?.particleCount ? Math.floor(effect.particleCount * (effect.params.density ?? 1)) : 0,
      transitioning: !!transition,
      transitionFrom: transition?.from || null,
      transitionProgress: transition ? Math.round((transition.elapsed / transition.duration) * 100) / 100 : 1,
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
    // Si se oculta en medio de un cross-fade, liberar el efecto saliente;
    // de lo contrario queda congelado y retiene recursos.
    if (outgoing) {
      outgoing.dispose();
      outgoing = null;
    }
    transition = null;
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
    if (outgoing) outgoing.dispose();
    outgoing = null;
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
      if (outgoing) outgoing.onResize(w, h);
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
    get transitioning() { return !!transition; },
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
