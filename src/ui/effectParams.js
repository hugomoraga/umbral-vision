/**
 * EffectParams — panel genérico de parámetros para efectos GPU.
 *
 * Agrupa por `desc.group`, usa controles accesibles y no conoce ningún efecto
 * concreto: solo schema + get/set.
 */

import { isEngineEffect } from '../engine/registry.js';
import {
  getEffectSchema,
  getEffectParameters,
  setEffectParameters
} from '../Visualizer.js';
import { createIcon } from './icons.js';

const SKIP_SLIDER = new Set(['seed']);
const GROUP_ORDER = ['Forma', 'Movimiento', 'Apariencia', 'Comportamiento'];
const GROUP_ICONS = {
  Forma: 'cube',
  Movimiento: 'wave',
  Apariencia: 'circle',
  Comportamiento: 'sliders'
};

export function createEffectParams(root, { onChange = null, emptyText = null } = {}) {
  if (!root) return { refresh() {}, destroy() {} };

  const list = document.createElement('div');
  list.className = 'uv-params-list';
  list.id = 'effect-params-list';
  const actions = document.createElement('div');
  actions.className = 'uv-params-actions';
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'uv-btn uv-btn-quiet';
  resetBtn.append(createIcon('reset', 14), document.createTextNode('Reiniciar'));
  actions.appendChild(resetBtn);
  root.append(list, actions);
  root.hidden = true;

  let currentName = null;
  let schema = {};

  function emitChange() {
    if (onChange) onChange(getEffectParameters());
  }

  function numberRow(name, desc, value) {
    const row = document.createElement('div');
    row.className = 'uv-param-row';

    const label = document.createElement('label');
    label.textContent = desc.label || name;
    label.htmlFor = `uv-param-${name}`;

    const input = document.createElement('input');
    input.type = 'range';
    input.id = `uv-param-${name}`;
    input.min = String(desc.min ?? 0);
    input.max = String(desc.max ?? 1);
    input.step = desc.type === 'int' ? '1' : '0.01';
    input.value = String(value);
    if (name === 'hue') input.dataset.kind = 'hue';

    const paintFill = () => {
      const min = Number(input.min) || 0;
      const max = Number(input.max) || 1;
      const pct = max === min ? 0 : ((Number(input.value) - min) / (max - min)) * 100;
      input.style.setProperty('--fill', `${pct}%`);
    };
    paintFill();

    const out = document.createElement('span');
    out.className = 'uv-param-value';
    out.textContent = desc.type === 'int' ? String(value) : Number(value).toFixed(2);

    input.addEventListener('input', () => {
      const next = Number(input.value);
      setEffectParameters({ [name]: next });
      out.textContent = desc.type === 'int' ? String(next) : next.toFixed(2);
      paintFill();
      emitChange();
    });

    row.append(label, input, out);
    return row;
  }

  function booleanRow(name, desc, value) {
    const row = document.createElement('div');
    row.className = 'uv-param-row uv-param-toggle';
    const label = document.createElement('label');
    label.textContent = desc.label || name;
    label.htmlFor = `uv-param-${name}`;
    const wrap = document.createElement('span');
    wrap.className = 'uv-switch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `uv-param-${name}`;
    input.checked = !!value;
    const track = document.createElement('span');
    track.className = 'uv-switch-track';
    wrap.append(input, track);
    input.addEventListener('change', () => {
      setEffectParameters({ [name]: input.checked });
      emitChange();
    });
    row.append(label, wrap);
    return row;
  }

  function seedRow(desc, value) {
    const row = document.createElement('div');
    row.className = 'uv-param-row uv-param-seed';
    const label = document.createElement('label');
    label.textContent = desc.label || 'Seed';
    const display = document.createElement('span');
    display.className = 'uv-seed-value';
    display.textContent = String(value);
    const dice = document.createElement('button');
    dice.type = 'button';
    dice.className = 'uv-btn uv-btn-icon';
    dice.title = 'Nueva seed';
    dice.setAttribute('aria-label', 'Nueva seed');
    dice.appendChild(createIcon('dice', 15));
    dice.addEventListener('click', () => {
      const next = Math.floor(Math.random() * 100000);
      setEffectParameters({ seed: next });
      display.textContent = String(next);
      emitChange();
    });
    row.append(label, display, dice);
    return row;
  }

  function buildGroup(groupName, entries, params) {
    const group = document.createElement('section');
    group.className = 'uv-param-group';

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'uv-param-group-head';
    head.setAttribute('aria-expanded', 'true');
    head.append(createIcon(GROUP_ICONS[groupName] || 'sliders', 14));
    const title = document.createElement('span');
    title.textContent = groupName;
    head.appendChild(title);
    head.appendChild(createIcon('chevron', 14));

    const body = document.createElement('div');
    body.className = 'uv-param-group-body';

    for (const [name, desc] of entries) {
      if (desc.type === 'boolean') {
        body.appendChild(booleanRow(name, desc, params[name] ?? desc.default));
      } else if (SKIP_SLIDER.has(name)) {
        body.appendChild(seedRow(desc, params[name] ?? desc.default));
      } else {
        body.appendChild(numberRow(name, desc, params[name] ?? desc.default));
      }
    }

    head.addEventListener('click', () => {
      const open = head.getAttribute('aria-expanded') !== 'false';
      head.setAttribute('aria-expanded', String(!open));
      body.hidden = open;
    });

    group.append(head, body);
    return group;
  }

  function build() {
    list.innerHTML = '';
    schema = getEffectSchema();
    const params = getEffectParameters();
    const entries = Object.entries(schema);
    actions.hidden = entries.length === 0;

    if (entries.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'uv-params-empty';
      empty.textContent = emptyText || 'Este efecto no expone parámetros en vivo.';
      list.appendChild(empty);
      return;
    }

    const groups = new Map();
    for (const [name, desc] of entries) {
      const key = desc.group || 'Parámetros';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push([name, desc]);
    }

    const ordered = [...groups.keys()].sort((a, b) => {
      const ia = GROUP_ORDER.indexOf(a);
      const ib = GROUP_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

    for (const key of ordered) {
      list.appendChild(buildGroup(key, groups.get(key), params));
    }
  }

  resetBtn.addEventListener('click', () => {
    if (!currentName) return;
    const defaults = {};
    for (const [name, desc] of Object.entries(schema)) defaults[name] = desc.default;
    setEffectParameters(defaults);
    build();
    emitChange();
  });

  return {
    /** @param {string|null} effectName */
    refresh(effectName) {
      currentName = effectName;
      if (!effectName || !isEngineEffect(effectName)) {
        root.hidden = true;
        list.innerHTML = '';
        schema = {};
        return;
      }
      root.hidden = false;
      build();
    },
    getEffectName() {
      return currentName;
    },
    destroy() {
      root.hidden = true;
      list.innerHTML = '';
    }
  };
}
