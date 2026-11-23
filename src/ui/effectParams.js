/**
 * EffectParams — panel genérico de parámetros para efectos GPU.
 *
 * Construye los controles a partir del schema del efecto activo, usando las
 * mismas clases del panel existente (`.panel-row`, `.panel-section-label`).
 * No conoce detalles de ningún efecto: solo schema + get/set.
 */

import { isEngineEffect } from '../engine/registry.js';
import {
  getEffectSchema,
  getEffectParameters,
  setEffectParameters
} from '../Visualizer.js';

const SKIP_SLIDER = new Set(['seed']);

export function createEffectParams(root, { onChange = null } = {}) {
  if (!root) return { refresh() {}, destroy() {} };

  const list = document.createElement('div');
  list.id = 'effect-params-list';
  const actions = document.createElement('div');
  actions.className = 'panel-row';
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn';
  resetBtn.textContent = '↺ Reiniciar';
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
    row.className = 'panel-row';

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

    const out = document.createElement('span');
    out.className = 'panel-section-label';
    out.textContent = desc.type === 'int' ? String(value) : Number(value).toFixed(2);

    input.addEventListener('input', () => {
      const next = Number(input.value);
      setEffectParameters({ [name]: next });
      out.textContent = desc.type === 'int' ? String(next) : next.toFixed(2);
      emitChange();
    });

    row.append(label, input, out);
    return row;
  }

  function booleanRow(name, desc, value) {
    const row = document.createElement('div');
    row.className = 'panel-row';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `uv-param-${name}`;
    input.checked = !!value;
    const label = document.createElement('label');
    label.textContent = desc.label || name;
    label.htmlFor = input.id;
    input.addEventListener('change', () => {
      setEffectParameters({ [name]: input.checked });
      emitChange();
    });
    row.append(input, label);
    return row;
  }

  function seedRow(desc, value) {
    const row = document.createElement('div');
    row.className = 'panel-row';
    const label = document.createElement('label');
    label.textContent = desc.label || 'Seed';
    const display = document.createElement('span');
    display.className = 'panel-section-label';
    display.textContent = String(value);
    const dice = document.createElement('button');
    dice.type = 'button';
    dice.className = 'btn';
    dice.textContent = '🎲';
    dice.title = 'Nueva seed';
    dice.addEventListener('click', () => {
      const next = Math.floor(Math.random() * 100000);
      setEffectParameters({ seed: next });
      display.textContent = String(next);
      emitChange();
    });
    row.append(label, display, dice);
    return row;
  }

  function build() {
    list.innerHTML = '';
    schema = getEffectSchema();
    const params = getEffectParameters();

    for (const [name, desc] of Object.entries(schema)) {
      if (desc.type === 'boolean') {
        list.appendChild(booleanRow(name, desc, params[name] ?? desc.default));
      } else if (SKIP_SLIDER.has(name)) {
        list.appendChild(seedRow(desc, params[name] ?? desc.default));
      } else {
        list.appendChild(numberRow(name, desc, params[name] ?? desc.default));
      }
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
