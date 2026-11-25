/**
 * Visualizer — gestor principal del canvas y efectos visuales.
 *
 * v0.4: soporta dos backends sin romper nada:
 *  - p5.js (15 efectos históricos, canvas 2D)
 *  - UmbralEngine (efectos GPU WebGL 2, canvas propio)
 *
 * El catálogo es la unión de `Effects` + `ENGINE_EFFECTS`. Al cambiar entre
 * backends se pausa el loop inactivo y se oculta su canvas, pero no se destruyen
 * recursos (cambio rápido sin GC).
 */

import { Effects } from './Effects.js';
import { createRenderLoop } from './perf/renderLoop.js';
import { createFpsCounter } from './perf/fpsCounter.js';
import { detectProfile, getLiteMode } from './perf/deviceProfile.js';
import { createEngine } from './engine/UmbralEngine.js';
import { isEngineEffect, getEngineEffectNames, ENGINE_EFFECTS } from './engine/registry.js';
import { createScene } from './scene/Scene.js';
import { getDefaultVariantForEffect } from './scene/families.js';
import { chooseTransition, cssEasing } from './scene/transitionDirector.js';
import { shouldCrossfadeBackends, createBackendCrossfade } from './ui/backendTransition.js';
import { getAudioFeatures } from './AudioReactive.js';

let p5Instance = null;
let p5Sketch = null;
let currentEffect = null;
let currentEffectName = null;
let renderLoop = null;
let fpsCounter = null;
let engine = null;
let engineContainer = null;
let p5CanvasEl = null;
let currentScene = null;
let config = { isLite: false };
let paused = false;
let lastTransitionType = null;
let backendCrossfade = null;

const profile = detectProfile();

function syncLiteConfig() {
  config = { ...config, isLite: getLiteMode() };
}

function hideP5Canvas() {
  if (p5CanvasEl) p5CanvasEl.style.display = 'none';
  if (renderLoop) renderLoop.stop();
}

function showP5Canvas() {
  if (p5CanvasEl) p5CanvasEl.style.display = 'block';
}

function getMainContainer() {
  return document.querySelector('#generator main') || document.body;
}

function getVisibleCanvas() {
  if (engine?.canvas && engine.canvas.style.display !== 'none') return engine.canvas;
  if (p5CanvasEl && p5CanvasEl.style.display !== 'none') return p5CanvasEl;
  return engine?.canvas || p5CanvasEl;
}

function beginBackendCrossfade(transition) {
  if (backendCrossfade) {
    backendCrossfade.cancel();
    backendCrossfade = null;
  }
  const source = getVisibleCanvas();
  if (!source) return;
  backendCrossfade = createBackendCrossfade({
    source,
    durationMs: transition.transitionMs,
    easing: cssEasing(transition.transitionEasing),
    type: transition.transitionType,
    container: document.body
  });
}

function finishBackendCrossfade() {
  if (!backendCrossfade) return;
  backendCrossfade.finish();
  backendCrossfade = null;
}

/**
 * Elige tipo, duración, easing y dirección para un cambio de escena.
 */
function resolveTransition(effectName, options = {}) {
  if (!currentEffectName) return { transitionMs: 0 };
  if (options.transitionMs === 0) return { ...options, transitionMs: 0 };
  if (options.transitionType && Number.isFinite(Number(options.transitionMs))) {
    return { ...options };
  }

  const fromGpu = isEngineEffect(currentEffectName);
  const toGpu = isEngineEffect(effectName);
  const from = getScene();
  const to = createScene({
    effect: effectName,
    variant: getDefaultVariantForEffect(effectName)
  });
  const chosen = chooseTransition({
    from,
    to,
    audio: getAudioFeatures(),
    lastType: lastTransitionType,
    sameBackend: fromGpu === toGpu
  });
  lastTransitionType = chosen.type;

  return {
    ...chosen,
    transitionMs: options.transitionMs === 'auto' || options.transitionMs == null
      ? chosen.durationMs
      : options.transitionMs,
    transitionType: options.transitionType || chosen.type,
    transitionEasing: options.transitionEasing || chosen.easing,
    transitionDirection: options.transitionDirection || chosen.direction,
    transitionSeed: options.transitionSeed ?? chosen.seed
  };
}

