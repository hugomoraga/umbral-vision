/**
 * Playlist — selección y programación de escenas.
 *
 * Modos:
 *  - curated: solo escenas guardadas
 *  - generative: escenas nuevas/mutadas
 *  - hybrid: mezcla ponderada de ambas
 *
 * La selección evita repetir una escena dentro de una ventana reciente y
 * favorece los favoritos. La programación puede cuantizarse al próximo compás.
 */

import { mulberry32 } from '../engine/math/random.js';
import { createScene, randomSeed } from './Scene.js';
import { sampleScene as defaultSample, mutateScene as defaultMutate } from './sampler.js';

export const PLAYBACK_MODES = Object.freeze(['curated', 'generative', 'hybrid']);

export function isPlaybackMode(mode) {
  return PLAYBACK_MODES.includes(mode);
}

/**
 * Segundos hasta el próximo límite musical.
 * @param {{bpm:number, beatPhase:number, beatsPerBar?:number, phraseBars?:number}} options
 * @returns {number|null}
 */
export function quantizeDelay({ bpm, beatPhase, beatsPerBar = 4, phraseBars = 1 } = {}) {
  const tempo = Number(bpm);
  if (!Number.isFinite(tempo) || tempo <= 0) return null;
  const phase = Number.isFinite(Number(beatPhase)) ? Math.min(0.999, Math.max(0, Number(beatPhase))) : 0;
  const beatDuration = 60 / tempo;
  const barBeats = Math.max(1, Number(beatsPerBar) || 4) * Math.max(1, Number(phraseBars) || 1);
  const beatsToBoundary = (1 - phase) + (barBeats - 1);
  return beatsToBoundary * beatDuration;
}

export function pickWeighted(items, weightOf = () => 1, rng = Math.random) {
  if (!items || items.length === 0) return null;
  let total = 0;
  const weights = items.map((item) => {
    const w = Math.max(0, Number(weightOf(item)) || 0);
    total += w;
    return w;
  });
  if (total <= 0) return items[Math.floor(rng() * items.length)];
  let cursor = rng() * total;
  for (let i = 0; i < items.length; i++) {
    cursor -= weights[i];
    if (cursor <= 0) return items[i];
  }
  return items[items.length - 1];
}

function sceneId(scene) {
  return scene?.id || null;
}

/**
 * @param {object} [options]
 * @param {'curated'|'generative'|'hybrid'} [options.mode]
 * @param {object[]} [options.scenes] escenas guardadas
 * @param {number} [options.noRepeatWindow]
 * @param {{curated?:number, generated?:number}} [options.weights]
 * @param {()=>number} [options.rng]
 * @param {{sampleScene:Function, mutateScene:Function}} [options.sampler]
 */
