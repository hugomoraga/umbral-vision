/**
 * Studio UI — rediseño del generador (instrumento visual).
 *
 * No depende de `ui/index.js`: se monta sobre el layout `#studio` y reutiliza
 * thumbnails, parámetros, presets, audio, share y atajos. Mantiene intacto el
 * mountUI legado para consumidores que usan el layout anterior.
 */

import { Effects } from '../Effects.js';
import { ENGINE_EFFECTS, isEngineEffect } from '../engine/registry.js';
import {
  startVisualizer,
  changeEffect,
  setScene,
  getScene,
  getFpsCounter,
  getEngineStats,
  getEffectParameters,
  setEffectParameters,
  getEngine,
  setVisualizerPaused,
  isVisualizerPaused
} from '../Visualizer.js';
import {
  initAudio,
  stopAudio,
  getAudioState,
  getAudioFeatures
} from '../AudioReactive.js';
import { startAutoTransition, stopAutoTransition } from '../Transition.js';
import { getLiteMode, setLiteMode } from '../perf/deviceProfile.js';
import { createThumbnails } from './thumbnails.js';
import { createEffectParams } from './effectParams.js';
import { createAudioControls } from './audioControls.js';
import { createSpectrum } from './spectrum.js';
import { getPresets, getPresetScenes, savePreset, saveScene, deletePreset } from './presets.js';
import { exportPack, importPack, serializePack } from '../scene/packs.js';
import { createSceneControls } from './sceneControls.js';
import { createHistory } from '../scene/history.js';
import { createThumbnailStore } from '../scene/storage.js';
import { createPlaylist, createSceneScheduler } from '../scene/playlist.js';
import { sampleScene, mutateScene } from '../scene/sampler.js';
import { createScene } from '../scene/Scene.js';
import { getFamilyForScene, resolveVariant, getRetiredEffects } from '../scene/families.js';
import { downloadFrame, copyShareURL, parseShareURL } from './share.js';
import { showToast, initToastListener } from './toast.js';
import { initKeyboard } from './keyboard.js';
import { initOnboarding } from './onboarding.js';
import { createIcon } from './icons.js';

const ORDER = [
  'fluidFields', 'organicStructures', 'mathematicalForms', 'temporalVeil',
  'tunnel', 'spiral', 'mandala', 'particles', 'waves', 'fractal',
  'matrix', 'glitch', 'melt', 'fractalGlitch', 'waveGlitch',
  'sacredGeometry', 'biomech', 'dune', 'yinYang'
];

const SHORT_LABELS = {
  fluidFields: 'Fluid',
  organicStructures: 'Organic',
  mathematicalForms: 'Fractal',
  temporalVeil: 'Temporal',
  tunnel: 'Túnel',
  spiral: 'Espiral',
  mandala: 'Mándala',
  particles: 'Partículas',
  waves: 'Olas',
  fractal: 'Árbol',
  matrix: 'Matrix',
  glitch: 'Glitch',
  melt: 'Melt',
  fractalGlitch: 'Árbol Glitch',
  waveGlitch: 'Olas Glitch',
  sacredGeometry: 'Geometría',
  biomech: 'Biomech',
  dune: 'Duna',
  yinYang: 'Yin Yang'
};

const META = {
  fluidFields: ['Fluid Fields', 'Tejido de partículas sobre una membrana viva.', 'Fluid Fields'],
  organicStructures: ['Organic Structures', 'Membranas topológicas translúcidas.', 'Organic Structures'],
  mathematicalForms: ['Mathematical Forms', 'Fractal volumétrico raymarched.', 'Mathematical Forms'],
  temporalVeil: ['Temporal Veil', 'Estelas que evolucionan desde su memoria.', 'Temporal Systems'],
  tunnel: ['Túnel', 'Elipses concéntricas en cámara infinita.', 'Clásico p5'],
  spiral: ['Espiral', 'Cromática en rotación continua.', 'Clásico p5'],
  mandala: ['Mándala', 'Simetría radial en capas.', 'Clásico p5'],
  particles: ['Partículas', 'Campo de partículas reactivas.', 'Clásico p5'],
  waves: ['Olas', 'Ondas de frecuencia sobre el plano.', 'Clásico p5'],
  fractal: ['Árbol fractal', 'Recursión ramificada.', 'Clásico p5'],
  matrix: ['Matrix', 'Lluvia de caracteres.', 'Clásico p5'],
  glitch: ['Glitch', 'Ruido, bandas y desplazamiento digital.', 'Clásico p5'],
  melt: ['Melt', 'Deriva y goteo vertical.', 'Clásico p5'],
  fractalGlitch: ['Árbol Glitch', 'Fractal con interferencias.', 'Clásico p5'],
  waveGlitch: ['Olas Glitch', 'Ondas atravesadas por ruido.', 'Clásico p5'],
  sacredGeometry: ['Geometría Sagrada', 'Flor de la vida y patrones.', 'Clásico p5'],
  biomech: ['Biomech', 'Estructuras orgánicas y mecánicas.', 'Clásico p5'],
  dune: ['Duna', 'Dunas suaves en capas.', 'Clásico p5'],
  yinYang: ['Yin Yang', 'Dualidad en equilibrio.', 'Clásico p5']
};

