# Spec Delta

## Purpose

Garantiza que las escenas buenas no se pierdan: mantiene un historial de lo mostrado, permite capturarlas retroactivamente y promocionarlas a presets o packs exportables.

## ADDED Requirements

### Requirement: Historial rodante de escenas

El sistema SHALL mantener un historial de las últimas N escenas mostradas, con su genoma, momento de aparición y thumbnail. Al superar N, MUST descartar la más antigua y conservar las más recientes.

#### Scenario: Historial acotado

- **WHEN** se muestran más de N escenas
- **THEN** el historial conserva las N más recientes y descarta las anteriores sin afectar los presets guardados

#### Scenario: Historial disponible tras recargar

- **WHEN** el usuario recarga la aplicación
- **THEN** el historial reciente disponible se conserva o se informa que fue limpiado, sin errores

### Requirement: Captura retroactiva

El usuario SHALL poder guardar la escena que está viendo en el momento de la acción, no la siguiente. La captura MUST funcionar también para escenas generadas que todavía no son presets.

#### Scenario: Guardar lo visible

- **WHEN** el usuario pulsa "Guardar esta escena"
- **THEN** se guarda el genoma de la escena actualmente en pantalla, incluyendo su seed y variante

#### Scenario: Escena generada efímera

- **WHEN** el usuario guarda una escena generada que no estaba en el repertorio
- **THEN** la escena se promociona a preset sin requerir recargar ni reiniciar la reproducción

### Requirement: Promoción desde el historial

Cada entrada del historial SHALL poder convertirse en preset con nombre y favorito. La promoción MUST preservar el genoma original y registrar el origen.

#### Scenario: Promover una entrada

- **WHEN** el usuario elige una entrada del historial y la guarda
- **THEN** se crea un preset con el nombre indicado, el mismo genoma y `origin` correspondiente

### Requirement: Persistencia de thumbnails fuera de localStorage

Los thumbnails del historial SHALL almacenarse en un almacenamiento con mayor cuota que `localStorage`, con un límite de tamaño configurable. Si el almacenamiento falla o se llena, el sistema MUST seguir guardando genomas y presets sin romper la aplicación.

#### Scenario: Cuota agotada

- **WHEN** el almacenamiento de thumbnails alcanza su límite
- **THEN** se descartan los thumbnails más antiguos y los presets y genomas siguen funcionando

#### Scenario: Almacenamiento no disponible

- **WHEN** el navegador bloquea el almacenamiento de thumbnails
- **THEN** el historial conserva genomas y la aplicación muestra la escena sin thumbnail

### Requirement: Export e import de packs

El sistema SHALL exportar un pack con escenas y sus metadatos, e importarlo en otra sesión. La importación MUST evitar duplicados por identificador y MUST informar cuántas escenas se agregaron, omitieron o fallaron.

#### Scenario: Exportar un pack

- **WHEN** el usuario exporta su repertorio
- **THEN** se descarga un archivo con los genomas, nombres, linaje y metadatos necesarios para reconstruirlos

#### Scenario: Importar un pack con duplicados

- **WHEN** se importa un pack que contiene escenas ya existentes
- **THEN** las escenas duplicadas se omiten y el resumen informa cuántas se agregaron y cuántas se omitieron

### Requirement: Privacidad local por defecto

El historial, los presets y los packs SHALL almacenarse localmente por defecto. El sistema MUST NOT enviar genomas, thumbnails ni metadatos a un servidor sin una acción explícita del usuario.

#### Scenario: Sin red

- **WHEN** el usuario usa la aplicación sin conexión
- **THEN** el historial, los presets y la reproducción siguen funcionando con los datos locales
