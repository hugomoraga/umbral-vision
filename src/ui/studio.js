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
  getFpsCounter,
  getEngineStats,
  getEffectParameters,
  setEffectParameters,
  setVisualizerPaused,
  isVisualizerPaused
} from '../Visualizer.js';
import {
  initAudio,
  stopAudio,
  getAudioState
} from '../AudioReactive.js';
import { startAutoTransition, stopAutoTransition } from '../Transition.js';
import { getLiteMode, setLiteMode } from '../perf/deviceProfile.js';
import { createThumbnails } from './thumbnails.js';
import { createEffectParams } from './effectParams.js';
import { createAudioControls } from './audioControls.js';
import { createSpectrum } from './spectrum.js';
import { getPresets, savePreset, deletePreset } from './presets.js';
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

  const state = {
    current: initial,
    interval: shareParams.interval || Number(localStorage.getItem(INTERVAL_KEY)) || 10,
    auto: false,
    paused: false
  };

  startVisualizer(initial, document.querySelector('#generator main'));
  if (shareParams.params && isEngineEffect(initial)) {
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
        order: names
      })
    : null;
  const countEl = document.getElementById('uv-effect-count');
  if (countEl) countEl.textContent = String(names.length);
  if (thumbs) thumbs.highlight(initial);

  document.getElementById('uv-strip-prev')?.addEventListener('click', () => {
    thumbsEl?.scrollBy({ left: -260, behavior: 'smooth' });
  });
  document.getElementById('uv-strip-next')?.addEventListener('click', () => {
    thumbsEl?.scrollBy({ left: 260, behavior: 'smooth' });
  });

  // ---- selección de efecto ----------------------------------------------
  function selectEffect(name) {
    if (!ALL[name]) return;
    changeEffect(name);
    state.current = name;
    if (thumbs) thumbs.highlight(name);
    refreshEffectMeta();
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
      if (state.auto) startAuto();
    });
  }

  function startAuto() {
    startAutoTransition(state.interval * 1000, names, selectEffect);
  }

  function setAuto(enabled) {
    state.auto = enabled;
    if (autoCheck) autoCheck.checked = enabled;
    if (enabled) startAuto();
    else stopAutoTransition();
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
    return {
      effect: state.current,
      interval: state.interval,
      audioEnabled: getAudioState().enabled,
      params: isEngineEffect(state.current) ? getEffectParameters() : null
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
    renderPresets();
    showToast(`Preset “${created.name}” guardado`);
  }

  document.getElementById('preset-save')?.addEventListener('click', saveCurrentPreset);
  document.getElementById('uv-save-preset')?.addEventListener('click', () => {
    setPanelOpen(true);
    openTab('presets');
    presetName?.focus();
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
        renderPresets();
        showToast('Preset eliminado');
      });

      item.append(load, remove);
      presetList.appendChild(item);
    }
  }

  function applyPreset(preset) {
    if (!preset || !preset.state) return;
    if (ALL[preset.state.effect]) selectEffect(preset.state.effect);
    if (isEngineEffect(preset.state.effect) && preset.state.params) {
      setEffectParameters(preset.state.params);
      effectParams?.refresh(preset.state.effect);
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
      params: isEngineEffect(state.current) ? getEffectParameters() : null
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
  openTab('params');
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