const INTERVAL_KEY = 'umbral-vision:transition-interval';
const MODE_KEY = 'umbral-vision:playback-mode';
const TRANSITION_KEY = 'umbral-vision:transition-type';

function buildRegistry() {
  const previews = {};
  for (const [name, entry] of Object.entries(ENGINE_EFFECTS)) {
    const factory = () => ({ draw: () => {} });
    factory.preview = entry.preview;
    factory.isEngine = true;
    factory.label = entry.label;
    previews[name] = factory;
  }
  return { ...Effects, ...previews };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function shortDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
}

export function mountStudioUI() {
  const panel = document.getElementById('panel');
  const dock = document.getElementById('uv-dock');
  if (!panel || !dock) return null;

  initToastListener();
  const ALL = buildRegistry();
  const names = ORDER.filter((n) => ALL[n]).concat(Object.keys(ALL).filter((n) => !ORDER.includes(n)));
  const thumbsEl = document.getElementById('thumbnails');

  const shareParams = parseShareURL(window.location.search);
  const initial = ALL[shareParams.effect] ? shareParams.effect : 'fluidFields';

  let storedTransition = 'auto';
  try { storedTransition = localStorage.getItem(TRANSITION_KEY) || 'auto'; } catch { /* noop */ }
  const state = {
    current: initial,
    interval: shareParams.interval || Number(localStorage.getItem(INTERVAL_KEY)) || 10,
    transitionType: storedTransition,
    auto: false,
    paused: false
  };

  startVisualizer(initial, document.querySelector('#generator main'));

  // Si el navegador no tiene WebGL 2, el motor GPU no existe y el canvas queda
  // negro. Caemos a p5 para que la UI siga siendo usable y avisamos.
  const gpuAvailable = !isEngineEffect(initial) || !!getEngine();
  if (!gpuAvailable) {
    state.current = 'tunnel';
    startVisualizer('tunnel', document.querySelector('#generator main'));
    showToast('WebGL 2 no disponible: usando efectos p5');
  }

  if (shareParams.params && isEngineEffect(initial) && gpuAvailable) {
    setEffectParameters(shareParams.params);
  }

  // ---- iconografía -------------------------------------------------------
  const iconBtn = (id, icon, label) => {
    const el = document.getElementById(id);
    if (!el) return null;
    el.appendChild(createIcon(icon, 18));
    el.setAttribute('aria-label', label);
    return el;
  };

  iconBtn('fullscreenBtn', 'expand', 'Pantalla completa');
  iconBtn('uv-panel-btn', 'grid', 'Mostrar u ocultar panel');
  iconBtn('uv-prev', 'prev', 'Efecto anterior');
  iconBtn('uv-next', 'next', 'Efecto siguiente');
  iconBtn('uv-play', 'pause', 'Pausar');
  iconBtn('uv-strip-prev', 'chevron', 'Desplazar efectos');
  iconBtn('uv-strip-next', 'chevron', 'Desplazar efectos');
  document.getElementById('uv-strip-prev')?.classList.add('uv-flip');
  iconBtn('lite-mode-btn', 'moon', 'Modo lite');
  iconBtn('uv-save-preset', 'bookmark', 'Guardar preset');
  iconBtn('capture-btn', 'camera', 'Descargar PNG');
  iconBtn('share-btn', 'share', 'Compartir URL');

  const exploreBtn = document.getElementById('uv-explore-btn');
  if (exploreBtn && !exploreBtn.querySelector('svg')) exploreBtn.appendChild(createIcon('chevron', 14));
  const panelToggle = panel.querySelector('.panel-toggle');
  if (panelToggle) panelToggle.appendChild(createIcon('chevron', 14));

  const micBtn = document.getElementById('micBtn');
  if (micBtn && !micBtn.querySelector('svg')) {
    micBtn.prepend(createIcon('mic', 16));
  }
  const playBtn = document.getElementById('uv-play');

  // ---- modo inmersivo / auto-hide ---------------------------------------
  const immersiveTargets = [panel, dock, document.querySelector('.uv-transport'), document.querySelector('.uv-topbar')].filter(Boolean);
  let idleTimer = null;
  let immersive = false;
  let hideHintShown = false;
  const holdUI = new URLSearchParams(window.location.search).has('uihold');

  function isEditing() {
    const el = document.activeElement;
    if (!el) return false;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable;
  }

  function isHoveringUI() {
    return immersiveTargets.some((el) => el.matches(':hover'));
  }

  function scheduleIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    if (immersive || isEditing() || holdUI) return;
    idleTimer = setTimeout(() => {
      if (isHoveringUI() || isEditing()) {
        scheduleIdle();
        return;
      }
      setImmersive(true, true);
    }, 4200);
  }

  function setImmersive(hidden, automatic = false) {
    immersive = !!hidden;
    document.body.classList.toggle('uv-immersive', immersive);
    for (const el of immersiveTargets) {
      if (el === panel) continue;
      try { el.inert = immersive; } catch { /* noop */ }
      el.setAttribute('aria-hidden', String(immersive));
    }
    syncPanelInert();
    const btn = document.getElementById('uv-panel-btn');
    if (btn) btn.setAttribute('aria-expanded', String(!immersive));
    if (immersive) {
      if (idleTimer) clearTimeout(idleTimer);
      exploreMenu && (exploreMenu.hidden = true);
      if (automatic && !hideHintShown) {
        hideHintShown = true;
        showToast('Interfaz oculta · mové el mouse o tocá para volver', 2600);
      }
    } else {
      scheduleIdle();
    }
  }

  function revealInterface() {
    if (immersive) setImmersive(false);
    else scheduleIdle();
  }

  for (const el of immersiveTargets) {
    el.addEventListener('pointerenter', () => {
      if (idleTimer) clearTimeout(idleTimer);
    });
    el.addEventListener('pointerleave', () => scheduleIdle());
  }
  for (const evt of ['pointermove', 'pointerdown', 'wheel', 'touchstart']) {
    window.addEventListener(evt, revealInterface, { passive: true });
  }
  window.addEventListener('keydown', (event) => {
    // H es el toggle de interfaz; no debe revelar y ocultar en el mismo evento.
    if (event.key === 'h' || event.key === 'H') return;
    revealInterface();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleIdle();
  });

  // ---- panel + pestañas --------------------------------------------------
  const paramsHost = document.getElementById('effect-params-host');
  const paramsFallback = document.getElementById('uv-params-fallback');
  const effectParams = createEffectParams(paramsHost, {
    emptyText: 'Este efecto no expone parámetros en vivo.'
  });
  const audioControls = createAudioControls(document.getElementById('audio-controls'));

  // ---- escenas: familias, generación y memoria ---------------------------
  const thumbnailStore = createThumbnailStore();
  const history = createHistory({ limit: 30, thumbnailStore });
  let storedMode = 'hybrid';
  try { storedMode = localStorage.getItem(MODE_KEY) || 'hybrid'; } catch { /* noop */ }
  const playlist = createPlaylist({
    mode: storedMode,
    scenes: getPresetScenes(),
    noRepeatWindow: 10,
    weights: { curated: 0.3, generated: 0.7 }
  });
  const scheduler = createSceneScheduler({
    playlist,
    intervalMs: state.interval * 1000,
    getAudio: () => getAudioFeatures(),
    onScene: (scene) => {
      if (scene) applyScene(scene, { record: true, silent: true });
    }
  });

  const sceneHost = document.createElement('section');
  sceneHost.id = 'uv-scene-controls-host';
  sceneHost.className = 'uv-scene-controls-host';
  if (paramsHost?.parentNode) paramsHost.parentNode.insertBefore(sceneHost, paramsHost);
  else panel.querySelector('.panel-body')?.appendChild(sceneHost);

  const sceneControls = createSceneControls(sceneHost, {
    isFamilyAvailable: (family) => family.renderer !== 'webgl' || gpuAvailable,
    getState: () => ({
      scene: safeScene(),
      mode: playlist.mode,
      history: history.list(),
      transitionType: state.transitionType,
      familyId: sceneFamilyId(safeScene()),
      variantId: safeScene()?.variant
    }),
    onTransitionChange: (type) => {
      state.transitionType = type;
      try { localStorage.setItem(TRANSITION_KEY, type); } catch { /* noop */ }
      showToast(type === 'auto' ? 'Transiciones automáticas' : `Transición: ${type}`);
    },
    onSelect: ({ familyId, variantId }) => {
      const resolved = resolveVariant(familyId, variantId);
      if (!resolved) return;
      if (resolved.family.renderer === 'webgl' && !gpuAvailable) {
        showToast('WebGL 2 no disponible en este navegador');
        return;
      }
      const current = safeScene();
      applyScene(createScene({
        ...(current || {}),
        effect: resolved.effect,
        variant: variantId
      }), { transitionMs: 'auto' });
    },
    onModeChange: (mode) => {
      playlist.setMode(mode);
      try { localStorage.setItem(MODE_KEY, mode); } catch { /* noop */ }
      if (state.auto) startAuto();
      refreshSceneControls();
    },
    onGenerate: () => {
      const selection = sceneControls.getSelection();
      const scene = sampleScene({ familyId: selection.familyId, variantId: selection.variantId });
      applyScene(scene, { record: true });
      showToast('Escena generada');
    },
    onMutate: () => {
      const current = safeScene();
      if (!current) return;
      const scene = mutateScene(current, { allowVariantChange: true });
      applyScene(scene, { record: true });
      showToast('Escena mutada');
    },
    onSave: () => {
      const scene = safeScene();
      if (!scene) return;
      const fallback = scene.name || `${META[scene.effect]?.[0] || scene.effect} ${new Date().toLocaleDateString('es-AR')}`;
      const name = (prompt('Nombre de la escena:', fallback) || '').trim();
      if (!name) return;
      saveScene(name, scene);
      history.push({ ...scene, name });
      refreshPresetSources();
      renderPresets();
      refreshSceneControls();
      showToast(`Escena “${name}” guardada`);
    },
    onHistorySelect: (id) => {
      const entry = history.get(id);
      if (entry) applyScene(entry.scene, { silent: true });
    },
    onHistorySave: (id) => {
      const entry = history.get(id);
      if (!entry) return;
      const fallback = entry.scene.name || `${META[entry.scene.effect]?.[0] || entry.scene.effect} ${new Date().toLocaleDateString('es-AR')}`;
      const name = (prompt('Nombre del preset:', fallback) || '').trim();
      if (!name) return;
      const scene = history.promote(id, name);
      if (!scene) return;
      saveScene(name, scene);
      refreshPresetSources();
      renderPresets();
      showToast(`Preset “${name}” guardado`);
    }
  });

  function sceneFamilyId(scene) {
    return getFamilyForScene(scene);
  }

  function safeScene() {
    try { return getScene(); } catch { return null; }
  }

  function refreshSceneControls() {
    const scene = safeScene();
    sceneControls.refresh({
      scene,
      mode: playlist.mode,
      history: history.list(),
      transitionType: state.transitionType,
      familyId: sceneFamilyId(scene),
      variantId: scene?.variant
    });
  }

  function refreshPresetSources() {
    playlist.setScenes(getPresetScenes());
    refreshSceneControls();
  }

  function applyScene(scene, options = {}) {
    if (!scene) return null;
    if (!gpuAvailable && isEngineEffect(scene.effect)) {
      showToast('WebGL 2 no disponible en este navegador');
      return null;
    }
    const transitionOptions = {};
    if (options.transitionMs != null) transitionOptions.transitionMs = options.transitionMs;
    const overrideType = options.transitionType
      || (state.transitionType !== 'auto' ? state.transitionType : null);
    if (overrideType) transitionOptions.transitionType = overrideType;
    const applied = setScene(scene, transitionOptions);
    if (!applied) return null;
    state.current = applied.effect;
    if (thumbs) thumbs.highlight(applied.effect);
    if (options.record) history.push(applied);
    refreshEffectMeta();
    refreshSceneControls();
    return applied;
  }

  const tabButtons = [...panel.querySelectorAll('[data-uv-tab]')];
  const tabPanels = [...panel.querySelectorAll('[data-uv-panel]')];

  function openTab(name) {
    for (const btn of tabButtons) {
      const active = btn.dataset.uvTab === name;
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    }
    for (const body of tabPanels) body.hidden = body.dataset.uvPanel !== name;
    if (name === 'presets') renderPresets();
  }
  tabButtons.forEach((btn) => btn.addEventListener('click', () => openTab(btn.dataset.uvTab)));

  function syncPanelInert() {
    const hidden = immersive || panel.classList.contains('is-hidden');
    try { panel.inert = hidden; } catch { /* noop */ }
    panel.setAttribute('aria-hidden', String(hidden));
    document.body.classList.toggle('uv-panel-open', !hidden);
  }

  function setPanelOpen(open) {
    panel.classList.toggle('is-hidden', !open);
    const btn = document.getElementById('uv-panel-btn');
    if (btn) btn.setAttribute('aria-expanded', String(open));
    syncPanelInert();
  }
  document.getElementById('uv-panel-btn')?.addEventListener('click', () => {
    setPanelOpen(panel.classList.contains('is-hidden'));
  });
  panelToggle?.addEventListener('click', () => setPanelOpen(false));

  // ---- explorar ----------------------------------------------------------
  const exploreMenu = document.getElementById('uv-explore-menu');
  const exploreToggle = () => {
    if (!exploreMenu) return;
    const open = exploreMenu.hidden;
    exploreMenu.hidden = !open;
    exploreBtn?.setAttribute('aria-expanded', String(open));
  };
  exploreBtn?.addEventListener('click', (e) => { e.stopPropagation(); exploreToggle(); });
  document.addEventListener('click', () => {
    if (exploreMenu && !exploreMenu.hidden) {
      exploreMenu.hidden = true;
      exploreBtn?.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && exploreMenu && !exploreMenu.hidden) {
      exploreMenu.hidden = true;
      exploreBtn?.setAttribute('aria-expanded', 'false');
    }
  });
  exploreMenu?.querySelectorAll('[data-uv-tab-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setPanelOpen(true);
      openTab(btn.dataset.uvTabTarget);
      exploreMenu.hidden = true;
    });
  });

  // ---- thumbnails --------------------------------------------------------
  const thumbs = thumbsEl
    ? createThumbnails(thumbsEl, ALL, (name) => selectEffect(name), {
        labels: SHORT_LABELS,
        order: names,
        classicNames: getRetiredEffects()
      })
    : null;
  const countEl = document.getElementById('uv-effect-count');
  if (countEl) countEl.textContent = String(names.length);
  if (thumbs) thumbs.highlight(state.current);

  document.getElementById('uv-strip-prev')?.addEventListener('click', () => {
    thumbsEl?.scrollBy({ left: -260, behavior: 'smooth' });
  });
  document.getElementById('uv-strip-next')?.addEventListener('click', () => {
    thumbsEl?.scrollBy({ left: 260, behavior: 'smooth' });
  });

  // ---- selección de efecto ----------------------------------------------
  function selectEffect(name) {
    if (!ALL[name]) return;
    if (!gpuAvailable && isEngineEffect(name)) {
      showToast('WebGL 2 no disponible en este navegador');
      return;
    }
    changeEffect(name, state.transitionType !== 'auto'
      ? { transitionType: state.transitionType }
      : undefined);
    state.current = name;
    if (thumbs) thumbs.highlight(name);
    refreshEffectMeta();
    refreshSceneControls();
    if (state.auto) startAuto();
  }

  function selectByOffset(delta) {
    const i = names.indexOf(state.current);
    const next = names[(i + delta + names.length) % names.length];
    selectEffect(next);
  }

  function refreshEffectMeta() {
    const meta = META[state.current] || [state.current, '', '—'];
    const idx = names.indexOf(state.current);
    setText('uv-effect-index', `${pad2(idx + 1)} / ${pad2(names.length)}`);
    setText('uv-effect-title', meta[0]);
    setText('uv-effect-desc', meta[1]);
    setText('uv-info-family', meta[2]);
    setText('uv-info-renderer', isEngineEffect(state.current) ? 'WebGL 2' : 'p5 · Canvas 2D');
    if (effectParams) effectParams.refresh(state.current);
    if (paramsFallback) paramsFallback.hidden = isEngineEffect(state.current);
    refreshStats();
  }

  // ---- transporte --------------------------------------------------------
  document.getElementById('uv-prev')?.addEventListener('click', () => selectByOffset(-1));
  document.getElementById('uv-next')?.addEventListener('click', () => selectByOffset(1));

  function paintPause() {
    if (!playBtn) return;
    playBtn.replaceChildren(createIcon(state.paused ? 'play' : 'pause', 18));
    playBtn.setAttribute('aria-label', state.paused ? 'Reanudar' : 'Pausar');
    playBtn.classList.toggle('is-paused', state.paused);
    document.getElementById('uv-live')?.classList.toggle('is-paused', state.paused);
  }
  playBtn?.addEventListener('click', () => {
    state.paused = setVisualizerPaused(!state.paused);
    paintPause();
  });

  // ---- auto-transición ---------------------------------------------------
  const autoCheck = document.getElementById('autoTransition');
  const intervalInput = document.getElementById('transitionInterval');
  const intervalOut = document.getElementById('transitionIntervalValue');

  if (intervalInput) {
    intervalInput.value = String(state.interval);
    if (intervalOut) intervalOut.textContent = `${state.interval}s`;
    intervalInput.addEventListener('input', () => {
      state.interval = Number(intervalInput.value);
      if (intervalOut) intervalOut.textContent = `${state.interval}s`;
      try { localStorage.setItem(INTERVAL_KEY, String(state.interval)); } catch { /* noop */ }
      scheduler.setIntervalMs(state.interval * 1000);
      if (state.auto) startAuto();
    });
  }

  function startAuto() {
    scheduler.setIntervalMs(state.interval * 1000);
    scheduler.stop();
    if (playlist.mode === 'curated' && playlist.getState().scenes === 0) {
      // Sin repertorio curado, el modo curado no tiene de dónde elegir.
      startAutoTransition(state.interval * 1000, names, selectEffect);
      return;
    }
    scheduler.start();
  }

  function setAuto(enabled) {
    state.auto = enabled;
    if (autoCheck) autoCheck.checked = enabled;
    if (enabled) startAuto();
    else {
      scheduler.stop();
      stopAutoTransition();
    }
  }
  autoCheck?.addEventListener('change', () => setAuto(autoCheck.checked));

  // ---- audio -------------------------------------------------------------
  const spectrum = createSpectrum(document.getElementById('audio-spectrum'));
  spectrum.start();

  const micState = { on: false };
  function paintMic() {
    if (!micBtn) return;
    micBtn.classList.toggle('is-on', micState.on);
    micBtn.setAttribute('aria-pressed', String(micState.on));
    micBtn.closest('.uv-audio')?.classList.toggle('is-on', micState.on);
    const label = micBtn.querySelector('[data-uv-mic-label]');
    if (label) label.textContent = micState.on ? 'Mic ON' : 'Audio';
  }
  micBtn?.addEventListener('click', async () => {
    if (!micState.on) {
      try {
        await initAudio();
        micState.on = true;
        paintMic();
        showToast('Micrófono activo');
      } catch {
        micBtn.classList.add('is-error');
        setTimeout(() => micBtn.classList.remove('is-error'), 1200);
        showToast('No se pudo acceder al micrófono');
      }
    } else {
      await stopAudio();
      micState.on = false;
      paintMic();
    }
  });
  paintMic();

  // ---- lite --------------------------------------------------------------
  function paintLite() {
    const btn = document.getElementById('lite-mode-btn');
    if (!btn) return;
    const on = getLiteMode();
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
  }
  document.getElementById('lite-mode-btn')?.addEventListener('click', () => {
    setLiteMode(!getLiteMode());
    paintLite();
    showToast(`Modo lite ${getLiteMode() ? 'activo' : 'desactivado'}`);
    setTimeout(refreshStats, 700);
  });
  paintLite();

  // ---- presets -----------------------------------------------------------
  const presetName = document.getElementById('preset-name');
  const presetList = document.getElementById('preset-list');

  function currentPresetState() {
    const scene = safeScene();
    return {
      effect: state.current,
      interval: state.interval,
      audioEnabled: getAudioState().enabled,
      params: isEngineEffect(state.current) ? getEffectParameters() : null,
      scene
    };
  }

  function saveCurrentPreset() {
    const fallback = `${META[state.current]?.[0] || state.current} ${new Date().toLocaleDateString('es-AR')}`;
    const name = (presetName?.value || '').trim() || fallback;
    const created = savePreset(name, currentPresetState());
    if (!created) {
      showToast('No se pudo guardar el preset');
      return;
    }
    if (presetName) presetName.value = '';
    refreshPresetSources();
    renderPresets();
    showToast(`Preset “${created.name}” guardado`);
  }

  document.getElementById('preset-save')?.addEventListener('click', saveCurrentPreset);
  document.getElementById('uv-save-preset')?.addEventListener('click', () => {
    setPanelOpen(true);
    openTab('presets');
    presetName?.focus();
  });

  // ---- packs: exportar / importar repertorio -----------------------------
  const packTools = document.createElement('div');
  packTools.className = 'uv-preset-pack';
  const exportPackBtn = document.createElement('button');
  exportPackBtn.type = 'button';
  exportPackBtn.className = 'uv-btn uv-btn-quiet';
  exportPackBtn.id = 'uv-pack-export';
  exportPackBtn.textContent = 'Exportar pack';
  const importPackBtn = document.createElement('button');
  importPackBtn.type = 'button';
  importPackBtn.className = 'uv-btn uv-btn-quiet';
  importPackBtn.id = 'uv-pack-import';
  importPackBtn.textContent = 'Importar pack';
  const importFile = document.createElement('input');
  importFile.type = 'file';
  importFile.accept = 'application/json';
  importFile.hidden = true;
  importFile.id = 'uv-pack-file';
  packTools.append(exportPackBtn, importPackBtn, importFile);
  if (presetList?.parentNode) presetList.parentNode.insertBefore(packTools, presetList);

  exportPackBtn.addEventListener('click', () => {
    const scenes = getPresetScenes();
    if (scenes.length === 0) {
      showToast('Todavía no hay escenas para exportar');
      return;
    }
    const pack = exportPack(scenes, { name: 'Umbral Vision' });
    const blob = new Blob([serializePack(pack)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = url;
    a.download = `umbral-vision-pack-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Pack exportado (${scenes.length} escenas)`);
  });

  importPackBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = importPack(text, getPresetScenes().map((scene) => scene.id));
      result.scenes.forEach((scene, index) => {
        saveScene(scene.name || `Importada ${index + 1}`, scene);
      });
      refreshPresetSources();
      renderPresets();
      showToast(`Pack: ${result.added} agregadas · ${result.skipped} omitidas · ${result.failed} fallidas`);
    } catch (error) {
      console.error('No se pudo importar el pack:', error);
      showToast('No se pudo importar el pack');
    } finally {
      importFile.value = '';
    }
  });

  function renderPresets() {
    if (!presetList) return;
    presetList.replaceChildren();
    const presets = getPresets();
    if (presets.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'uv-preset-empty';
      empty.textContent = 'Todavía no hay presets. Guardá la configuración actual.';
      presetList.appendChild(empty);
      return;
    }
    for (const preset of presets) {
      const item = document.createElement('div');
      item.className = 'uv-preset-item';

      const load = document.createElement('button');
      load.type = 'button';
      load.className = 'uv-preset-load';
      const title = document.createElement('b');
      title.textContent = preset.name;
      const sub = document.createElement('span');
      const effectLabel = META[preset.state?.effect]?.[0] || preset.state?.effect || '—';
      sub.textContent = `${effectLabel} · ${shortDate(preset.createdAt)}`;
      load.append(title, sub);
      load.addEventListener('click', () => applyPreset(preset));

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'uv-btn uv-btn-icon uv-preset-delete';
      remove.setAttribute('aria-label', `Eliminar ${preset.name}`);
      remove.appendChild(createIcon('trash', 14));
      remove.addEventListener('click', () => {
        deletePreset(preset.id);
        refreshPresetSources();
        renderPresets();
        showToast('Preset eliminado');
      });

      item.append(load, remove);
      presetList.appendChild(item);
    }
  }

  function applyPreset(preset) {
    if (!preset || !preset.state) return;
    if (preset.state.scene) {
      applyScene(preset.state.scene, { silent: true });
    } else if (ALL[preset.state.effect]) {
      selectEffect(preset.state.effect);
      if (isEngineEffect(preset.state.effect) && preset.state.params) {
        setEffectParameters(preset.state.params);
        effectParams?.refresh(preset.state.effect);
      }
    }
    if (preset.state.interval) {
      state.interval = preset.state.interval;
      if (intervalInput) intervalInput.value = String(state.interval);
      if (intervalOut) intervalOut.textContent = `${state.interval}s`;
    }
    showToast(`Preset “${preset.name}” cargado`);
  }

  // ---- share / capture / fullscreen -------------------------------------
  document.getElementById('capture-btn')?.addEventListener('click', async () => {
    const ok = await downloadFrame();
    showToast(ok ? 'PNG descargado' : 'No se pudo capturar el frame');
  });

  document.getElementById('share-btn')?.addEventListener('click', async () => {
    const res = await copyShareURL({
      effect: state.current,
      interval: state.interval,
      audio: getAudioState().enabled,
      params: isEngineEffect(state.current) ? getEffectParameters() : null,
      scene: safeScene()
    });
    if (res.method === 'clipboard') showToast('URL copiada');
    else showToast('No se pudo copiar la URL');
  });

  document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  });
  document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('fullscreenBtn');
    if (btn) {
      btn.replaceChildren(createIcon(document.fullscreenElement ? 'collapse' : 'expand', 18));
      btn.setAttribute('aria-label', document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa');
    }
  });

  // ---- estado / métricas -------------------------------------------------
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function refreshStats() {
    const stats = getEngineStats();
    const engineActive = isEngineEffect(state.current);
    const counter = getFpsCounter();
    const fps = counter ? (counter.getAvg?.() || counter.getInstant?.() || 0) : 0;

    setText('uv-fps', `${Math.round(fps)} FPS`);
    setText('uv-backend', engineActive ? 'GPU' : 'P5');
    setText('uv-info-fps', stats ? `${stats.fps.toFixed(1)}` : Math.round(fps).toString());
    if (engineActive && stats) {
      setText('uv-info-res', `${stats.width}×${stats.height}`);
      setText('uv-info-quality', stats.quality);
      setText('uv-info-particles', stats.activeParticles > 0 ? stats.activeParticles.toLocaleString('es-AR') : '—');
    } else {
      setText('uv-info-res', `${window.innerWidth}×${window.innerHeight}`);
      setText('uv-info-quality', getLiteMode() ? 'lite' : 'high');
      setText('uv-info-particles', '—');
    }
  }
  setInterval(refreshStats, 600);
  setInterval(() => audioControls.refresh(), 120);

  // ---- atajos ------------------------------------------------------------
  initKeyboard({
    selectByIndex: (index) => { if (names[index]) selectEffect(names[index]); },
    prevEffect: () => selectByOffset(-1),
    nextEffect: () => selectByOffset(1),
    toggleAuto: () => setAuto(!state.auto),
    toggleFullscreen: () => document.getElementById('fullscreenBtn')?.click(),
    toggleMic: () => micBtn?.click(),
    togglePanel: () => setImmersive(!immersive),
    toggleOnboarding: () => document.getElementById('onboarding')?.removeAttribute('hidden'),
    togglePause: () => playBtn?.click()
  });

  // ---- arranque ----------------------------------------------------------
  if (window.matchMedia && window.matchMedia('(max-width: 720px)').matches) {
    setPanelOpen(false);
  }
  setAuto(false);
  state.paused = isVisualizerPaused();
  paintPause();
  refreshEffectMeta();
  refreshSceneControls();
  openTab('params');
  syncPanelInert();
  if (!new URLSearchParams(window.location.search).has('nointro')) {
    initOnboarding({
      onFirstFrame: (cb) => requestAnimationFrame(() => requestAnimationFrame(cb))
    });
  }
  scheduleIdle();

  return {
    selectEffect,
    openTab,
    setImmersive,
    getState: () => ({ ...state, immersive }),
    refresh: refreshEffectMeta
  };
}

// Auto-init solo en el layout del studio (no interfiere con mountUI legado).
if (typeof window !== 'undefined' && document.getElementById('uv-dock') && !window.__UV_NO_AUTO_INIT__) {
  const start = () => {
    if (window.__UV_STUDIO_MOUNTED__) return;
    window.__UV_STUDIO_MOUNTED__ = true;
    mountStudioUI();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
