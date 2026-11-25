# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Sitio del Studio en `docs/`** con la UX/UI del host KNDL (layout
  `generator`, CSS `style.css` + `generator.css`, panel, transporte, dock,
  topbar) y los controles de escenas integrados. Publicado en GitHub Pages.
- **`npm run build:site`** (`esbuild.site.mjs`): bundlea `src/ui/studio.js` en
  `docs/assets/umbral-vision.js` y copia `audio-map.json`.
- **Genoma de escena v2** (`src/scene/Scene.js`): efecto, variante, seed,
  parámetros, paleta, post, drift y momento congelado. Serialización,
  validación, fingerprint determinista y codificación compacta para URLs.
- **Catálogo de familias y auditoría** (`src/scene/families.js`): 7 familias +
  Clásicos, variantes estructurales y decisión `keep`/`merge`/`refactor`/`retire`
  para los 19 efectos existentes.
- **Sampler, mutación y cruce** (`src/scene/sampler.js`) con restricciones por
  familia, PRNG determinista y linaje (`origin`/`parentId`).
- **Playlist híbrida** (`src/scene/playlist.js`): modos curado/generativo/híbrido,
  ventana de no repetición, peso de favoritos y cuantización al compás/frase.
- **Memoria de escenas** (`src/scene/history.js`, `storage.js`, `packs.js`):
  historial rodante, thumbnails en IndexedDB, captura retroactiva, promoción a
  preset y export/import de packs.
- **Audio fast/slow** por banda, forma de onda, AGC independiente y onsets por
  banda. Nuevas señales `bassFast`, `bassSlow`, `waveRms`, `transient`, etc.
- **Feedback global** en `PostPipeline` con zoom/rotación/warp/decay modulados
  por audio y memoria visual entre escenas.
- **Variantes de Fluid Fields**: `torus` y `ribbon`, además de `membrane`.
- **Controles de escena** en la Studio UI: familia/variante, modo, generar,
  mutar, guardar e historial.
- **TransitionDirector** (`src/scene/transitionDirector.js`): elige tipo
  (`dissolve`, `luma`, `zoom`, `wipe`, `feedback`), duración, easing y dirección
  según familias, backend y energía musical; evita repetir el último tipo.
- **Transiciones reales en `PostPipeline`**: zoom-through, barrido direccional
  con ruido y mezcla por luminancia, además del feedback boost.
- **Cross-fade unificado p5 ↔ GPU y p5 ↔ p5** con overlay 2D del canvas visible
  (`src/ui/backendTransition.js`); las variantes GPU también hacen cross-fade.
- **Selector de transición** (Auto / Disolver / Luz / Zoom / Barrido / Feedback)
  y **export/import de packs** de escenas en la pestaña Presets.

### Verified
- Benchmark GPU con Chrome headless + SwiftShader (software), Fluid Fields:
  - `high`: feedback on ≈287 ms/frame vs off ≈285 ms/frame (~1% de overhead).
  - `lite`: feedback on ≈298 ms/frame vs off ≈288 ms/frame (~3.5%).
  - Sampler: 1.000 escenas ≈32–35 ms; 500 mutaciones ≈13–17 ms.
- Smoke: WebGL 2 activo, pérdida/restauración de contexto sin errores, perfil
  `lite` aplicado en caliente, micrófono con fake device habilitando el pipeline
  de audio, y fallback p5 cuando WebGL 2 no está disponible.

### Changed
- Los presets migran de `{effect, interval, audioEnabled, params}` a un genoma
  v2 idempotente; `saveScene`/`promoteScene` conservan la seed y la variante.
- `setEffect()` sigue funcionando y ahora construye/actualiza una escena.
- `changeEffect()` usa transiciones de duración variable (`auto`).
- Los efectos retirados de la taxonomía quedan bajo **Clásicos** sin borrar
  código ni romper presets/enlaces.
- `audio-map.json` incorpora `agc` y `feedback`.

## [0.9.0] - 2026-11-23

