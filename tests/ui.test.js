import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPresets,
  savePreset,
  loadPreset,
  deletePreset,
  renamePreset,
  duplicatePreset
} from '../src/ui/presets.js';
import { parseShareURL } from '../src/ui/share.js';

const STORAGE_KEY = 'umbral-vision:presets';

describe('presets CRUD', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('returns empty list initially', () => {
    expect(getPresets()).toEqual([]);
  });

  it('savePreset adds and persists an entry', () => {
    const p = savePreset('Mi vibe', { effect: 'mandala', interval: 15, audioEnabled: true });
    expect(p).toBeTruthy();
    expect(p.name).toBe('Mi vibe');
    expect(p.state.effect).toBe('mandala');
    expect(p.id).toBeTruthy();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
  });

  it('savePreset rejects empty name', () => {
    expect(savePreset('', { effect: 'tunnel' })).toBeNull();
    expect(savePreset('   ', { effect: 'tunnel' })).toBeNull();
  });

  it('loadPreset returns the saved entry', () => {
    const p = savePreset('Test', { effect: 'tunnel', interval: 10, audioEnabled: false });
    const loaded = loadPreset(p.id);
    expect(loaded.id).toBe(p.id);
    expect(loaded.state.effect).toBe('tunnel');
  });

  it('loadPreset returns null for unknown id', () => {
    expect(loadPreset('nope')).toBeNull();
  });

  it('deletePreset removes the entry', () => {
    const p = savePreset('Test', { effect: 'tunnel', interval: 10, audioEnabled: false });
    expect(deletePreset(p.id)).toBe(true);
    expect(loadPreset(p.id)).toBeNull();
  });

  it('renamePreset updates name', () => {
    const p = savePreset('Original', { effect: 'tunnel', interval: 10, audioEnabled: false });
    expect(renamePreset(p.id, 'Nuevo nombre')).toBe(true);
    expect(loadPreset(p.id).name).toBe('Nuevo nombre');
  });

  it('renamePreset rejects empty name', () => {
    const p = savePreset('Original', { effect: 'tunnel', interval: 10, audioEnabled: false });
    expect(renamePreset(p.id, '')).toBe(false);
    expect(loadPreset(p.id).name).toBe('Original');
  });

  it('duplicatePreset creates a copy with new id', () => {
    const p = savePreset('Original', { effect: 'tunnel', interval: 10, audioEnabled: false });
    const copy = duplicatePreset(p.id);
    expect(copy).toBeTruthy();
    expect(copy.id).not.toBe(p.id);
    expect(copy.name).toContain('(copia)');
    expect(loadPreset(copy.id).state.effect).toBe('tunnel');
  });
});

describe('share URL parser', () => {
  it('parses effect, interval, audio', () => {
    const p = parseShareURL('?effect=tunnel&interval=15&audio=1');
    expect(p.effect).toBe('tunnel');
    expect(p.interval).toBe(15);
    expect(p.audio).toBe(true);
  });

  it('returns null defaults for empty query', () => {
    const p = parseShareURL('');
    expect(p.effect).toBeNull();
    expect(p.interval).toBeNull();
    expect(p.audio).toBe(false);
  });

  it('handles audio=0', () => {
    const p = parseShareURL('?audio=0');
    expect(p.audio).toBe(false);
  });

  it('falls back to null on garbage interval', () => {
    const p = parseShareURL('?interval=garbage');
    expect(p.interval).toBeNull();
  });
});

import { buildShareURL } from '../src/ui/share.js';

describe('share URL builder', () => {
  it('builds URL with state', () => {
    const url = buildShareURL({ effect: 'tunnel', interval: 10, audio: false });
    expect(url).toContain('effect=tunnel');
    expect(url).toContain('interval=10');
    expect(url).toContain('audio=0');
    expect(url).toMatch(/^https?:\/\/.+/);
  });

  it('omits null fields', () => {
    const url = buildShareURL({ audio: true });
    expect(url).toContain('audio=1');
    expect(url).not.toContain('effect=');
    expect(url).not.toContain('interval=');
  });
});
