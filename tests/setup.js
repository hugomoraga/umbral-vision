/**
 * Test setup — garantiza que `localStorage`/`sessionStorage` existan.
 *
 * Node 26 define un getter global para Web Storage que devuelve `undefined`
 * salvo que se pase `--localstorage-file`. Vitest solo copia los globals de
 * jsdom que no existen ya en el global, por lo que `localStorage` se queda en
 * `undefined`. Instalamos un Storage en memoria cuando falta (en navegadores
 * reales y en Node <= 24 se usa el de jsdom sin tocar nada).
 */

class MemoryStorage {
  #data = new Map();

  get length() {
    return this.#data.size;
  }

  key(index) {
    const keys = [...this.#data.keys()];
    return index >= 0 && index < keys.length ? keys[index] : null;
  }

  getItem(key) {
    const k = String(key);
    return this.#data.has(k) ? this.#data.get(k) : null;
  }

  setItem(key, value) {
    this.#data.set(String(key), String(value));
  }

  removeItem(key) {
    this.#data.delete(String(key));
  }

  clear() {
    this.#data.clear();
  }
}

function installStorage(name) {
  let current;
  try {
    current = globalThis[name];
  } catch {
    current = undefined;
  }

  if (current) return;

  Object.defineProperty(globalThis, name, {
    value: new MemoryStorage(),
    configurable: true,
    writable: true
  });
}

installStorage('localStorage');
installStorage('sessionStorage');
