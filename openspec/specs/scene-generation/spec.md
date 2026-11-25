# scene-generation Specification

## Purpose

Permite generar escenas nuevas dentro de la gramática de cada familia y evolucionarlas mediante mutación y linaje, sin perder la identidad visual ni la reproducibilidad.

## Requirements

### Requirement: Sampler restringido por familia

El sistema SHALL generar escenas nuevas seleccionando una familia y una variante válidas, y muestreando parámetros dentro de los rangos y restricciones declarados por esa familia. Ninguna escena generada MUST contener parámetros fuera de rango.

#### Scenario: Generación válida

- **WHEN** se solicitan cien escenas generadas para una familia
- **THEN** las cien escenas tienen variante válida y todos sus parámetros dentro de los rangos permitidos

#### Scenario: Restricción estética insatisfecha

- **WHEN** el sampler produce una escena que no cumple las restricciones estéticas de la familia
- **THEN** la descarta o la repara antes de mostrarla, sin bloquear la reproducción

### Requirement: Generación determinista por seed

El sampler SHALL aceptar una seed y MUST producir la misma escena para la misma seed, familia y versión de reglas. Sin seed explícita, el sistema SHALL usar una fuente aleatoria y registrar la seed resultante en el genoma.

#### Scenario: Misma seed, misma escena

- **WHEN** se genera dos veces una escena con la misma seed y familia
- **THEN** ambos genomas son idénticos

#### Scenario: Seed registrada

- **WHEN** se genera una escena sin seed explícita
- **THEN** el genoma resultante contiene la seed efectivamente usada

### Requirement: Mutación controlada

El sistema SHALL poder mutar una escena guardada cambiando un subconjunto acotado de genes. La mutación MUST conservar la familia y la variante salvo que el usuario habilite explícitamente cambiar la variante.

#### Scenario: Mutar un preset

- **WHEN** el usuario muta un preset guardado
- **THEN** la escena resultante conserva familia y variante, y cambia solo los genes seleccionados

#### Scenario: Mutación con cambio de variante

- **WHEN** el usuario habilita cambiar la variante durante la mutación
- **THEN** la escena resultante puede usar otra variante de la misma familia y lo registra en el linaje

### Requirement: Linaje de escenas

Toda escena generada o mutada SHALL registrar `origin` (`generated` o `mutated`) y, cuando corresponda, `parentId` con la escena de origen. El linaje MUST ser consultable desde la escena resultante.

#### Scenario: Ascendencia visible

- **WHEN** una escena se crea mutando un preset
- **THEN** su genoma incluye `parentId` apuntando a ese preset y `origin: mutated`

#### Scenario: Escena sin padre

- **WHEN** una escena se genera desde cero
- **THEN** su genoma registra `origin: generated` y `parentId` nulo

### Requirement: Promoción de escena generada a preset

Cualquier escena generada o mutada SHALL poder guardarse como preset con nombre. Una vez guardada, MUST participar como semilla disponible para futuras generaciones y mutaciones.

#### Scenario: Promover una escena

- **WHEN** el usuario guarda una escena generada como preset
- **THEN** la escena aparece en el repertorio y puede seleccionarse como origen de una mutación

#### Scenario: Persistencia de la promoción

- **WHEN** el usuario recarga la aplicación después de promover una escena
- **THEN** el preset promovido sigue disponible con su genoma y linaje
