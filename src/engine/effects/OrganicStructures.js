/**
 * OrganicStructures — membranas topológicas 3D.
 *
 * Familia: Organic Structures.
 * Técnica distinta a Fluid Fields: no usa partículas; es un mesh paramétrico
 * (torus knot) con displacement en vertex shader, shading Fresnel y capas
 * translúcidas. Aporta volumen, silueta y profundidad real de cámara.
 */

import { Effect } from './Effect.js';
import { Program } from '../core/Program.js';
import { RenderTarget, supportsRenderFormat } from '../core/RenderTarget.js';
import { Mesh } from '../core/Mesh.js';
import { ORGANIC_VERT, ORGANIC_FRAG } from '../shaders/organic.js';
import { createOrganicGeometry } from '../math/organicGeometry.js';
import { perspective, lookAt, multiply, rotationY } from '../math/mat4.js';


export const ORGANIC_SCHEMA = {
  speed: { type: 'number', default: 1.0, min: 0.1, max: 3.0, label: 'Velocidad', group: 'Movimiento' },
  amplitude: { type: 'number', default: 0.26, min: 0.0, max: 0.9, label: 'Deformación', group: 'Forma' },
  frequency: { type: 'number', default: 1.35, min: 0.3, max: 4.0, label: 'Frecuencia', group: 'Forma' },
  twist: { type: 'number', default: 0.0, min: 0.0, max: 1.0, label: 'Torsión', group: 'Forma' },
  hue: { type: 'number', default: 0.53, min: 0.0, max: 1.0, label: 'Tono', group: 'Apariencia' },
  saturation: { type: 'number', default: 0.95, min: 0.0, max: 1.0, label: 'Saturación', group: 'Apariencia' },
  glow: { type: 'number', default: 0.95, min: 0.2, max: 4.0, label: 'Glow', group: 'Apariencia' },
  opacity: { type: 'number', default: 0.85, min: 0.05, max: 1.0, label: 'Opacidad', group: 'Apariencia' },
  bloom: { type: 'number', default: 0.85, min: 0.0, max: 3.0, label: 'Bloom', group: 'Apariencia' },
  exposure: { type: 'number', default: 0.95, min: 0.2, max: 3.0, label: 'Exposición', group: 'Apariencia' },
  audio: { type: 'number', default: 1.0, min: 0.0, max: 1.0, label: 'Audio', group: 'Comportamiento' },
  seed: { type: 'int', default: 3, min: 0, max: 2147483647, label: 'Seed', group: 'Comportamiento' }
};

const FALLBACK_AUDIO = Object.freeze({
  enabled: false, level: 0, rms: 0, bass: 0, mid: 0, high: 0, beat: 0, energy: 0
});

const DETAIL = {
  lite: { u: 170, v: 42 },
  high: { u: 260, v: 60 },
  ultra: { u: 360, v: 84 }
};

export class OrganicStructures extends Effect {
  static schema = ORGANIC_SCHEMA;

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
    this.program = new Program(this.gl, ORGANIC_VERT, ORGANIC_FRAG, 'organic:render');
    this.mesh = null;
    this.model = new Float32Array(16);
    this.viewProj = new Float32Array(16);
    this.eye = [0, 1.5, 7];
    this.lastAudio = FALLBACK_AUDIO;
    this.audioPhase = 0;
    this._buildMesh();
  }

  _buildMesh() {
    const detail = DETAIL[this.renderer.quality.name] || DETAIL.high;
    const geometry = createOrganicGeometry({
      segmentsU: detail.u,
      segmentsV: detail.v,
      tube: 0.26,
      scale: 0.95,
      twist: this.params.twist,
      seed: this.params.seed | 0
    });
    if (this.mesh) this.mesh.dispose();
    this.mesh = new Mesh(this.gl, geometry);
    this.vertexCount = this.mesh.vertexCount;
    this.triangleCount = this.mesh.indexCount / 3;
  }

  setParameters(patch) {
    const changed = super.setParameters(patch);
    if (this.mesh && (changed.includes('seed') || changed.includes('twist'))) {
      this._buildMesh();
    }
    return changed;
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
    const bass = audio.bass * a;
    const beat = audio.beat * a;
    const radius = 7.1 + Math.sin(t * 0.085) * 0.45 - bass * 1.0 - beat * 0.45 - audio.rms * a * 0.25;
    const angle = t * 0.09 * p.speed * (1 + bass * 1.1) + this.audioPhase + pointer.x * 0.2;
    this.eye = [
      Math.sin(angle) * radius,
      1.35 + Math.sin(t * 0.07) * 1.1 - pointer.y * 0.8,
      Math.cos(angle) * radius
    ];

    const view = lookAt(this.eye, [0, 0, 0], [0, 1, 0]);
    const proj = perspective((52 * Math.PI) / 180, this.renderer.width / Math.max(1, this.renderer.height), 0.1, 60);
    multiply(proj, view, this.viewProj);

    this.audioPhase = (this.audioPhase || 0) + dt * (audio.mid * a * 0.25 + beat * 0.7);
    const spin = t * 0.055 * p.speed * (1 + bass * 0.6) + this.audioPhase + (p.seed | 0) * 0.01;
    rotationY(spin, this.model);
  }

  render() {
    const gl = this.gl;
    const p = this.params;
    const audio = this.lastAudio || FALLBACK_AUDIO;
    const a = p.audio > 0 && audio.enabled ? p.audio : 0;

    this.sceneTarget.bind();
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    this.program.use()
      .set('uViewProj', this.viewProj)
      .set('uModel', this.model)
      .set('uTime', this.time)
      .set('uAmplitude', p.amplitude)
      .set('uFrequency', p.frequency)
      .set('uSeed', (p.seed | 0) % 997)
      .set('uHue', p.hue)
      .set('uSaturation', p.saturation)
      .set('uGlow', p.glow)
      .set('uOpacity', p.opacity)
      .set('uCamPos', this.eye)
      .set('uAudioBass', audio.bass * a)
      .set('uAudioMid', audio.mid * a)
      .set('uAudioHigh', audio.high * a)
      .set('uAudioRms', audio.rms * a)
      .set('uBeat', audio.beat * a)
      .set('uAudioAmount', a)
      .set('uScale', 1 + audio.bass * a * 0.10 + audio.beat * a * 0.06 + audio.rms * a * 0.04);

    this.mesh.draw();

    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  getPostParams() {
    const p = this.params;
    return {
      bloomStrength: p.bloom,
      bloomThreshold: 0.30,
      bloomKnee: 0.24,
      exposure: p.exposure,
      vignette: 0.5,
      grain: 0.022,
      aberration: 0.012,
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
    if (this.mesh) this.mesh.dispose();
    if (this.sceneTarget) this.sceneTarget.dispose();
    this.program = null;
    this.mesh = null;
    this.sceneTarget = null;
  }
}