### Added
- Modelo de audio físico extendido a **Fluid Fields**, **Mathematical Forms** y
  **Temporal Veil** (Organic ya era el piloto): `AudioMotion` compartido con
  spring-damper + fase de flujo.
- Gains de audio por efecto en `audio-map.json → effects.<efecto>`.
- Impulso radial de kick en la simulación de partículas de Fluid Fields.
- Control de cámara/zoom/potencia/roll/warp/emisión por kick, body, mid y high en
  cada familia.

### Changed
- Fluid Fields dejó de usar bandas crudas para cámara y simulación.
- Los cuatro efectos consumen `bassBody`, `midFlow`, `highShimmer`, `kick`,
  `kickFlash` y `rms`, con envelopes lentos y señales de fase.

## [0.8.0] - 2026-11-23

### Added
- **Kick detector + tempo tracker**: onset en 35–120 Hz, refractario adaptativo,
  BPM por intervalos plegados y confianza. Modos `grid` (4/4), `kick` y `off`.
- **`src/audio/audio-map.json`**: fuente de verdad para todos los valores de
  reacción (kick, spring/damping, envelopes, twist, shimmer, volumen, dinámica).
  Overrides por `window.UV_AUDIO_MAP` y por la UI en localStorage.
- **Controles de audio** en el panel: sincronía, BPM auto/manual, kick, retumbe,
  sensibilidad, torsión, shimmer, volumen y dinámica, con BPM/fase/confianza en vivo.
- **Organic Structures pilot**: impulso físico spring-damper del kick, onda de
  kick viajera, respiración lenta de graves, torsión/ondas de medios y porosidad /
  micro-shimmer de agudos.
- Triggers visuales con latencia configurable (28 ms).
- Endurecimiento del análisis: `kickFlash` rápido para bloom, `kick` lento para cuerpo.

### Changed
- `getAudioFeatures()` agrega `bassBody`, `midFlow`, `highShimmer`, `kick`,
  `kickFlash`, `kickTrigger`, `kickOnset`, `bpm`, `beatPhase`, `tempoConfidence`.
- `getAudioState()` agrega `kick`, `bpm` y `mode`.
- El post-proceso modula bloom con el transiente rápido y exposición con volumen.

## [0.7.0] - 2026-11-23

### Added
- **Studio UI**: rediseño completo del generador (top bar, panel por tabs, dock de
  efectos, transporte, presets, info, modo inmersivo y responsive móvil).
- **Espectro de audio en vivo** con 42 barras logarítmicas coloreadas por banda y
  medidores B/M/A.
- **Auto-hide de interfaz** tras 4.2 s de inactividad; `H` alterna inmersivo.
- Pausa/reanudación del backend (`setVisualizerPaused`) y atajo `P`.
- Parámetros agrupados (Forma / Movimiento / Apariencia / Comportamiento).

### Changed
- **Análisis de audio reescrito**: FFT 2048, ganancia global (conserva la relación
  entre bandas), volumen RMS absoluto, spectral flux + beat, smoothing por `dt`.
- Mapeos por banda más fuertes y distintos en las cuatro familias GPU: graves →
  zoom/onda, medios → ondulación/roll, agudos → shimmer/detalle, RMS/beat → glow.
- El post-proceso modula exposición y bloom con RMS/beat.
- `tickAudio(dt)` recibe el delta del loop; `level` ahora mezcla RMS y bandas.

### Fixed
- La normalización por banda aplanaba graves/medios/agudos y hacía que la reacción
  pareciera estática.
- `H` se revelaba y ocultaba en el mismo evento por competencia de handlers.

## [0.6.0] - 2026-11-23

### Added
- **Panel genérico de parámetros** en la UI del generador: se construye desde el
  schema del efecto GPU activo, usa las clases existentes del panel y permite
  editar todos los parámetros en vivo + reiniciar defaults + nueva seed.
- Los parámetros se **conservan por efecto** al cambiar y volver.
- **Parámetros compartibles por URL**: `?effect=fluidFields&p={...}`; se restauran
  al cargar. JSON inválido se ignora.
- Presets de efectos p5 ya no guardan parámetros GPU obsoletos.

