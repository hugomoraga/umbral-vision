/**
 * Catálogo de familias visuales y auditoría de los efectos existentes.
 *
 * Una familia es la identidad estable; una variante es la gramática concreta
 * dentro de esa familia. Los efectos históricos de p5 se conservan: los que
 * salen de la taxonomía principal quedan accesibles como "Clásicos".
 */

export const AUDIT_DECISIONS = Object.freeze(['keep', 'merge', 'refactor', 'retire']);

export const EFFECT_AUDIT = Object.freeze({
  fluidFields: { decision: 'keep', family: 'fluidFields', variant: 'membrane', classic: false, reason: 'Técnica GPU propia y buena base de variantes.' },
  organicStructures: { decision: 'keep', family: 'organicStructures', variant: 'knot', classic: false, reason: 'Mesh 3D con Fresnel y silueta propia.' },
  mathematicalForms: { decision: 'keep', family: 'mathematicalForms', variant: 'mandelbulb', classic: false, reason: 'Raymarch + SDF con alto techo visual.' },
  temporalVeil: { decision: 'refactor', family: 'temporalSystems', variant: 'veil', classic: false, reason: 'Base del feedback global y de la familia temporal.' },
  tunnel: { decision: 'refactor', family: 'kineticGeometry', variant: 'tunnel', classic: true, reason: 'Concepto de túnel reutilizable como variante geométrica.' },
  spiral: { decision: 'refactor', family: 'kineticGeometry', variant: 'spiral', classic: true, reason: 'Espiral clásica; variante de geometría cinética.' },
  mandala: { decision: 'refactor', family: 'kineticGeometry', variant: 'mandala', classic: true, reason: 'Simetría radial; variante de geometría cinética.' },
  particles: { decision: 'merge', family: 'fluidFields', variant: 'swarm', classic: true, reason: 'Se solapa con Fluid Fields; queda como variante y clásico.' },
  waves: { decision: 'refactor', family: 'wavesAndFields', variant: 'waves', classic: true, reason: 'Base de la familia de ondas y campos.' },
  fractal: { decision: 'refactor', family: 'fractalGrowth', variant: 'tree', classic: true, reason: 'Recursión ramificada; base de crecimiento fractal.' },
  matrix: { decision: 'retire', family: 'classics', variant: 'matrix', classic: true, reason: 'Referencia literal; no es una familia visual.' },
  glitch: { decision: 'retire', family: 'classics', variant: 'glitch', classic: true, reason: 'Su valor es post-proceso/transición, no una familia.' },
  melt: { decision: 'retire', family: 'classics', variant: 'melt', classic: true, reason: 'Efecto puntual fuera de la taxonomía principal.' },
  fractalGlitch: { decision: 'merge', family: 'fractalGrowth', variant: 'glitch', classic: true, reason: 'Duplicaba el fractal con interferencias.' },
  waveGlitch: { decision: 'merge', family: 'wavesAndFields', variant: 'glitch', classic: true, reason: 'Duplicaba las ondas con interferencias.' },
  sacredGeometry: { decision: 'merge', family: 'kineticGeometry', variant: 'sacred', classic: true, reason: 'Casi idéntico a mandala; variante sagrada.' },
  biomech: { decision: 'refactor', family: 'organicStructures', variant: 'biomech', classic: true, reason: 'Estructura orgánica; variante de Organic Structures.' },
  dune: { decision: 'merge', family: 'wavesAndFields', variant: 'dunes', classic: true, reason: 'Ondas + geometría; variante de dunas.' },
  yinYang: { decision: 'retire', family: 'classics', variant: 'yinYang', classic: true, reason: 'Símbolo único, no una familia.' }
});

function variant(label, effect, structural, implemented = false) {
  return { label, effect, structural, implemented };
}

