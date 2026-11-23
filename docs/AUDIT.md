# Auditoría técnica — Umbral Vision 0.3.3

Fecha: 2026-11-23

> **Estado actual:** slices 1–6 implementados en v0.5.0 (motor GPU, cuatro familias
> visuales y cross-fade). Este documento conserva el diagnóstico previo a la migración.

## 1. Resumen ejecutivo

Umbral Vision es hoy una **librería de efectos 2D sobre p5.js**. No existe un motor de
renderizado: cada efecto es una función que recibe un sketch de p5 y dibuja primitivas
(`ellipse`, `line`, `rect`) en un canvas 2D. La UI, los presets, el audio y el loop están
bien separados, pero el "motor visual" es implícito: no hay escena, cámara, materiales,
pipeline ni ciclo de vida más allá de un objeto con `draw()`.

El código está sano para lo que hace (15 efectos, 68 tests, modo lite, cleanup de audio),
pero su arquitectura **no soporta** el objetivo de un motor procedural GPU: no hay shaders,
no hay profundidad real, no hay buffers, no hay simulación, no hay composición
post-proceso, y el estado de cada efecto no es serializable ni parametrizable.

Conclusión: **no conviene reescribir**. Conviene añadir un motor WebGL 2 paralelo,
conectarlo al selector/UI existentes y mantener intactos los 15 efectos p5 como legado.

## 2. Arquitectura actual

```
src/
  index.js            API pública (re-exports + namespace default)
  Visualizer.js       dueño de la instancia p5 y del renderLoop
  Effects.js          registro de 15 factories p5 (1 archivo, 1013 líneas)
  AudioReactive.js    getUserMedia → AnalyserNode → level + FFT crudo
  Transition.js       setInterval para auto-transición
  Utils.js            helpers de inputs y matemática 2D
  app.js              app standalone legacy (DOM ids sueltos)
  perf/
    deviceProfile.js  heurística de hardware + lite mode (localStorage)
    renderLoop.js     rAF unificado (render + audio + fps)
    fpsCounter.js     FPS instantáneo, promedio, 1% low
    fpsCounterUI.js   widget Shift+F
    objectPool.js     pool de objetos JS
    inputCache.js     cache de inputs DOM
  ui/
    index.js          orquestador: monta panel, thumbnails, atajos, presets…
    panel.js          colapsar/expandir
    presets.js        CRUD en localStorage
    share.js          PNG + URL compartible
    thumbnails.js     previews 2D a 5fps
    keyboard.js       atajos
    audioIndicator.js indicador de nivel
    onboarding.js     overlay inicial
    toast.js          notificaciones
```

### Renderer actual

- **p5.js en modo 2D** (`sketch.createCanvas`, `colorMode(HSB)`, `ellipse`, `line`).
- Canvas único, DPR limitado a 1.5 desktop / 1.0 mobile.
- **No hay WebGL, ni shaders, ni framebuffers, ni cámara.**
- La profundidad es una ilusión: escala/tamaño/orden de dibujo. No hay z-buffer ni
  perspectiva.
- `Visualizer.js` crea p5 una sola vez y cambia la referencia `currentEffect`; el
  `sketch.draw` de p5 es un no-op y el trabajo real ocurre en `perf/renderLoop.js`.
  Esto genera **dos loops** de animación (p5 y rAF) aunque solo uno dibuje.

### Implementación de efectos

- Todos viven en `Effects.js` como `Effects.nombre(sketch) → { draw(config) }`.
- Estado mutable en clausuras (ángulos, arrays, tiempos).
- Parámetros leídos del DOM en cada frame con `getInputValue()` (acoplamiento UI↔motor).
- El audio se consulta llamando `getAudioState()` dentro de cada efecto.
- No hay `initialize/update/render/dispose/setParameters`, ni schema, ni seed.
- No hay transición real entre efectos: cambio instantáneo de referencia.

### Dependencias entre capas

```
ui/index.js ──> index.js ──> Visualizer.js ──> Effects.js ──> Utils.js
    │                │              │              └──────────> AudioReactive.js
    │                │              └──> perf/renderLoop.js ──> AudioReactive.js
    │                └──> AudioReactive.js / Transition.js / perf/*
    └──> ui/presets, share, thumbnails…
```

Problemas concretos:

1. `ui/index.js` importa `Effects` directamente para thumbnails y validación; el
   registro de efectos no es una abstracción.
2. Los efectos leen el DOM (`getInputValue`) en cada frame: no son testeables ni
   reutilizables fuera de la página del generador.
3. `Visualizer.js` conoce p5 y el recorrido del DOM (`#generator main`).
4. `share.js` captura el primer `<canvas>` de `#generator`: un canvas adicional rompería
   la captura PNG.
5. `setLiteMode()` persiste pero no notifica al motor; `setVisualizerConfig()` existe
   pero nadie lo llama.
6. `app.js` duplica lógica de UI que ya vive en `ui/index.js` (código legacy).

## 3. Rendimiento actual

