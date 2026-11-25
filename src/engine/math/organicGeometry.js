/**
 * Geometría procedural para Organic Structures.
 *
 * Variantes:
 *  - knot: torus knot (trefoil) con tubo orgánico (default histórico)
 *  - cell: esfera deformada tipo célula
 *  - coral: tubo enredado con pliegues de coral
 *  - biomech: tubo segmentado con anillos biomecánicos
 *
 * Es una función pura (sin WebGL) para poder testearla en Node.
 */

import { mulberry32 } from './random.js';

const TAU = Math.PI * 2;

function createTubeGeometry(options, center, radius) {
  const segmentsU = Math.max(24, options.segmentsU ?? 240);
  const segmentsV = Math.max(8, options.segmentsV ?? 56);
  const twist = options.twist ?? 0;
  const seed = options.seed ?? 1;
  const rng = mulberry32(seed);
  const phase = rng() * TAU;

  const vertexCount = segmentsU * segmentsV;
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices = new Uint32Array(segmentsU * segmentsV * 6);

  const eps = 1e-3;
  const up = [0, 1, 0];

  for (let j = 0; j < segmentsV; j++) {
    const v = j / segmentsV;
    const phi = v * TAU;

    for (let i = 0; i < segmentsU; i++) {
      const u = i / segmentsU;
      const idx = (j * segmentsU + i) * 3;
      const uvIdx = (j * segmentsU + i) * 2;

      const c = center(u);
      const cNext = center(u + eps);
      let tx = cNext[0] - c[0];
      let ty = cNext[1] - c[1];
      let tz = cNext[2] - c[2];
      const tLen = Math.hypot(tx, ty, tz) || 1;
      tx /= tLen; ty /= tLen; tz /= tLen;

      // Frame estable (con fallback si la tangente es paralela a up).
      let nx = ty * up[2] - tz * up[1];
      let ny = tz * up[0] - tx * up[2];
      let nz = tx * up[1] - ty * up[0];
      let nLen = Math.hypot(nx, ny, nz);
      if (nLen < 1e-4) {
        nx = ty * 0 - tz * 1;
        ny = tz * 1 - tx * 0;
        nz = tx * 0 - ty * 1;
        nLen = Math.hypot(nx, ny, nz) || 1;
      }
      nx /= nLen; ny /= nLen; nz /= nLen;
      const bx = ty * nz - tz * ny;
      const by = tz * nx - tx * nz;
      const bz = tx * ny - ty * nx;

      const angle = phi + twist * u * TAU;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const r = radius(u, phi, phase);
      const normalX = nx * cosA + bx * sinA;
      const normalY = ny * cosA + by * sinA;
      const normalZ = nz * cosA + bz * sinA;

      positions[idx] = c[0] + normalX * r;
      positions[idx + 1] = c[1] + normalY * r;
      positions[idx + 2] = c[2] + normalZ * r;

      normals[idx] = normalX;
      normals[idx + 1] = normalY;
      normals[idx + 2] = normalZ;

      uvs[uvIdx] = u;
      uvs[uvIdx + 1] = v;
    }
  }

  let o = 0;
  for (let j = 0; j < segmentsV; j++) {
    const jNext = (j + 1) % segmentsV;
    for (let i = 0; i < segmentsU; i++) {
      const iNext = (i + 1) % segmentsU;
      const a = j * segmentsU + i;
      const b = j * segmentsU + iNext;
      const c = jNext * segmentsU + i;
      const d = jNext * segmentsU + iNext;

      indices[o++] = a;
      indices[o++] = c;
      indices[o++] = b;
      indices[o++] = b;
      indices[o++] = c;
      indices[o++] = d;
    }
  }

  return { positions, normals, uvs, indices };
}

