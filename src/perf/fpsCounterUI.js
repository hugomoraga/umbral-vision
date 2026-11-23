/**
 * fpsCounterUI — widget minimalista que muestra FPS en una esquina.
 *
 * FR-013: visible cuando se activa (toggle desde panel). Métricas: instant, avg, 1% low.
 * ponytail: actualiza con throttling de 500ms (no cada frame) — la métrica visual no
 * necesita refresco de 60Hz.
 */

export function createFpsWidget(fpsCounter, container) {
  if (!fpsCounter || !container) return null;
  let timer = 0;
  const el = document.createElement('div');
  el.id = 'fps-widget';
  el.style.cssText = 'font-family:ui-monospace,monospace;font-size:11px;color:#0f0;background:rgba(0,0,0,0.6);padding:0.3rem 0.5rem;border-radius:4px;position:fixed;top:0.5rem;right:0.5rem;z-index:11;display:none;line-height:1.4;pointer-events:none;';
  container.appendChild(el);

  const render = () => {
    const inst = fpsCounter.getInstant().toFixed(0);
    const avg = fpsCounter.getAvg().toFixed(0);
    const low = fpsCounter.getLow1Percent().toFixed(0);
    const ms = fpsCounter.getFrameMs().toFixed(1);
    el.innerHTML = `FPS <b>${inst}</b> · avg ${avg} · 1% ${low}<br><span style="opacity:0.6">${ms} ms</span>`;
  };

  return {
    show() {
      el.style.display = 'block';
      render();
      if (!timer) timer = setInterval(render, 500);
    },
    hide() {
      el.style.display = 'none';
      if (timer) { clearInterval(timer); timer = 0; }
    },
    toggle() {
      if (el.style.display === 'none') this.show();
      else this.hide();
    }
  };
}
