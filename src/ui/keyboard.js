/**
 * Keyboard — global shortcuts handler.
 *
 * Shortcuts (FR-003):
 *   1-9, 0, -, =  → switch effect N (1-indexed, hasta 12)
 *   ← / →        → previous / next effect (wrap)
 *   Space        → toggle auto-transition
 *   F            → toggle fullscreen
 *   H            → toggle panel
 *   M            → toggle microphone
 *   ?            → toggle onboarding
 *
 * Se ignoran cuando el foco está en <input>, <textarea>, o [contenteditable].
 */

const NON_TARGET_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export function initKeyboard(handlers) {
  const map = {
    ' ': () => handlers.toggleAuto?.(),
    'f': () => handlers.toggleFullscreen?.(),
    'F': () => handlers.toggleFullscreen?.(),
    'h': () => handlers.togglePanel?.(),
    'H': () => handlers.togglePanel?.(),
    'm': () => handlers.toggleMic?.(),
    'M': () => handlers.toggleMic?.(),
    '?': () => handlers.toggleOnboarding?.(),
    'ArrowLeft': () => handlers.prevEffect?.(),
    'ArrowRight': () => handlers.nextEffect?.()
  };

  for (let i = 1; i <= 9; i++) map[String(i)] = () => handlers.selectByIndex?.(i - 1);
  map['0'] = () => handlers.selectByIndex?.(9);
  map['-'] = () => handlers.selectByIndex?.(10);
  map['='] = () => handlers.selectByIndex?.(11);

  const onKey = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && NON_TARGET_TAGS.has(t.tagName)) return;
    if (t && t.isContentEditable) return;

    const fn = map[e.key];
    if (!fn) return;
    e.preventDefault();
    fn();
  };

  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}
