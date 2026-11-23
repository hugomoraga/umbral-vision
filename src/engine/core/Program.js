/**
 * Program — WebGL program wrapper with cached uniform locations and
 * type-aware setters. Keeps shader compilation errors readable.
 */

function compileShader(gl, type, source, label) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`[${label}] shader compile error:\n${log}\n${source}`);
  }
  return shader;
}

export class Program {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} vertexSource
   * @param {string} fragmentSource
   * @param {string} [name]
   */
  constructor(gl, vertexSource, fragmentSource, name = 'program') {
    this.gl = gl;
    this.name = name;
    this.disposed = false;

    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource, `${name}:vs`);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, `${name}:fs`);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      throw new Error(`[${name}] program link error:\n${log}`);
    }

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    this.program = program;
    this.uniforms = new Map();
    this._introspect();
  }

  _introspect() {
    const gl = this.gl;
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(this.program, i);
      if (!info) continue;
      const key = info.name.replace(/\[0\]$/, '');
      this.uniforms.set(key, {
        location: gl.getUniformLocation(this.program, info.name),
        type: info.type,
        size: info.size
      });
    }
  }

  use() {
    this.gl.useProgram(this.program);
    return this;
  }

  has(name) {
    return this.uniforms.has(name);
  }

  location(name) {
    const entry = this.uniforms.get(name);
    return entry ? entry.location : null;
  }

  /**
   * Set a uniform by name. Scalars, vectors, matrices, ints and samplers
   * are dispatched by the introspected GL type.
   */
  set(name, value) {
    const entry = this.uniforms.get(name);
    if (!entry || entry.location === null) return this;
    const gl = this.gl;
    switch (entry.type) {
      case gl.FLOAT: gl.uniform1f(entry.location, value); break;
      case gl.FLOAT_VEC2: gl.uniform2fv(entry.location, value); break;
      case gl.FLOAT_VEC3: gl.uniform3fv(entry.location, value); break;
      case gl.FLOAT_VEC4: gl.uniform4fv(entry.location, value); break;
      case gl.INT:
      case gl.BOOL:
      case gl.SAMPLER_2D:
      case gl.SAMPLER_CUBE:
        gl.uniform1i(entry.location, value); break;
      case gl.INT_VEC2: gl.uniform2iv(entry.location, value); break;
      case gl.INT_VEC3: gl.uniform3iv(entry.location, value); break;
      case gl.INT_VEC4: gl.uniform4iv(entry.location, value); break;
      case gl.FLOAT_MAT3: gl.uniformMatrix3fv(entry.location, false, value); break;
      case gl.FLOAT_MAT4: gl.uniformMatrix4fv(entry.location, false, value); break;
      default:
        // Unknown uniform type: ignore rather than throw in the render loop.
        break;
    }
    return this;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.uniforms.clear();
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }
}
