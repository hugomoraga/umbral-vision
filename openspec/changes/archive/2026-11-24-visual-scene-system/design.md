# Design

## Context

Ver `proposal.md` para la motivación. El estado actual relevante:

- 4 efectos GPU con contrato `Effect` (`update`/`render`/`getPostParams`) y un `UmbralEngine` que ya soporta cross-fade de dos escenas antes del bloom.
- 15 efectos p5 en `src/Effects.js`, sin contrato de parámetros ni variantes; comparten `getAudioState()` y paletas hardcodeadas.
- Presets en `localStorage` con `{ effect, interval, audioEnabled, params }`; la seed vive dentro de `params` y `UmbralEngine.setEffect()` la restaura al volver a un efecto.
- Playlist secuencial por `setInterval` en `Transition.js`; transición fija de 1000 ms.
- Audio con FFT, kick, BPM y envolventes lentas; no hay forma de onda ni normalización por banda.
- `TemporalVeil` ya implementa feedback ping-pong, pero es un efecto aislado y no una etapa compartida.

## Goals / Non-Goals

**Goals:**

- Un modelo de escena reproducible que unifique presets, generación y share.
- Una taxonomía de familias con variantes estructurales, sin romper los 19 efectos actuales.
- Generación y mutación que exploren dentro de una gramática, no ruido.
- Playlist híbrida con transiciones musicales y memoria visual.
- Historial que evite perder escenas buenas.
- Reacción al audio con señales rápidas/lentas y feedback acumulativo.

**Non-Goals:**

- No se reescribe el motor ni se migra a TypeScript/WebGPU en esta change.
- No se implementa un lenguaje de presets tipo MilkDrop (`per_frame`, `per_pixel`).
- No se elimina ningún efecto ni preset existente.
- No se agrega backend, cuentas ni sincronización en la nube.
- No se persiguen 130k presets: se prioriza variedad real por familia.

## Decisions

### 1. Taxonomía: 7 familias + Clásicos

La familia es la unidad estable de identidad; la variante es la gramática; la escena es la instancia. Se propone:

| Familia | Origen | Variantes iniciales |
|---|---|---|
| `fluidFields` | GPU actual | `membrane`, `torus`, `ribbon`, `smoke`, `swarm` |
| `organicStructures` | GPU actual | `knot`, `cell`, `coral`, `biomech` |
| `mathematicalForms` | GPU actual | `mandelbulb`, `knot`, `lattice`, `orb` |
| `temporalSystems` | GPU actual + feedback | `veil`, `echo`, `smear`, `tunnel` |
| `kineticGeometry` | p5 refactor | `tunnel`, `spiral`, `mandala`, `sacred`, `flower` |
| `wavesAndFields` | p5 refactor | `waves`, `glitch`, `dunes`, `interference` |
| `fractalGrowth` | p5 refactor | `tree`, `glitch`, `coral`, `tendril` |
| `classics` | p5 sin familia | efectos originales accesibles, sin promesa de evolución |

**Alternativa considerada:** dejar los 19 efectos como familias. Se descarta porque la mayoría son variantes de la misma idea y diluyen la identidad; además impide una gramática de generación coherente.

### 2. Auditoría de los 19 efectos

Ninguna decisión borra código. `retire` significa salir de la taxonomía principal y quedar en **Clásicos**.

| # | Efecto actual | Decisión | Destino / justificación |
|---|---|---|---|
| 1 | `fluidFields` | keep | Familia Fluid Fields. Técnica GPU propia y buena base de variantes. |
| 2 | `organicStructures` | keep | Familia Organic Structures. Mesh + Fresnel; buena silueta 3D. |
| 3 | `mathematicalForms` | keep | Familia Mathematical Forms. Raymarch + SDF; alto techo visual. |
| 4 | `temporalVeil` | refactor | Familia Temporal Systems y, además, base de la etapa de feedback global. |
| 5 | `tunnel` | refactor | Variante `tunnel` de Kinetic Geometry. |
| 6 | `spiral` | refactor | Variante `spiral` de Kinetic Geometry. |
| 7 | `mandala` | refactor | Variante `mandala` de Kinetic Geometry. |
| 8 | `particles` | merge | Variante `swarm` de Fluid Fields; el original queda en Clásicos. |
| 9 | `waves` | refactor | Variante `waves` de Waves & Fields. |
| 10 | `fractal` | refactor | Variante `tree` de Fractal Growth. |
| 11 | `matrix` | retire | Fuera de la taxonomía; queda en Clásicos por ser una referencia literal. |
| 12 | `glitch` | retire | No es una familia: su valor es post-proceso/transición. Queda en Clásicos. |
| 13 | `melt` | retire | Fuera de la taxonomía; queda en Clásicos. |
| 14 | `fractalGlitch` | merge | Variante `glitch` de Fractal Growth; duplicaba `fractal`. |
| 15 | `waveGlitch` | merge | Variante `glitch` de Waves & Fields; duplicaba `waves`. |
| 16 | `sacredGeometry` | merge | Variante `sacred` de Kinetic Geometry; casi idéntico a `mandala`. |
| 17 | `biomech` | refactor | Variante `biomech` de Organic Structures. |
| 18 | `dune` | merge | Variante `dunes` de Waves & Fields. |
| 19 | `yinYang` | retire | Símbolo único, no familia. Queda en Clásicos. |

