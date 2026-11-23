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

let p5Instance = null;
let p5Sketch = null;
let currentEffect = null;
let currentEffectName = null;
let renderLoop = null;
let fpsCounter = null;
let engine = null;
let engineContainer = null;
let p5CanvasEl = null;
let config = { isLite: false };

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

function startEngineEffect(effectName, container = null) {
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
      return;
    }
    fpsCounter = engine.fpsCounter;
  } else {
    engine.setEffect(effectName);
    engine.show();
    fpsCounter = engine.fpsCounter;
  }
  currentEffect = null;
  currentEffectName = effectName;
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
export function changeEffect(effectName) {
  if (isEngineEffect(effectName)) {
    startEngineEffect(effectName);
    return;
  }
  if (!Effects[effectName]) {
    console.warn('Efecto no encontrado:', effectName);
    return;
  }
  if (!p5Instance) {
    startVisualizer(effectName);
    return;
  }
  if (engine) engine.hide();
  showP5Canvas();
  syncLiteConfig();
  const sk = p5Sketch || p5Instance;
  currentEffectName = effectName;
  currentEffect = Effects[effectName](sk);
  if (renderLoop && !renderLoop.isRunning()) renderLoop.start();
}

export function getCurrentEffect() {
  return currentEffectName;
}

export function getAvailableEffects() {
  return [...Object.keys(Effects), ...getEngineEffectNames()];
}

export function stopVisualizer() {
  if (renderLoop) { renderLoop.stop(); renderLoop = null; }
  if (p5Instance) { p5Instance.remove(); p5Instance = null; }
  if (engine) { engine.dispose(); engine = null; }
  p5Sketch = null;
  p5CanvasEl = null;
  currentEffect = null;
  currentEffectName = null;
  engineContainer = null;
  fpsCounter = null;
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
