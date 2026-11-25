# Tasks

## 1. Slice 1 — Genoma de escena y migración

- [x] 1.1 Crear el módulo de escena con schema `v2`, validación y helpers de serialización; verificar con tests de ida y vuelta que todos los campos se conservan.
- [x] 1.2 Adaptar `src/ui/presets.js` para leer presets legados, migrarlos de forma idempotente a escenas y conservar nombre, id, fecha y parámetros; verificar con tests de migración repetida.
- [x] 1.3 Extender `UmbralEngine` con `setScene()`/`getScene()` y hacer que `setEffect()` construya una escena compatible; verificar que la misma seed y `timeOffset` producen el mismo frame.
- [x] 1.4 Extender `src/ui/share.js` con un genoma compacto URL-safe y mantener compatibilidad con `?effect=&p=`; verificar con tests de build/parse para URLs viejas y nuevas.
- [x] 1.5 Documentar el genoma, la migración y la compatibilidad en `docs/ENGINE.md`; verificar que los ejemplos del documento funcionan con el código.

## 2. Slice 2 — Taxonomía de familias y variantes

- [x] 2.1 Crear el registro de familias y variantes con identificadores estables y validación (ninguna familia sin variantes); verificar con tests de catálogo inválido y válido.
- [x] 2.2 Clasificar los 19 efectos actuales con `keep`, `merge`, `refactor` o `retire`, y exponer la categoría **Clásicos**; verificar con un test que los 19 tienen decisión y siguen accesibles.
- [x] 2.3 Implementar dos variantes estructurales nuevas de Fluid Fields (`torus`, `ribbon`) con parámetros y goldens; verificar que difieren de `membrane` en el rasgo estructural declarado.
- [x] 2.4 Agregar a la Studio UI el selector de familia/variante y el badge de **Clásicos**; verificar con test de UI que el cambio de variante actualiza la escena activa.
- [x] 2.5 Documentar la tabla de familias y la auditoría en `docs/ENGINE.md`; verificar que cada familia listada tiene al menos una variante implementada o marcada como pendiente.

## 3. Slice 3 — Sampler, mutación y linaje

- [x] 3.1 Definir `SamplerSpec` por familia con distribuciones, correlaciones y restricciones estéticas; verificar que cien muestras por familia son válidas y están dentro de rango.
- [x] 3.2 Implementar el sampler determinista con seed y registro de la seed efectiva; verificar que la misma seed produce el mismo genoma.
- [x] 3.3 Implementar mutación y cruce con `origin`, `parentId` y conservación de familia/variante por defecto; verificar con tests de mutación y de cambio explícito de variante.
- [x] 3.4 Agregar acciones de generar, mutar y guardar en la Studio UI; verificar el flujo generar → guardar → aparece en presets y puede usarse como padre.
- [x] 3.5 Implementar el rechazo o reparación de escenas que no cumplen restricciones; verificar que una muestra inválida nunca llega al render.

## 4. Slice 4 — Playlist híbrida y transiciones musicales

- [x] 4.1 Implementar la playlist con modos `curated`, `generative` e `hybrid`, pesos y ventana de no repetición; verificar con tests de secuencias y de no repetición.
- [x] 4.2 Cuantizar los cambios de escena al siguiente compás o frase usando BPM y `beatPhase`, con fallback sin BPM; verificar con reloj simulado.
- [x] 4.3 Implementar transiciones `dissolve` y `feedback-smear` con duración variable entre 1.5 y 4 s; verificar que no hay corte abrupto y que la duración respeta el rango.
- [x] 4.4 Resolver el retarget de una transición en curso sin recursos huérfanos ni canvas congelado; verificar con test de cambio durante el blend.
- [x] 4.5 Agregar a la UI el selector de modo, el estado de la playlist y el intervalo de respaldo; verificar que la preferencia persiste al recargar.

## 5. Slice 5 — Memoria de escenas

- [x] 5.1 Crear el adaptador de almacenamiento en IndexedDB con LRU y tope de thumbnails; verificar el comportamiento con cuota agotada y almacenamiento no disponible.
- [x] 5.2 Implementar el historial rodante de N escenas con genoma y thumbnail; verificar que al superar N se descarta la más antigua y se conservan las recientes.
- [x] 5.3 Implementar la captura retroactiva de la escena visible y su promoción a preset; verificar que se guarda la escena actual, no la siguiente.
- [x] 5.4 Implementar export/import de packs con merge por id y resumen de agregadas, omitidas y fallidas; verificar con un pack que contiene duplicados.
- [x] 5.5 Agregar la pestaña de historial y la acción "Guardar esta escena" en la UI; verificar que una escena generada efímera se puede guardar y recargar.

## 6. Slice 6 — Audio fast/slow y feedback global

- [x] 6.1 Agregar análisis de forma de onda y señales `fast`/`slow` por banda; verificar con señales sintéticas que `fast` sube y decae antes que `slow`.
- [x] 6.2 Implementar AGC por banda y onset por banda con refractario; verificar que graves fuertes no anulan agudos y que no hay onsets múltiples dentro del refractario.
- [x] 6.3 Implementar `FeedbackStage` entre el mix de escenas y el bloom, con zoom/rotación/decay driven by audio y clamp de seguridad; verificar audio on/off y ausencia de lavado o negro.
- [x] 6.4 Extender `audio-map.json` con `fast`, `slow`, `agc` y `feedback`, y soportar overrides en runtime; verificar que un cambio de umbral se aplica sin recargar el efecto.
- [x] 6.5 Medir el costo del feedback en perfiles `lite` y `high` y ajustar resolución o defaults; verificar que el benchmark no supera el presupuesto acordado.

## 7. Slice 7 — Refactor de familias p5

- [x] 7.1 Crear la familia Kinetic Geometry a partir de `tunnel`, `spiral`, `mandala` y `sacredGeometry`; verificar goldens por variante y que las cuatro siguen accesibles.
- [x] 7.2 Crear la familia Waves & Fields a partir de `waves`, `waveGlitch` y `dune`; verificar goldens por variante y que las tres siguen accesibles.
- [x] 7.3 Crear la familia Fractal Growth a partir de `fractal`, `fractalGlitch` y `biomech`; verificar goldens por variante y que las tres siguen accesibles.
- [x] 7.4 Mover `matrix`, `glitch`, `melt`, `yinYang` y `particles` a **Clásicos** sin borrar código; verificar que presets y enlaces que los referencian siguen funcionando.
- [x] 7.5 Actualizar el mapa de familias y la documentación de Clásicos; verificar que la UI no muestra un efecto retirado como familia principal.

## 8. Slice 8 — Integración y release

- [x] 8.1 Ejecutar un test end-to-end de los tres modos con guardar, compartir y recargar; verificar que la escena reconstruida coincide con la original.
- [x] 8.2 Ejecutar la suite de regresión visual de variantes con seeds fijas en CI; verificar que no hay diferencias inesperadas.
- [x] 8.3 Ejecutar el benchmark con feedback y sampler activos; verificar que se mantiene dentro del presupuesto de FPS y CPU acordado.
- [x] 8.4 Actualizar README, CHANGELOG y docs de familias/escenas; verificar que los comandos y ejemplos documentados funcionan.
- [x] 8.5 Hacer smoke manual con micrófono, sin micrófono, perfil `lite` y pérdida/restauración de contexto WebGL; registrar el resultado en el changelog.

## Workflow follow-up

- Archivar la change después de cumplir los requisitos de revisión del proyecto.
- Verificar las specs archivadas y el estado final de OpenSpec.
