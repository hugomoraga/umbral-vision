# Proposal

## Why

Umbral Vision tiene hoy 19 efectos heterogéneos: 4 familias GPU con técnicas sólidas y 15 efectos p5 que, en su mayoría, son variaciones simples de las mismas ideas (ondas, fractales, mandalas, túneles) con paletas y composiciones fijas. Al no existir un modelo de escena, cada efecto se percibe como "siempre el mismo", los presets guardan solo parámetros sueltos y la aleatoriedad no produce variedad real. Además, la playlist recorre los efectos en orden fijo y las transiciones no están cuantizadas ni comparten memoria visual. El resultado es una brecha frente a projectM/MilkDrop: menor impacto de la reacción al sonido, repetición percibida y pérdida de escenas buenas que aparecen una sola vez.

Ahora que el motor GPU y el análisis de audio están estables, es el momento de definir la capa de familias, escenas y reproducción antes de seguir agregando efectos. La apuesta de valor no es tener más efectos sueltos, sino una identidad visual estable (familias) con exploración generativa y memoria de lo creado.

## What Changes

- Definir una taxonomía de familias estable y auditar los 19 efectos actuales con una decisión explícita por efecto: **keep**, **merge**, **refactor** o **retire de la taxonomía** (sin borrar código existente).
- Introducir `variant` como eje de gramática visual dentro de cada familia, para que una familia pueda producir composiciones claramente distintas sin convertirse en efectos sueltos.
- Introducir un **genoma de escena** reproducible: `{ effect, variant, seed, params, palette, post, drift, schemaVersion }`.
- Migrar los presets existentes a escenas sin pérdida y extender share/export para reconstruir una escena exacta.
- Agregar generación de escenas: sampler restringido por familia, mutación y linaje a partir de presets guardados.
- Agregar una playlist híbrida (curado / generativo / híbrido) con selección ponderada, memoria de recientes y transiciones cuantizadas al beat.
- Agregar historial rodante de escenas con captura retroactiva ("guardar esta escena") para no perder hallazgos.
- Exponer señales de audio rápidas y lentas, y una capa de feedback global para que el audio mueva parámetros que se acumulan en el tiempo.
- **No BREAKING**: las APIs públicas actuales siguen funcionando. Los 15 efectos p5 se conservan accesibles como **Clásicos**, aunque salgan de la taxonomía principal de familias.

## Capabilities

### New Capabilities

- `visual-families`: taxonomía de familias, gramática de variantes y criterios de auditoría y refactor de efectos.
- `scene-model`: genoma de escena, presets reproducibles, versionado, migración y share/export.
- `scene-generation`: sampler restringido por familia, mutación y linaje de escenas.
- `scene-playback`: modos de playlist, selección ponderada, memoria de recientes y transiciones cuantizadas.
- `scene-memory`: historial rodante, thumbnails y captura/promoción de escenas.
- `audio-reactivity`: señales de audio fast/slow, mapeo a feedback y respuesta musical profunda.

### Modified Capabilities

Ninguna. El proyecto no tiene specs previas y esta change introduce la línea base de comportamiento.

## Impact

- `src/Effects.js` y `src/engine/effects/*`, `src/engine/shaders/*`: auditoría, variantes y feedback.
- `src/engine/registry.js`, `src/engine/UmbralEngine.js`, `src/Visualizer.js`: la escena pasa a ser la unidad de carga y transición.
- `src/ui/presets.js`, `src/ui/share.js`, `src/ui/studio.js`: genoma, historial, sampler y modos de reproducción.
- `src/Transition.js`: reemplazado por una playlist con cuantización musical.
- `src/AudioReactive.js`, `src/audio/audio-map.json`, `src/audio/motion.js`: señales fast/slow y nuevos mapeos.
- `openspec/specs/*`: nuevas capacidades de la línea base.
- Tests: unitarios de sampler, migración, playlist y regresión visual determinista por seed.
