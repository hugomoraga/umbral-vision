# Spec Delta

## Purpose

Define una reacción musical profunda y estable: señales rápidas para transientes y lentas para gestos, normalización por banda y mapeo a parámetros con memoria visual.

## ADDED Requirements

### Requirement: Señales rápidas y lentas por banda

El análisis de audio SHALL exponer, para graves, medios y agudos, un valor `fast` con ataque rápido y liberación corta y un valor `slow` con envolvente suave. Ambos valores MUST estar disponibles para todos los efectos sin cambiar su contrato.

#### Scenario: Respuesta a un transiente

- **WHEN** entra un kick en la banda de graves
- **THEN** la señal `fast` de graves sube antes que la `slow` y decae antes, sin tirones en la geometría

#### Scenario: Gestos sostenidos

- **WHEN** suena una nota sostenida de medios
- **THEN** la señal `slow` de medios acompaña el gesto mientras la `fast` se estabiliza

### Requirement: Análisis de forma de onda

El sistema SHALL analizar la forma de onda temporal además del espectro de frecuencias. La detección de transientes MUST combinar energía temporal y flujo espectral para reducir falsos positivos.

#### Scenario: Transiente con waveform

- **WHEN** se detecta un ataque de percusión
- **THEN** la detección usa la energía de la forma de onda y el flujo espectral, y no solo el nivel de una banda

#### Scenario: Ruido sostenido

- **WHEN** hay ruido sostenido sin ataques claros
- **THEN** no se disparan onsets repetidos por encima de la tasa refractaria configurada

### Requirement: Normalización independiente por banda

Cada banda SHALL normalizarse con su propia ganancia automática. Un pico fuerte en graves MUST NOT reducir la sensibilidad aparente de medios o agudos por debajo del mínimo configurado.

#### Scenario: Graves dominantes

- **WHEN** la música tiene graves muy fuertes y agudos suaves
- **THEN** los agudos conservan respuesta visible y los graves no saturan el resto del análisis

### Requirement: Mapeo de audio a feedback

Las familias SHALL poder mapear las señales de audio a parámetros de feedback como zoom, rotación, decaimiento y desplazamiento. Estos parámetros MUST acumularse en el buffer temporal para amplificar el efecto de la señal.

#### Scenario: Kick sobre feedback

- **WHEN** el audio está habilitado y entra un kick
- **THEN** el zoom o el decaimiento del feedback cambia de forma perceptible y se acumula en los frames siguientes

#### Scenario: Audio deshabilitado

- **WHEN** el audio está deshabilitado
- **THEN** los parámetros de feedback permanecen en su valor base y la escena sigue animándose por tiempo

### Requirement: Configuración sin recompilar

Los umbrales, ganancias, tiempos de ataque y liberación y mapeos por familia SHALL configurarse en `audio-map.json` o mediante overrides en runtime, sin modificar código de los efectos.

#### Scenario: Ajuste de umbral

- **WHEN** se cambia el umbral de kick en la configuración
- **THEN** la detección y la respuesta visual adoptan el nuevo valor sin recompilar ni recargar el efecto

### Requirement: Estabilidad y latencia acotada

El sistema SHALL mantener una latencia visual configurable y MUST evitar jitter de alta frecuencia en las señales lentas. La tasa de onsets MUST respetar el período refractario configurado.

#### Scenario: Sin jitter

- **WHEN** la señal de entrada es estable
- **THEN** las señales lentas no oscilan frame a frame más allá de la tolerancia configurada

#### Scenario: Refractario

- **WHEN** llegan dos ataques muy próximos entre sí
- **THEN** el sistema dispara como máximo un onset visual dentro del período refractario
