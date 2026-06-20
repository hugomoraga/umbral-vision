/**
 * UI orchestrator — initializes all UI modules and wires them together.
 *
 * Exports `mountUI({ startVisualizer, changeEffect, ... })` that the host page
 * (kndl000's generator layout) calls once after p5 + the framework is loaded.
 */

import { Effects } from '../Effects.js';
import {
  startVisualizer,
  changeEffect,
  getCurrentEffect,
  initAudio,
  stopAudio,
  getAudioState,
  startAutoTransition,
  stopAutoTransition
} from '../index.js';
import { getFrequencyData } from '../AudioReactive.js';

import { createPanel } from './panel.js';
import { createThumbnails } from './thumbnails.js';
import { initKeyboard } from './keyboard.js';
import { initAudioIndicator } from './audioIndicator.js';
import {
  getPresets,
  savePreset,
  loadPreset
} from './presets.js';
import { initOnboarding } from './onboarding.js';
import { downloadFrame, copyShareURL, parseShareURL } from './share.js';
import { showToast, initToastListener } from './toast.js';

const DEFAULT_EFFECT = 'tunnel';

export function mountUI({ onFirstFrame = () => {}, skipOnboarding = false } = {}) {
  initToastListener();

  const panel = document.getElementById('panel');
  const thumbnailsEl = document.getElementById('thumbnails');
  const audioIndicatorEl = document.getElementById('audio-indicator');
  const micBtn = document.getElementById('micBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const autoCheck = document.getElementById('autoTransition');
  const intervalInput = document.getElementById('transitionInterval');
  const intervalValue = document.getElementById('transitionIntervalValue');
  const presetSelect = document.getElementById('preset-select');
  const presetSaveBtn = document.getElementById('preset-save');
  const shareBtn = document.getElementById('share-btn');
  const captureBtn = document.getElementById('capture-btn');
  const backLink = document.querySelector('.uv-back');

  const state = {
    autoTransitionEnabled: false,
    intervalSeconds: 10,
    currentEffect: DEFAULT_EFFECT
  };

  const shareParams = parseShareURL(window.location.search);
  if (shareParams.interval && Number.isFinite(shareParams.interval)) {
    state.intervalSeconds = Math.max(3, Math.min(30, shareParams.interval));
    if (intervalInput) intervalInput.value = String(state.intervalSeconds);
    if (intervalValue) intervalValue.textContent = `${state.intervalSeconds}s`;
  }

  startVisualizer(shareParams.effect || DEFAULT_EFFECT);
  state.currentEffect = getCurrentEffect();

  if (panel) createPanel(panel);

  const thumbs = thumbnailsEl
    ? createThumbnails(thumbnailsEl, Effects, (name) => selectEffect(name))
    : null;

  if (thumbs) thumbs.highlight(state.currentEffect);

  function selectEffect(name) {
    if (!Effects[name]) {
      showToast(`Efecto "${name}" no disponible, usando "${state.currentEffect}"`);
      name = state.currentEffect;
    }
    changeEffect(name);
    state.currentEffect = name;
    if (thumbs) thumbs.highlight(name);
    if (autoCheck?.checked) {
      startAutoTransition(state.intervalSeconds * 1000, Object.keys(Effects), selectEffect);
    }
  }

  function selectByIndex(idx) {
    if (!thumbs) return;
    const names = thumbs.getNames();
    if (idx >= 0 && idx < names.length) selectEffect(names[idx]);
  }

  function selectNext(delta) {
    if (!thumbs) return;
    const names = thumbs.getNames();
    const idx = names.indexOf(state.currentEffect);
    const next = (idx + delta + names.length) % names.length;
    selectEffect(names[next]);
  }

  function toggleAuto() {
    if (!autoCheck) return;
    autoCheck.checked = !autoCheck.checked;
    autoCheck.dispatchEvent(new Event('change'));
  }

  function toggleFullscreen() {
    const el = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  }

  async function toggleMic() {
    if (micBtn) micBtn.click();
  }

  function togglePanel() {
    panel?.querySelector('.panel-toggle')?.click();
  }

  function toggleOnboarding() {
    window.dispatchEvent(new CustomEvent('uv:onboarding-toggle'));
  }

  initKeyboard({
    selectByIndex,
    prevEffect: () => selectNext(-1),
    nextEffect: () => selectNext(1),
    toggleAuto,
    toggleFullscreen,
    toggleMic,
    togglePanel,
    toggleOnboarding
  });

  // Auto-transition
  if (autoCheck) {
    autoCheck.addEventListener('change', () => {
      state.autoTransitionEnabled = autoCheck.checked;
      if (state.autoTransitionEnabled) {
        startAutoTransition(state.intervalSeconds * 1000, Object.keys(Effects), selectEffect);
      } else {
        stopAutoTransition();
      }
    });
  }
  if (intervalInput) {
    intervalInput.addEventListener('input', () => {
      state.intervalSeconds = Number(intervalInput.value);
      if (intervalValue) intervalValue.textContent = `${state.intervalSeconds}s`;
      if (state.autoTransitionEnabled) {
        startAutoTransition(state.intervalSeconds * 1000, Object.keys(Effects), selectEffect);
      }
    });
  }

  // Microphone + indicator
  const indicator = audioIndicatorEl ? initAudioIndicator(audioIndicatorEl) : null;
  if (micBtn) {
    micBtn.addEventListener('click', async () => {
      const audio = getAudioState();
      if (!audio.enabled) {
        try {
          await initAudio();
          if (indicator) indicator.show();
          micBtn.textContent = '🎤 Mic: ON';
        } catch {
          micBtn.textContent = '🎤 Mic: Error';
        }
      } else {
        stopAudio();
        if (indicator) indicator.hide();
        micBtn.textContent = '🎤 Mic: OFF';
      }
    });
  }

  // Wire audio indicator into render loop (ponytail: shared rAF, no separate timer)
  wireAudioIndicator(indicator);

  // Fullscreen
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Presets
  if (presetSelect) populatePresetSelect(presetSelect);
  if (presetSelect) {
    presetSelect.addEventListener('change', () => {
      const id = presetSelect.value;
      if (!id || id === '__save__') return;
      const p = loadPreset(id);
      if (!p) return;
      state.intervalSeconds = p.state.interval || state.intervalSeconds;
      if (intervalInput) intervalInput.value = String(state.intervalSeconds);
      if (intervalValue) intervalValue.textContent = `${state.intervalSeconds}s`;
      if (p.state.effect && Effects[p.state.effect]) selectEffect(p.state.effect);
      showToast(`Preset "${p.name}" cargado`);
    });
  }
  if (presetSaveBtn) {
    presetSaveBtn.addEventListener('click', () => {
      const name = prompt('Nombre del preset:');
      if (!name) return;
      const created = savePreset(name, {
        effect: state.currentEffect,
        interval: state.intervalSeconds,
        audioEnabled: getAudioState().enabled
      });
      if (created) {
        populatePresetSelect(presetSelect);
        showToast(`Preset "${created.name}" guardado`);
      }
    });
  }

  // Share + capture
  if (captureBtn) {
    captureBtn.addEventListener('click', async () => {
      const ok = await downloadFrame();
      if (ok) showToast('PNG descargado');
      else showToast('No se pudo capturar el frame');
    });
  }
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const audio = getAudioState();
      const res = await copyShareURL({
        effect: state.currentEffect,
        interval: state.intervalSeconds,
        audio: audio.enabled
      });
      if (res.method === 'clipboard') {
        showToast('URL copiada al clipboard');
      } else {
        showToast('Clipboard no disponible');
        prompt('Copiá la URL manualmente:', res.url);
      }
    });
  }

  // Onboarding
  if (!skipOnboarding) {
    initOnboarding({ onFirstFrame });
  }
  window.addEventListener('uv:onboarding-toggle', () => {
    document.getElementById('onboarding')?.removeAttribute('hidden');
  });

  // Back link: stop fullscreen when leaving
  if (backLink) {
    backLink.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen?.();
    });
  }

  return {
    selectEffect,
    getState: () => ({ ...state })
  };
}

