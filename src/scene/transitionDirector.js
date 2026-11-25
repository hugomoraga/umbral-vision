/**
 * TransitionDirector — elige cómo pasar de una escena a otra.
 *
 * La idea es la parte buena de MilkDrop/projectM: el cambio no es un corte ni
 * un cross-fade fijo, sino una transición con tipo, duración, easing y dirección
 * variables, elegida según familias, backend y energía musical.
 */

import { mulberry32 } from '../engine/math/random.js';
import { getFamilyForScene } from './families.js';

export const TRANSITION_TYPES = Object.freeze(['dissolve', 'luma', 'zoom', 'wipe', 'feedback']);
export const TRANSITION_EASINGS = Object.freeze(['smooth', 'cubic', 'expo', 'linear']);

export const TRANSITION_LABELS = Object.freeze({
  dissolve: 'Disolver',
  luma: 'Luz',
  zoom: 'Zoom',
  wipe: 'Barrido',
  feedback: 'Feedback'
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Curva de easing normalizada [0,1].
 * @param {'smooth'|'cubic'|'expo'|'linear'} name
 * @param {number} t
 */
export function easeTransition(name, t) {
  const x = clamp(Number(t) || 0, 0, 1);
  switch (name) {
    case 'linear':
      return x;
    case 'cubic':
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    case 'expo':
      if (x === 0) return 0;
      if (x === 1) return 1;
      return x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
    case 'smooth':
    default:
      return x * x * (3 - 2 * x);
  }
}

/** Mapea el tipo de transición al modo del shader de mix. */
export function transitionMode(type) {
  switch (type) {
    case 'luma': return 1;
    case 'zoom': return 2;
    case 'wipe': return 3;
    case 'feedback': return 1;
    default: return 0;
  }
}

export function cssEasing(name) {
  switch (name) {
    case 'cubic': return 'cubic-bezier(0.22, 0.8, 0.25, 1)';
    case 'expo': return 'cubic-bezier(0.16, 1, 0.3, 1)';
    case 'linear': return 'linear';
    case 'smooth':
    default: return 'ease-in-out';
  }
}

function familyOf(scene) {
  if (!scene?.effect) return null;
  return getFamilyForScene(scene);
}

/**
 * Elige una transición determinista si se pasa `seed`, o aleatoria si no.
 *
 * @param {{
 *   from?:object|null,
 *   to?:object|null,
 *   audio?:object|null,
 *   lastType?:string|null,
 *   sameBackend?:boolean,
 *   seed?:number,
 *   random?:()=>number
 * }} [options]
 */
export function chooseTransition(options = {}) {
  const seed = Number.isFinite(options.seed) ? (options.seed >>> 0) : null;
  const rng = options.random || (seed != null ? mulberry32(seed) : Math.random);
  const fromFamily = familyOf(options.from);
  const toFamily = familyOf(options.to);
  const sameFamily = !!(fromFamily && toFamily && fromFamily === toFamily);
  const sameBackend = options.sameBackend !== false;
  const audio = options.audio || {};
  const energy = clamp(
    (Number(audio.level) || 0) * 0.45
      + (Number(audio.kickFlash) || 0) * 0.35
      + (Number(audio.bassFast) || 0) * 0.2,
    0,
    1
  );

  let candidates;
  if (!sameBackend) {
    // El overlay de backend hace un cross-fade; el tipo sólo informa duración.
    candidates = ['luma', 'dissolve', 'wipe'];
  } else if (sameFamily) {
    candidates = ['dissolve', 'zoom', 'luma'];
  } else {
    candidates = ['zoom', 'wipe', 'luma', 'feedback', 'dissolve'];
  }

  const withoutLast = candidates.filter((type) => type !== options.lastType);
  const pool = withoutLast.length ? withoutLast : candidates;
  const type = pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];

  const base = sameFamily ? 1500 : (sameBackend ? 2100 : 1400);
  const spread = sameFamily ? 700 : (sameBackend ? 1400 : 600);
  let durationMs = base + rng() * spread;
  durationMs *= 1 - energy * 0.24;
  durationMs = Math.round(clamp(durationMs, 900, 3800));

  const easing = type === 'zoom' || type === 'feedback'
    ? 'cubic'
    : type === 'wipe' ? 'expo' : 'smooth';
  const angle = rng() * Math.PI * 2;

  return {
    type,
    durationMs,
    easing,
    direction: [Math.cos(angle), Math.sin(angle)],
    seed: Math.floor(rng() * 0x7fffffff),
    sameFamily,
    sameBackend,
    energy: Math.round(energy * 100) / 100
  };
}

/**
 * Transiciones que ameritan un empujón del feedback global.
 */
export function transitionFeedbackBoost(type) {
  if (type === 'feedback' || type === 'feedback-smear') {
    return { amount: 0.2, decay: 0.025, zoom: 0.4 };
  }
  if (type === 'zoom') {
    return { amount: 0.08, decay: 0.01, zoom: 0.2 };
  }
  return null;
}
