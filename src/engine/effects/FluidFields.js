/**
 * FluidFields — tejido de partículas GPU.
 *
 * Familia: Fluid Fields.
 * Técnicas: curl noise (divergence-free), domain warping, spring-to-surface,
 * simulación ping-pong en GPU, sprite instanciado con motion stretch,
 * paleta procedural y composición HDR con bloom.
 *
 * La coherencia visual viene de tres decisiones:
 *  1. Las partículas nacen sobre una membrana paramétrica y vuelven a ella
 *     (spring), en vez de flotar libremente.
 *  2. El campo que las mueve es curl noise: no converge ni diverge.
 *  3. La vida es cíclica con fade in/out, así el tejido respira sin saltos.
 */

import { Effect } from './Effect.js';
import { Program } from '../core/Program.js';
import { RenderTarget, supportsRenderFormat } from '../core/RenderTarget.js';
import { createSpriteQuad, createFullscreenQuad } from '../core/Geometry.js';
import { UPDATE_FRAG, RENDER_VERT, RENDER_FRAG } from '../shaders/fluid.js';
import { perspective, lookAt, multiply } from '../math/mat4.js';
import { mulberry32 } from '../math/random.js';

const TAU = Math.PI * 2;

export const FLUID_FIELDS_SCHEMA = {
  density: { type: 'number', default: 0.9, min: 0.1, max: 1.0, label: 'Densidad', group: 'Forma' },
  speed: { type: 'number', default: 1.0, min: 0.1, max: 3.0, label: 'Velocidad', group: 'Movimiento' },
  amplitude: { type: 'number', default: 0.62, min: 0.0, max: 2.0, label: 'Amplitud', group: 'Movimiento' },
  complexity: { type: 'number', default: 0.62, min: 0.0, max: 1.0, label: 'Complejidad', group: 'Forma' },
  turbulence: { type: 'number', default: 0.55, min: 0.0, max: 1.5, label: 'Turbulencia', group: 'Movimiento' },
  hue: { type: 'number', default: 0.56, min: 0.0, max: 1.0, label: 'Tono', group: 'Apariencia' },
  saturation: { type: 'number', default: 0.9, min: 0.0, max: 1.0, label: 'Saturación', group: 'Apariencia' },
  glow: { type: 'number', default: 0.68, min: 0.2, max: 4.0, label: 'Glow', group: 'Apariencia' },
  particleSize: { type: 'number', default: 1.0, min: 0.4, max: 3.0, label: 'Tamaño', group: 'Forma' },
  bloom: { type: 'number', default: 0.85, min: 0.0, max: 3.0, label: 'Bloom', group: 'Apariencia' },
  exposure: { type: 'number', default: 0.98, min: 0.2, max: 3.0, label: 'Exposición', group: 'Apariencia' },
  audio: { type: 'number', default: 1.0, min: 0.0, max: 1.0, label: 'Audio', group: 'Comportamiento' },
  seed: { type: 'int', default: 1, min: 0, max: 2147483647, label: 'Seed', group: 'Comportamiento' }
};

const FALLBACK_AUDIO = Object.freeze({
  enabled: false, level: 0, rms: 0, bass: 0, mid: 0, high: 0, beat: 0, energy: 0
});

export class FluidFields extends Effect {
  static schema = FLUID_FIELDS_SCHEMA;

  /**
   * @param {object} renderer
   * @param {Record<string, number|boolean>} [params]
   */
  constructor(renderer, params = {}) {
    super(params);
    this.renderer = renderer;
    this.particleSize = renderer.quality.particleSize;
    this.particleCount = this.particleSize * this.particleSize;
    this.gl = renderer.gl;
    this.sceneFormat = supportsRenderFormat(this.gl, 'rgba16f') ? 'rgba16f' : 'rgba8';
    this.simFormat = supportsRenderFormat(this.gl, 'rgba32f')
      ? 'rgba32f'
      : (supportsRenderFormat(this.gl, 'rgba16f') ? 'rgba16f' : null);

    this.programs = [];
    this.state = null;
    this.homeTexture = null;
    this.sceneTarget = null;
    this.sprite = null;
    this.fullscreen = null;
    this.viewProj = new Float32Array(16);
    this.eye = [0, 0, 4.8];
    this.lightPos = [2.2, 1.8, 2.4];
    this.lastAudio = null;
    this.audioPhase = 0;

    if (!this.simFormat) {
      throw new Error('WebGL 2 sin soporte de render a texturas float (se requiere EXT_color_buffer_float)');
    }

    this._initialize();
  }