function createCellGeometry(options) {
  const segmentsU = Math.max(24, options.segmentsU ?? 240);
  const segmentsV = Math.max(12, options.segmentsV ?? 56);
  const scale = options.scale ?? 0.95;
  const seed = options.seed ?? 1;
  const phase = mulberry32(seed)() * TAU;

  const vertexCount = segmentsU * segmentsV;
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices = new Uint32Array((segmentsU * (segmentsV - 1)) * 6);

  for (let j = 0; j < segmentsV; j++) {
    const v = j / (segmentsV - 1);
    const phi = v * Math.PI;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    for (let i = 0; i < segmentsU; i++) {
      const u = i / segmentsU;
      const theta = u * TAU;
      const bump = 1
        + 0.16 * Math.sin(theta * 3 + phase) * Math.sin(phi * 2)
        + 0.10 * Math.sin(theta * 5 - phi * 3 + phase * 0.7)
        + 0.06 * Math.sin(theta * 8 + phi * 4);
      const r = scale * 0.9 * bump;
      const idx = (j * segmentsU + i) * 3;
      const uvIdx = (j * segmentsU + i) * 2;
      const x = sinPhi * Math.cos(theta);
      const y = cosPhi;
      const z = sinPhi * Math.sin(theta);

      positions[idx] = x * r;
      positions[idx + 1] = y * r;
      positions[idx + 2] = z * r;
      normals[idx] = x;
      normals[idx + 1] = y;
      normals[idx + 2] = z;
      uvs[uvIdx] = u;
      uvs[uvIdx + 1] = v;
    }
  }

  let o = 0;
  for (let j = 0; j < segmentsV - 1; j++) {
    for (let i = 0; i < segmentsU; i++) {
      const iNext = (i + 1) % segmentsU;
      const a = j * segmentsU + i;
      const b = j * segmentsU + iNext;
      const c = (j + 1) * segmentsU + i;
      const d = (j + 1) * segmentsU + iNext;
      indices[o++] = a;
      indices[o++] = c;
      indices[o++] = b;
      indices[o++] = b;
      indices[o++] = c;
      indices[o++] = d;
    }
  }

  return { positions, normals, uvs, indices };
}

/**
 * @param {{segmentsU?:number, segmentsV?:number, tube?:number, scale?:number,
 *          twist?:number, seed?:number, variant?:number}} [options]
 * @returns {{positions:Float32Array, normals:Float32Array, uvs:Float32Array, indices:Uint32Array}}
 */
export function createOrganicGeometry(options = {}) {
  const variant = options.variant | 0;
  const scale = options.scale ?? 0.95;
  const tube = options.tube ?? 0.24;

  if (variant === 1) return createCellGeometry(options);

  if (variant === 2) {
    // Coral: curva de Lissajous enredada con pliegues profundos.
    return createTubeGeometry(options, (u) => {
      const t = u * TAU;
      return [
        (Math.sin(2 * t) + 0.8 * Math.sin(5 * t)) * scale * 0.72,
        (Math.cos(3 * t) + 0.5 * Math.cos(7 * t)) * scale * 0.72,
        Math.sin(4 * t) * scale * 0.9
      ];
    }, (u, phi, phase) => {
      const t = u * TAU;
      return tube * 1.15 * (
        1
        + 0.30 * Math.sin(t * 9 + phase)
        + 0.18 * Math.sin(t * 17 - phi * 3)
      );
    });
  }

  if (variant === 3) {
    // Biomech: tubo segmentado con anillos y torsión.
    return createTubeGeometry(options, (u) => {
      const t = u * TAU;
      return [
        Math.sin(t) * scale * 1.1,
        (Math.cos(t) * 0.45 + 0.25 * Math.sin(4 * t)) * scale,
        Math.cos(2 * t) * scale * 0.9
      ];
    }, (u, phi, phase) => {
      const t = u * TAU;
      const ring = 0.5 + 0.5 * Math.sin(t * 24 + phase);
      return tube * (0.72 + 0.42 * ring + 0.12 * Math.sin(phi * 4 + phase));
    });
  }

  // Knot histórico (trefoil).
  return createTubeGeometry(options, (u) => {
    const t = u * TAU;
    return [
      (Math.sin(t) + 2 * Math.sin(2 * t)) * scale,
      (Math.cos(t) - 2 * Math.cos(2 * t)) * scale,
      -Math.sin(3 * t) * scale
    ];
  }, (u, phi, phase) => {
    const t = u * TAU;
    return tube * (
      1
      + 0.22 * Math.sin(t * 3 + phi * 2 + phase)
      + 0.10 * Math.sin(t * 5 - phi * 3 + phase * 0.7)
    );
  });
}
