/**
 * Sampler — generación y evolución de escenas dentro de la gramática de cada
 * familia. Determinista por seed; no renderiza, solo produce genomas válidos.
 */

import { mulberry32 } from '../engine/math/random.js';
import {
  getFamily,
  resolveVariant,
  listFamilies
} from './families.js';
import {
  createScene,
  nextSceneId,
  randomSeed
} from './Scene.js';

const PALETTES = [
  { name: 'abyss', hue: 0.56, saturation: 0.9 },
  { name: 'ember', hue: 0.05, saturation: 0.95 },
  { name: 'acid', hue: 0.22, saturation: 0.85 },
  { name: 'ultraviolet', hue: 0.78, saturation: 0.95 },
  { name: 'ice', hue: 0.48, saturation: 0.7 },
  { name: 'blood', hue: 0.98, saturation: 0.9 },
  { name: 'sand', hue: 0.11, saturation: 0.65 }
];

export const SAMPLER_SPECS = Object.freeze({
  fluidFields: {
    variants: ['membrane', 'torus', 'ribbon'],
    params: {
      density: { min: 0.55, max: 1, default: 0.9, sigma: 0.09 },
      speed: { min: 0.6, max: 1.8, default: 1, sigma: 0.16 },
      amplitude: { min: 0.35, max: 1.1, default: 0.62, sigma: 0.14 },
      complexity: { min: 0.3, max: 1, default: 0.62, sigma: 0.13 },
      turbulence: { min: 0.2, max: 1.2, default: 0.55, sigma: 0.16 },
      hue: { min: 0, max: 1, default: 0.56, sigma: 0.16 },
      saturation: { min: 0.45, max: 1, default: 0.9, sigma: 0.1 },
      glow: { min: 0.4, max: 2, default: 0.68, sigma: 0.22 },
      particleSize: { min: 0.7, max: 1.8, default: 1, sigma: 0.18 },
      bloom: { min: 0.3, max: 1.8, default: 0.85, sigma: 0.22 },
      exposure: { min: 0.6, max: 1.5, default: 0.98, sigma: 0.16 },
      audio: { min: 0.6, max: 1, default: 1, sigma: 0.08 }
    }
  },
  organicStructures: {
    variants: ['knot'],
    params: {
      speed: { min: 0.6, max: 1.8, default: 1, sigma: 0.16 },
      amplitude: { min: 0.08, max: 0.6, default: 0.26, sigma: 0.09 },
      frequency: { min: 0.6, max: 3, default: 1.35, sigma: 0.35 },
      twist: { min: 0, max: 1, default: 0.2, sigma: 0.2 },
      hue: { min: 0, max: 1, default: 0.53, sigma: 0.16 },
      saturation: { min: 0.45, max: 1, default: 0.95, sigma: 0.08 },
      glow: { min: 0.4, max: 2, default: 0.95, sigma: 0.24 },
      opacity: { min: 0.35, max: 1, default: 0.85, sigma: 0.12 },
      bloom: { min: 0.3, max: 1.8, default: 0.85, sigma: 0.22 },
      exposure: { min: 0.6, max: 1.5, default: 0.95, sigma: 0.16 },
      audio: { min: 0.6, max: 1, default: 1, sigma: 0.08 }
    }
  },
  mathematicalForms: {
    variants: ['mandelbulb'],
    params: {
      speed: { min: 0.5, max: 1.8, default: 1, sigma: 0.16 },
      power: { min: 4, max: 11, default: 7.6, sigma: 1.1 },
      warp: { min: 0, max: 1.2, default: 0.35, sigma: 0.2 },
      detail: { min: 0.25, max: 0.9, default: 0.55, sigma: 0.14 },
      hue: { min: 0, max: 1, default: 0.58, sigma: 0.16 },
      saturation: { min: 0.4, max: 1, default: 0.85, sigma: 0.1 },
      glow: { min: 0.4, max: 2, default: 0.95, sigma: 0.24 },
      bloom: { min: 0.2, max: 1.6, default: 0.58, sigma: 0.2 },
      exposure: { min: 0.55, max: 1.4, default: 0.88, sigma: 0.15 },
      audio: { min: 0.6, max: 1, default: 1, sigma: 0.08 }
    }
  },
  temporalSystems: {
    variants: ['veil'],
    params: {
      speed: { min: 0.5, max: 1.8, default: 1, sigma: 0.16 },
      decay: { min: 0.82, max: 0.985, default: 0.93, sigma: 0.025 },
      zoom: { min: 0.2, max: 0.9, default: 0.55, sigma: 0.14 },
      rotation: { min: -0.8, max: 0.8, default: 0.45, sigma: 0.2 },
      warp: { min: 0.1, max: 1.2, default: 0.55, sigma: 0.18 },
      density: { min: 0.1, max: 0.9, default: 0.3, sigma: 0.12 },
      hue: { min: 0, max: 1, default: 0.62, sigma: 0.16 },
      saturation: { min: 0.4, max: 1, default: 0.9, sigma: 0.1 },
      glow: { min: 0.4, max: 2, default: 0.85, sigma: 0.22 },
      bloom: { min: 0.25, max: 1.8, default: 0.7, sigma: 0.2 },
      exposure: { min: 0.6, max: 1.5, default: 0.95, sigma: 0.15 },
      audio: { min: 0.6, max: 1, default: 1, sigma: 0.08 }
    }
  }
});