  _initialize() {
    const gl = this.gl;

    this.updateProgram = new Program(gl, `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`, UPDATE_FRAG, 'fluid:update');

    this.renderProgram = new Program(gl, RENDER_VERT, RENDER_FRAG, 'fluid:render');
    this.programs.push(this.updateProgram, this.renderProgram);

    this.sprite = createSpriteQuad(gl);
    this.fullscreen = createFullscreenQuad(gl);
    this.sceneTarget = new RenderTarget(gl, {
      width: this.renderer.width,
      height: this.renderer.height,
      format: this.sceneFormat,
      filter: 'linear'
    });

    this._createHomeAndState();
  }

  _createHomeAndState() {
    const gl = this.gl;
    const size = this.particleSize;
    const count = size * size;
    const home = new Float32Array(count * 4);
    const vel = new Float32Array(count * 4);
    const pos = new Float32Array(count * 4);
    const rng = mulberry32(this.params.seed | 0 || 1);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const u = ((x + 0.5 + y * 0.61803398875) % size) / size;
        const v = ((y + 0.5) / size) * 2 - 1;
        const theta = u * TAU;

        const seed = rng();
        const seed2 = rng();
        const seed3 = rng();

        // Membrana paramétrica: cilindro abierto con pliegues orgánicos.
        const fold = Math.sin(theta * 3.0 + v * 2.2) * 0.20
                   + Math.sin(theta * 5.0 - v * 1.7) * 0.07;
        const radius = 1.28 + 0.30 * Math.cos(v * Math.PI * 0.92) + fold;
        const yPos = v * 1.95 + 0.20 * Math.sin(theta * 2.0 + v * 3.4);

        const hx = Math.cos(theta) * radius + 0.10 * Math.sin(theta * 4.0 + v * 3.0);
        const hz = Math.sin(theta) * radius;
        const hy = yPos;

        home[i] = hx;
        home[i + 1] = hy;
        home[i + 2] = hz;
        home[i + 3] = (u + v * 0.08 + 1.0) % 1.0;

        const jitter = 0.035;
        pos[i] = hx + (rng() - 0.5) * jitter;
        pos[i + 1] = hy + (rng() - 0.5) * jitter;
        pos[i + 2] = hz + (rng() - 0.5) * jitter;
        pos[i + 3] = rng() * 0.7;

        vel[i] = (seed - 0.5) * 0.08;
        vel[i + 1] = (seed2 - 0.5) * 0.08;
        vel[i + 2] = (seed3 - 0.5) * 0.08;
        vel[i + 3] = seed;
      }
    }

    this.homeTexture = this._createTexture(size, home);
    const posA = this._createTexture(size, pos);
    const velA = this._createTexture(size, vel);
    const posB = this._createTexture(size, null);
    const velB = this._createTexture(size, null);

    const fbo = gl.createFramebuffer();
    this.state = { fbo, posA, velA, posB, velB, read: 'a' };

    // Un único FBO con dos color attachments (MRT): posición + velocidad.
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  _createTexture(size, data) {
    const gl = this.gl;
    const tex = gl.createTexture();
    const type = gl.FLOAT;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D, 0,
      this.simFormat === 'rgba32f' ? gl.RGBA32F : gl.RGBA16F,
      size, size, 0, gl.RGBA, type, data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

  initialize() {
    // Recursos creados en el constructor (el engine valida soporte antes).
  }

  /**
   * Reproducibilidad: cambiar la seed reconstruye la membrana inicial.
   * @param {Record<string, number|boolean>} patch
   */
  setParameters(patch) {
    const changed = super.setParameters(patch);
    if (changed.includes('seed') && this.state) this._rebuildState();
    return changed;
  }

  _rebuildState() {
    this._destroyState();
    this._createHomeAndState();
  }

  _destroyState() {
    const gl = this.gl;
    if (this.state) {
      gl.deleteTexture(this.state.posA);
      gl.deleteTexture(this.state.posB);
      gl.deleteTexture(this.state.velA);
      gl.deleteTexture(this.state.velB);
      gl.deleteFramebuffer(this.state.fbo);
      this.state = null;
    }
    if (this.homeTexture) {
      gl.deleteTexture(this.homeTexture);
      this.homeTexture = null;
    }
  }

  /**
   * @param {number} dt
   * @param {object} audio
   */
  update(dt, audio = FALLBACK_AUDIO) {
    super.update(dt, audio);
    this.lastAudio = audio;
    const p = this.params;
    const a = p.audio > 0 && audio.enabled ? p.audio : 0;
    const bass = audio.bass * a;
    const mid = audio.mid * a;
    const beat = audio.beat * a;
    this.audioPhase += dt * (mid * 0.3 + beat * 0.9);

    this._stepSimulation(Math.min(0.033, Math.max(0.0, dt)), audio);

    // Cámara: órbita lenta + parallax sutil del puntero.
    const t = this.time;
    const pointer = this.renderer.pointer || { x: 0, y: 0 };
    const radius = 4.9 - bass * 0.65 - beat * 0.4 + Math.sin(t * 0.09) * 0.35;
    const angle = t * 0.11 + this.audioPhase + pointer.x * 0.22;
    this.eye = [
      Math.sin(angle) * radius,
      Math.sin(t * 0.07) * 1.15 + pointer.y * 0.9 + beat * 0.35,
      Math.cos(angle) * radius
    ];
    const view = lookAt(this.eye, [0, 0, 0], [0, 1, 0]);
    const proj = perspective((55 * Math.PI) / 180, this.renderer.width / Math.max(1, this.renderer.height), 0.1, 40);
    multiply(proj, view, this.viewProj);

    // Luz orbital: aporta volumen y un punto focal cambiante.
    this.lightPos = [
      Math.sin(t * 0.23) * 2.6,
      1.7 + Math.cos(t * 0.17) * 0.9,
      Math.cos(t * 0.23) * 2.8
    ];
  }

  _stepSimulation(dt, audio) {
    const gl = this.gl;
    const state = this.state;
    const p = this.params;
    const a = p.audio > 0 && audio.enabled ? p.audio : 0;
    const bass = audio.bass * a;
    const mid = audio.mid * a;
    const high = audio.high * a;
    const rms = audio.rms * a;
    const beat = audio.beat * a;

    const readPos = state.read === 'a' ? state.posA : state.posB;
    const readVel = state.read === 'a' ? state.velA : state.velB;
    const writePos = state.read === 'a' ? state.posB : state.posA;
    const writeVel = state.read === 'a' ? state.velB : state.velA;

    gl.bindFramebuffer(gl.FRAMEBUFFER, state.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, writePos, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, writeVel, 0);
    gl.viewport(0, 0, this.particleSize, this.particleSize);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

    this.updateProgram.use()
      .set('uPos', 0)
      .set('uVel', 1)
      .set('uHome', 2)
      .set('uTime', this.time)
      .set('uDt', dt)
      .set('uSpeed', p.speed)
      .set('uAmplitude', p.amplitude)
      .set('uComplexity', p.complexity)
      .set('uTurbulence', p.turbulence)
      .set('uAudioBass', bass)
      .set('uAudioMid', mid)
      .set('uAudioHigh', high)
      .set('uAudioRms', rms)
      .set('uBeat', beat)
      .set('uAudioAmount', a);

    this._bindTexture(readPos, 0);
    this._bindTexture(readVel, 1);
    this._bindTexture(this.homeTexture, 2);

    this.fullscreen.draw();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    state.read = state.read === 'a' ? 'b' : 'a';
  }

  _bindTexture(texture, unit) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }

  /** @param {object} renderer */
  render(renderer) {
    const gl = this.gl;
    const p = this.params;
    const state = this.state;
    const audio = this.lastAudio || FALLBACK_AUDIO;
    const a = p.audio > 0 && audio.enabled ? p.audio : 0;

    const pos = state.read === 'a' ? state.posA : state.posB;
    const vel = state.read === 'a' ? state.velA : state.velB;

    this.sceneTarget.bind();
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const instanced = Math.max(1, Math.floor(this.particleCount * p.density));
    const res = [this.sceneTarget.width, this.sceneTarget.height];

    this.renderProgram.use()
      .set('uPos', 0)
      .set('uVel', 1)
      .set('uHome', 2)
      .set('uViewProj', this.viewProj)
      .set('uResolution', res)
      .set('uTime', this.time)
      .set('uPointSize', p.particleSize * 1.95)
      .set('uOpacity', 0.62)
      .set('uGlow', p.glow)
      .set('uHue', p.hue)
      .set('uSaturation', p.saturation)
      .set('uStretch', renderer.quality.trailLength)
      .set('uLightPos', this.lightPos)
      .set('uLightPower', 1.35 + (audio.rms || 0) * a * 0.8)
      .set('uAudioHigh', audio.high * a)
      .set('uAudioRms', audio.rms * a)
      .set('uBeat', audio.beat * a)
      .set('uAudioAmount', a);

    this._bindTexture(pos, 0);
    this._bindTexture(vel, 1);
    this._bindTexture(this.homeTexture, 2);

    this.sprite.drawInstanced(instanced);

    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /** El engine llama a este método antes de render para mapear audio. */
  setAudioFeatures(audio) {
    this.lastAudio = audio;
  }

  getPostParams() {
    const p = this.params;
    return {
      bloomStrength: p.bloom,
      bloomThreshold: 0.30,
      bloomKnee: 0.26,
      exposure: p.exposure,
      vignette: 0.55,
      grain: 0.028,
      aberration: 0.014,
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
    for (const program of this.programs) program.dispose();
    this.programs = [];
    if (this.sprite) this.sprite.dispose();
    if (this.fullscreen) this.fullscreen.dispose();
    if (this.sceneTarget) this.sceneTarget.dispose();
    this._destroyState();
    this.sprite = null;
    this.fullscreen = null;
    this.sceneTarget = null;
  }
}