function startEngineEffect(effectName, container = null, options = {}) {
  if (!ENGINE_EFFECTS[effectName]) {
    console.warn('Efecto GPU no encontrado:', effectName);
    return;
  }
  if (p5Instance) hideP5Canvas();
  engineContainer = container || engineContainer || getMainContainer();

  if (!engine) {
    try {
      engine = createEngine({
        container: engineContainer,
        effectName,
        quality: getLiteMode() ? 'lite' : 'auto'
      });
    } catch (error) {
      console.error('No se pudo iniciar el motor GPU:', error);
      engine = null;
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('uv:engine-unavailable', {
          detail: { effectName, error }
        }));
      }
      return;
    }
    fpsCounter = engine.fpsCounter;
  } else {
    const same = engine.currentEffect === effectName;
    const wasRunning = engine.running;
    engine.setEffect(effectName, undefined, {
      transitionMs: (same || !wasRunning) ? 0 : (options.transitionMs ?? 1000),
      transitionType: options.transitionType,
      transitionEasing: options.transitionEasing,
      transitionDirection: options.transitionDirection,
      transitionSeed: options.transitionSeed
    });
    engine.show();
    fpsCounter = engine.fpsCounter;
  }
  currentEffect = null;
  currentEffectName = effectName;
  currentScene = engine?.getScene?.() || createScene({
    effect: effectName,
    variant: getDefaultVariantForEffect(effectName)
  });
  if (paused && engine) engine.stop();
}

function startP5Effect(effectName, container = null) {
  if (typeof p5 === 'undefined') {
    console.warn('p5.js no está cargado — el visualizador requiere p5');
    return;
  }
  if (!Effects[effectName]) {
    console.warn('Efecto no encontrado:', effectName);
    effectName = 'tunnel';
  }

  if (engine) engine.hide();
  showP5Canvas();
  syncLiteConfig();

  if (!p5Instance) {
    p5Instance = new p5((sketch) => {
      sketch.setup = function () {
        const cnv = sketch.createCanvas(window.innerWidth, window.innerHeight);
        const main = getMainContainer();
        if (cnv && cnv.elt && main && cnv.elt.parentNode !== main) {
          main.appendChild(cnv.elt);
        }
        p5CanvasEl = cnv && cnv.elt ? cnv.elt : null;
        // US1 FR-003: DPR cap
        const targetDpr = profile.isMobile ? 1.0 : 1.5;
        sketch.pixelDensity(Math.min(window.devicePixelRatio || 1, targetDpr));
        sketch.colorMode(sketch.HSB, 360, 100, 100);
        sketch.stroke(255);
        sketch.noFill();
      };

      sketch.windowResized = function () {
        sketch.resizeCanvas(window.innerWidth, window.innerHeight);
      };

      syncLiteConfig();

      currentEffectName = effectName;
      currentScene = createScene({
        effect: effectName,
        variant: getDefaultVariantForEffect(effectName)
      });
      p5Sketch = sketch;
      currentEffect = Effects[effectName](sketch);

      fpsCounter = createFpsCounter();
      renderLoop = createRenderLoop({
        targetFps: 60,
        fpsCounter,
        onFrame: () => {
          if (currentEffect && currentEffect.draw) {
            currentEffect.draw(config);
          }
        }
      });
      renderLoop.start();
      if (paused) renderLoop.stop();

      // p5 sigue dibujando via sketch.draw, pero el work real está en renderLoop.
      sketch.draw = function () { /* renderLoop handles it */ };
    }, container || engineContainer || null);
    return;
  }

  // Instancia ya existe: sólo cambiamos el efecto.
  changeEffect(effectName);
}

/**
 * Iniciar visualizador con un efecto (p5 o GPU).
 * El parámetro `container` es opcional; por defecto usa `#generator main`.
 */
export function startVisualizer(effectName = 'tunnel', container = null) {
  if (isEngineEffect(effectName)) {
    startEngineEffect(effectName, container);
    return;
  }
  startP5Effect(effectName, container);
}

/**
 * Cambiar efecto activo.
 */
export function changeEffect(effectName, options = {}) {
  const toGpu = isEngineEffect(effectName);
  if (!toGpu && !Effects[effectName]) {
    console.warn('Efecto no encontrado:', effectName);
    return;
  }

  const transition = resolveTransition(effectName, options);
  const fromGpu = isEngineEffect(currentEffectName);
  const useOverlay = !!currentEffectName
    && shouldCrossfadeBackends(fromGpu, toGpu)
    && transition.transitionMs > 0;
  if (useOverlay) beginBackendCrossfade(transition);

  if (toGpu) {
    startEngineEffect(effectName, null, transition);
    finishBackendCrossfade();
    return;
  }

  if (!p5Instance) {
    startVisualizer(effectName);
    finishBackendCrossfade();
    return;
  }

  if (engine) engine.hide();
  showP5Canvas();
  syncLiteConfig();
  const sk = p5Sketch || p5Instance;
  currentEffectName = effectName;
  currentEffect = Effects[effectName](sk);
  currentScene = createScene({
    effect: effectName,
    variant: getDefaultVariantForEffect(effectName)
  });
  if (renderLoop && !renderLoop.isRunning() && !paused) renderLoop.start();
  if (paused && engine) engine.stop();
  finishBackendCrossfade();
}