## [0.5.2] - 2026-11-23

### Fixed
- Los thumbnails no seleccionados aparecían negros (parecían rotos). Ahora se
  dibuja un frame estático de cada efecto al crear la grilla; el preview en vivo
  sigue reservado al efecto activo.

## [0.5.1] - 2026-11-23

### Fixed
- Al cambiar a un efecto p5 durante un cross-fade GPU, el efecto saliente queda
  congelado y retiene recursos. `hide()` ahora cancela la transición y libera el
  efecto saliente.

## [0.5.0] - 2026-11-23

### Added
- **Organic Structures** (`organicStructures`): mesh paramétrico (torus knot) con
  displacement en vertex shader, venas procedurales, Fresnel y capas translúcidas.
- **Mathematical Forms** (`mathematicalForms`): Mandelbulb raymarched en GLSL con
  SDF, normales por gradiente, oclusión aproximada y glow volumétrico.
- **Temporal Veil** (`temporalVeil`): feedback de framebuffer ping-pong, zoom/rotación
  y distorsión del frame anterior, acumulación temporal y estelas.
- **Cross-fade entre efectos GPU**: `setEffect(name, params, { transitionMs })`,
  mezcla de ambos scene targets antes del bloom; easing smoothstep.
- `engine.transitioning` y progreso en `getEngineStats()`.
- Previews 2D para las cuatro familias en thumbnails.
- Tests de geometría procedural, normales, determinismo y registro (100 tests).
- Capturas y métricas de las cuatro familias + cross-fade.

### Changed
- El selector y la auto-transición alternan las cuatro familias GPU.
- Cambiar entre efectos GPU hace cross-fade de 1 s; p5↔GPU sigue siendo instantáneo
  y GPU→GPU solo transiciona si el motor estaba visible.

## [0.4.0] - 2026-11-23

### Added
- **Motor de renderizado GPU WebGL 2** (`src/engine/`): renderer, programas,
  render targets HDR, post-proceso y perfiles de calidad.
- **Fluid Fields** (`fluidFields`): membrana de partículas simulada en GPU con
  curl noise, domain warping, spring-to-surface, cámara con profundidad y bloom.
- Pipeline de post-proceso: bright pass, blur multi-mip, tonemap ACES, viñeta,
  grano y aberración cromática.
- **Audio features** enriquecidas: bandas bass/mid/high, RMS, energía y beat
  detection con smoothing (`getAudioFeatures()`). FFT 1024.
- Contrato de efectos (`initialize/update/render/dispose/setParameters`) y schema
  de parámetros serializable.
- Perfiles `lite` / `high` / `ultra` y resolución adaptativa.
- API pública: `createEngine`, `ENGINE_EFFECTS`, `setEffectParameters`,
  `getEffectParameters`, `getEffectSchema`, `getEngineStats`, `setEngineQuality`.
- Presets guardan parámetros del motor (compatibles con presets previos).
- Demos `examples/fluid.html` y `examples/bench.html`; auditoría y arquitectura
  en `docs/AUDIT.md` y `docs/ENGINE.md`.

### Changed
- `getAvailableEffects()` incluye efectos GPU; el selector/thumbnails/auto-transición
  usan el catálogo unificado.
- Captura PNG elige el canvas visible (soporta p5 + WebGL simultáneos).
- `setLiteMode()` notifica en caliente al motor GPU.
- `stopAudio()` resetea las features del motor.

### Preserved
- Los 15 efectos p5, la UI, presets, share URL, fullscreen y auto-transición siguen
  funcionando sin cambios.

## [0.1.0] - 2026-06-20

### Added
- Initial extraction from `hugomoraga/kndl000` (`assets/js/umbral-vision/`)
- 11 visual effects: tunnel, spiral, mandala, particles, waves, fractal, matrix, glitch, melt, biomech, dune
- Audio-reactive analysis (microphone via Web Audio API)
- Auto-transition system between effects
- Modular ES6 API (Visualizer, AudioReactive, Transition, Utils)
- p5.js as peer dependency (`^1.0.0 || ^2.0.0`)
