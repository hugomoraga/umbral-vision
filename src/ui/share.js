/**
 * Share — capture PNG frame + build share URL with the scene genome.
 *
 * Formato nuevo: `?s=<genoma-base64url>` reconstruye una escena exacta.
 * Formato legado: `?effect=tunnel&interval=10&audio=0&p={...}` sigue funcionando.
 */

import {
  createScene,
  decodeSceneCompact,
  encodeSceneCompact,
  legacyStateToScene
} from '../scene/Scene.js';

export function captureFrame() {
  // Puede haber dos canvases (p5 2D + motor WebGL): capturamos el visible.
  const canvases = Array.from(document.querySelectorAll('#generator canvas, main canvas, body > canvas'));
  const canvas = canvases.find((c) => c.style.display !== 'none' && !c.hidden) || canvases[0];
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

export function buildShareURL({ effect, interval, audio, params: effectParams, scene } = {}) {
  const params = new URLSearchParams();
  if (effect) params.set('effect', String(effect));
  if (interval != null) params.set('interval', String(interval));
  params.set('audio', audio ? '1' : '0');

  if (scene) {
    const normalized = createScene(scene);
    params.set('s', encodeSceneCompact(normalized));
    params.set('effect', normalized.effect);
  } else if (effectParams && typeof effectParams === 'object' && Object.keys(effectParams).length > 0) {
    params.set('p', JSON.stringify(effectParams));
  }

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
  let effectParams = null;
  if (params.has('p')) {
    try {
      const parsed = JSON.parse(params.get('p'));
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) effectParams = parsed;
    } catch { /* URL inválida: ignorar parámetros */ }
  }

  let scene = null;
  if (params.has('s')) {
    scene = decodeSceneCompact(params.get('s'));
  }

  const effect = scene?.effect || params.get('effect') || null;

  return {
    effect,
    interval: params.has('interval') ? Number(params.get('interval')) || null : null,
    audio: params.get('audio') === '1',
    params: scene ? { ...scene.params, seed: scene.seed } : effectParams,
    scene
  };
}

/**
 * Reconstruye una escena desde una URL legada o nueva.
 */
export function sceneFromShareURL(searchString) {
  const parsed = parseShareURL(searchString);
  if (parsed.scene) return parsed.scene;
  if (!parsed.effect) return null;
  return legacyStateToScene({
    effect: parsed.effect,
    params: parsed.params || {}
  }, { name: 'Escena compartida' });
}