Criterio de auditoría: técnica propia, potencial de variantes, calidad de la reacción al audio y costo de mantenimiento. La tabla es la fuente de verdad para la implementación.

### 3. Genoma de escena

```js
{
  schemaVersion: 2,
  id: 'sc_...',
  name: 'Nebulosa 3',
  createdAt: '...', updatedAt: '...',
  origin: 'manual' | 'generated' | 'mutated',
  parentId: null,
  effect: 'fluidFields',
  variant: 'membrane',
  seed: 84721,
  params: { /* validado contra el schema de la familia */ },
  palette: { mode: 'procedural', hue: 0.56, saturation: 0.9 },
  post: { bloom: 0.85, exposure: 0.98, vignette: 0.55, grain: 0.028, aberration: 0.014 },
  drift: { enabled: true, rates: { hue: 0.01, warp: 0.015 } },
  moment: { timeOffset: 0 } | null,
  tags: [], favorite: false
}
```

Decisiones:

- `seed` es de primer nivel, no un parámetro más: toda la reproducibilidad depende de ella.
- `variant` es explícito para que una escena no cambie de composición si la familia agrega variantes.
- `drift` separa "genoma" de "evolución en vivo"; `moment.timeOffset` congela un instante.
- Un preset es una escena con `origin: manual` y `drift` opcional. No hay dos modelos.
- Migración perezosa en lectura: los presets viejos se convierten en memoria y se reescriben con `schemaVersion: 2`; nunca se pierde el original hasta confirmar la escritura.

**Alternativa considerada:** guardar solo el estado actual de parámetros. Se descarta porque no permite linaje, mutación ni reconstruir una escena generada.

### 4. Sampler, mutación y linaje

- Cada familia declara un `SamplerSpec`: distribuciones por parámetro, correlaciones, elecciones categóricas (variante, paleta, look de post) y restricciones (contraste mínimo, saturación máxima, rango de warp, evidencia de que la escena no es negra).
- El sampler usa el PRNG determinista existente (`mulberry32`) y registra la seed efectiva.
- La mutación aplica deltas gaussianos acotados a 1–3 genes; por defecto conserva familia y variante. El cruce combina paleta de A con geometría de B.
- `origin` y `parentId` permiten mostrar el linaje y reconstruir un árbol de exploración.
- Restricción práctica: el sampler no renderiza para validar (sería caro); usa heurísticas de rango y de combinación. La validación visual por regresión queda para variantes, no para cada muestra.

**Alternativa considerada:** generación totalmente libre de parámetros. Se descarta porque produce escenas rotas o indistinguibles; la gramática por familia es la apuesta de valor.

### 5. Playlist y transiciones

- `Playlist` reemplaza `Transition.js` como máquina de estados: `current`, `queue`, `history`, `mode`, `weights`.
- Modos: `curated`, `generative`, `hybrid`. En `hybrid`, el peso inicial sugerido es 70% generadas/mutadas y 30% guardadas; los favoritos aumentan el peso como semilla.
- Ventana de no repetición configurable (inicial: 10 escenas). Si no hay elegibles, se relaja la ventana antes que repetir inmediatamente.
- Cuantización: si `bpm` y `beatPhase` son confiables, el cambio se agenda en el siguiente límite de compás (4 beats) o frase (8/16 beats). Sin BPM, intervalo de respaldo.
- Transición: duración aleatoria 1.5–4 s, easing variable y tipos seleccionables (`dissolve`, `feedback-smear`, `zoom-through`, `wipe`). El saliente se mantiene vivo hasta completar el blend.
- Retarget: si llega una nueva escena durante el blend, se resuelve el estado anterior y se inicia una transición desde el frame compuesto actual; nunca se dejan recursos huérfanos (el engine ya tiene el patrón `outgoing` + `transition`).

**Alternativa considerada:** cross-fade lineal de dos escenas (actual). Se descarta como única opción porque produce doble exposición; se conserva como `dissolve` y se agregan variantes con feedback.

