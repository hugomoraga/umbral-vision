/**
 * TemporalVeil — estelas y transformaciones progresivas.
 *
 * Familia: Temporal Systems.
 * Mantiene dos render targets HDR y compone cada frame a partir del anterior
 * (zoom, rotación, distorsión) más emisores procedurales.
 */

import { Effect } from './Effect.js';
import { Program } from '../core/Program.js';
import { RenderTarget, supportsRenderFormat } from '../core/RenderTarget.js';
import { createFullscreenQuad } from '../core/Geometry.js';
import { TEMPORAL_VERT, TEMPORAL_FRAG } from '../shaders/temporal.js';

export const TEMPORAL_SCHEMA = {
  speed: { type: 'number', default: 1.0, min: 0.1, max: 3.0, label: 'Velocidad' },
  decay: { type: 'number', default: 0.93, min: 0.7, max: 0.998, label: 'Persistencia' },
  zoom: { type: 'number', default: 0.55, min: 0.0, max: 1.0, label: 'Zoom' },
  rotation: { type: 'number', default: 0.45, min: -1.0, max: 1.0, label: 'Rotación' },
  warp: { type: 'number', default: 0.55, min: 0.0, max: 1.5, label: 'Distorsión' },
  density: { type: 'number', default: 0.30, min: 0.05, max: 1.5, label: 'Densidad' },
  hue: { type: 'number', default: 0.62, min: 0.0, max: 1.0, label: 'Tono' },
  saturation: { type: 'number', default: 0.9, min: 0.0, max: 1.0, label: 'Saturación' },
  glow: { type: 'number', default: 0.85, min: 0.2, max: 4.0, label: 'Glow' },
  bloom: { type: 'number', default: 0.7, min: 0.0, max: 3.0, label: 'Bloom' },
  exposure: { type: 'number', default: 0.95, min: 0.2, max: 3.0, label: 'Exposición' },
  audio: { type: 'number', default: 1.0, min: 0.0, max: 1.0, label: 'Audio' },
  seed: { type: 'int', default: 9, min: 0, max: 2147483647, label: 'Seed' }
};

const FALLBACK_AUDIO = Object.freeze({
  enabled: false, level: 0, rms: 0, bass: 0, mid: 0, high: 0, beat: 0, energy: 0
});

export class TemporalVeil extends Effect {
  static schema = TEMPORAL_SCHEMA;

  constructor(renderer, params = {}) {
    super(params);
    this.renderer = renderer;
    this.gl = renderer.gl;
    const format = supportsRenderFormat(this.gl, 'rgba16f') ? 'rgba16f' : 'rgba8';
    this.format = format;
    this.targets = [
      new RenderTarget(this.gl, { width: renderer.width, height: renderer.height, format }),
      new RenderTarget(this.gl, { width: renderer.width, height: renderer.height, format })
    ];
    this.index = 0;
    this.quad = createFullscreenQuad(this.gl);
    this.program = new Program(this.gl, TEMPORAL_VERT, TEMPORAL_FRAG, 'temporal:feedback');
    this.lastAudio = FALLBACK_AUDIO;
    this._clearTargets();
  }

  _clearTargets() {
    const gl = this.gl;
    for (const target of this.targets) {
      target.bind();
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  setAudioFeatures(audio) {
    this.lastAudio = audio || FALLBACK_AUDIO;
  }

  update(dt, audio = FALLBACK_AUDIO) {
    super.update(dt, audio);
    this.lastAudio = audio;
    this.dt = dt;
  }

  render() {
    const gl = this.gl;
    const p = this.params;
    const audio = this.lastAudio || FALLBACK_AUDIO;
    const a = p.audio > 0 && audio.enabled ? p.audio : 0;

    const read = this.targets[this.index];
    const write = this.targets[1 - this.index];

    write.bind();
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    this.program.use()
      .set('uPrev', 0)
      .set('uResolution', [write.width, write.height])
      .set('uTime', this.time)
      .set('uDt', Math.min(0.05, this.dt || 1 / 60))
      .set('uDecay', p.decay)
      .set('uZoom', p.zoom * p.speed)
      .set('uRotation', p.rotation * p.speed)
      .set('uWarp', p.warp)
      .set('uDensity', p.density)
      .set('uHue', p.hue)
      .set('uSaturation', p.saturation)
      .set('uGlow', p.glow)
      .set('uSeed', (p.seed | 0) % 1000)
      .set('uAudioBass', audio.bass * a)
      .set('uAudioMid', audio.mid * a)
      .set('uAudioHigh', audio.high * a)
      .set('uAudioRms', audio.rms * a)
      .set('uBeat', audio.beat * a)
      .set('uAudioAmount', a);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, read.texture);
    this.quad.draw();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.index = 1 - this.index;
  }

  getSceneTarget() {
    return this.targets[this.index];
  }

  getPostParams() {
    const p = this.params;
    return {
      bloomStrength: p.bloom,
      bloomThreshold: 0.34,
      bloomKnee: 0.24,
      exposure: p.exposure,
      vignette: 0.62,
      grain: 0.018,
      aberration: 0.008,
      time: this.time
    };
  }

  onResize(width, height) {
    for (const target of this.targets) target.resize(width, height);
    this._clearTargets();
  }

  dispose() {
    if (this.program) this.program.dispose();
    if (this.quad) this.quad.dispose();
    for (const target of this.targets) target.dispose();
    this.program = null;
    this.quad = null;
    this.targets = [];
  }
}
