/**
 * Almacenamiento de thumbnails del historial.
 *
 * Usa IndexedDB cuando está disponible y cae a memoria si no. Los genomas
 * viven en localStorage (son pequeños); las imágenes nunca van ahí porque
 * llenan la cuota rápidamente.
 */

const DB_NAME = 'umbral-vision';
const DB_VERSION = 1;
const STORE = 'thumbnails';

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
  });
}

function transactionDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'));
  });
}

function estimateSize(value) {
  if (value == null) return 0;
  if (typeof value === 'string') return value.length * 2;
  if (value.size != null) return Number(value.size) || 0;
  if (value.byteLength != null) return Number(value.byteLength) || 0;
  return 0;
}

/**
 * @param {{indexedDB?:IDBFactory|null, maxBytes?:number, maxEntries?:number}} [options]
 */
export function createThumbnailStore(options = {}) {
  const idb = options.indexedDB !== undefined ? options.indexedDB : (globalThis.indexedDB || null);
  const maxBytes = Math.max(0, Number(options.maxBytes ?? 20 * 1024 * 1024));
  const maxEntries = Math.max(1, Number(options.maxEntries ?? 120));
  const memory = new Map();
  let db = null;
  let opened = false;
  let available = !!idb;

  async function open() {
    if (opened) return db;
    opened = true;
    if (!idb) return null;
    try {
      db = await new Promise((resolve, reject) => {
        const request = idb.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(STORE)) {
            const store = database.createObjectStore(STORE, { keyPath: 'key' });
            store.createIndex('at', 'at');
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
      });
      return db;
    } catch {
      available = false;
      db = null;
      return null;
    }
  }

  async function readAll() {
    if (!available) return [...memory.values()];
    const database = await open();
    if (!database) return [...memory.values()];
    try {
      const tx = database.transaction(STORE, 'readonly');
      const store = tx.objectStore(STORE);
      const rows = await requestToPromise(store.getAll());
      await transactionDone(tx);
      return Array.isArray(rows) ? rows : [];
    } catch {
      available = false;
      return [...memory.values()];
    }
  }

  async function prune() {
    const rows = await readAll();
    rows.sort((a, b) => Number(b.at || 0) - Number(a.at || 0));
    let total = rows.reduce((sum, row) => sum + Number(row.size || 0), 0);
    const keep = [];
    for (const row of rows) {
      if (keep.length >= maxEntries || (total > maxBytes && keep.length > 0)) {
        total -= Number(row.size || 0);
        await remove(row.key);
      } else if (total > maxBytes && keep.length === 0) {
        // Nunca conservar una entrada que sola excede el presupuesto.
        await remove(row.key);
      } else {
        keep.push(row);
      }
    }
    return keep.length;
  }

  async function put(key, data, extra = {}) {
    if (!key) return false;
    const size = estimateSize(data);
    if (size > maxBytes) return false;
    const row = {
      key: String(key),
      data,
      size,
      at: Date.now(),
      sceneId: extra.sceneId || null
    };
    if (!available) {
      memory.set(row.key, row);
      trimMemory();
      return true;
    }
    try {
      const database = await open();
      if (!database) {
        memory.set(row.key, row);
        trimMemory();
        return true;
      }
      const tx = database.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(row);
      await transactionDone(tx);
      await prune();
      return true;
    } catch {
      available = false;
      memory.set(row.key, row);
      trimMemory();
      return true;
    }
  }

  async function get(key) {
    if (!key) return null;
    if (!available) return memory.get(String(key))?.data ?? null;
    try {
      const database = await open();
      if (!database) return memory.get(String(key))?.data ?? null;
      const tx = database.transaction(STORE, 'readonly');
      const row = await requestToPromise(tx.objectStore(STORE).get(String(key)));
      await transactionDone(tx);
      return row?.data ?? null;
    } catch {
      available = false;
      return memory.get(String(key))?.data ?? null;
    }
  }

  async function remove(key) {
    if (!key) return false;
    memory.delete(String(key));
    if (!available) return true;
    try {
      const database = await open();
      if (!database) return true;
      const tx = database.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(String(key));
      await transactionDone(tx);
      return true;
    } catch {
      return true;
    }
  }

  function trimMemory() {
    const rows = [...memory.values()].sort((a, b) => a.at - b.at);
    let total = rows.reduce((sum, row) => sum + row.size, 0);
    while (rows.length > maxEntries || (total > maxBytes && rows.length > 0)) {
      const row = rows.shift();
      total -= row.size;
      memory.delete(row.key);
    }
  }

  async function clear() {
    memory.clear();
    if (!available) return;
    try {
      const database = await open();
      if (!database) return;
      const tx = database.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      await transactionDone(tx);
    } catch { /* noop */ }
  }

  async function stats() {
    const rows = await readAll();
    return {
      available,
      entries: rows.length,
      bytes: rows.reduce((sum, row) => sum + Number(row.size || 0), 0),
      maxBytes,
      maxEntries
    };
  }

  return { put, get, delete: remove, clear, prune, stats, open, get available() { return available; } };
}
