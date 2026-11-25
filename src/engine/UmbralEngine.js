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
import { getAudioMap } from '../audio/audioConfig.js';
import { createScene, sceneToEffectParams } from '../scene/Scene.js';
import {
  getVariantForEffectParam,
  getVariantParamForEffect
} from '../scene/families.js';

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

/**
 * Duración de transición en ms. `'auto'` elige un valor variable entre 1.5 y 4 s.
 * @param {number|'auto'|undefined} value
 * @param {()=>number} [random]
 */
export function resolveTransitionMs(value, random = Math.random) {
  if (value === 'auto') return 1500 + random() * 2500;
  return Math.max(0, Number(value) || 0);
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
  let currentScene = null;
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
    const audioMap = getAudioMap();
    const volumeExposure = Number(audioMap.volume?.exposure ?? 0.2);
    const volumeBloom = Number(audioMap.volume?.bloom ?? 0.15);
    const kickBloom = Number(audioMap.kick?.bloomPulse ?? 0.18);
    const fb = audioMap.feedback || {};
    const clamp01 = (v) => Math.min(1, Math.max(0, Number(v) || 0));
    const audioPost = {
      exposure: (basePost.exposure ?? 1) * (1 + (audio.rms * volumeExposure + audio.kickFlash * volumeExposure * 0.6) * audioAmount),
      bloomStrength: (basePost.bloomStrength ?? 1) * (1 + (audio.high * 0.3 + audio.rms * volumeBloom + audio.kickFlash * kickBloom) * audioAmount),
      feedback: clamp01((basePost.feedback ?? fb.amount ?? 0.25)
        + ((audio.bassFast || 0) * Number(fb.bassZoom ?? 0.35) * 0.22 + (audio.kickFlash || 0) * 0.12) * audioAmount),
      feedbackDecay: Math.min(0.999, Math.max(0.5,
        (basePost.feedbackDecay ?? fb.decay ?? 0.92) - (audio.kick || 0) * Number(fb.kickDecay ?? 0.035) * audioAmount)),
      feedbackZoom: Math.max(0, (basePost.feedbackZoom ?? fb.zoom ?? 0.5)
        + (audio.bassFast || 0) * Number(fb.bassZoom ?? 0.35) * audioAmount),
      feedbackRotation: (basePost.feedbackRotation ?? fb.rotation ?? 0.3)
        + (audio.midFast || 0) * Number(fb.midRotation ?? 0.4) * audioAmount,
      feedbackWarp: Math.max(0, (basePost.feedbackWarp ?? fb.warp ?? 0.5)
        + (audio.highFast || 0) * Number(fb.highWarp ?? 0.25) * audioAmount)
    };
    if (transition?.type === 'feedback-smear') {
      audioPost.feedback = clamp01(audioPost.feedback + 0.18);
      audioPost.feedbackDecay = Math.min(0.985, audioPost.feedbackDecay + 0.025);
      audioPost.feedbackZoom = Math.max(0, audioPost.feedbackZoom + 0.35);
    }
    post.render(sceneFrom || sceneTo, renderer.output, {
      ...basePost,
      ...audioPost,
      ...postOverrides,
      transitionType: transition?.type || 'dissolve',
      transitionProgress: mix
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

  function transitionMsFrom(value) {
    return resolveTransitionMs(value);
  }

  function cleanParams(raw) {
    const out = { ...(raw || {}) };
    delete out.variant;
    delete out.seed;
    return out;
  }

  function sceneFromCurrent(hint = null) {
    const p = effect ? effect.getParameters() : {};
    const variant = getVariantForEffectParam(currentName, p.variant ?? 0);
    return createScene({
      ...(hint || currentScene || {}),
      effect: currentName,
      variant,
      seed: p.seed ?? 1,
      params: cleanParams(p)
    });
  }

  /**
   * @param {string} name
   * @param {Record<string, number|boolean>} [nextParams]
   * @param {{transitionMs?:number, transitionType?:string, scene?:object}} [options]
   */
  function setEffect(name, nextParams, options = {}) {
    if (!isEngineEffect(name)) throw new Error(`Efecto GPU desconocido: ${name}`);
    if (name === currentName) {
      if (nextParams) effect.setParameters(nextParams);
      currentScene = options.scene
        ? createScene({ ...options.scene, effect: name })
        : sceneFromCurrent();
      return effect;
    }

    if (currentName && effect) savedParams[currentName] = effect.getParameters();

    const transitionMs = transitionMsFrom(options.transitionMs ?? 0);
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
        duration: transitionMs / 1000,
        type: options.transitionType || 'dissolve'
      };
    } else if (previous) {
      previous.dispose();
      transition = null;
      outgoing = null;
    }

    effect = next;
    currentName = name;
    currentScene = options.scene
      ? createScene({ ...options.scene, effect: name })
      : sceneFromCurrent();
    return effect;
  }

  /**
   * Carga una escena completa en el motor GPU.
   * @param {object} scene
   * @param {{transitionMs?:number, transitionType?:string}} [options]
   */
  function setScene(scene, options = {}) {
    const s = createScene(scene);
    if (!isEngineEffect(s.effect)) {
      throw new Error(`La escena usa un efecto no-GPU: ${s.effect}`);
    }
    const variantParam = getVariantParamForEffect(s.effect, s.variant);
    setEffect(s.effect, { ...sceneToEffectParams(s), variant: variantParam }, {
      ...options,
      scene: s
    });
    currentScene = createScene({
      ...s,
      effect: s.effect,
      variant: s.variant,
      seed: s.seed
    });
    return currentScene;
  }

  function getScene() {
    if (!effect) return null;
    return sceneFromCurrent();
  }

  function setParameters(patch) {
    if (!effect) return [];
    const changed = effect.setParameters(patch);
    if (outgoing) outgoing.setParameters(patch);
    if (changed.length) currentScene = sceneFromCurrent();
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
    const name = currentName || DEFAULT_EFFECT;

    // En algunos drivers la extensión float tarda un frame en volver a estar
    // disponible después de `webglcontextrestored`. Reintentamos la
    // reconstrucción en vez de dejar el motor con resources a medio crear.
    const attempt = (tries = 0) => {
      if (disposed) return;
      renderer.refreshExtensions?.();
      try {
        const preserve = effect ? effect.getParameters() : params;
        buildResources(name, preserve);
        renderer.resize();
        effect.onResize(renderer.width, renderer.height);
        start();
      } catch (error) {
        if (tries < 3) {
          setTimeout(() => attempt(tries + 1), 120);
          return;
        }
        console.error('No se pudo restaurar el contexto WebGL:', error);
        window.dispatchEvent(new CustomEvent('uv:engine-restore-failed', { detail: { error } }));
      }
    };

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => attempt(0));
    } else {
      attempt(0);
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    stop();
    removeLiteListener();
    if (effect) effect.dispose();
    effect = null;
    currentScene = null;
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
    get currentScene() { return currentScene ? createScene(currentScene) : null; },
    get transitioning() { return !!transition; },
    get running() { return running; },
    get fpsCounter() { return fpsCounter; },
    start,
    stop,
    show,
    hide,
    renderFrame,
    setEffect,
    setScene,
    getScene,
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
