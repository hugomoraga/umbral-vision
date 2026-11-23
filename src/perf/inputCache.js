/**
 * inputCache — cachea valores del DOM una vez por efecto.
 *
 * FR-011: inputs DOM se cachean en setup del efecto, no se releen cada frame.
 *
 * Uso en una factory de efecto:
 *   const config = inputCache.readMany({
 *     ellipseCount: { default: 100, parser: parseInt },
 *     ellipseSpacing: { default: 10 }
 *   });
 *   // ... draw usa config.ellipseCount, no getElementById('ellipseCount')
 */

export function readOne(id, defaultValue, parser) {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
  if (!el) return defaultValue;
  const raw = el.value;
  if (parser) {
    const v = parser(raw);
    return Number.isFinite(v) ? v : defaultValue;
  }
  return raw;
}

export function readMany(map) {
  const out = {};
  for (const key in map) {
    const spec = map[key];
    out[key] = readOne(spec.id || key, spec.default, spec.parser);
  }
  return out;
}
