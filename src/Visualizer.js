/**
 * Visualizer — gestor principal del canvas y efectos visuales.
 *
 * Cambios vs v0.1:
 * - US1 FR-001/002: renderLoop unificado (audio + render + fps en un solo rAF)
 * - US1 FR-003: DPR cap a 1.5 desktop / 1.0 mobile
 * - US1 FR-005: tickAudio() se llama en el render loop, no en rAF separado
 * - ponytail: el efecto se crea una vez en setup; sólo cambiamos la referencia
 *   activa en changeEffect. No destruimos/recreamos el canvas (ahorra GC).
 */

import { Effects } from './Effects.js';
import { createRenderLoop } from './perf/renderLoop.js';
import { createFpsCounter } from './perf/fpsCounter.js';
import { detectProfile } from './perf/deviceProfile.js';

let p5Instance = null;
let currentEffect = null;
let currentEffectName = null;
let renderLoop = null;
let fpsCounter = null;
let config = { isLite: false };

const profile = detectProfile();

/**
 * Iniciar visualizador con un efecto.
 * El parámetro `container` es ignorado — p5 siempre monta en <main>.
 */
export function startVisualizer(effectName = 'tunnel', container = null) {
  if (typeof p5 === 'undefined') {
    console.warn('p5.js no está cargado — el visualizador requiere p5');
    return;
  }

  if (!Effects[effectName]) {
    console.warn('Efecto no encontrado:', effectName);
    effectName = 'tunnel';
  }

  if (!p5Instance) {
    p5Instance = new p5((sketch) => {
      sketch.setup = function () {
        const cnv = sketch.createCanvas(window.innerWidth, window.innerHeight);
        const main = document.querySelector('#generator main') || document.body;
        if (cnv && cnv.elt && main && cnv.elt.parentNode !== main) {
          main.appendChild(cnv.elt);
        }
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

      config = { isLite: false };

      currentEffectName = effectName;
      currentEffect = Effects[effectName](sketch);

      fpsCounter = createFpsCounter();
      renderLoop = createRenderLoop({
        targetFps: 60,
        fpsCounter,
        onFrame: () => {
          if (currentEffect && currentEffect.draw) {
            currentEffect.draw();
          }
        }
      });
      renderLoop.start();

      // p5 sigue dibujando via sketch.draw, pero el work real está en renderLoop.
      // El sketch.draw queda como no-op para no duplicar el trabajo.
      sketch.draw = function () { /* renderLoop handles it */ };
    }, container);
    return;
  }

  // Instancia ya existe: sólo cambiamos el efecto.
  changeEffect(effectName);
}

/**
 * Cambiar efecto activo.
 */
export function changeEffect(effectName) {
  if (!Effects[effectName]) {
    console.warn('Efecto no encontrado:', effectName);
    return;
  }
  if (!p5Instance) {
    startVisualizer(effectName);
    return;
  }
  const sk = p5Instance;
  currentEffectName = effectName;
  currentEffect = Effects[effectName](sk);
}

export function getCurrentEffect() {
  return currentEffectName;
}

export function getAvailableEffects() {
  return Object.keys(Effects);
}

export function stopVisualizer() {
  if (renderLoop) { renderLoop.stop(); renderLoop = null; }
  if (p5Instance) { p5Instance.remove(); p5Instance = null; }
  currentEffect = null;
  currentEffectName = null;
  fpsCounter = null;
}

/**
 * Update config (e.g., lite mode toggled). Los efectos leen `config.isLite` en draw.
 */
export function setVisualizerConfig(next) {
  config = { ...config, ...next };
}

export function getVisualizerConfig() {
  return config;
}

/**
 * Acceso al fpsCounter para el widget de métricas.
 */
export function getFpsCounter() {
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
