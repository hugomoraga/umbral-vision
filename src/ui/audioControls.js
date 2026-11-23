/**
 * AudioControls — controles de reacción musical.
 *
 * Solo expone los parámetros que tiene sentido tocar en vivo. El resto
 * (thresholds, spring/damping, rangos de frecuencia) vive en audio-map.json.
 */

import { createIcon } from './icons.js';
import { getAudioMap, setAudioOverride, resetAudioOverrides } from '../audio/audioConfig.js';
import { getAudioFeatures } from '../AudioReactive.js';

const SLIDERS = [
  { label: 'Kick', path: 'kick.depth', min: 0, max: 1.5, step: 0.01, digits: 2 },
  { label: 'Retumbe', path: 'kick.decaySec', min: 0.4, max: 2.5, step: 0.05, digits: 2 },
  { label: 'Sensibilidad', path: 'kick.sensitivity', min: 0.2, max: 3, step: 0.05, digits: 2 },
  { label: 'Torsión', path: 'midFlow.twist', min: 0, max: 0.6, step: 0.01, digits: 2 },
  { label: 'Shimmer', path: 'highShimmer.porosity', min: 0, max: 1.5, step: 0.01, digits: 2 },
  { label: 'Volumen', path: 'volume.exposure', min: 0, max: 0.8, step: 0.01, digits: 2 },
  { label: 'Dinámica', path: 'dynamics.autoGain', min: 0, max: 1, step: 0.01, digits: 2 }
];

function getPath(object, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), object);
}

