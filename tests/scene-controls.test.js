import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSceneControls } from '../src/ui/sceneControls.js';
import { createScene } from '../src/scene/Scene.js';

function makeRoot() {
  const root = document.createElement('section');
  document.body.appendChild(root);
  return root;
}

describe('scene controls', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    localStorage.clear();
  });

  it('muestra familias, variantes y modo', () => {
    const root = makeRoot();
    const controls = createSceneControls(root, {
      getState: () => ({
        scene: createScene({ effect: 'fluidFields', variant: 'torus' }),
        mode: 'hybrid'
      })
    });
    const { familySelect, variantSelect, modeSelect } = controls.elements;
    expect(familySelect.options.length).toBe(8);
    expect(modeSelect.value).toBe('hybrid');
    expect(variantSelect.value).toBe('torus');
    expect(familySelect.value).toBe('fluidFields');
  });

  it('marca Clásicos al elegir esa familia', () => {
    const root = makeRoot();
    const onSelect = vi.fn();
    const controls = createSceneControls(root, {
      getState: () => ({ scene: createScene({ effect: 'fluidFields', variant: 'membrane' }) }),
      onSelect
    });
    const { familySelect, classicBadge } = controls.elements;
    expect(classicBadge.hidden).toBe(true);
    familySelect.value = 'classics';
    familySelect.dispatchEvent(new Event('change'));
    expect(classicBadge.hidden).toBe(false);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ familyId: 'classics', effect: 'matrix' }));
  });

  it('dispara generar, mutar y guardar', () => {
    const root = makeRoot();
    const onGenerate = vi.fn();
    const onMutate = vi.fn();
    const onSave = vi.fn();
    const controls = createSceneControls(root, {
      getState: () => ({ scene: createScene({ effect: 'fluidFields', variant: 'membrane' }) }),
      onGenerate,
      onMutate,
      onSave
    });
    controls.elements.generateBtn.click();
    controls.elements.mutateBtn.click();
    controls.elements.saveBtn.click();
    expect(onGenerate).toHaveBeenCalledTimes(1);
    expect(onMutate).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('cambia de modo y avisa', () => {
    const root = makeRoot();
    const onModeChange = vi.fn();
    const controls = createSceneControls(root, {
      getState: () => ({ scene: null, mode: 'hybrid' }),
      onModeChange
    });
    const { modeSelect } = controls.elements;
    modeSelect.value = 'generative';
    modeSelect.dispatchEvent(new Event('change'));
    expect(onModeChange).toHaveBeenCalledWith('generative');
  });

  it('renderiza el historial y permite abrirlo o promoverlo', () => {
    const root = makeRoot();
    const onHistorySelect = vi.fn();
    const onHistorySave = vi.fn();
    const scene = createScene({ effect: 'fluidFields', variant: 'ribbon', name: 'Nebulosa' });
    createSceneControls(root, {
      getState: () => ({
        scene,
        history: [{ id: scene.id, scene, at: Date.now() }]
      }),
      onHistorySelect,
      onHistorySave
    });
    const rows = root.querySelectorAll('.uv-scene-history-row');
    expect(rows.length).toBe(1);
    rows[0].querySelector('.uv-scene-history-open').click();
    expect(onHistorySelect).toHaveBeenCalledWith(scene.id);
    rows[0].querySelector('button.uv-btn-icon').click();
    expect(onHistorySave).toHaveBeenCalledWith(scene.id);
  });

  it('deshabilita familias sin WebGL 2 y cae a una disponible', () => {
    const root = makeRoot();
    createSceneControls(root, {
      getState: () => ({ scene: createScene({ effect: 'fluidFields', variant: 'membrane' }) }),
      isFamilyAvailable: (family) => family.renderer !== 'webgl'
    });
    const familySelect = root.querySelector('#uv-family-select');
    const fluid = [...familySelect.options].find((option) => option.value === 'fluidFields');
    expect(fluid.disabled).toBe(true);
    expect(fluid.textContent).toContain('WebGL 2');
    expect(familySelect.value).toBe('kineticGeometry');
  });

  it('deshabilita variantes no implementadas', () => {
    const root = makeRoot();
    createSceneControls(root, {
      getState: () => ({ scene: createScene({ effect: 'fluidFields', variant: 'membrane' }) })
    });
    const variantSelect = root.querySelector('#uv-variant-select');
    const smoke = [...variantSelect.options].find((option) => option.value === 'smoke');
    expect(smoke.disabled).toBe(true);
  });
});
