/**
 * Mesh — indexed triangle mesh with position/normal/uv attributes.
 * WebGL 2 supports Uint32 indices natively.
 */

export class Mesh {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {{positions:Float32Array, normals:Float32Array, uvs:Float32Array, indices:Uint32Array}} data
   */
  constructor(gl, data) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
    this.buffers = [];
    this.vertexCount = data.positions.length / 3;
    this.indexCount = data.indices.length;

    gl.bindVertexArray(this.vao);

    this.positionBuffer = this._buffer(gl.ARRAY_BUFFER, data.positions, 3);
    this.normalBuffer = this._buffer(gl.ARRAY_BUFFER, data.normals, 3, 1);
    this.uvBuffer = this._buffer(gl.ARRAY_BUFFER, data.uvs, 2, 2);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
    this.buffers.push(this.indexBuffer);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  _buffer(target, array, size, location = 0) {
    const gl = this.gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, array, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    this.buffers.push(buffer);
    return buffer;
  }

  draw() {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    for (const buffer of this.buffers) gl.deleteBuffer(buffer);
    this.buffers = [];
    gl.deleteVertexArray(this.vao);
    this.vao = null;
  }
}
