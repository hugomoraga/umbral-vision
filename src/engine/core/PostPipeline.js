/**
 * PostPipeline — HDR scene → bright pass → multi-mip bloom → composite.
 *
 * Owns its programs and render targets. Shared by all GPU effects; effects
 * only provide the scene target and the artistic parameters.
 */

import { Program } from './Program.js';
import { RenderTarget } from './RenderTarget.js';
import { transitionMode } from '../../scene/transitionDirector.js';
import { FULLSCREEN_VERT, BRIGHT_FRAG, BLUR_FRAG, COMPOSITE_FRAG, COPY_FRAG, MIX_FRAG, FEEDBACK_FRAG } from '../shaders/post.js';

const WEIGHTS_BY_MIPS = {
  1: [1.0, 0.0, 0.0],
  2: [0.62, 0.38, 0.0],
  3: [0.50, 0.30, 0.20]
};

export class PostPipeline {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {ReturnType<import('./Geometry.js').createFullscreenQuad>} quad
   * @param {{mips?:number, hdr?:boolean}} options
   */
  constructor(gl, quad, options = {}) {
    this.gl = gl;
    this.quad = quad;
    this.mips = Math.max(1, Math.min(3, options.mips || 2));
    this.format = options.hdr ? 'rgba16f' : 'rgba8';
    this.bloomQuality = options.bloomQuality || 9;

    this.bright = new Program(gl, FULLSCREEN_VERT, BRIGHT_FRAG, 'post:bright');
    this.blur = new Program(gl, FULLSCREEN_VERT, BLUR_FRAG, 'post:blur');
    this.copy = new Program(gl, FULLSCREEN_VERT, COPY_FRAG, 'post:copy');
    this.mix = new Program(gl, FULLSCREEN_VERT, MIX_FRAG, 'post:mix');
    this.feedback = new Program(gl, FULLSCREEN_VERT, FEEDBACK_FRAG, 'post:feedback');
    this.composite = new Program(gl, FULLSCREEN_VERT, COMPOSITE_FRAG, 'post:composite');

    this.levels = [];
    this.mixTarget = null;
    this.feedbackTargets = [];
    this.feedbackIndex = 0;
    this.width = 0;
    this.height = 0;
    this.disposed = false;
  }

