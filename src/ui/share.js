/**
 * Share — capture PNG frame + build share URL with state.
 *
 * Share URL format: ?effect=tunnel&interval=10&audio=0
 * Parse al cargar el generador y restaura el estado.
 */

export function captureFrame() {
  const canvas = document.querySelector('#generator canvas');
  if (!canvas) return null;
  if (typeof canvas.toBlob !== 'function') return null;
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export function downloadFrame() {
  return captureFrame().then((blob) => {
    if (!blob) return false;
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `umbral-vision-${ts}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  });
}

export function buildShareURL({ effect, interval, audio } = {}) {
  const params = new URLSearchParams();
  if (effect) params.set('effect', String(effect));
  if (interval != null) params.set('interval', String(interval));
  params.set('audio', audio ? '1' : '0');
  const url = new URL(window.location.href);
  url.search = params.toString();
  url.hash = '';
  return url.toString();
}

export async function copyShareURL(state) {
  const url = buildShareURL(state);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return { ok: true, url, method: 'clipboard' };
    }
  } catch { /* fallback below */ }
  return { ok: false, url, method: 'fallback' };
}

export function parseShareURL(searchString) {
  const params = new URLSearchParams(searchString);
  return {
    effect: params.get('effect') || null,
    interval: params.has('interval') ? Number(params.get('interval')) || null : null,
    audio: params.get('audio') === '1'
  };
}