export const FAMILIES = Object.freeze({
  fluidFields: {
    id: 'fluidFields',
    label: 'Fluid Fields',
    description: 'Tejido de partículas y membranas vivas.',
    renderer: 'webgl',
    effect: 'fluidFields',
    defaultVariant: 'membrane',
    variants: {
      membrane: variant('Membrana', 'fluidFields', { topology: 'open-cylinder', folds: 3 }, true),
      torus: variant('Toro', 'fluidFields', { topology: 'torus', folds: 0 }, true),
      ribbon: variant('Cinta', 'fluidFields', { topology: 'twisted-ribbon', folds: 2 }, true),
      smoke: variant('Humo', 'fluidFields', { topology: 'volume', folds: 5 }, true),
      swarm: variant('Enjambre', 'fluidFields', { topology: 'free-swarm', folds: 0 }, true)
    }
  },
  organicStructures: {
    id: 'organicStructures',
    label: 'Organic Structures',
    description: 'Membranas topológicas translúcidas y volumen real.',
    renderer: 'webgl',
    effect: 'organicStructures',
    defaultVariant: 'knot',
    variants: {
      knot: variant('Nudo', 'organicStructures', { topology: 'torus-knot', shell: 'translucent' }, true),
      cell: variant('Célula', 'organicStructures', { topology: 'cell', shell: 'membrane' }, true),
      coral: variant('Coral', 'organicStructures', { topology: 'coral', shell: 'branched' }, true),
      biomech: variant('Biomech', 'organicStructures', { topology: 'biomech', shell: 'segmented' }, true)
    }
  },
  mathematicalForms: {
    id: 'mathematicalForms',
    label: 'Mathematical Forms',
    description: 'Formas matemáticas volumétricas por ray marching.',
    renderer: 'webgl',
    effect: 'mathematicalForms',
    defaultVariant: 'mandelbulb',
    variants: {
      mandelbulb: variant('Mandelbulb', 'mathematicalForms', { surface: 'mandelbulb', symmetry: 'radial' }, true),
      knot: variant('Nudo SDF', 'mathematicalForms', { surface: 'torus-knot', symmetry: 'none' }, true),
      lattice: variant('Retícula', 'mathematicalForms', { surface: 'lattice', symmetry: 'cubic' }, true),
      orb: variant('Orbe', 'mathematicalForms', { surface: 'sphere', symmetry: 'radial' }, true)
    }
  },
  temporalSystems: {
    id: 'temporalSystems',
    label: 'Temporal Systems',
    description: 'Estelas, acumulación y memoria visual.',
    renderer: 'webgl',
    effect: 'temporalVeil',
    defaultVariant: 'veil',
    variants: {
      veil: variant('Velo', 'temporalVeil', { feedback: 'warp', emitters: 'filaments' }, true),
      echo: variant('Eco', 'temporalVeil', { feedback: 'echo', emitters: 'rings' }, true),
      smear: variant('Smear', 'temporalVeil', { feedback: 'directional', emitters: 'streaks' }, true),
      tunnel: variant('Túnel temporal', 'temporalVeil', { feedback: 'zoom', emitters: 'tunnel' }, true)
    }
  },
  kineticGeometry: {
    id: 'kineticGeometry',
    label: 'Kinetic Geometry',
    description: 'Geometría cinética: túneles, espirales y simetrías radiales.',
    renderer: 'p5',
    effect: 'tunnel',
    defaultVariant: 'tunnel',
    variants: {
      tunnel: variant('Túnel', 'tunnel', { symmetry: 'radial', motif: 'ellipses' }, true),
      spiral: variant('Espiral', 'spiral', { symmetry: 'spiral', motif: 'dots' }, true),
      mandala: variant('Mándala', 'mandala', { symmetry: 'radial', motif: 'petals' }, true),
      sacred: variant('Sagrada', 'sacredGeometry', { symmetry: 'radial', motif: 'polygons' }, true),
      flower: variant('Flor', 'mandala', { symmetry: 'radial', motif: 'flower' }, true)
    }
  },
  wavesAndFields: {
    id: 'wavesAndFields',
    label: 'Waves & Fields',
    description: 'Ondas, dunas e interferencias sobre el plano.',
    renderer: 'p5',
    effect: 'waves',
    defaultVariant: 'waves',
    variants: {
      waves: variant('Olas', 'waves', { field: 'sine-lines', motif: 'layered' }, true),
      glitch: variant('Olas Glitch', 'waveGlitch', { field: 'sine-distorted', motif: 'glitch' }, true),
      dunes: variant('Dunas', 'dune', { field: 'dunes', motif: 'sand' }, true),
      interference: variant('Interferencia', 'waves', { field: 'interference', motif: 'ripples' }, true)
    }
  },
  fractalGrowth: {
    id: 'fractalGrowth',
    label: 'Fractal Growth',
    description: 'Crecimiento recursivo y estructuras ramificadas.',
    renderer: 'p5',
    effect: 'fractal',
    defaultVariant: 'tree',
    variants: {
      tree: variant('Árbol', 'fractal', { growth: 'recursive-tree', motif: 'branches' }, true),
      glitch: variant('Árbol Glitch', 'fractalGlitch', { growth: 'recursive-tree', motif: 'glitch' }, true),
      coral: variant('Coral', 'biomech', { growth: 'radial', motif: 'coral' }, true),
      tendril: variant('Tendril', 'biomech', { growth: 'radial', motif: 'tendrils' }, true)
    }
  },
  classics: {
    id: 'classics',
    label: 'Clásicos',
    description: 'Efectos históricos conservados fuera de la taxonomía principal.',
    renderer: 'p5',
    effect: 'matrix',
    defaultVariant: 'matrix',
    variants: {
      matrix: variant('Matrix', 'matrix', { motif: 'code-rain' }, true),
      glitch: variant('Glitch', 'glitch', { motif: 'scanlines' }, true),
      melt: variant('Melt', 'melt', { motif: 'dripping' }, true),
      yinYang: variant('Yin Yang', 'yinYang', { motif: 'symbol' }, true)
    }
  }
});

export const FAMILY_LIST = Object.freeze(Object.keys(FAMILIES));

export function getFamily(familyId) {
  return Object.prototype.hasOwnProperty.call(FAMILIES, familyId) ? FAMILIES[familyId] : null;
}

