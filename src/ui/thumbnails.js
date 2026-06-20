/**
 * Thumbnails — grid of previews for each effect.
 *
 * ponytail: las thumbnails renderizan a 5fps (no 60fps) usando
 * requestAnimationFrame compartido. En devices con deviceMemory < 4GB
 * caen a placeholder estático con el nombre (FR-013).
 */

const PREVIEW_FPS = 5;
const KEY_MAP = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];

const LABELS = {
  tunnel: 'Túnel',
  spiral: 'Espiral',
  mandala: 'Mándala',
  particles: 'Partículas',
  waves: 'Olas',
  fractal: 'Fractal',
  matrix: 'Matrix',
  glitch: 'Glitch',
  melt: 'Melt',
  fractalGlitch: 'Fractal Glitch',
  waveGlitch: 'Wave Glitch',
  sacredGeometry: 'Geometría Sagrada',
  biomech: 'Biomech',
  dune: 'Duna',
  yinYang: 'Yin Yang'
};

export function createThumbnails(container, effects, onSelect) {
  if (!container || !effects) return null;

  const names = Object.keys(effects).sort();
  const liteMode = isLiteRecommended();
  const buttons = new Map();

  for (const name of names) {
    const btn = document.createElement('button');
    btn.className = 'thumb';
    btn.type = 'button';
    btn.setAttribute('aria-label', LABELS[name] || name);
    btn.setAttribute('aria-pressed', 'false');
    btn.dataset.effectName = name;

    const key = KEY_MAP[buttons.size];
    if (key) {
      const kbd = document.createElement('span');
      kbd.className = 'thumb-key';
      kbd.textContent = key;
      btn.appendChild(kbd);
    }

    const label = document.createElement('span');
    label.className = 'thumb-label';
    label.textContent = LABELS[name] || name;
    btn.appendChild(label);

    if (!liteMode) {
      const preview = document.createElement('canvas');
      preview.width = 80;
      preview.height = 80;
      btn.appendChild(preview);
    }

    btn.addEventListener('click', () => onSelect?.(name));

    container.appendChild(btn);
    buttons.set(name, { btn, preview: btn.querySelector('canvas') });
  }

  let liveStop = null;
  let activeName = null;

  const startPreview = (name) => {
    stopPreview();
    activeName = name;
    const { preview } = buttons.get(name);
    if (!preview || !effects[name]) return;
    const sk = createPreviewSketch(preview);
    const fx = effects[name](sk);
    let last = 0;
    const interval = 1000 / PREVIEW_FPS;
    let raf = 0;
    const tick = (now) => {
      if (activeName !== name) return;
      if (now - last >= interval) {
        last = now;
        try { fx.draw(); } catch { return; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    liveStop = () => {
      activeName = null;
      cancelAnimationFrame(raf);
    };
  };

  const stopPreview = () => {
    if (liveStop) liveStop();
    liveStop = null;
  };

  const highlight = (name) => {
    for (const [n, { btn }] of buttons) {
      btn.setAttribute('aria-pressed', n === name ? 'true' : 'false');
    }
    startPreview(name);
  };

  return {
    highlight,
    stopPreview,
    getNames: () => names,
    getKey: (name) => {
      const idx = names.indexOf(name);
      return idx >= 0 && idx < KEY_MAP.length ? KEY_MAP[idx] : null;
    },
    destroy: () => {
      stopPreview();
      container.innerHTML = '';
    }
  };
}

/**
 * Stub mínimo de p5 sketch para que las factories no lancen.
 * ponytail: solo las primitivas que Effects dibuja en su primer frame.
 */
function createPreviewSketch(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const noop = () => {};

  const colorState = { mode: 'RGB', maxR: 255, maxG: 255, maxB: 255 };
  const fillState = { on: false, r: 0, g: 0, b: 0, a: 255 };

  return {
    width: w,
    height: h,
    background: (v, a) => {
      const alpha = typeof a === 'number' ? a : 255;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha / 255})`;
      ctx.fillRect(0, 0, w, h);
      void v;
    },
    noFill: () => { fillState.on = false; ctx.fillStyle = 'transparent'; },
    fill: (r, g, b, a) => {
      fillState.on = true;
      fillState.r = r; fillState.g = g; fillState.b = b;
      fillState.a = a ?? 255;
      ctx.fillStyle = rgbaFromMode(colorState, r, g, b, fillState.a);
    },
    stroke: (r, g, b, a) => {
      ctx.strokeStyle = rgbaFromMode(colorState, r, g, b, a ?? 255);
    },
    strokeWeight: (n) => { ctx.lineWidth = n; },
    colorMode: (mode, mr, mg, mb) => {
      colorState.mode = mode;
      colorState.maxR = mr ?? 255;
      colorState.maxG = mg ?? mr ?? 255;
      colorState.maxB = mb ?? mr ?? 255;
    },
    translate: (x, y) => { ctx.translate(x, y); },
    push: () => { ctx.save(); },
    pop: () => { ctx.restore(); },
    rotate: (a) => { ctx.rotate(a); },
    ellipse: (x, y, rw, rh) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rw / 2, rh / 2, 0, 0, Math.PI * 2);
      if (fillState.on) ctx.fill();
      ctx.stroke();
    },
    line: (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); },
    point: (x, y) => { ctx.fillRect(x, y, 1, 1); },
    rect: (x, y, rw, rh) => { ctx.strokeRect(x, y, rw, rh); if (fillState.on) ctx.fillRect(x, y, rw, rh); },
    beginShape: noop,
    endShape: noop,
    vertex: (x, y) => { ctx.lineTo(x, y); },
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    HSB: 'HSB',
    RGB: 'RGB',
    DEGREES: 'degrees',
    RADIANS: 'radians',
    createCanvas: noop
  };
}

function rgbaFromMode(cs, r, g, b, a) {
  const norm = (v, m) => (m === 255 ? v : (v / m) * 255);
  if (cs.mode === 'HSB') {
    return hsbaToRgba(r, g, b, a);
  }
  return `rgba(${norm(r, cs.maxR)}, ${norm(g, cs.maxG)}, ${norm(b, cs.maxB)}, ${a / 255})`;
}

function hsbaToRgba(h, s, b, a) {
  h = (h % 360 + 360) % 360 / 360;
  s = Math.min(1, Math.max(0, s / 100));
  const v = Math.min(1, Math.max(0, b / 100));
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r, g, bl;
  switch (i % 6) {
    case 0: r = v; g = t; bl = p; break;
    case 1: r = q; g = v; bl = p; break;
    case 2: r = p; g = v; bl = t; break;
    case 3: r = p; g = q; bl = v; break;
    case 4: r = t; g = p; bl = v; break;
    case 5: r = v; g = p; bl = q; break;
  }
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(bl * 255)}, ${a / 255})`;
}

function isLiteRecommended() {
  try {
    const mem = navigator.deviceMemory;
    if (typeof mem === 'number' && mem < 4) return true;
    const cores = navigator.hardwareConcurrency;
    if (typeof cores === 'number' && cores < 4) return true;
    const conn = navigator.connection;
    if (conn && conn.saveData) return true;
  } catch { /* noop */ }
  return false;
}
