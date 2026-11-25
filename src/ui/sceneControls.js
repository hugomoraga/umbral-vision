/**
 * SceneControls — controles de familias, variantes, generación, memoria y
 * modo de reproducción. Es agnóstico del host: recibe callbacks y no toca el
 * motor directamente, así puede testearse sin WebGL.
 */

import { FAMILIES, listFamilies, resolveVariant, getFamilyForScene } from '../scene/families.js';
import { PLAYBACK_MODES } from '../scene/playlist.js';
import { TRANSITION_TYPES, TRANSITION_LABELS } from '../scene/transitionDirector.js';
import { createIcon } from './icons.js';

const MODE_LABELS = {
  curated: 'Curado',
  generative: 'Generativo',
  hybrid: 'Híbrido'
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/**
 * @param {HTMLElement} root
 * @param {{
 *   getState?:()=>{scene?:object, mode?:string, history?:object[], familyId?:string,
 *                  variantId?:string, transitionType?:string},
 *   onSelect?:(selection:{familyId:string, variantId:string, effect:string})=>void,
 *   onModeChange?:(mode:string)=>void,
 *   onTransitionChange?:(type:string)=>void,
 *   onGenerate?:()=>void,
 *   onMutate?:()=>void,
 *   onSave?:()=>void,
 *   onHistorySelect?:(id:string)=>void,
 *   onHistorySave?:(id:string)=>void
 * }} [options]
 */
export function createSceneControls(root, options = {}) {
  if (!root) return { refresh() {}, destroy() {}, setMode() {}, get elements() { return {}; } };

  const isFamilyAvailable = options.isFamilyAvailable || (() => true);
  const fallbackFamilyId = () => {
    const available = listFamilies({ includeClassics: true }).find((family) => isFamilyAvailable(family));
    return available ? available.id : 'fluidFields';
  };

  root.classList.add('uv-scene-controls');
  root.replaceChildren();

  const header = el('div', 'uv-scene-head');
  header.append(createIcon('grid', 14));
  header.append(el('span', null, 'Escena'));
  const classicBadge = el('span', 'uv-badge uv-badge-classic', 'Clásico');
  classicBadge.hidden = true;
  header.append(classicBadge);
  root.append(header);

  const modeRow = el('label', 'uv-scene-row');
  modeRow.append(el('span', null, 'Modo'));
  const modeSelect = el('select', 'uv-select');
  modeSelect.id = 'uv-playback-mode';
  for (const mode of PLAYBACK_MODES) {
    const option = el('option', null, MODE_LABELS[mode] || mode);
    option.value = mode;
    modeSelect.append(option);
  }
  modeRow.append(modeSelect);
  root.append(modeRow);

  const familyRow = el('label', 'uv-scene-row');
  familyRow.append(el('span', null, 'Familia'));
  const familySelect = el('select', 'uv-select');
  familySelect.id = 'uv-family-select';
  for (const family of listFamilies({ includeClassics: true })) {
    const available = isFamilyAvailable(family);
    const option = el('option', null, available ? family.label : `${family.label} (requiere WebGL 2)`);
    option.value = family.id;
    option.disabled = !available;
    familySelect.append(option);
  }
  familyRow.append(familySelect);
  root.append(familyRow);

  const variantRow = el('label', 'uv-scene-row');
  variantRow.append(el('span', null, 'Variante'));
  const variantSelect = el('select', 'uv-select');
  variantSelect.id = 'uv-variant-select';
  variantRow.append(variantSelect);
  root.append(variantRow);

  const transitionRow = el('label', 'uv-scene-row');
  transitionRow.append(el('span', null, 'Transición'));
  const transitionSelect = el('select', 'uv-select');
  transitionSelect.id = 'uv-transition-type';
  const autoTransition = el('option', null, 'Auto');
  autoTransition.value = 'auto';
  transitionSelect.append(autoTransition);
  for (const type of TRANSITION_TYPES) {
    const option = el('option', null, TRANSITION_LABELS[type] || type);
    option.value = type;
    transitionSelect.append(option);
  }
  transitionRow.append(transitionSelect);
  root.append(transitionRow);

  const actions = el('div', 'uv-scene-actions');
  const generateBtn = el('button', 'uv-btn', 'Generar');
  generateBtn.type = 'button';
  generateBtn.id = 'uv-generate';
  const mutateBtn = el('button', 'uv-btn', 'Mutar');
  mutateBtn.type = 'button';
  mutateBtn.id = 'uv-mutate';
  const saveBtn = el('button', 'uv-btn uv-btn-quiet', 'Guardar escena');
  saveBtn.type = 'button';
  saveBtn.id = 'uv-save-scene';
  actions.append(generateBtn, mutateBtn, saveBtn);
  root.append(actions);

  const status = el('p', 'uv-scene-status', '');
  status.id = 'uv-scene-status';
  root.append(status);

  const historyHead = el('div', 'uv-scene-history-head');
  historyHead.append(el('span', null, 'Historial'));
  const historyCount = el('span', 'uv-scene-history-count', '0');
  historyHead.append(historyCount);
  root.append(historyHead);

  const historyList = el('div', 'uv-scene-history');
  historyList.id = 'uv-scene-history';
  root.append(historyList);

  let state = {};
  let lastRenderedHistory = -1;

  function variantsFor(familyId) {
    const family = FAMILIES[familyId];
    if (!family) return [];
    return Object.entries(family.variants).map(([id, entry]) => ({ id, ...entry }));
  }

  function paintVariants(familyId, selected) {
    variantSelect.replaceChildren();
    for (const entry of variantsFor(familyId)) {
      const option = el('option', null, entry.implemented === false ? `${entry.label} (próx.)` : entry.label);
      option.value = entry.id;
      if (entry.implemented === false) option.disabled = true;
      variantSelect.append(option);
    }
    const fallback = FAMILIES[familyId]?.defaultVariant;
    variantSelect.value = variantsFor(familyId).some((v) => v.id === selected) ? selected : fallback;
  }

  function currentSelection() {
    const familyId = familySelect.value;
    const variantId = variantSelect.value;
    const resolved = resolveVariant(familyId, variantId);
    return { familyId, variantId, effect: resolved?.effect || '' };
  }

  function renderHistory(history) {
    const list = Array.isArray(history) ? history : [];
    if (list.length === lastRenderedHistory && list.length > 0) {
      // El contenido puede haber cambiado aunque el largo no; se repinta igual
      // cuando el llamador lo pide explícitamente.
    }
    lastRenderedHistory = list.length;
    historyCount.textContent = String(list.length);
    historyList.replaceChildren();
    if (!list.length) {
      historyList.append(el('p', 'uv-scene-empty', 'Todavía no hay escenas en el historial.'));
      return;
    }
    for (const entry of list.slice(0, 12)) {
      const row = el('div', 'uv-scene-history-row');
      const open = el('button', 'uv-scene-history-open');
      open.type = 'button';
      open.dataset.sceneId = entry.id;
      const scene = entry.scene || {};
      open.append(el('b', null, scene.name || `${scene.effect || 'escena'} · ${scene.variant || '—'}`));
      const mode = scene.origin === 'generated' ? 'generada' : scene.origin === 'mutated' ? 'mutada' : 'guardada';
      open.append(el('span', null, `${mode} · ${new Date(entry.at || Date.now()).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`));
      open.addEventListener('click', () => options.onHistorySelect?.(entry.id));
      const save = el('button', 'uv-btn uv-btn-icon', '');
      save.type = 'button';
      save.title = 'Promover a preset';
      save.setAttribute('aria-label', 'Promover a preset');
      save.append(createIcon('bookmark', 14));
      save.addEventListener('click', () => options.onHistorySave?.(entry.id));
      row.append(open, save);
      historyList.append(row);
    }
  }

  function refresh(next = {}) {
    state = next || {};
    const scene = state.scene || null;
    if (state.mode && PLAYBACK_MODES.includes(state.mode)) modeSelect.value = state.mode;
    transitionSelect.value = state.transitionType || 'auto';
    let familyId = state.familyId
      || (scene ? getFamilyForScene(scene) : null)
      || familySelect.value
      || 'fluidFields';
    if (!FAMILIES[familyId] || !isFamilyAvailable(FAMILIES[familyId])) {
      familyId = fallbackFamilyId();
    }
    if (FAMILIES[familyId]) familySelect.value = familyId;
    paintVariants(familyId, state.variantId || scene?.variant || FAMILIES[familyId]?.defaultVariant);
    const isClassic = familyId === 'classics';
    classicBadge.hidden = !isClassic;
    status.textContent = scene
      ? `${scene.effect} · ${scene.variant} · seed ${scene.seed}`
      : 'Sin escena activa';
    if (state.history) renderHistory(state.history);
  }

  modeSelect.addEventListener('change', () => options.onModeChange?.(modeSelect.value));
  familySelect.addEventListener('change', () => {
    paintVariants(familySelect.value, FAMILIES[familySelect.value]?.defaultVariant);
    classicBadge.hidden = familySelect.value !== 'classics';
    options.onSelect?.(currentSelection());
  });
  variantSelect.addEventListener('change', () => options.onSelect?.(currentSelection()));
  transitionSelect.addEventListener('change', () => options.onTransitionChange?.(transitionSelect.value));
  generateBtn.addEventListener('click', () => options.onGenerate?.());
  mutateBtn.addEventListener('click', () => options.onMutate?.());
  saveBtn.addEventListener('click', () => options.onSave?.());

  refresh(options.getState?.() || {});

  return {
    refresh,
    setMode(mode) {
      if (PLAYBACK_MODES.includes(mode)) modeSelect.value = mode;
    },
    renderHistory,
    getSelection: currentSelection,
    get elements() {
      return {
        root, modeSelect, familySelect, variantSelect, transitionSelect,
        generateBtn, mutateBtn, saveBtn, status, historyList, classicBadge
      };
    },
    destroy() {
      root.replaceChildren();
      root.classList.remove('uv-scene-controls');
    }
  };
}
