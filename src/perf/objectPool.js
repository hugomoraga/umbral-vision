/**
 * objectPool — pool genérico reutilizable.
 *
 * FR-010: usar para partículas, boids, etc. Evita GC pressure.
 * ponytail: tipo genérico <T>, factory + reset provistos por caller.
 */

export class ObjectPool {
  constructor(factory, reset, initialSize = 50) {
    this.factory = factory;
    this.reset = reset;
    this.pool = [];
    for (let i = 0; i < initialSize; i++) this.pool.push(factory());
  }

  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.factory();
  }

  release(obj) {
    this.reset(obj);
    this.pool.push(obj);
  }

  size() { return this.pool.length; }
}
