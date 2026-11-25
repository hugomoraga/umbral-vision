import { describe, it, expect, vi } from 'vitest';
import {
  shouldCrossfadeBackends,
  createBackendCrossfade
} from '../src/ui/backendTransition.js';

describe('backend cross-fade', () => {
  it('decide cuándo hace falta overlay', () => {
    expect(shouldCrossfadeBackends(true, true)).toBe(false);
    expect(shouldCrossfadeBackends(true, false)).toBe(true);
    expect(shouldCrossfadeBackends(false, true)).toBe(true);
    expect(shouldCrossfadeBackends(false, false)).toBe(true);
  });

  it('no crea overlay sin canvas válido', () => {
    expect(createBackendCrossfade({ source: null })).toBeNull();
    expect(createBackendCrossfade({ source: { width: 0, height: 10 } })).toBeNull();
  });

  it('dibuja el snapshot y lo desvanece', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const source = { width: 100, height: 50 };
    const drawImage = vi.fn();
    const raf = (cb) => { cb(); };
    let removal = null;

    const overlay = createBackendCrossfade({
      source,
      container,
      durationMs: 500,
      contextFactory: () => ({ drawImage }),
      requestFrame: raf,
      setTimeoutFn: (cb) => { removal = cb; return 1; }
    });

    expect(overlay).toBeTruthy();
    expect(drawImage).toHaveBeenCalledWith(source, 0, 0);
    expect(container.querySelector('.uv-backend-crossfade')).toBeTruthy();
    expect(overlay.canvas.style.opacity).toBe('1');

    overlay.finish();
    expect(overlay.canvas.style.opacity).toBe('0');
    expect(removal).toBeTypeOf('function');
    removal();
    expect(container.querySelector('.uv-backend-crossfade')).toBeNull();
    container.remove();
  });

  it('aplica zoom y wipe al overlay', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const make = (type) => createBackendCrossfade({
      source: { width: 10, height: 10 },
      container,
      type,
      contextFactory: () => ({ drawImage: () => {} }),
      requestFrame: (cb) => cb(),
      setTimeoutFn: () => 1
    });
    const zoom = make('zoom');
    zoom.finish();
    expect(zoom.canvas.style.transform).toContain('scale');
    zoom.cancel();
    const wipe = make('wipe');
    expect(wipe.canvas.style.clipPath).toContain('inset');
    wipe.finish();
    expect(wipe.canvas.style.clipPath).toContain('100%');
    wipe.cancel();
    container.remove();
  });

  it('cancel elimina el overlay inmediatamente', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const overlay = createBackendCrossfade({
      source: { width: 10, height: 10 },
      container,
      contextFactory: () => ({ drawImage: () => {} }),
      requestFrame: (cb) => cb(),
      setTimeoutFn: () => 1
    });
    overlay.cancel();
    expect(container.querySelector('.uv-backend-crossfade')).toBeNull();
    container.remove();
  });
});
