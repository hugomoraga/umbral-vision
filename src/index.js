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
  setScene,
  getScene,
  getCurrentEffect,
  getAvailableEffects,
  stopVisualizer,
  setVisualizerConfig,
  getVisualizerConfig,
  getFpsCounter,
  getDeviceProfile,
  setEffectParameters,
  getEffectParameters,
  getEffectSchema,
  getEngineStats,
  setEngineQuality,
  getEngine,
  setVisualizerPaused,
  isVisualizerPaused
} from './Visualizer.js';
import {
  initAudio,
  stopAudio,
  getAudioState,
  getFrequencyData,
  getWaveformData,
  getAudioFeatures,
  tickAudio
} from './AudioReactive.js';
import { createEngine } from './engine/UmbralEngine.js';
import { loadAudioMap, getAudioMap, setAudioOverride, resetAudioOverrides } from './audio/audioConfig.js';
import {
  SCENE_SCHEMA_VERSION,
  createScene,
  migrateScene,
  validateScene,
  serializeScene,
  deserializeScene,
  legacyStateToScene,
  sceneToLegacyState,
  encodeSceneCompact,
  decodeSceneCompact,
  sceneFingerprint,
  randomSeed
} from './scene/Scene.js';
import {
  FAMILIES,
  FAMILY_LIST,
  EFFECT_AUDIT,
  getFamily,
  getFamilyForEffect,
  getVariant,
  resolveVariant,
  listFamilies,
  validateFamilyCatalog,
  isClassicEffect,
  getClassicEffects
} from './scene/families.js';
import { sampleScene, mutateScene, crossoverScenes, sampleMany, validateSample } from './scene/sampler.js';
import { createPlaylist, createSceneScheduler, quantizeDelay, PLAYBACK_MODES } from './scene/playlist.js';
import { createHistory } from './scene/history.js';
import { createThumbnailStore } from './scene/storage.js';
import { exportPack, importPack, parsePack, serializePack } from './scene/packs.js';
import { ENGINE_EFFECTS, isEngineEffect, getEngineEffectNames } from './engine/registry.js';
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
import {
  getPresets,
  loadPreset,
  savePreset,
  saveScene,
  promoteScene,
  getPresetScenes
} from './ui/presets.js';

// Re-exportar todo
export { Effects };
export {
  startVisualizer,
  changeEffect,
  setScene,
  getScene,
  getCurrentEffect,
  getAvailableEffects,
  stopVisualizer,
  setVisualizerConfig,
  getVisualizerConfig,
  getFpsCounter,
  getDeviceProfile,
  setEffectParameters,
  getEffectParameters,
  getEffectSchema,
  getEngineStats,
  setEngineQuality,
  getEngine,
  setVisualizerPaused,
  isVisualizerPaused
};
export {
  initAudio,
  stopAudio,
  getAudioState,
  getFrequencyData,
  getWaveformData,
  getAudioFeatures,
  tickAudio
};
export { createEngine, ENGINE_EFFECTS, isEngineEffect, getEngineEffectNames };
export { loadAudioMap, getAudioMap, setAudioOverride, resetAudioOverrides };
export {
  SCENE_SCHEMA_VERSION,
  createScene,
  migrateScene,
  validateScene,
  serializeScene,
  deserializeScene,
  legacyStateToScene,
  sceneToLegacyState,
  encodeSceneCompact,
  decodeSceneCompact,
  sceneFingerprint,
  randomSeed
};
export {
  FAMILIES,
  FAMILY_LIST,
  EFFECT_AUDIT,
  getFamily,
  getFamilyForEffect,
  getVariant,
  resolveVariant,
  listFamilies,
  validateFamilyCatalog,
  isClassicEffect,
  getClassicEffects,
  sampleScene,
  mutateScene,
  crossoverScenes,
  sampleMany,
  validateSample,
  createPlaylist,
  createSceneScheduler,
  quantizeDelay,
  PLAYBACK_MODES,
  createHistory,
  createThumbnailStore,
  exportPack,
  importPack,
  parsePack,
  serializePack
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
export {
  getPresets,
  loadPreset,
  savePreset,
  saveScene,
  promoteScene,
  getPresetScenes
};

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
    getDeviceProfile,
    setEffectParameters,
    getEffectParameters,
    getEffectSchema,
    getEngineStats,
    setEngineQuality,
    getEngine,
    setVisualizerPaused,
    isVisualizerPaused
  },
  Audio: {
    init: initAudio,
    stop: stopAudio,
    getState: getAudioState,
    getFrequencyData: getFrequencyData,
    getFeatures: getAudioFeatures,
    tick: tickAudio,
    loadMap: loadAudioMap,
    getMap: getAudioMap,
    setOverride: setAudioOverride,
    resetOverrides: resetAudioOverrides
  },
  Engine: {
    create: createEngine,
    effects: ENGINE_EFFECTS,
    isEngineEffect,
    getEffectNames: getEngineEffectNames
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


