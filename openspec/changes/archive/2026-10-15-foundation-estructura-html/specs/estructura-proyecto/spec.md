## Purpose

Define la organización de directorios y archivos del frontend de la librería y garantiza que el proyecto se abra con doble clic, sin servidor, build ni recursos externos.

## ADDED Requirements

### Requirement: Estructura de directorios del proyecto
El proyecto SHALL tener en su raíz los cinco archivos HTML de las vistas y los directorios `css/`, `js/` e `img/tapas/`. El proyecto MUST NOT incluir `package.json`, `node_modules/`, archivos de configuración de herramientas de build ni bundlers.

#### Scenario: Directorios presentes
- **WHEN** se lista la raíz del proyecto
- **THEN** existen `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` y los directorios `css/`, `js/` e `img/tapas/`

#### Scenario: Sin herramientas de build
- **WHEN** se busca `package.json`, `node_modules` o archivos de configuración de bundlers en la raíz
- **THEN** no se encuentra ninguno

### Requirement: Recursos exclusivamente locales
Todas las hojas de estilo, scripts e imágenes referenciados por las páginas SHALL ser archivos locales del proyecto, enlazados con rutas relativas. Los archivos `*.html`, `*.css` y `*.js` MUST NOT contener URLs `http://` ni `https://` hacia recursos, librerías, frameworks, CDNs o fuentes externas.

#### Scenario: Búsqueda de URLs externas
- **WHEN** se buscan las cadenas `http://` y `https://` en todos los `*.html`, `*.css` y `*.js`
- **THEN** la búsqueda no devuelve resultados

#### Scenario: Apertura sin conexión
- **WHEN** se abre `index.html` con doble clic (`file://`) sin conexión a internet
- **THEN** la página se muestra completa y la consola no informa recursos que no se pudieron cargar

### Requirement: Todo archivo referenciado existe
Cada hoja de estilo y cada script que una página referencia SHALL existir en el proyecto desde este change, aunque su contenido definitivo se complete en changes posteriores. Un archivo todavía sin contenido funcional MUST contener al menos un comentario de cabecera que indique su propósito y el change que lo completa, y MUST NOT producir errores al cargarse.

#### Scenario: Ninguna referencia rota
- **WHEN** se abre cada una de las 5 páginas con `file://` y se revisa la consola y la pestaña de red de las herramientas de desarrollo
- **THEN** no aparece ningún error de archivo no encontrado ni de ejecución de script

#### Scenario: Placeholder identificable
- **WHEN** se abre un archivo CSS o JS que todavía no tiene contenido funcional
- **THEN** su primera línea de comentario indica para qué sirve y qué change lo completa