function populatePresetSelect(select) {
  if (!select) return;
  const previous = select.value;
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '— Presets —';
  select.appendChild(placeholder);
  const saveOpt = document.createElement('option');
  saveOpt.value = '__save__';
  saveOpt.textContent = '💾 Guardar actual…';
  select.appendChild(saveOpt);
  const presets = getPresets();
  for (const p of presets) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  }
  if (previous) select.value = previous;
}

function wireAudioIndicator(indicator) {
  if (!indicator) return;
  const tick = () => {
    const data = getFrequencyData();
    const audio = getAudioState();
    if (audio.enabled && data) {
      indicator.update(audio.level || 0, data);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Auto-init cuando se carga como módulo principal en la página del generador.
// ponytail: si el módulo se importa como librería (sin #panel en DOM),
// este bloque no hace nada gracias al guard.
// Si el host quiere tomar control manual, setea window.__UV_NO_AUTO_INIT__ = true
// antes de importar el módulo.
if (typeof window !== 'undefined'
    && !window.__UV_NO_AUTO_INIT__
    && document.getElementById('panel')) {
  const start = () => {
    if (window.__UV_MOUNTED__) return;
    window.__UV_MOUNTED__ = true;
    mountUI({
      onFirstFrame: (cb) => {
        requestAnimationFrame(() => requestAnimationFrame(cb));
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}