export function getFamilyForEffect(effectName) {
  const audit = EFFECT_AUDIT[effectName];
  if (audit) return audit.family;
  for (const family of Object.values(FAMILIES)) {
    if (family.effect === effectName) return family.id;
    for (const entry of Object.values(family.variants)) {
      if (entry.effect === effectName) return family.id;
    }
  }
  return null;
}

/**
 * Resuelve la familia de una escena usando efecto + variante. Necesario
 * porque un mismo efecto p5 puede servir a más de una familia (p. ej.
 * biomech como variante de Fractal Growth).
 */
export function getFamilyForScene(scene) {
  if (!scene) return null;
  for (const family of Object.values(FAMILIES)) {
    const entry = family.variants?.[scene.variant];
    if (entry?.effect === scene.effect) return family.id;
  }
  return getFamilyForEffect(scene.effect);
}

export function getDefaultVariant(familyId) {
  const family = getFamily(familyId);
  return family ? family.defaultVariant : null;
}

export function getDefaultVariantForEffect(effectName) {
  const audit = EFFECT_AUDIT[effectName];
  return audit ? audit.variant : 'default';
}

export function getVariant(familyId, variantId) {
  const family = getFamily(familyId);
  if (!family) return null;
  return family.variants[variantId] || null;
}

/**
 * Resuelve una familia + variante a un efecto real del renderer.
 * @param {string} familyId
 * @param {string} [variantId]
 */
export function resolveVariant(familyId, variantId) {
  const family = getFamily(familyId);
  if (!family) return null;
  const id = variantId && family.variants[variantId] ? variantId : family.defaultVariant;
  const entry = family.variants[id];
  return { family, variantId: id, entry, effect: entry.effect || family.effect };
}

export function listFamilies({ includeClassics = true } = {}) {
  return FAMILY_LIST
    .filter((id) => includeClassics || id !== 'classics')
    .map((id) => FAMILIES[id]);
}

export function getClassicEffects() {
  return Object.keys(EFFECT_AUDIT).filter((name) => EFFECT_AUDIT[name].classic);
}

export function getRetiredEffects() {
  return Object.keys(EFFECT_AUDIT).filter((name) => EFFECT_AUDIT[name].decision === 'retire');
}

export function isClassicEffect(effectName) {
  return !!(EFFECT_AUDIT[effectName] && EFFECT_AUDIT[effectName].classic);
}

export function isRetiredEffect(effectName) {
  return !!(EFFECT_AUDIT[effectName] && EFFECT_AUDIT[effectName].decision === 'retire');
}

/**
 * Valida que el catálogo sea coherente. Devuelve una lista de errores.
 */
export function validateFamilyCatalog() {
  const errors = [];
  for (const [id, family] of Object.entries(FAMILIES)) {
    if (family.id !== id) errors.push(`Familia ${id}: id inconsistente`);
    const variants = Object.keys(family.variants || {});
    if (variants.length === 0) errors.push(`Familia ${id}: sin variantes`);
    if (!family.variants[family.defaultVariant]) {
      errors.push(`Familia ${id}: defaultVariant "${family.defaultVariant}" no existe`);
    }
    for (const [variantId, entry] of Object.entries(family.variants)) {
      if (!entry.effect) errors.push(`Familia ${id}/${variantId}: sin efecto`);
      if (!entry.structural || Object.keys(entry.structural).length === 0) {
        errors.push(`Familia ${id}/${variantId}: sin rasgo estructural`);
      }
    }
  }
  for (const [effect, audit] of Object.entries(EFFECT_AUDIT)) {
    if (!AUDIT_DECISIONS.includes(audit.decision)) {
      errors.push(`Efecto ${effect}: decisión inválida "${audit.decision}"`);
    }
    if (!getFamily(audit.family)) errors.push(`Efecto ${effect}: familia inexistente "${audit.family}"`);
  }
  return errors;
}

export function getAudit(effectName) {
  return EFFECT_AUDIT[effectName] || null;
}

/**
 * Índice numérico de una variante dentro de su familia. Los efectos GPU
 * reciben este índice como parámetro `variant`.
 */
export function getVariantIndex(familyId, variantId) {
  const family = getFamily(familyId);
  if (!family) return 0;
  const ids = Object.keys(family.variants);
  const index = ids.indexOf(variantId);
  return index < 0 ? 0 : index;
}

export function getVariantIdByIndex(familyId, index) {
  const family = getFamily(familyId);
  if (!family) return null;
  const ids = Object.keys(family.variants);
  return ids[Math.max(0, Math.min(ids.length - 1, Number(index) | 0))] || family.defaultVariant;
}

export function getVariantParamForEffect(effectName, variantId) {
  const familyId = getFamilyForEffect(effectName);
  if (!familyId) return 0;
  return getVariantIndex(familyId, variantId || getDefaultVariantForEffect(effectName));
}

export function getVariantForEffectParam(effectName, index) {
  const familyId = getFamilyForEffect(effectName);
  if (!familyId) return getDefaultVariantForEffect(effectName);
  return getVariantIdByIndex(familyId, index);
}
