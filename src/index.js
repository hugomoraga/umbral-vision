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
  stopVisualizer
} from './Visualizer.js';
import {
  initAudio,
  stopAudio,
  getAudioState,
  getFrequencyData
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
import { mountUI } from './ui/index.js';

// Re-exportar todo
export { Effects };
export {
  startVisualizer,
  changeEffect,
  getCurrentEffect,
  getAvailableEffects,
  stopVisualizer
};
export {
  initAudio,
  stopAudio,
  getAudioState,
  getFrequencyData
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
export { mountUI };

// Exportar como objeto namespace para compatibilidad
export default {
  Effects,
  Visualizer: {
    start: startVisualizer,
    change: changeEffect,
    getCurrent: getCurrentEffect,
    getAvailable: getAvailableEffects,
    stop: stopVisualizer
  },
  Audio: {
    init: initAudio,
    stop: stopAudio,
    getState: getAudioState,
    getFrequencyData: getFrequencyData
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
  mountUI
};


