# scene-model Specification

## Purpose

Define el genoma reproducible de una escena, su persistencia versionada y la migración sin pérdida de los presets existentes de Umbral Vision.

## Requirements

### Requirement: Genoma de escena serializable

Una escena SHALL serializarse con los campos `effect`, `variant`, `seed`, `params`, `palette`, `post`, `drift` y `schemaVersion`. El genoma MUST ser suficiente para reconstruir la composición sin depender del estado de la sesión.

#### Scenario: Ida y vuelta del genoma

- **WHEN** una escena se serializa y luego se deserializa
- **THEN** todos los campos del genoma se conservan y la escena resultante es equivalente a la original

#### Scenario: Genoma incompleto

- **WHEN** un genoma no contiene `effect`, `variant` o `seed`
- **THEN** el sistema rechaza la carga o completa los campos faltantes con valores por defecto documentados

### Requirement: Reproducibilidad por seed

Dos ejecuciones de la misma escena con la misma seed, variante, parámetros y tiempo SHALL producir el mismo frame. El sistema MUST exponer un desplazamiento de tiempo (`timeOffset`) para congelar o compartir un momento exacto.

#### Scenario: Render determinista

- **WHEN** se renderiza la misma escena dos veces con idéntica seed y `timeOffset`
- **THEN** las imágenes resultantes coinciden dentro de la tolerancia de regresión visual

#### Scenario: Momento congelado

- **WHEN** un usuario congela un momento de una escena en vivo
- **THEN** el genoma guarda el `timeOffset` correspondiente y puede reproducir ese instante

### Requirement: Migración sin pérdida de presets

Los presets existentes con `{ effect, interval, audioEnabled, params }` SHALL migrarse al genoma de escena sin pérdida de nombre, identificador, fecha de creación ni parámetros. La migración MUST ser idempotente.

#### Scenario: Preset legado

- **WHEN** se carga un preset creado antes del genoma de escena
- **THEN** se convierte a una escena válida con `origin: manual`, `variant` por defecto y los parámetros originales intactos

#### Scenario: Migración repetida

- **WHEN** la migración se ejecuta dos veces sobre el mismo conjunto de presets
- **THEN** no se duplican presets ni se alteran sus identificadores

### Requirement: Versionado de esquema

El genoma SHALL declarar `schemaVersion`. El sistema MUST migrar versiones conocidas y MUST rechazar con un mensaje claro las versiones futuras o desconocidas, sin sobrescribir datos.

#### Scenario: Versión desconocida

- **WHEN** se intenta cargar una escena con `schemaVersion` mayor a la soportada
- **THEN** el sistema no la carga, informa la incompatibilidad y conserva el archivo original

### Requirement: Share y export reconstruyen la escena

Una URL de compartir SHALL incluir el genoma suficiente para reconstruir la escena, incluyendo `effect`, `variant`, `seed` y parámetros. La importación de una URL MUST producir una escena equivalente y MUST NOT requerir estado local.

#### Scenario: Compartir una escena generada

- **WHEN** un usuario comparte una escena generada y otra persona abre la URL
- **THEN** la escena se reconstruye con la misma variante, seed, paleta y parámetros

#### Scenario: URL incompleta o inválida

- **WHEN** una URL contiene parámetros inválidos o incompletos
- **THEN** el sistema carga una escena por defecto segura e informa que la URL no era válida
