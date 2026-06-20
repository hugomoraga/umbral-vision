/**
 * deviceProfile — detecta capacidades del hardware.
 *
 * FR-008: hardwareConcurrency + deviceMemory + isMobile.
 * FR-009: isLiteRecommended sugiere modo lite automáticamente.
 *
 * ponytail: heurística simple, sin ML. Si deviceMemory no está disponible (Firefox),
 * cae a hardwareConcurrency < 4 como proxy.
 */

const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

let cached = null;

export function detectProfile() {
  if (cached) return cached;

  const ua = navigator.userAgent || '';
  const isMobileUA = MOBILE_REGEX.test(ua);
  const isMobileTouch = ('ontouchstart' in window) && (window.innerWidth <= 1024);

  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = navigator.deviceMemory || null;
  const saveData = navigator.connection?.saveData || false;

  const isMobile = isMobileUA || isMobileTouch;

  let isLiteRecommended;
  if (saveData) {
    isLiteRecommended = true;
  } else if (typeof deviceMemory === 'number') {
    isLiteRecommended = deviceMemory < 4 || hardwareConcurrency < 4;
  } else {
    isLiteRecommended = hardwareConcurrency < 4 || isMobile;
  }

  cached = {
    hardwareConcurrency,
    deviceMemory,
    isMobile,
    isLiteRecommended,
    saveData,
    dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5)
  };
  return cached;
}

export function getLiteMode() {
  try {
    const stored = localStorage.getItem('umbral-vision:lite-mode');
    if (stored === 'on') return true;
    if (stored === 'off') return false;
  } catch { /* noop */ }
  return detectProfile().isLiteRecommended;
}

export function setLiteMode(value) {
  try {
    localStorage.setItem('umbral-vision:lite-mode', value ? 'on' : 'off');
  } catch { /* noop */ }
}