- Costo dominante: **CPU** dibujando cientos/miles de primitivas 2D por frame
  (`tunnel` ~100 elipses, `spiral` 300 segmentos, `waves` 200 líneas…).
- `renderLoop` no limita frames por carga, solo por visibilidad (5 fps en background).
- `fpsCounter` mide delta entre frames (CPU/rAF), no tiempo de GPU.
- No hay control adaptativo de resolución ni presupuesto de frame.
- El modo lite solo reduce cantidad de elementos en 4 efectos y evita thumbnails.
- Fortalezas reutilizables: `fpsCounter`, `renderLoop`, `deviceProfile`, `objectPool`,
  `presets`, `share`, `toast`, `keyboard`.

## 4. Componentes reutilizables

| Componente | Reuso propuesto |
|---|---|
| `perf/fpsCounter.js` | métricas del nuevo motor |
| `perf/renderLoop.js` | se mantiene para efectos p5; el motor GPU tiene su loop |
| `perf/deviceProfile.js` | base de perfiles Lite/High/Ultra y adaptativo |
| `ui/*` | intactos: selector, presets, share, fullscreen, onboarding |
| `AudioReactive.js` | se extiende con bandas/RMS/beat sin romper API |
| `Effects.js` | legado p5 intacto |
| `Transition.js` | se mantiene; el motor añade blending propio después |

## 5. Limitaciones técnicas

1. **Sin GPU**: imposible simulación de partículas, SDF, ray marching, volumetría real.
2. **Sin post-proceso**: no hay bloom, tonemapping, feedback temporal ni HDR.
3. **Sin contrato de efecto**: no se pueden serializar parámetros ni hacer blending.
4. **Acoplamiento al DOM**: impide reutilizar efectos fuera del generador y testearlos.
5. **Un solo canvas**: mezclar p5 y WebGL requiere una capa y selección de canvas visible.
6. **Sin presupuesto de rendimiento**: no hay degradación automática por carga.
7. **Sin determinismo**: casi todo usa `Math.random()` directo.
8. **Sin documentación visual**: no hay demo aislada que valide el motor.

## 6. Oportunidades de evolución

- Añadir un **motor WebGL 2** independiente de p5 y de la UI.
- Mantener p5 para los 15 efectos existentes (cero regresiones) y registrar los nuevos
  efectos GPU en el mismo selector mediante un **registro unificado**.
- Extender `AudioReactive` con un analizador rico (bandas, RMS, beat, smoothing) y
  exponerlo como features inmutables por frame.
- Introducir un **contrato de efecto** (`initialize/update/render/dispose/setParameters`)
  y un **schema de parámetros** con defaults, rangos y serialización.
- Añadir **pipeline de post-proceso** (HDR, bloom, tonemap, grano, viñeta) y
  **control adaptativo de resolución**.
- No migrar a TypeScript/Vite de golpe: el paquete se publica con esbuild + JS.
  El motor nuevo se escribe en ES modules con JSDoc; la migración a TS/Vite queda como
  fase posterior, una vez validado el motor.

## 7. Propuesta de migración incremental

**Regla:** cada slice deja el paquete ejecutable, testeado y publicado-compatible.

| Slice | Entrega | Riesgo | Validación |
|---|---|---|---|
| 0 | Auditoría + docs (este documento) | nulo | revisión |
| 1 | Renderer WebGL 2, canvas, resize, loop, métricas, perfiles | bajo | demo mínima |
| 2 | Sistema de shaders, noise/curl GLSL, uniforms, quad/instancing | bajo | tests CPU + demo |
| 3 | Fluid Fields: partículas GPU, ping-pong FBO, curl noise, render | medio | captura + FPS |
| 4 | Composición: HDR, bloom, tonemap, profundidad, cámara | medio | captura |
| 5 | Audio: bandas, RMS, beat, mapeo a simulación | bajo | features testeadas |
| 6 | Contrato de efectos, registro, blending/transición, más familias | medio | tests |
| 7 | Integración UI: selector, presets, share/capture, lite | medio | tests + demo |
| 8 | (Futuro) Organic Structures, Mathematical Forms, Temporal | alto | — |

**No se elimina ni reescribe nada existente.** El motor nuevo se activa solo para los
efectos registrados en él; el resto sigue usando p5.

## 8. Criterios para considerar exitoso el Slice 3–5

- [ ] `fluidFields` visible en el selector junto a los 15 efectos actuales.
- [ ] Simulación de partículas en GPU (ping-pong FBO), no en CPU.
- [ ] Superficie coherente (membrana/torus orgánico), no nube aleatoria.
- [ ] Movimiento continuo y estable con `dt` variable.
- [ ] Bloom + tonemap + profundidad.
- [ ] Audio modifica velocidad, amplitud, tamaño y brillo (bandas + beat).
- [ ] Parámetros modificables en runtime vía API y sliders de demo.
- [ ] Recursos liberados en `dispose`; cambio de efecto sin leak.
- [ ] Presets, share, PNG, fullscreen, auto-transición y modo lite intactos.
- [ ] `npm test`, `npm run lint` y `npm run build` verdes con Node 26.
