/**
 * MathematicalForms — Mandelbulb raymarched.
 *
 * Familia: Mathematical Forms.
 * No comparte técnica con las otras familias: SDF + ray marching + iteración
 * fractal en el fragment shader, con normales por gradiente y glow volumétrico.
 */

import { Effect } from './Effect.js';
import { Program } from '../core/Program.js';
import { RenderTarget, supportsRenderFormat } from '../core/RenderTarget.js';
import { createFullscreenQuad } from '../core/Geometry.js';
import { MATH_VERT, MATH_FRAG } from '../shaders/mathematical.js';

export const MATH_SCHEMA = {
  speed: { type: 'number', default: 1.0, min: 0.1, max: 3.0, label: 'Velocidad', group: 'Movimiento' },
  power: { type: 'number', default: 7.6, min: 3.0, max: 12.0, label: 'Potencia', group: 'Forma' },
  warp: { type: 'number', default: 0.35, min: 0.0, max: 1.5, label: 'Warp', group: 'Forma' },
  detail: { type: 'number', default: 0.55, min: 0.0, max: 1.0, label: 'Detalle', group: 'Forma' },
  hue: { type: 'number', default: 0.58, min: 0.0, max: 1.0, label: 'Tono', group: 'Apariencia' },
  saturation: { type: 'number', default: 0.85, min: 0.0, max: 1.0, label: 'Saturación', group: 'Apariencia' },
  glow: { type: 'number', default: 0.95, min: 0.2, max: 4.0, label: 'Glow', group: 'Apariencia' },
  bloom: { type: 'number', default: 0.58, min: 0.0, max: 3.0, label: 'Bloom', group: 'Apariencia' },
  exposure: { type: 'number', default: 0.88, min: 0.2, max: 3.0, label: 'Exposición', group: 'Apariencia' },
  audio: { type: 'number', default: 1.0, min: 0.0, max: 1.0, label: 'Audio', group: 'Comportamiento' },
  seed: { type: 'int', default: 5, min: 0, max: 2147483647, label: 'Seed', group: 'Comportamiento' }
};

const FALLBACK_AUDIO = Object.freeze({
  enabled: false, level: 0, rms: 0, bass: 0, mid: 0, high: 0, beat: 0, energy: 0
});

function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

export class MathematicalForms extends Effect {
  static schema = MATH_SCHEMA;

  constructor(renderer, params = {}) {
    super(params);
    this.renderer = renderer;
    this.gl = renderer.gl;
    this.sceneFormat = supportsRenderFormat(this.gl, 'rgba16f') ? 'rgba16f' : 'rgba8';
    this.sceneTarget = new RenderTarget(this.gl, {
      width: renderer.width,
      height: renderer.height,
      format: this.sceneFormat
    });
    this.quad = createFullscreenQuad(this.gl);
    this.program = new Program(this.gl, MATH_VERT, MATH_FRAG, 'math:raymarch');
    this.lastAudio = FALLBACK_AUDIO;
    this.camera = { pos: [0, 0, 3.4], right: [1, 0, 0], up: [0, 1, 0], forward: [0, 0, -1] };
  }

  setAudioFeatures(audio) {
    this.lastAudio = audio || FALLBACK_AUDIO;
  }

  update(dt, audio = FALLBACK_AUDIO) {
    super.update(dt, audio);
    this.lastAudio = audio;
    const p = this.params;
    const t = this.time;
    const pointer = this.renderer.pointer || { x: 0, y: 0 };
    const a = p.audio > 0 && audio.enabled ? p.audio : 0;

    const radius = 3.35 - audio.bass * a * 1.25 - audio.beat * a * 0.55 + Math.sin(t * 0.1) * 0.16;
    const angle = t * 0.12 * p.speed * (1 + audio.bass * a * 1.2) + pointer.x * 0.25 + (p.seed | 0) * 0.013;
    const height = Math.sin(t * 0.09) * 1.6 + pointer.y * 0.9 + audio.mid * a * 0.5;

    const pos = [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ];
    const forward = normalize([-pos[0], -pos[1] * 0.55, -pos[2]]);
    const right0 = normalize(cross(forward, [0, 1, 0]));
    const up0 = normalize(cross(right0, forward));

    // Roll reactivo: los medios y el beat inclinan la cámara.
    const roll = audio.mid * a * 0.42 + audio.beat * a * 0.3;
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    const right = [
      right0[0] * cr + up0[0] * sr,
      right0[1] * cr + up0[1] * sr,
      right0[2] * cr + up0[2] * sr
    ];
    const up = [
      up0[0] * cr - right0[0] * sr,
      up0[1] * cr - right0[1] * sr,
      up0[2] * cr - right0[2] * sr
    ];
    this.camera = { pos, right, up, forward };
  }

  getDetail() {
    const quality = this.renderer.quality.name;
    const reduction = quality === 'lite' ? -16 : 0;
    const steps = Math.round(56 + this.params.detail * 64) + reduction;
    const iterations = 4 + Math.round(this.params.detail * 2);
    return {
      steps: Math.max(32, Math.min(120, steps)),
      iterations: Math.max(3, Math.min(6, iterations))
    };
  }

  render() {
    const gl = this.gl;
    const p = this.params;
    const audio = this.lastAudio || FALLBACK_AUDIO;
    const a = p.audio > 0 && audio.enabled ? p.audio : 0;
    const detail = this.getDetail();

    this.sceneTarget.bind();
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const cam = this.camera;
    this.program.use()
      .set('uResolution', [this.sceneTarget.width, this.sceneTarget.height])
      .set('uTime', this.time)
      .set('uSpeed', p.speed)
      .set('uPower', p.power)
      .set('uWarp', p.warp)
      .set('uHue', p.hue)
      .set('uSaturation', p.saturation)
      .set('uGlow', p.glow)
      .set('uSeed', ((p.seed | 0) % 1000) * 0.01)
      .set('uSteps', detail.steps)
      .set('uIterations', detail.iterations)
      .set('uCamPos', cam.pos)
      .set('uCamRight', cam.right)
      .set('uCamUp', cam.up)
      .set('uCamForward', cam.forward)
      .set('uTanHalfFov', Math.tan((48 * Math.PI) / 360))
      .set('uAudioBass', audio.bass * a)
      .set('uAudioMid', audio.mid * a)
      .set('uAudioHigh', audio.high * a)
      .set('uAudioRms', audio.rms * a)
      .set('uBeat', audio.beat * a)
      .set('uAudioAmount', a);

    this.quad.draw();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  getPostParams() {
    const p = this.params;
    return {
      bloomStrength: p.bloom,
      bloomThreshold: 0.42,
      bloomKnee: 0.25,
      exposure: p.exposure,
      vignette: 0.55,
      grain: 0.02,
      aberration: 0.016,
      time: this.time
    };
  }

  getSceneTarget() {
    return this.sceneTarget;
  }

  onResize(width, height) {
    if (this.sceneTarget) this.sceneTarget.resize(width, height);
  }

  dispose() {
    if (this.program) this.program.dispose();
    if (this.quad) this.quad.dispose();
    if (this.sceneTarget) this.sceneTarget.dispose();
    this.program = null;
    this.quad = null;
    this.sceneTarget = null;
  }
}
