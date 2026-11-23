/**
 * RenderTarget — offscreen framebuffer + color texture.
 *
 * Supports the formats the engine needs: rgba8, rgba16f (HDR scene/bloom)
 * and rgba32f (particle state). Availability is negotiated by the caller.
 */

const FORMAT_INFO = {
  rgba8: { internal: 'RGBA8', type: 'UNSIGNED_BYTE' },
  rgba16f: { internal: 'RGBA16F', type: 'HALF_FLOAT' },
  rgba32f: { internal: 'RGBA32F', type: 'FLOAT' }
};

/**
 * Test whether a color-renderable texture format is usable.
 * @param {WebGL2RenderingContext} gl
 * @param {'rgba8'|'rgba16f'|'rgba32f'} format
 */
export function supportsRenderFormat(gl, format) {
  const info = FORMAT_INFO[format];
  if (!info) return false;
  const internal = gl[info.internal];
  const type = gl[info.type];
  if (internal == null || type == null) return false;

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, 1, 1, 0, gl.RGBA, type, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(tex);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

export class RenderTarget {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {{width:number, height:number, format?:string, filter?:'nearest'|'linear', depth?:boolean}} options
   */
  constructor(gl, options) {
    this.gl = gl;
    this.format = options.format || 'rgba16f';
    this.filterMode = options.filter || 'linear';
    this.needsDepth = !!options.depth;
    this.width = 0;
    this.height = 0;
    this.texture = null;
    this.fbo = null;
    this.depthBuffer = null;
    this.disposed = false;
    this.resize(Math.max(1, options.width | 0), Math.max(1, options.height | 0));
  }

  resize(width, height) {
    if (this.disposed) return;
    width = Math.max(1, width | 0);
    height = Math.max(1, height | 0);
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;

    const gl = this.gl;
    if (!this.texture) this.texture = gl.createTexture();
    if (!this.fbo) this.fbo = gl.createFramebuffer();

    const info = FORMAT_INFO[this.format];
    const internal = gl[info.internal];
    const type = gl[info.type];
    // Las texturas float solo son filtrables con la extensión correspondiente.
    // Si no está, NEAREST es preferible a un muestreo negro/incompleto.
    const floatFormat = this.format === 'rgba16f' || this.format === 'rgba32f';
    const linearSupported = !floatFormat || !!(
      gl.getExtension('OES_texture_float_linear') ||
      gl.getExtension('OES_texture_half_float_linear')
    );
    const filter = (this.filterMode === 'nearest' || !linearSupported) ? gl.NEAREST : gl.LINEAR;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, gl.RGBA, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    if (this.needsDepth) {
      if (!this.depthBuffer) this.depthBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  bind() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.width, this.height);
    return this;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    const gl = this.gl;
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.fbo) gl.deleteFramebuffer(this.fbo);
    if (this.depthBuffer) gl.deleteRenderbuffer(this.depthBuffer);
    this.texture = null;
    this.fbo = null;
    this.depthBuffer = null;
  }
}