const POST_SPEC = {
  bloom: { min: 0.25, max: 1.8, default: 0.8, sigma: 0.2 },
  exposure: { min: 0.65, max: 1.4, default: 0.98, sigma: 0.14 },
  vignette: { min: 0.25, max: 0.8, default: 0.55, sigma: 0.1 },
  grain: { min: 0.008, max: 0.06, default: 0.028, sigma: 0.01 },
  aberration: { min: 0.002, max: 0.035, default: 0.014, sigma: 0.006 },
  feedback: { min: 0.08, max: 0.55, default: 0.25, sigma: 0.08 },
  feedbackDecay: { min: 0.86, max: 0.975, default: 0.92, sigma: 0.02 }
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function gaussian(rng) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sampleParam(rng, spec, base = null) {
  const center = Number.isFinite(base) ? base : spec.default;
  // 30% uniforme para explorar los bordes; 70% gaussiano alrededor del centro.
  if (rng() < 0.3) return spec.min + rng() * (spec.max - spec.min);
  return clamp(center + gaussian(rng) * spec.sigma, spec.min, spec.max);
}

function samplePalette(rng) {
  const base = PALETTES[Math.floor(rng() * PALETTES.length)] || PALETTES[0];
  return {
    mode: 'named',
    name: base.name,
    hue: clamp(base.hue + (rng() - 0.5) * 0.12, 0, 1),
    saturation: clamp(base.saturation + (rng() - 0.5) * 0.18, 0.25, 1)
  };
}

function samplePost(rng) {
  const post = {};
  for (const [key, spec] of Object.entries(POST_SPEC)) {
    post[key] = sampleParam(rng, spec);
  }
  return post;
}

function availableVariants(family) {
  if (!family) return [];
  return Object.entries(family.variants)
    .filter(([, entry]) => entry.implemented !== false)
    .map(([id]) => id);
}

function familyFromInput(rng, familyId) {
  if (familyId) return getFamily(familyId);
  const families = listFamilies({ includeClassics: false });
  const eligible = families.filter((family) => availableVariants(family).length > 0);
  return eligible[Math.floor(rng() * eligible.length)] || eligible[0] || null;
}

/**
 * Genera una escena válida dentro de una familia.
 * @param {{familyId?:string, variantId?:string, seed?:number, rng?:()=>number, name?:string}} [options]
 */
export function sampleScene(options = {}) {
  const seed = Number.isFinite(options.seed) ? (options.seed >>> 0) : randomSeed();
  const rng = options.rng || mulberry32(seed);
  const family = familyFromInput(rng, options.familyId);
  if (!family) throw new Error('No hay familias disponibles para samplear');

  const variants = availableVariants(family);
  const variantId = options.variantId && family.variants[options.variantId]
    ? options.variantId
    : variants[Math.floor(rng() * variants.length)] || family.defaultVariant;
  const resolved = resolveVariant(family.id, variantId);
  const spec = SAMPLER_SPECS[family.id] || { params: {} };

  const params = {};
  for (const [key, paramSpec] of Object.entries(spec.params || {})) {
    params[key] = sampleParam(rng, paramSpec);
  }

  const scene = createScene({
    id: nextSceneId('gen'),
    name: options.name || '',
    origin: 'generated',
    effect: resolved.effect,
    variant: variantId,
    seed,
    params,
    palette: samplePalette(rng),
    post: samplePost(rng),
    drift: {
      enabled: true,
      rates: {
        hue: 0.004 + rng() * 0.02,
        warp: 0.004 + rng() * 0.025
      }
    },
    tags: [family.id, variantId]
  });
  return ensureConstraints(scene);
}

/**
 * Ajusta una escena para que cumpla los rangos y restricciones de su familia.
 */
export function ensureConstraints(scene) {
  const s = createScene(scene);
  const familyId = familyIdForScene(s);
  const spec = SAMPLER_SPECS[familyId] || { params: {} };
  const params = { ...s.params };
  for (const [key, paramSpec] of Object.entries(spec.params || {})) {
    if (!Number.isFinite(Number(params[key]))) {
      params[key] = paramSpec.default;
    } else {
      params[key] = clamp(Number(params[key]), paramSpec.min, paramSpec.max);
    }
  }
  // Nunca una escena completamente apagada.
  if (Number.isFinite(params.saturation) && params.saturation < 0.2) params.saturation = 0.35;
  if (Number.isFinite(params.exposure) && Number.isFinite(params.bloom)
      && params.exposure * (1 + params.bloom) < 0.55) {
    params.exposure = Math.max(0.7, params.exposure);
    params.bloom = Math.max(0.35, params.bloom);
  }
  return createScene({ ...s, params });
}

export function familyIdForScene(scene) {
  const family = listFamilies({ includeClassics: false })
    .find((entry) => entry.id === scene.familyId
      || entry.effect === scene.effect
      || Object.values(entry.variants).some((v) => v.effect === scene.effect));
  return family ? family.id : (scene.tags?.[0] || null);
}

export function validateSample(scene) {
  const s = createScene(scene);
  const errors = [];
  if (!s.effect) errors.push('sin effect');
  if (!s.variant) errors.push('sin variant');
  if (!Number.isInteger(s.seed)) errors.push('seed inválida');
  const familyId = familyIdForScene(s);
  const family = getFamily(familyId);
  if (!family) {
    errors.push(`familia desconocida para ${s.effect}/${s.variant}`);
    return errors;
  }
  if (!family.variants[s.variant]) errors.push(`variante ${s.variant} no pertenece a ${familyId}`);
  const spec = SAMPLER_SPECS[familyId] || { params: {} };
  for (const [key, paramSpec] of Object.entries(spec.params || {})) {
    const value = Number(s.params[key]);
    if (!Number.isFinite(value)) errors.push(`parámetro ${key} no numérico`);
    else if (value < paramSpec.min || value > paramSpec.max) {
      errors.push(`parámetro ${key} fuera de rango (${value})`);
    }
  }
  return errors;
}

/**
 * Muta una escena existente cambiando un subconjunto acotado de genes.
 */
export function mutateScene(parent, options = {}) {
  const base = createScene(parent);
  const seed = Number.isFinite(options.seed) ? (options.seed >>> 0) : randomSeed();
  const rng = options.rng || mulberry32(seed);
  const familyId = familyIdForScene(base);
  const family = getFamily(familyId);
  const spec = SAMPLER_SPECS[familyId] || { params: {} };
  const strength = Math.max(0.05, Math.min(1, Number(options.strength ?? 0.35)));

  const allGenes = Object.keys(spec.params || {});
  const requested = Array.isArray(options.genes) && options.genes.length
    ? options.genes.filter((gene) => allGenes.includes(gene))
    : [];
  const genes = requested.length
    ? requested
    : allGenes.filter(() => rng() < 0.35).slice(0, 3);

  const params = { ...base.params };
  for (const gene of genes) {
    const paramSpec = spec.params[gene];
    const current = Number.isFinite(Number(params[gene])) ? Number(params[gene]) : paramSpec.default;
    params[gene] = clamp(current + gaussian(rng) * paramSpec.sigma * strength, paramSpec.min, paramSpec.max);
  }

  let variant = base.variant;
  if (options.allowVariantChange && family) {
    const variants = availableVariants(family).filter((id) => id !== base.variant);
    if (variants.length && rng() < 0.25) variant = variants[Math.floor(rng() * variants.length)];
  }
  const resolved = family ? resolveVariant(family.id, variant) : null;

  const palette = {
    ...base.palette,
    hue: clamp(base.palette.hue + (rng() - 0.5) * 0.08, 0, 1),
    saturation: clamp(base.palette.saturation + (rng() - 0.5) * 0.1, 0.25, 1)
  };

  return ensureConstraints(createScene({
    ...base,
    id: nextSceneId('mut'),
    name: options.name || '',
    origin: 'mutated',
    parentId: base.id,
    effect: resolved ? resolved.effect : base.effect,
    variant,
    seed,
    params,
    palette,
    tags: [familyId, variant].filter(Boolean)
  }));
}

/**
 * Cruce simple: geometría/params de A, paleta de B.
 */
export function crossoverScenes(a, b, options = {}) {
  const left = createScene(a);
  const right = createScene(b);
  const seed = Number.isFinite(options.seed) ? (options.seed >>> 0) : randomSeed();
  return ensureConstraints(createScene({
    ...left,
    id: nextSceneId('mix'),
    name: options.name || '',
    origin: 'mutated',
    parentId: left.id,
    seed,
    palette: { ...right.palette },
    post: { ...left.post },
    tags: [familyIdForScene(left), left.variant].filter(Boolean)
  }));
}

/**
 * Genera N escenas válidas para tests y para el modo generativo.
 */
export function sampleMany(count, options = {}) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const seed = Number.isFinite(options.seed) ? (options.seed + i) >>> 0 : undefined;
    out.push(sampleScene({ ...options, seed }));
  }
  return out;
}

export function getSamplerSpec(familyId) {
  return SAMPLER_SPECS[familyId] || null;
}

export { PALETTES };
