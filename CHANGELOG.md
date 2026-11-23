# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