  resize(width, height) {
    width = Math.max(1, width | 0);
    height = Math.max(1, height | 0);
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;

    // Rebuild the mip chain; cheap enough on resize.
    for (const level of this.levels) {
      level.a.dispose();
      level.b.dispose();
    }
    this.levels = [];
    if (this.mixTarget) this.mixTarget.dispose();
    this.mixTarget = new RenderTarget(this.gl, { width, height, format: this.format });
    for (const target of this.feedbackTargets) target.dispose();
    // El feedback corre a media resolución: el bloom posterior lo suaviza y
    // el costo por píxel de cada pase se reduce ~4×.
    const fbWidth = Math.max(1, width >> 1);
    const fbHeight = Math.max(1, height >> 1);
    this.feedbackTargets = [
      new RenderTarget(this.gl, { width: fbWidth, height: fbHeight, format: this.format }),
      new RenderTarget(this.gl, { width: fbWidth, height: fbHeight, format: this.format })
    ];
    this.feedbackIndex = 0;
    const gl = this.gl;
    for (const target of this.feedbackTargets) {
      target.bind();
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    let w = Math.max(1, width >> 1);
    let h = Math.max(1, height >> 1);
    for (let i = 0; i < this.mips; i++) {
      this.levels.push({
        a: new RenderTarget(this.gl, { width: w, height: h, format: this.format }),
        b: new RenderTarget(this.gl, { width: w, height: h, format: this.format }),
        width: w,
        height: h
      });
      w = Math.max(1, w >> 1);
      h = Math.max(1, h >> 1);
    }
  }

  /**
   * @param {RenderTarget} scene
   * @param {{width:number,height:number}} output viewport del canvas
   * @param {object} params
   * @param {RenderTarget|null} [sceneB] segunda escena para cross-fade
   * @param {number} [mix] 0 = scene, 1 = sceneB
   */
  render(scene, output, params = {}, sceneB = null, mix = 1) {
    const gl = this.gl;
    if (this.levels.length === 0) return;

    // Cross-fade: mezcla ambas escenas antes del bloom/tonemap.
    if (sceneB && this.mixTarget) {
      this.mixTarget.bind();
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.mix.use()
        .set('uSceneA', 0)
        .set('uSceneB', 1)
        .set('uMix', Math.max(0, Math.min(1, mix)))
        .set('uMode', transitionMode(params.transitionType || 'dissolve'))
        .set('uDirection', params.transitionDirection || [1, 0])
        .set('uSeed', Number(params.transitionSeed) || 0);
      this._bindTexture(scene.texture, 0);
      this._bindTexture(sceneB.texture, 1);
      this.quad.draw();
      scene = this.mixTarget;
    }

    // Feedback global: la memoria visual sobrevive al cambio de escena.
    const feedbackAmount = Math.max(0, Math.min(1, Number(params.feedback ?? 0)));
    if (feedbackAmount > 0 && this.feedbackTargets.length === 2) {
      const previous = this.feedbackTargets[this.feedbackIndex];
      const write = this.feedbackTargets[1 - this.feedbackIndex];
      write.bind();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.feedback.use()
        .set('uScene', 0)
        .set('uPrev', 1)
        .set('uResolution', [write.width, write.height])
        .set('uTime', params.time ?? 0)
        .set('uFeedback', feedbackAmount)
        .set('uDecay', Math.max(0.5, Math.min(0.999, Number(params.feedbackDecay ?? 0.92))))
        .set('uZoom', Number(params.feedbackZoom ?? 0.5))
        .set('uRotation', Number(params.feedbackRotation ?? 0.3))
        .set('uWarp', Number(params.feedbackWarp ?? 0.5));
      this._bindTexture(scene.texture, 0);
      this._bindTexture(previous.texture, 1);
      this.quad.draw();
      scene = write;
      this.feedbackIndex = 1 - this.feedbackIndex;
    }

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);

    // Bright pass at mip 0 (half res).
    const first = this.levels[0];
    first.a.bind();
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.bright.use()
      .set('uScene', 0)
      .set('uThreshold', params.bloomThreshold ?? 0.55)
      .set('uKnee', params.bloomKnee ?? 0.25)
      .set('uIntensity', 1.0);
    this._bindTexture(scene.texture, 0);
    this.quad.draw();

    // Blur each level, downsampling from the previous one.
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if (i > 0) {
        const prev = this.levels[i - 1];
        level.a.bind();
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.copy.use().set('uSource', 0);
        this._bindTexture(prev.a.texture, 0);
        this.quad.draw();
      }

      const texelX = 1 / level.width;
      const texelY = 1 / level.height;

      level.b.bind();
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.blur.use()
        .set('uSource', 0)
        .set('uDirection', [texelX * 1.4, 0])
        .set('uQuality', this.bloomQuality);
      this._bindTexture(level.a.texture, 0);
      this.quad.draw();

      level.a.bind();
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.blur.use()
        .set('uSource', 0)
        .set('uDirection', [0, texelY * 1.4])
        .set('uQuality', this.bloomQuality);
      this._bindTexture(level.b.texture, 0);
      this.quad.draw();
    }

    // Composite to the canvas.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, output.width, output.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const weights = WEIGHTS_BY_MIPS[this.levels.length] || WEIGHTS_BY_MIPS[1];
    const b0 = this.levels[0]?.a;
    const b1 = this.levels[1]?.a || b0;
    const b2 = this.levels[2]?.a || b1;

    this.composite.use()
      .set('uScene', 0)
      .set('uBloom0', 1)
      .set('uBloom1', 2)
      .set('uBloom2', 3)
      .set('uBloomWeights', weights)
      .set('uBloomStrength', params.bloomStrength ?? 0.9)
      .set('uExposure', params.exposure ?? 1.0)
      .set('uVignette', params.vignette ?? 0.55)
      .set('uGrain', params.grain ?? 0.035)
      .set('uAberration', params.aberration ?? 0.012)
      .set('uTime', params.time ?? 0)
      .set('uResolution', [output.width, output.height]);

    this._bindTexture(scene.texture, 0);
    this._bindTexture(b0?.texture ?? null, 1);
    this._bindTexture(b1?.texture ?? null, 2);
    this._bindTexture(b2?.texture ?? null, 3);
    this.quad.draw();
  }

  _bindTexture(texture, unit) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const level of this.levels) {
      level.a.dispose();
      level.b.dispose();
    }
    this.levels = [];
    if (this.mixTarget) this.mixTarget.dispose();
    this.mixTarget = null;
    for (const target of this.feedbackTargets) target.dispose();
    this.feedbackTargets = [];
    this.bright.dispose();
    this.blur.dispose();
    this.copy.dispose();
    this.mix.dispose();
    this.feedback.dispose();
    this.composite.dispose();
  }
}
