/**
 * Effect — contrato común para efectos del motor GPU.
 *
 * Un efecto declara un schema de parámetros serializable, recibe deltas de
 * tiempo y features de audio, y dibuja en su propio scene target. El engine se
 * encarga del post-proceso y del canvas; el efecto no conoce la UI.
 */

/**
 * @typedef {Object} ParamDescriptor
 * @property {'number'|'int'|'boolean'} type
 * @property {number|boolean} default
 * @property {number} [min]
 * @property {number} [max]
 * @property {string} [label]
 */

export class Effect {
  /** @type {Record<string, ParamDescriptor>} */
  static schema = {};

  /** @param {Record<string, number|boolean>} [params] */
  constructor(params = {}) {
    this.params = {};
    this.time = 0;
    this.elapsed = 0;
    this._resetParams();
    if (params) this.setParameters(params);
  }

  _resetParams() {
    for (const [name, desc] of Object.entries(this.constructor.schema)) {
      this.params[name] = desc.default;
    }
  }

  /**
   * Aplica un patch de parámetros, validando y clampeando según el schema.
   * @param {Record<string, number|boolean>} patch
   * @returns {string[]} nombres efectivamente modificados
   */
  setParameters(patch) {
    if (!patch) return [];
    const schema = this.constructor.schema;
    const changed = [];
    for (const [name, raw] of Object.entries(patch)) {
      const desc = schema[name];
      if (!desc) continue;
      let value;
      if (desc.type === 'boolean') {
        value = !!raw;
      } else {
        value = Number(raw);
        if (!Number.isFinite(value)) continue;
        if (desc.type === 'int') value = Math.round(value);
        if (typeof desc.min === 'number') value = Math.max(desc.min, value);
        if (typeof desc.max === 'number') value = Math.min(desc.max, value);
      }
      if (value !== this.params[name]) {
        this.params[name] = value;
        changed.push(name);
      }
    }
    return changed;
  }

  /** @returns {Record<string, number|boolean>} copia serializable */
  getParameters() {
    return { ...this.params };
  }

  /** @returns {Record<string, ParamDescriptor>} */
  getSchema() {
    return this.constructor.schema;
  }

  /**
   * Avanza el tiempo del efecto y su simulación.
   * @param {number} dt segundos
   * @param {object} audio features
   */
  update(dt, audio) { // eslint-disable-line no-unused-vars
    this.time += dt;
    this.elapsed += dt;
  }

  /** @param {import('../core/Renderer.js').Renderer} renderer */
  render(renderer) { // eslint-disable-line no-unused-vars
    throw new Error('Effect.render() must be implemented');
  }

  /** @param {number} width @param {number} height */
  onResize(width, height) { // eslint-disable-line no-unused-vars
    // no-op by default
  }

  initialize() {}

  dispose() {}
}
