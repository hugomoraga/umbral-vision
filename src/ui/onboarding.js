/**
 * Onboarding — first-run tips overlay.
 *
 * Aparece 800ms después del primer frame. Auto-cierra a los 6s si no hay
 * interacción. Flag en localStorage para no repetir.
 */

const STORAGE_KEY = 'umbral-vision:onboarded';
const AUTO_CLOSE_MS = 6000;

const TIPS = [
  { keys: ['1', '–', '9'], text: 'Cambiar efecto (atajo numérico)' },
  { keys: ['←', '→'], text: 'Efecto anterior / siguiente' },
  { keys: ['Espacio'], text: 'Auto-transición on/off' },
  { keys: ['F'], text: 'Pantalla completa' },
  { keys: ['H'], text: 'Ocultar / mostrar panel' },
  { keys: ['M'], text: 'Activar / desactivar micrófono' }
];

export function initOnboarding({ onFirstFrame }) {
  let overlay = document.getElementById('onboarding');
  if (!overlay) {
    overlay = createOverlay();
    document.body.appendChild(overlay);
  }

  let autoCloseTimer = null;
  let dismissed = isDismissed();

  const show = () => {
    if (dismissed) return;
    overlay.hidden = false;
    autoCloseTimer = setTimeout(dismiss, AUTO_CLOSE_MS);
  };

  const dismiss = () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
    overlay.hidden = true;
    if (!dismissed) {
      dismissed = true;
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
    }
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismiss();
  });
  overlay.querySelector('.onboarding-dismiss')?.addEventListener('click', dismiss);
  document.addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    if (e.key === 'Escape' || e.key === 'Enter') dismiss();
  });

  if (!dismissed) {
    onFirstFrame(() => setTimeout(show, 800));
  }

  return {
    show: () => { dismissed = false; show(); },
    dismiss
  };
}

function isDismissed() {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; }
  catch { return false; }
}

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'onboarding';
  overlay.hidden = true;

  const card = document.createElement('div');
  card.className = 'onboarding-card';

  const h2 = document.createElement('h2');
  h2.textContent = 'Umbral Vision';
  card.appendChild(h2);

  const sub = document.createElement('p');
  sub.style.cssText = 'margin: 0; font-size: 0.9rem; opacity: 0.75;';
  sub.textContent = 'Atajos principales:';
  card.appendChild(sub);

  const ul = document.createElement('ul');
  ul.className = 'onboarding-tips';
  for (const tip of TIPS) {
    const li = document.createElement('li');
    for (const k of tip.keys) {
      const kbd = document.createElement('kbd');
      kbd.textContent = k;
      li.appendChild(kbd);
    }
    const span = document.createElement('span');
    span.textContent = ' ' + tip.text;
    li.appendChild(span);
    ul.appendChild(li);
  }
  card.appendChild(ul);

  const btn = document.createElement('button');
  btn.className = 'btn primary onboarding-dismiss';
  btn.textContent = 'Entendido';
  card.appendChild(btn);

  overlay.appendChild(card);
  return overlay;
}
