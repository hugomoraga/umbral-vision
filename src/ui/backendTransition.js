/**
 * Cross-fade entre backends (p5 ↔ GPU y p5 ↔ p5).
 *
 * El motor GPU ya tiene su propio cross-fade interno. Cuando el cambio cruza
 * backends, o cuando p5 reemplaza un sketch por otro, congelamos el canvas
 * visible en un overlay 2D y lo desvanecemos sobre el nuevo backend. Así el
 * cambio nunca es un corte seco.
 */

export function shouldCrossfadeBackends(fromGpu, toGpu) {
  // GPU → GPU lo resuelve el PostPipeline del engine.
  return !(fromGpu && toGpu);
}

function removeNode(node) {
  if (!node) return;
  if (node.parentNode) node.parentNode.removeChild(node);
  else node.remove?.();
}

/**
 * @param {{
 *   source: HTMLCanvasElement|null,
 *   durationMs?:number,
 *   easing?:string,
 *   container?:HTMLElement,
 *   contextFactory?:(canvas:HTMLCanvasElement)=>CanvasRenderingContext2D|null,
 *   requestFrame?:(cb:()=>void)=>void,
 *   setTimeoutFn?:(cb:()=>void, ms:number)=>unknown
 * }} options
 */
export function createBackendCrossfade(options = {}) {
  const source = options.source;
  if (!source || !source.width || !source.height) return null;

  const container = options.container || document.body;
  const doc = container.ownerDocument || document;
  const durationMs = Math.max(0, Number(options.durationMs) || 0);
  const easing = options.easing || 'ease-in-out';
  const type = options.type || 'dissolve';

  let canvas;
  try {
    canvas = doc.createElement('canvas');
  } catch {
    return null;
  }
  canvas.width = source.width;
  canvas.height = source.height;
  canvas.className = 'uv-backend-crossfade';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '5';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '1';
  canvas.style.transformOrigin = 'center';
  canvas.style.willChange = 'opacity, transform, clip-path';
  canvas.style.transition = `opacity ${durationMs}ms ${easing}, transform ${durationMs}ms ${easing}, clip-path ${durationMs}ms ${easing}`;
  if (type === 'wipe') canvas.style.clipPath = 'inset(0 0 0 0)';

  let ctx;
  try {
    ctx = options.contextFactory
      ? options.contextFactory(canvas)
      : canvas.getContext('2d');
  } catch {
    ctx = null;
  }
  if (!ctx) return null;

  try {
    ctx.drawImage(source, 0, 0);
  } catch {
    removeNode(canvas);
    return null;
  }

  container.appendChild(canvas);

  const raf = options.requestFrame
    || (typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb) => setTimeout(cb, 16));
  const later = options.setTimeoutFn
    || (typeof setTimeout === 'function' ? setTimeout : (cb) => cb());

  let done = false;
  return {
    canvas,
    finish() {
      if (done) return;
      done = true;
      // Dos frames: aseguramos que el backend nuevo ya pintó debajo.
      raf(() => raf(() => {
        if (type === 'zoom') {
          canvas.style.transform = 'scale(1.08)';
          canvas.style.opacity = '0';
        } else if (type === 'wipe') {
          canvas.style.clipPath = 'inset(0 0 0 100%)';
        } else {
          canvas.style.opacity = '0';
        }
      }));
      later(() => removeNode(canvas), durationMs + 120);
    },
    cancel() {
      if (done) return;
      done = true;
      removeNode(canvas);
    }
  };
}
