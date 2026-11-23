import { describe, it, expect, beforeEach } from 'vitest';
import * as uv from '../src/index.js';
import { ENGINE_EFFECTS } from '../src/engine/registry.js';
import { createThumbnails } from '../src/ui/thumbnails.js';
import { getPresets, savePreset, loadPreset, deletePreset } from '../src/ui/presets.js';
import { captureFrame, buildShareURL, parseShareURL } from '../src/ui/share.js';
import { createEffectParams } from '../src/ui/effectParams.js';

describe('API pública v0.4', () => {
  it('expone el motor y las funciones de parámetros', () => {
    expect(typeof uv.createEngine).toBe('function');
    expect(typeof uv.setEffectParameters).toBe('function');
    expect(typeof uv.getEffectParameters).toBe('function');
    expect(typeof uv.getEffectSchema).toBe('function');
    expect(typeof uv.getEngineStats).toBe('function');
    expect(typeof uv.setEngineQuality).toBe('function');
    expect(typeof uv.getAudioFeatures).toBe('function');
    expect(uv.ENGINE_EFFECTS).toBe(ENGINE_EFFECTS);
  });

  it('getAvailableEffects une los 15 efectos p5 y las 4 familias GPU', () => {
    const names = uv.getAvailableEffects();
    expect(names).toHaveLength(19);
    expect(names).toContain('fluidFields');
    expect(names).toContain('organicStructures');
    expect(names).toContain('mathematicalForms');
    expect(names).toContain('temporalVeil');
    expect(names).toContain('tunnel');
    expect(new Set(names).size).toBe(names.length);
  });

  it('los 15 efectos históricos siguen intactos', () => {
    expect(Object.keys(uv.Effects)).toHaveLength(15);
    expect(uv.Effects.tunnel).toBeTypeOf('function');
    expect(uv.Effects.yinYang).toBeTypeOf('function');
  });
});

describe('presets con parámetros del motor', () => {
  beforeEach(() => {
    for (const p of getPresets()) deletePreset(p.id);
  });

  it('guarda y recupera params serializables', () => {
    const created = savePreset('fluido', {
      effect: 'fluidFields',
      interval: 12,
      audioEnabled: true,
      params: { density: 0.7, speed: 1.4, hue: 0.5 }
    });
    expect(created).toBeTruthy();
    const loaded = loadPreset(created.id);
    expect(loaded.state.effect).toBe('fluidFields');
    expect(loaded.state.params).toEqual({ density: 0.7, speed: 1.4, hue: 0.5 });
  });

  it('presets viejos sin params siguen funcionando', () => {
    const created = savePreset('legacy', { effect: 'tunnel', interval: 10, audioEnabled: false });
    expect(created.state.params).toBeNull();
    expect(loadPreset(created.id).state.effect).toBe('tunnel');
  });
});

describe('share + capture con dos canvases', () => {
  it('captura el canvas visible, no el oculto de p5', async () => {
    const root = document.createElement('div');
    root.id = 'generator';
    const main = document.createElement('main');
    root.appendChild(main);
    const p5Canvas = document.createElement('canvas');
    p5Canvas.style.display = 'none';
    p5Canvas.toBlob = (cb) => cb('p5');
    const glCanvas = document.createElement('canvas');
    glCanvas.toBlob = (cb) => cb('webgl');
    main.append(p5Canvas, glCanvas);
    document.body.appendChild(root);

    const blob = await captureFrame();
    expect(blob).toBe('webgl');
    root.remove();
  });

  it('buildShareURL codifica parámetros del efecto GPU', () => {
    const params = { speed: 1.4, hue: 0.2, seed: 42 };
    const url = buildShareURL({ effect: 'fluidFields', interval: 8, audio: false, params });
    const parsed = parseShareURL(new URL(url).search);
    expect(parsed.params).toEqual(params);
  });

  it('parseShareURL ignora parámetros corruptos', () => {
    expect(parseShareURL('?effect=fluidFields&p=no-json').params).toBeNull();
    expect(parseShareURL('?p=[1,2]').params).toBeNull();
  });

  it('buildShareURL conserva effect/interval/audio', () => {
    const url = buildShareURL({ effect: 'fluidFields', interval: 8, audio: true });
    expect(url).toContain('effect=fluidFields');
    expect(url).toContain('interval=8');
    expect(url).toContain('audio=1');
    expect(parseShareURL(new URL(url).search)).toEqual({ effect: 'fluidFields', interval: 8, audio: true, params: null });
  });
});

describe('panel de parámetros', () => {
  it('se oculta para efectos p5 y al destruirse', () => {
    const root = document.createElement('section');
    document.body.appendChild(root);
    const panel = createEffectParams(root);
    panel.refresh('tunnel');
    expect(root.hidden).toBe(true);
    panel.refresh('fluidFields');
    expect(root.hidden).toBe(false);
    panel.destroy();
    expect(root.hidden).toBe(true);
    root.remove();
  });
});

describe('thumbnails con catálogo unificado', () => {
  it('crea un botón por efecto GPU y usa la preview propia', () => {
    const container = document.createElement('div');
    const all = { ...uv.Effects };
    for (const [name, entry] of Object.entries(ENGINE_EFFECTS)) {
      const factory = () => ({ draw: () => {} });
      factory.preview = entry.preview;
      factory.isEngine = true;
      all[name] = factory;
    }
    document.body.appendChild(container);
    const thumbs = createThumbnails(container, all, () => {});
    expect(thumbs.getNames()).toHaveLength(19);
    const fluidButton = container.querySelector('[data-effect-name="fluidFields"]');
    expect(fluidButton).toBeTruthy();
    expect(fluidButton.getAttribute('aria-label')).toBe('Fluid Fields');
    expect(fluidButton.querySelector('canvas')).toBeTruthy();
    thumbs.destroy();
    container.remove();
  });
});
