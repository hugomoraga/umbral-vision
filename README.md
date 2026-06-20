# Umbral Vision

[![npm version](https://badge.fury.io/js/%40hugomoraga%2Fumbral-vision.svg)](https://www.npmjs.com/package/@kndl/umbral-vision)
[![CI](https://github.com/hugomoraga/umbral-vision/actions/workflows/ci.yml/badge.svg)](https://github.com/hugomoraga/umbral-vision/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework modular para generación de visuales psicodélicos en tiempo real con [p5.js](https://p5js.org/).

## Install

```bash
npm install @kndl/umbral-vision
```

> **Peer dependency**: este paquete requiere [`p5`](https://www.npmjs.com/package/p5) v1.x o v2.x. El consumidor debe proveerlo (típicamente vía CDN).

## Usage

### Browser (con bundler)

```javascript
import { startVisualizer, Effects } from '@kndl/umbral-vision';

// Iniciar visualizador con un efecto
startVisualizer('tunnel');

// Cambiar efecto
import { changeEffect } from '@kndl/umbral-vision';
changeEffect('spiral');
```

### Browser (sin bundler, con CDN)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.2/p5.min.js"></script>
<script type="module">
  import { startVisualizer } from 'https://cdn.jsdelivr.net/npm/@kndl/umbral-vision/dist/index.mjs';
  startVisualizer('tunnel');
</script>
```

### Activar reactividad al audio

```javascript
import { initAudio, getAudioState, stopAudio } from '@kndl/umbral-vision';

await initAudio();
const { enabled, level } = getAudioState();
stopAudio();
```

### Auto-transición

```javascript
import { startAutoTransition, stopAutoTransition, changeEffect } from '@kndl/umbral-vision';

startAutoTransition(10000, ['tunnel', 'spiral', 'mandala'], (effectName) => {
  changeEffect(effectName);
});
```

## API

### Visualizer

- `startVisualizer(effectName, container?)` — Inicia visualizador con un efecto
- `changeEffect(effectName)` — Cambia el efecto actual
- `getCurrentEffect()` — Obtiene el nombre del efecto activo
- `getAvailableEffects()` — Lista de efectos disponibles
- `stopVisualizer()` — Detiene y limpia el canvas

### AudioReactive

- `initAudio()` — Inicializa análisis de audio del micrófono (async)
- `stopAudio()` — Detiene análisis y libera recursos
- `getAudioState()` — Retorna `{ enabled, level }`
- `getFrequencyData()` — Retorna `Uint8Array` con datos FFT crudos

### Transition

- `startAutoTransition(intervalMs, effectNames[], onChange)` — Inicia transiciones automáticas
- `stopAutoTransition()` — Detiene transiciones
- `isAutoTransitionEnabled()` — Booleano

### Effects

- `Effects.tunnel(sketch)` — Túnel de elipses concéntricas
- `Effects.spiral(sketch)` — Espiral psicodélico con colores cambiantes
- `Effects.mandala(sketch)` — Mandala rotativo
- `Effects.particles(sketch)` — Partículas reactivas
- `Effects.waves(sketch)` — Olas de audio
- `Effects.fractal(sketch)` — Árbol fractal
- `Effects.matrix(sketch)` — Lluvia Matrix
- `Effects.glitch(sketch)` — Glitch art
- `Effects.melt(sketch)` — Efecto melt/drip
- `Effects.fractalGlitch(sketch)` — Fractal con glitches aleatorios
- `Effects.waveGlitch(sketch)` — Olas con bandas de glitch horizontales
- `Effects.sacredGeometry(sketch)` — Geometría sagrada (Flower of Life)
- `Effects.biomech(sketch)` — Biomechánico orgánico
- `Effects.dune(sketch)` — Dunas suaves
- `Effects.yinYang(sketch)` — Símbolo Yin-Yang audio-reactivo

## Peer Dependencies

- `p5`: `^1.0.0 || ^2.0.0`

## Browser support

- Chrome / Edge / Firefox / Safari evergreen (ES2022)
- Mobile Safari iOS 14+
- Chrome Android 90+

## License

MIT © 2026 hugomoraga

## Links

- [Repository](https://github.com/hugomoraga/umbral-vision)
- [Issues](https://github.com/hugomoraga/umbral-vision/issues)
- [Origin repo (kndl000)](https://github.com/hugomoraga/kndl000)
