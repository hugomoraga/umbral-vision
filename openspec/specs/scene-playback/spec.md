# scene-playback Specification

## Purpose

Define cómo Umbral Vision elige qué escena mostrar y cómo transiciona entre escenas, combinando repertorio curado, exploración generativa y sincronización musical.

## Requirements

### Requirement: Modos de reproducción

El sistema SHALL ofrecer tres modos de reproducción: `curated` (solo escenas guardadas), `generative` (solo escenas generadas) e `hybrid` (mezcla ponderada de ambas). El modo activo MUST ser visible y persistente entre sesiones.

#### Scenario: Modo curado

- **WHEN** el modo es `curated`
- **THEN** solo se muestran escenas guardadas y nunca una escena generada no guardada

#### Scenario: Modo generativo

- **WHEN** el modo es `generative`
- **THEN** cada transición produce o selecciona una escena generada dentro de la familia activa

#### Scenario: Modo híbrido

- **WHEN** el modo es `hybrid`
- **THEN** la secuencia combina escenas guardadas y generadas según los pesos configurados

### Requirement: Selección sin repetición reciente

La playlist SHALL evitar repetir una escena dentro de una ventana configurable de las últimas N escenas. Los presets marcados como favoritos MUST tener mayor peso de selección cuando el modo los incluya.

#### Scenario: Ventana de no repetición

- **WHEN** la ventana es de diez escenas y quedan escenas elegibles
- **THEN** la playlist no repite ninguna de las últimas diez antes de agotar las alternativas

#### Scenario: Peso de favoritos

- **WHEN** un preset está marcado como favorito
- **THEN** su probabilidad de selección es mayor que la de un preset no favorito en igualdad de condiciones

### Requirement: Cuantización musical de transiciones

Cuando existe BPM y fase de beat confiables, el sistema SHALL iniciar las transiciones en el siguiente límite de compás o frase configurado. Sin BPM confiable, MUST usar un intervalo de respaldo sin bloquear la reproducción.

#### Scenario: Transición en compás

- **WHEN** el BPM es confiable y se solicita un cambio de escena
- **THEN** la transición comienza en el siguiente límite musical configurado, no en el instante arbitrario de la solicitud

#### Scenario: Sin BPM

- **WHEN** no hay BPM confiable
- **THEN** la transición se ejecuta con el intervalo de respaldo y sigue siendo suave

### Requirement: Transición con memoria visual

El cambio de escena SHALL ser un blend continuo, nunca un corte abrupto. La escena saliente MUST seguir renderizándose hasta completar el blend y la duración MUST variar dentro de un rango configurable.

#### Scenario: Blend continuo

- **WHEN** se cambia de escena con transición habilitada
- **THEN** no existe un frame que salte directamente de una composición completa a la otra sin mezcla

#### Scenario: Duración variable

- **WHEN** se realizan varias transiciones consecutivas
- **THEN** las duraciones varían dentro del rango configurado y respetan el mínimo y el máximo

### Requirement: Cambio durante una transición

Si se solicita una nueva escena mientras una transición está en curso, el sistema MUST resolver el estado anterior sin dejar recursos huérfanos, sin congelar el canvas y sin producir un corte abrupto.

#### Scenario: Retarget de transición

- **WHEN** llega una nueva escena antes de terminar la transición actual
- **THEN** la transición se reanuda o se reinicia de forma controlada y no quedan escenas salientes retenidas

### Requirement: Reproducción sin audio

El sistema SHALL reproducir y transicionar escenas aunque el audio esté deshabilitado o no haya micrófono. La ausencia de señal MUST NOT detener la playlist ni producir errores visibles.

#### Scenario: Audio deshabilitado

- **WHEN** el usuario desactiva el audio
- **THEN** las escenas siguen rotando con las transiciones y el movimiento base de cada familia