export function createPlaylist(options = {}) {
  const rng = options.rng || mulberry32(randomSeed());
  const sampler = {
    sampleScene: options.sampler?.sampleScene || defaultSample,
    mutateScene: options.sampler?.mutateScene || defaultMutate
  };
  let mode = isPlaybackMode(options.mode) ? options.mode : 'hybrid';
  let scenes = (options.scenes || []).map((scene) => createScene(scene));
  let noRepeatWindow = Math.max(0, Number(options.noRepeatWindow ?? 10));
  let weights = {
    curated: Math.max(0, Number(options.weights?.curated ?? 0.3)),
    generated: Math.max(0, Number(options.weights?.generated ?? 0.7))
  };
  const memory = [];
  let last = null;

  function remember(scene) {
    const id = sceneId(scene);
    memory.push(id);
    while (memory.length > noRepeatWindow) memory.shift();
  }

  function eligibleScenes() {
    const recent = new Set(memory);
    const eligible = scenes.filter((scene) => !recent.has(sceneId(scene)));
    return eligible.length ? eligible : scenes;
  }

  function pickCurated() {
    const eligible = eligibleScenes();
    return pickWeighted(eligible, (scene) => (scene.favorite ? 2.5 : 1), rng);
  }

  function pickGenerated() {
    const parents = eligibleScenes();
    const parent = parents.length && rng() < 0.45
      ? pickWeighted(parents, (scene) => (scene.favorite ? 2.5 : 1), rng)
      : last;
    if (parent && rng() < 0.65) {
      return sampler.mutateScene(parent, {
        seed: (randomSeed() + Math.floor(rng() * 100000)) >>> 0,
        allowVariantChange: true
      });
    }
    return sampler.sampleScene({ seed: (randomSeed() + Math.floor(rng() * 100000)) >>> 0 });
  }

  function next() {
    let scene = null;
    if (mode === 'curated') {
      scene = pickCurated();
    } else if (mode === 'generative') {
      scene = pickGenerated();
    } else {
      const curated = scenes.length > 0;
      const useCurated = curated && rng() < weights.curated / Math.max(0.0001, weights.curated + weights.generated);
      scene = useCurated ? pickCurated() : pickGenerated();
    }
    if (!scene) {
      if (mode === 'curated') return null;
      scene = sampler.sampleScene({ seed: (randomSeed() + Math.floor(rng() * 100000)) >>> 0 });
    }
    scene = createScene(scene);
    remember(scene);
    last = scene;
    return scene;
  }

  return {
    get mode() { return mode; },
    setMode(nextMode) {
      if (isPlaybackMode(nextMode)) mode = nextMode;
      return mode;
    },
    get scenes() { return scenes.slice(); },
    setScenes(nextScenes) {
      scenes = (nextScenes || []).map((scene) => createScene(scene));
    },
    addScene(scene) {
      scenes.push(createScene(scene));
    },
    get noRepeatWindow() { return noRepeatWindow; },
    setNoRepeatWindow(value) {
      noRepeatWindow = Math.max(0, Number(value) || 0);
      while (memory.length > noRepeatWindow) memory.shift();
    },
    get weights() { return { ...weights }; },
    setWeights(next) {
      weights = {
        curated: Math.max(0, Number(next?.curated ?? weights.curated)),
        generated: Math.max(0, Number(next?.generated ?? weights.generated))
      };
    },
    get history() { return memory.slice(); },
    get last() { return last; },
    next,
    nextDelay(audio = null) {
      if (!audio) return null;
      return quantizeDelay({
        bpm: audio.bpm,
        beatPhase: audio.beatPhase,
        beatsPerBar: 4,
        phraseBars: 1
      });
    },
    getState() {
      return {
        mode,
        scenes: scenes.length,
        noRepeatWindow,
        weights: { ...weights },
        history: memory.slice(),
        lastId: sceneId(last)
      };
    }
  };
}

/**
 * Scheduler con cuantización musical. No usa setInterval: agenda el próximo
 * cambio y consulta el reloj de audio en cada vuelta.
 */
export function createSceneScheduler({
  playlist,
  onScene,
  intervalMs = 10000,
  getAudio = () => null,
  setTimeoutFn = typeof setTimeout === 'function' ? setTimeout : null,
  clearTimeoutFn = typeof clearTimeout === 'function' ? clearTimeout : null
} = {}) {
  if (!playlist || typeof onScene !== 'function') {
    throw new Error('createSceneScheduler requiere playlist y onScene');
  }
  let timer = 0;
  let running = false;
  let interval = Math.max(0, Number(intervalMs) || 0);

  function schedule(delayMs) {
    if (!running || !setTimeoutFn) return;
    timer = setTimeoutFn(() => {
      if (!running) return;
      const scene = playlist.next();
      if (scene) onScene(scene);
      arm();
    }, Math.max(0, delayMs));
  }

  function arm() {
    if (!running) return;
    const audio = getAudio();
    const quantized = audio ? playlist.nextDelay(audio) : null;
    const delay = quantized != null ? quantized * 1000 : interval;
    schedule(delay);
  }

  return {
    start() {
      if (running) return;
      running = true;
      arm();
    },
    stop() {
      running = false;
      if (timer && clearTimeoutFn) clearTimeoutFn(timer);
      timer = 0;
    },
    setIntervalMs(value) {
      interval = Math.max(0, Number(value) || 0);
      if (running) {
        if (timer && clearTimeoutFn) clearTimeoutFn(timer);
        arm();
      }
    },
    get intervalMs() { return interval; },
    get running() { return running; },
    tickNow() {
      const scene = playlist.next();
      if (scene) onScene(scene);
      return scene;
    }
  };
}
