# visual-families Specification

## Purpose

Define las familias visuales estables de Umbral Vision, la gramática de variantes que cada una puede producir y el destino de los efectos existentes dentro de esa taxonomía.

## Requirements

### Requirement: Catálogo de familias estable

El sistema SHALL exponer un catálogo de familias visuales con identificadores estables. Cada familia SHALL declarar al menos una variante y una descripción de su técnica visual. Los identificadores MUST NOT cambiar entre versiones menores.

#### Scenario: Catálogo consultable

- **WHEN** un consumidor solicita el catálogo de familias
- **THEN** recibe una lista con identificadores estables, descripción y variantes declaradas por familia

#### Scenario: Familia sin variantes es inválida

- **WHEN** una familia se registra sin variantes
- **THEN** el sistema rechaza el registro e informa el error

### Requirement: Variante obligatoria por escena

Cada escena SHALL seleccionar exactamente una variante perteneciente a su familia. Si la variante no existe o no pertenece a la familia, el sistema MUST rechazar la escena o aplicar una variante por defecto declarada, sin producir un estado inconsistente.

#### Scenario: Variante inválida

- **WHEN** una escena declara una variante que no pertenece a su familia
- **THEN** el sistema aplica la variante por defecto de la familia y registra la sustitución

#### Scenario: Variante válida

- **WHEN** una escena declara una variante existente de su familia
- **THEN** el sistema la utiliza sin modificaciones

### Requirement: Variantes estructuralmente distintas

Dos variantes de la misma familia SHALL diferir en al menos un rasgo estructural de composición, no solo en color o paleta. Cada variante MUST tener una referencia visual de regresión para detectar cambios involuntarios.

#### Scenario: Diferencia entre variantes

- **WHEN** se comparan dos variantes de una misma familia con la misma seed y tiempo
- **THEN** sus imágenes de referencia de regresión son distintas y el rasgo estructural declarado difiere

### Requirement: Auditoría explícita de efectos existentes

Cada efecto existente SHALL tener una decisión de auditoría: `keep`, `merge`, `refactor` o `retire`. La decisión MUST incluir una justificación y el destino del efecto cuando no se conserva como efecto independiente.

#### Scenario: Cobertura completa de la auditoría

- **WHEN** se publica la taxonomía de familias
- **THEN** los 19 efectos existentes tienen una decisión de auditoría registrada y ninguna queda sin clasificar

### Requirement: Los efectos retirados siguen accesibles

Un efecto marcado como `retire` SHALL salir de la taxonomía principal de familias, pero MUST seguir accesible bajo la categoría **Clásicos** con su comportamiento actual. El sistema MUST NOT eliminar presets ni enlaces que referencien ese efecto.

#### Scenario: Acceso a un clásico

- **WHEN** un usuario abre un efecto retirado de la taxonomía
- **THEN** el efecto se ejecuta con su comportamiento previo y aparece bajo **Clásicos**

#### Scenario: Preset de un clásico

- **WHEN** se carga un preset que referencia un efecto retirado
- **THEN** el preset se reproduce sin errores ni pérdida de parámetros