export function createAudioControls(root) {
  if (!root) return { refresh() {} };

  const card = document.createElement('section');
  card.className = 'uv-audio-panel';

  const head = document.createElement('div');
  head.className = 'uv-audio-head';
  head.append(createIcon('wave', 14));
  const title = document.createElement('span');
  title.textContent = 'Audio reactivo';
  head.appendChild(title);

  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'uv-btn uv-btn-icon';
  reset.title = 'Reiniciar audio';
  reset.setAttribute('aria-label', 'Reiniciar audio');
  reset.appendChild(createIcon('reset', 14));
  reset.addEventListener('click', () => {
    resetAudioOverrides();
    rebuild();
  });
  head.appendChild(reset);
  card.appendChild(head);

  const body = document.createElement('div');
  body.className = 'uv-audio-body';
  card.appendChild(body);

  function selectRow(labelText, options, value, onChange) {
    const row = document.createElement('div');
    row.className = 'uv-param-row uv-audio-row';
    const label = document.createElement('label');
    label.textContent = labelText;
    const select = document.createElement('select');
    select.className = 'uv-select';
    for (const [valueKey, text] of options) {
      const option = document.createElement('option');
      option.value = valueKey;
      option.textContent = text;
      if (valueKey === value) option.selected = true;
      select.appendChild(option);
    }
    select.addEventListener('change', () => onChange(select.value));
    row.append(label, select);
    body.appendChild(row);
    return select;
  }

  function sliderRow(desc, current) {
    const row = document.createElement('div');
    row.className = 'uv-param-row';

    const label = document.createElement('label');
    label.textContent = desc.label;

    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(desc.min);
    input.max = String(desc.max);
    input.step = String(desc.step);
    input.value = String(current);

    const out = document.createElement('span');
    out.className = 'uv-param-value';
    out.textContent = Number(current).toFixed(desc.digits);

    const paint = () => {
      const pct = ((Number(input.value) - desc.min) / (desc.max - desc.min)) * 100;
      input.style.setProperty('--fill', `${pct}%`);
    };
    paint();

    input.addEventListener('input', () => {
      const value = Number(input.value);
      setAudioOverride(desc.path, value);
      out.textContent = value.toFixed(desc.digits);
      paint();
    });

    row.append(label, input, out);
    body.appendChild(row);
  }

  // BPM: auto/manual.
  const bpmRow = document.createElement('div');
  bpmRow.className = 'uv-param-row uv-audio-row';
  const bpmLabel = document.createElement('label');
  bpmLabel.textContent = 'BPM';
  const bpmWrap = document.createElement('span');
  bpmWrap.className = 'uv-bpm-wrap';
  const bpmInput = document.createElement('input');
  bpmInput.type = 'number';
  bpmInput.min = '60';
  bpmInput.max = '200';
  bpmInput.step = '1';
  bpmInput.className = 'uv-number';
  const autoBtn = document.createElement('button');
  autoBtn.type = 'button';
  autoBtn.className = 'uv-btn uv-btn-quiet';
  autoBtn.textContent = 'Auto';
  bpmWrap.append(bpmInput, autoBtn);
  bpmRow.append(bpmLabel, bpmWrap);
  body.appendChild(bpmRow);

  function paintBpm() {
    const current = getAudioMap().sync?.bpm;
    const auto = typeof current !== 'number';
    bpmInput.value = String(auto ? getAudioMap().sync?.fallbackBpm ?? 128 : current);
    bpmInput.disabled = auto;
    autoBtn.textContent = auto ? 'Auto' : 'Manual';
    autoBtn.classList.toggle('is-on', auto);
    autoBtn.setAttribute('aria-pressed', String(auto));
    autoBtn.title = auto ? 'BPM automático · click para fijar manual' : 'BPM manual · click para volver a automático';
  }

  bpmInput.addEventListener('change', () => {
    const value = Math.max(60, Math.min(200, Number(bpmInput.value) || 128));
    setAudioOverride('sync.bpm', value);
    paintBpm();
  });
  autoBtn.addEventListener('click', () => {
    const current = getAudioMap().sync?.bpm;
    if (typeof current === 'number') {
      setAudioOverride('sync.bpm', 'auto');
    } else {
      const detected = getAudioFeatures().bpm || getAudioMap().sync?.fallbackBpm || 128;
      setAudioOverride('sync.bpm', Math.round(detected));
    }
    paintBpm();
  });

  const status = document.createElement('div');
  status.className = 'uv-audio-status';
  const statusText = document.createElement('span');
  statusText.className = 'uv-audio-status-text';
  const phaseTrack = document.createElement('span');
  phaseTrack.className = 'uv-phase-track';
  const phaseFill = document.createElement('span');
  phaseFill.className = 'uv-phase-fill';
  phaseTrack.appendChild(phaseFill);
  const kickDot = document.createElement('span');
  kickDot.className = 'uv-kick-dot';
  status.append(kickDot, statusText, phaseTrack);
  card.appendChild(status);

  function rebuild() {
    body.replaceChildren();
    paintBpm();

    const currentMode = getAudioMap().sync?.mode || 'grid';
    selectRow('Sincronía', [
      ['grid', 'Grilla 4/4'],
      ['kick', 'Kick real'],
      ['off', 'Off']
    ], currentMode, (value) => setAudioOverride('sync.mode', value));

    // El BPM va después de sincronía.
    body.appendChild(bpmRow);

    for (const desc of SLIDERS) {
      sliderRow(desc, Number(getPath(getAudioMap(), desc.path) ?? desc.min));
    }
    paintBpm();
  }

  root.appendChild(card);
  rebuild();

  let lastStatusPaint = 0;
  function refresh() {
    const now = performance.now();
    if (now - lastStatusPaint < 120) return;
    lastStatusPaint = now;
    const f = getAudioFeatures();
    const modeLabel = f.syncMode === 'grid' ? '4/4' : f.syncMode === 'kick' ? 'kick' : 'off';
    const bpm = f.bpm ? Math.round(f.bpm) : '—';
    const conf = Math.round((f.tempoConfidence || 0) * 100);
    statusText.textContent = `${modeLabel} · ${bpm} BPM · ${conf}%`;
    phaseFill.style.width = `${Math.max(0, Math.min(1, f.beatPhase || 0)) * 100}%`;
    kickDot.style.transform = `scale(${1 + Math.min(1.4, f.kick || 0) * 0.9})`;
    kickDot.classList.toggle('is-hit', (f.kick || 0) > 0.35);
  }

  return { refresh, rebuild };
}