export function getCurrentEffect() {
  return currentEffectName;
}

/**
 * Carga una escena completa, sea GPU o p5.
 * @param {object} scene
 * @param {{transitionMs?:number|'auto', transitionType?:string}} [options]
 */
export function setScene(scene, options = {}) {
  const s = createScene(scene);
  if (!isEngineEffect(s.effect) && !Effects[s.effect]) {
    console.warn('Efecto no encontrado:', s.effect);
    return null;
  }

  const transition = resolveTransition(s.effect, options);
  const fromGpu = isEngineEffect(currentEffectName);
  const toGpu = isEngineEffect(s.effect);

  if (toGpu) {
    const useOverlay = !!currentEffectName
      && shouldCrossfadeBackends(fromGpu, toGpu)
      && transition.transitionMs > 0;
    if (useOverlay) beginBackendCrossfade(transition);
    startEngineEffect(s.effect, null, transition);
    if (engine) engine.setScene(s, transition);
    currentEffectName = s.effect;
    currentEffect = null;
    currentScene = s;
    finishBackendCrossfade();
    return s;
  }

  changeEffect(s.effect, transition);
  currentEffectName = s.effect;
  currentScene = s;
  return s;
}

/**
 * Devuelve la escena activa, reconstruida desde el backend actual.
 */
export function getScene() {
  if (!currentEffectName) return null;
  if (isEngineEffect(currentEffectName) && engine) {
    currentScene = engine.getScene();
    return currentScene;
  }
  if (currentScene && currentScene.effect === currentEffectName) return createScene(currentScene);
  return createScene({
    effect: currentEffectName,
    variant: getDefaultVariantForEffect(currentEffectName)
  });
}

export function getAvailableEffects() {
  return [...Object.keys(Effects), ...getEngineEffectNames()];
}

/** Pausa/reanuda el backend activo (p5 o GPU) sin destruirlo. */
export function setVisualizerPaused(value) {
  paused = !!value;
  if (paused) {
    if (engine) engine.stop();
    if (renderLoop) renderLoop.stop();
  } else if (isEngineEffect(currentEffectName) && engine) {
    engine.show();
  } else if (renderLoop) {
    renderLoop.start();
  }
  return paused;
}

export function isVisualizerPaused() {
  return paused;
}

export function stopVisualizer() {
  if (renderLoop) { renderLoop.stop(); renderLoop = null; }
  if (p5Instance) { p5Instance.remove(); p5Instance = null; }
  if (engine) { engine.dispose(); engine = null; }
  p5Sketch = null;
  p5CanvasEl = null;
  currentEffect = null;
  currentEffectName = null;
  currentScene = null;
  engineContainer = null;
  fpsCounter = null;
  lastTransitionType = null;
  if (backendCrossfade) {
    backendCrossfade.cancel();
    backendCrossfade = null;
  }
}

/**
 * Update config (e.g., lite mode toggled). Los efectos p5 leen `config.isLite`.
 */
export function setVisualizerConfig(next) {
  config = { ...config, ...next };
  if (engine && typeof next.isLite === 'boolean') {
    engine.setQuality(next.isLite ? 'lite' : 'high');
  }
}

export function getVisualizerConfig() {
  return config;
}

// ---------------------------------------------------------------------------
// API de parámetros del motor GPU (agnóstica del efecto)
// ---------------------------------------------------------------------------

/**
 * @param {Record<string, number|boolean>} patch
 */
export function setEffectParameters(patch) {
  if (!engine) return [];
  return engine.setParameters(patch);
}

export function getEffectParameters() {
  return engine ? engine.getParameters() : {};
}

export function getEffectSchema() {
  return engine ? engine.getSchema() : {};
}

export function getEngineStats() {
  return engine ? engine.getStats() : null;
}

export function setEngineQuality(name) {
  if (engine) engine.setQuality(name);
}

export function getEngine() {
  return engine;
}

/**
 * Acceso al fpsCounter para el widget de métricas.
 */
export function getFpsCounter() {
  if (engine) return engine.fpsCounter;
  return fpsCounter;
}

/**
 * Acceso al renderLoop para integración con UI (toggle lite, etc.).
 */
export function getRenderLoop() {
  return renderLoop;
}

export function getDeviceProfile() {
  return profile;
}
