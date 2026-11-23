/**
 * Renderer — canvas + contexto WebGL 2 + resolución adaptativa + métricas.
 *
 * No conoce efectos ni post-proceso: solo gestiona el contexto, el tamaño de
 * dibujo y el presupuesto de frame.
 */

import { getQualityProfile, createAdaptiveResolution } from './Quality.js';

function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export class Renderer {
  /**
   * @param {{container?:HTMLElement|null, canvas?:HTMLCanvasElement|null, quality?:string, onScaleChange?:(w:number,h:number)=>void}} options
   */
  constructor(options = {}) {
    this.container = options.container || null;
    this.quality = getQualityProfile(options.quality || 'high');
    this.adaptive = createAdaptiveResolution(this.quality);
    this.onScaleChange = options.onScaleChange || null;
    this.pointer = { x: 0, y: 0 };
    this.frameMs = 0;
    this.fps = 0;
    this.cpuMs = 0;
    this.contextLost = false;
    this.disposed = false;

    this.canvas = options.canvas || document.createElement('canvas');
    this.canvas.className = 'uv-engine-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
    this.canvas.setAttribute('aria-hidden', 'true');

    if (this.container && this.canvas.parentNode !== this.container) {
      this.container.appendChild(this.canvas);
    }

    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      desynchronized: true
    });

    if (!gl) {
      throw new Error('WebGL 2 no está disponible en este navegador');
    }
    this.gl = gl;

    // Extensiones necesarias para HDR / simulación en float.
    this.extFloat = gl.getExtension('EXT_color_buffer_float');
    this.extHalfFloat = gl.getExtension('EXT_color_buffer_half_float');
    this.extFloatLinear = gl.getExtension('OES_texture_float_linear');
    gl.getExtension('OES_texture_half_float_linear');

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 1);

    this._onResize = () => this.resize();
    this._onPointer = (event) => {
      this.pointer.x = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      this.pointer.y = -((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    };

    window.addEventListener('resize', this._onResize);
    window.addEventListener('pointermove', this._onPointer, { passive: true });

    this._lastFrameTime = 0;
    this.resize();
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get output() {
    return { width: this.canvas.width, height: this.canvas.height };
  }

  get aspect() {
    return this.canvas.width / Math.max(1, this.canvas.height);
  }

  _cssSize() {
    if (this.container) {
      const rect = this.container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return { width: rect.width, height: rect.height };
      if (this.container.clientWidth > 0 && this.container.clientHeight > 0) {
        return { width: this.container.clientWidth, height: this.container.clientHeight };
      }
    }
    return {
      width: window.innerWidth || 1,
      height: window.innerHeight || 1
    };
  }

  /** @returns {boolean} true si cambió el tamaño de dibujo */
  resize() {
    if (this.disposed) return false;
    const { width: cssW, height: cssH } = this._cssSize();
    const dpr = Math.min(window.devicePixelRatio || 1, this.quality.maxDpr);
    const scale = dpr * this.adaptive.scale;
    const width = Math.max(2, Math.round(cssW * scale));
    const height = Math.max(2, Math.round(cssH * scale));
    this.cssWidth = cssW;
    this.cssHeight = cssH;
    if (width === this.canvas.width && height === this.canvas.height) return false;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    if (this.onScaleChange) this.onScaleChange(width, height);
    return true;
  }

  setQuality(name) {
    const next = getQualityProfile(name);
    if (next.name === this.quality.name) return false;
    this.quality = next;
    this.adaptive = createAdaptiveResolution(next);
    this.resize();
    return true;
  }

  /**
   * Registra el tiempo del frame y ajusta la resolución si hace falta.
   * @param {number} frameMs
   * @returns {boolean} true si cambió la escala (hay que redimensionar targets)
   */
  sampleFrame(frameMs) {
    if (!Number.isFinite(frameMs) || frameMs <= 0) return false;
    this.frameMs = this.frameMs === 0 ? frameMs : this.frameMs * 0.9 + frameMs * 0.1;
    this.fps = 1000 / Math.max(1, this.frameMs);
    if (this.adaptive.sample(frameMs)) {
      return this.resize();
    }
    return false;
  }

  beginFrame() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  getStats() {
    return {
      fps: Math.round(this.fps * 10) / 10,
      frameMs: Math.round(this.frameMs * 100) / 100,
      cpuMs: Math.round(this.cpuMs * 100) / 100,
      width: this.canvas.width,
      height: this.canvas.height,
      cssWidth: this.cssWidth,
      cssHeight: this.cssHeight,
      scale: Math.round(this.adaptive.scale * 100) / 100,
      quality: this.quality.name
    };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onPointer);
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    const lose = this.gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    this.gl = null;
  }
}

export function createRenderer(options) {
  return new Renderer(options);
}

export { now as rendererNow };