### 6. Memoria de escenas

- Historial rodante de N=30 escenas en IndexedDB: genoma + timestamp + thumbnail.
- Thumbnails de 160–240 px en WebP/JPEG con calidad ~0.6 y LRU con tope de ~20 MB; nunca en `localStorage`.
- Captura retroactiva: "Guardar esta escena" toma el genoma actual (incluida la seed y el `timeOffset` si está congelada).
- Promoción: una entrada del historial se convierte en preset con nombre, favorito y `parentId` intacto.
- Export/import de packs JSON; merge por `id`, sin duplicados, con resumen de agregadas/omitidas/fallidas.
- Auto-captura desactivada por defecto. Si se habilita, solo marca candidatos; no guarda sin acción del usuario.

**Alternativa considerada:** guardar todo automáticamente. Se descarta porque llena la cuota y convierte el repertorio en basura.

### 7. Audio: fast/slow y feedback global

- Agregar `getByteTimeDomainData` para energía temporal y detección de transientes.
- Por banda: `fast` (ataque ~10–20 ms, release ~80–150 ms) y `slow` (envolventes actuales). `fast` para impulsos; `slow` para gestos.
- AGC por banda: pico independiente con decaimiento lento; evita que los graves aplasten medios/agudos.
- Onset por banda: flujo espectral + subida de energía temporal, con refractario.
- Etapa `FeedbackStage` compartida: escena A/B → mix de transición → feedback ping-pong (zoom, rotación, warp, decay driven by audio) → bloom/tonemap. El buffer de feedback sobrevive al cambio de escena, lo que da continuidad visual real.
- El feedback se limita con techo suave y clamp; `decay` y `zoom` tienen rangos seguros por familia para evitar lavado o negro.
- Toda la configuración nueva vive en `audio-map.json` (`feedback`, `fast`, `slow`, `agc`) y admite overrides en runtime.

**Alternativa considerada:** feedback por efecto. Se descarta como única vía porque no da continuidad entre escenas; se mantiene el feedback interno de `TemporalVeil` y se suma la etapa global.

### 8. Compatibilidad y APIs

- `setEffect(name, params, options)` sigue funcionando; internamente construye una escena con `variant` por defecto y `seed` de `params` si existe.
- Se agrega `setScene(scene)` y `getScene()` al engine.
- Los 15 efectos p5 siguen en `Effects` y en el catálogo; la UI los agrupa bajo **Clásicos**.
- Share URL: se mantiene el formato actual (`?effect=&p=`) para enlaces viejos; el genoma nuevo se agrega en un parámetro compacto (`s=`) con codificación URL-safe. Si la URL excede un largo razonable, se ofrece guardar como preset local en lugar de compartir.
- `schemaVersion` desconocida: no se carga, se informa y se conserva el dato original.

## Risks / Trade-offs

- **Scope creep** → slices verticales shippables; cada una deja el sistema funcionando y testeado.
- **Feedback que lava o ennegrece** → clamp, techo suave, rangos por familia y defaults conservadores.
- **Sampler produce escenas feas** → restricciones por familia, pesos por favoritos y posibilidad de bloquear genes.
- **Cuota de IndexedDB** → LRU, thumbnails pequeños, fallback a historial sin thumbnail.
- **Migración rompe presets** → migración idempotente, backup del original y tests de ida y vuelta.
- **Costo del feedback global** → targets reutilizados, resolución adaptable y perfil `lite` con feedback a media resolución.
- **Regresiones visuales** → goldens por variante con seed fija; el determinismo ya existe.
- **Subjetividad de "efecto pobre"** → la auditoría queda documentada y no borra código; el usuario puede revertir una decisión sin perder acceso.
- **URLs largas** → genoma compacto y fallback a preset local.

## Migration Plan

1. Introducir el genoma y la migración en lectura, sin cambiar la UI ni el render.
2. Verificar que todos los presets existentes cargan y que la share URL vieja sigue funcionando.
3. Activar la escritura en `schemaVersion: 2` solo después de validar la migración.
4. Rollback: el genoma conserva los campos originales; si una versión falla, se puede volver a leer el preset legado desde el backup local.

## Open Questions

- N exacto del historial y de la ventana de no repetición (se dejan configurables; defaults 30 y 10).
- Si los thumbnails se incluyen en los packs exportados por defecto o solo como opción.
- Qué tipos de transición entran en el primer slice además de `dissolve`.
- Si la paleta se modela como parámetros procedurales, como paletas nombradas o ambas; la propuesta es soportar ambas desde el inicio.
