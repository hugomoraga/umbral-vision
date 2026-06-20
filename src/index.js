/**
 * Umbral Vision - Framework modular para generación de visuales
 * KISS: Separación de responsabilidades, fácil de extender
 *
 * Punto de entrada centralizado - importa y exporta todos los módulos
 */

import { Effects } from './Effects.js';
import {
  startVisualizer,
  changeEffect,
  getCurrentEffect,
  getAvailableEffects,
  stopVisualizer,
  setVisualizerConfig,
  getVisualizerConfig,
  getFpsCounter,
  getDeviceProfile
} from './Visualizer.js';
import {
  initAudio,
  stopAudio,
  getAudioState,
  getFrequencyData,
  tickAudio
} from './AudioReactive.js';
import {
  startAutoTransition,
  stopAutoTransition,
  isAutoTransitionEnabled
} from './Transition.js';
import {
  getInputValue,
  normalize,
  map,
  constrain,
  lerp,
  glitchNoise,
  distortionWave,
  meltEffect,
  fractalNoise
} from './Utils.js';
import { getLiteMode, setLiteMode } from './perf/deviceProfile.js';
import { createFpsCounter } from './perf/fpsCounter.js';
import { createRenderLoop } from './perf/renderLoop.js';
import { createFpsWidget } from './perf/fpsCounterUI.js';
import { ObjectPool } from './perf/objectPool.js';
import { mountUI } from './ui/index.js';

// Re-exportar todo
export { Effects };
export {
  startVisualizer,
  changeEffect,
  getCurrentEffect,
  getAvailableEffects,
  stopVisualizer,
  setVisualizerConfig,
  getVisualizerConfig,
  getFpsCounter,
  getDeviceProfile
};
export {
  initAudio,
  stopAudio,
  getAudioState,
  getFrequencyData,
  tickAudio
};
export {
  startAutoTransition,
  stopAutoTransition,
  isAutoTransitionEnabled
};
export {
  getInputValue,
  normalize,
  map,
  constrain,
  lerp,
  glitchNoise,
  distortionWave,
  meltEffect,
  fractalNoise
};
export {
  getLiteMode,
  setLiteMode,
  createFpsCounter,
  createRenderLoop,
  createFpsWidget,
  ObjectPool
};
export { mountUI };

// Exportar como objeto namespace para compatibilidad
export default {
  Effects,
  Visualizer: {
    start: startVisualizer,
    change: changeEffect,
    getCurrent: getCurrentEffect,
    getAvailable: getAvailableEffects,
    stop: stopVisualizer,
    setConfig: setVisualizerConfig,
    getConfig: getVisualizerConfig,
    getFpsCounter,
    getDeviceProfile
  },
  Audio: {
    init: initAudio,
    stop: stopAudio,
    getState: getAudioState,
    getFrequencyData: getFrequencyData,
    tick: tickAudio
  },
  Transition: {
    start: startAutoTransition,
    stop: stopAutoTransition,
    isEnabled: isAutoTransitionEnabled
  },
  Utils: {
    getInputValue,
    normalize,
    map,
    constrain,
    lerp,
    glitchNoise,
    distortionWave,
    meltEffect,
    fractalNoise
  },
  Perf: {
    getLiteMode,
    setLiteMode,
    createFpsCounter,
    createRenderLoop,
    createFpsWidget,
    ObjectPool
  },
  mountUI
};


