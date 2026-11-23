/**
 * Registro de efectos del motor GPU.
 *
 * La UI consume este registro junto con `Effects` (p5) para construir un
 * catálogo unificado sin conocer detalles del motor.
 */

import { FluidFields, FLUID_FIELDS_SCHEMA } from './effects/FluidFields.js';

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

export const ENGINE_EFFECTS = {
  fluidFields: {
    label: 'Fluid Fields',
    family: 'fluid',
    schema: FLUID_FIELDS_SCHEMA,
    create: (renderer, params) => new FluidFields(renderer, params),
    preview: drawFluidPreview
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
