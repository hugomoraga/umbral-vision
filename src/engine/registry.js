/**
 * Registro de efectos del motor GPU.
 *
 * La UI consume este registro junto con `Effects` (p5) para construir un
 * catálogo unificado sin conocer detalles del motor.
 */

import { FluidFields, FLUID_FIELDS_SCHEMA } from './effects/FluidFields.js';
import { OrganicStructures, ORGANIC_SCHEMA } from './effects/OrganicStructures.js';
import { MathematicalForms, MATH_SCHEMA } from './effects/MathematicalForms.js';
import { TemporalVeil, TEMPORAL_SCHEMA } from './effects/TemporalVeil.js';

/**
 * Preview 2D aproximada para thumbnails de la UI (no usa WebGL).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} time seconds
 */
export function drawFluidPreview(ctx, width, height, time) {
  ctx.fillStyle = '#04060a';
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.33;
  const glow = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.7);
  glow.addColorStop(0, 'rgba(90, 190, 255, 0.30)');
  glow.addColorStop(1, 'rgba(10, 20, 40, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'lighter';
  const count = 56;
  for (let i = 0; i < count; i++) {
    const u = i / count;
    const theta = u * Math.PI * 2;
    const wobble = Math.sin(theta * 3 + time * 1.4) * 0.18 + Math.sin(theta * 5 - time) * 0.06;
    const rad = r * (0.85 + wobble);
    const x = cx + Math.cos(theta) * rad;
    const y = cy + Math.sin(theta) * rad * 0.8 + Math.sin(theta * 2 + time * 1.1) * r * 0.18;
    const hue = 190 + Math.sin(theta + time) * 26;
    const size = 1.4 + (Math.sin(theta * 4 + time * 2) * 0.5 + 0.5) * 2.2;
    ctx.fillStyle = `hsla(${hue}, 90%, 68%, 0.55)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}

export function drawOrganicPreview(ctx, width, height, time) {
  ctx.fillStyle = '#04060a';
  ctx.fillRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.115;

  ctx.globalCompositeOperation = 'lighter';
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const t = (i / 180) * Math.PI * 2;
      const wob = 1 + Math.sin(t * 6 + time * 1.3 + layer) * 0.08;
      const x = cx + (Math.sin(t) + 2 * Math.sin(2 * t)) * scale * 0.62 * wob;
      const y = cy + (Math.cos(t) - 2 * Math.cos(2 * t)) * scale * 0.62 * wob;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `hsla(${205 + layer * 18}, 85%, ${60 + layer * 8}%, ${0.5 - layer * 0.12})`;
    ctx.lineWidth = 1.2 + layer * 0.8;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
}

export function drawMathPreview(ctx, width, height, time) {
  ctx.fillStyle = '#05040a';
  ctx.fillRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) * 0.42;

  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2 + time * 0.15;
    const bulb = 0.55 + 0.45 * Math.abs(Math.sin(a * 4 + time));
    const r = maxR * bulb * (0.75 + 0.25 * Math.sin(a * 7 - time));
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.9;
    ctx.fillStyle = `hsla(${250 + Math.cos(a * 3) * 30}, 85%, 62%, 0.45)`;
    ctx.beginPath();
    ctx.arc(x, y, 1.6 + bulb * 2.0, 0, Math.PI * 2);
    ctx.fill();
  }
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  glow.addColorStop(0, 'rgba(140,120,255,0.28)');
  glow.addColorStop(1, 'rgba(20,10,40,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

export function drawTemporalPreview(ctx, width, height, time) {
  ctx.fillStyle = '#030408';
  ctx.fillRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 12; i++) {
    const r = (i / 12) * Math.min(width, height) * 0.46;
    ctx.beginPath();
    ctx.arc(cx, cy, r, time * 0.5 + i * 0.5, time * 0.5 + i * 0.5 + 2.2);
    ctx.strokeStyle = `hsla(${190 + i * 9}, 85%, 60%, ${0.55 - i * 0.03})`;
    ctx.lineWidth = 1 + (i % 3) * 0.7;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
}

export const ENGINE_EFFECTS = {
  fluidFields: {
    label: 'Fluid Fields',
    family: 'fluid',
    schema: FLUID_FIELDS_SCHEMA,
    create: (renderer, params) => new FluidFields(renderer, params),
    preview: drawFluidPreview
  },
  organicStructures: {
    label: 'Organic Structures',
    family: 'organic',
    schema: ORGANIC_SCHEMA,
    create: (renderer, params) => new OrganicStructures(renderer, params),
    preview: drawOrganicPreview
  },
  mathematicalForms: {
    label: 'Mathematical Forms',
    family: 'mathematical',
    schema: MATH_SCHEMA,
    create: (renderer, params) => new MathematicalForms(renderer, params),
    preview: drawMathPreview
  },
  temporalVeil: {
    label: 'Temporal Veil',
    family: 'temporal',
    schema: TEMPORAL_SCHEMA,
    create: (renderer, params) => new TemporalVeil(renderer, params),
    preview: drawTemporalPreview
  }
};

export function isEngineEffect(name) {
  return Object.prototype.hasOwnProperty.call(ENGINE_EFFECTS, name);
}

export function getEngineEffectNames() {
  return Object.keys(ENGINE_EFFECTS);
}

export function createEngineEffect(name, renderer, params) {
  const entry = ENGINE_EFFECTS[name];
  if (!entry) throw new Error(`Efecto GPU desconocido: ${name}`);
  return entry.create(renderer, params);
}
