/**
 * Panel — collapsed/expanded state for the controls panel.
 * ponytail: solo persistimos `expanded` en localStorage; el resto del estado UI
 * (efecto activo, audio, presets) lo gestionan sus propios módulos.
 */

const STORAGE_KEY = 'umbral-vision:panel-state';

export function createPanel(root) {
  if (!root) return null;

  const header = root.querySelector('.panel-header');
  const toggleBtn = root.querySelector('.panel-toggle');
  if (!header || !toggleBtn) return null;

  const stored = readStored();
  if (stored.expanded === false) {
    root.classList.add('collapsed');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Mostrar controles');
  } else {
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Ocultar controles');
  }

  const handler = () => toggle(root, toggleBtn);
  toggleBtn.addEventListener('click', handler);

  return {
    toggle: () => toggle(root, toggleBtn),
    isExpanded: () => !root.classList.contains('collapsed'),
    destroy: () => toggleBtn.removeEventListener('click', handler)
  };
}

function toggle(root, btn) {
  const isCollapsed = root.classList.toggle('collapsed');
  btn.setAttribute('aria-expanded', String(!isCollapsed));
  btn.setAttribute('aria-label', isCollapsed ? 'Mostrar controles' : 'Ocultar controles');
  writeStored({ expanded: !isCollapsed });
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { expanded: true };
    const parsed = JSON.parse(raw);
    return { expanded: parsed.expanded !== false };
  } catch {
    return { expanded: true };
  }
}

function writeStored(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // modo incógnito o storage bloqueado: estado se mantiene en memoria
  }
}
