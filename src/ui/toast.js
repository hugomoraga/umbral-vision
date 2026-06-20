/**
 * Toast — minimal ephemeral notifications.
 *
 * Escucha el evento `uv:toast` para mensajes disparados por otros módulos
 * (ej. presets.js cuando localStorage está bloqueado).
 */

let el = null;
let timer = null;

function ensureEl() {
  if (el) return el;
  el = document.createElement('div');
  el.id = 'toast';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  document.body.appendChild(el);
  return el;
}

export function showToast(text, duration = 2000) {
  const node = ensureEl();
  node.textContent = text;
  node.classList.add('show');
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    node.classList.remove('show');
  }, duration);
}

export function initToastListener() {
  window.addEventListener('uv:toast', (e) => {
    showToast(e.detail?.text || '', e.detail?.duration ?? 2000);
  });
}
