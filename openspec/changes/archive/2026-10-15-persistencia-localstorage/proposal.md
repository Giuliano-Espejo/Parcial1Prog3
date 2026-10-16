## Why

La aplicación es multipágina (DD-01): hoy cada página recrea libros y clientes en memoria desde la semilla, así que nada de lo que se cargue en una vista llega a otra ni sobrevive a una recarga. Las altas (C-06), la venta (C-07) y el historial con precio histórico (C-08) necesitan antes una capa de persistencia en `localStorage` que no duplique la semilla (RN-PE-01..03, DD-03, IN-01). Es el primer change de la Etapa 2 y además tiene que despejar el riesgo alto SU-02 / P-02: confirmar que las cinco páginas abiertas por `file://` comparten el mismo almacenamiento en Chrome **y** en Firefox.

## What Changes

- `js/comun.js` incorpora la sección de almacenamiento: constante `CLAVES` (`libreria.libros`, `libreria.clientes`, `libreria.ventas`), `leerColeccion(clave, semilla)` y `guardarColeccion(clave, datos)` (las **únicas** funciones que tocan `localStorage`), más los atajos `cargarLibros/Clientes/Ventas()` y `guardarLibros/Clientes/Ventas(datos)`.
- `cargarLibros()` y `cargarClientes()` conservan su firma (C-03 D3) pero pasan a leer del almacenamiento: la semilla se escribe solo si la clave no existe. Las ventas arrancan en `[]` (sin semilla). `cargarVentas()`/`guardarVentas()` se agregan ya, aunque la interfaz de ventas llega en C-07.
- Manejo de errores: JSON dañado (o que no es un arreglo) en una clave → aviso visible, `[]` en memoria, la clave **no** se pisa y queda bloqueada para escritura durante esa carga (P-03). `localStorage` no disponible → aviso "No se pueden guardar datos en este navegador…" y semilla en memoria.
- Nueva zona de aviso de almacenamiento (`#mensajes-almacenamiento`, región viva) al comienzo del `<main>` de las cinco páginas, y helper DOM `mostrarAvisosAlmacenamiento()` en `comun.js` que llaman los scripts de página después de cargar datos.
- `catalogo.js`, `libros.js` y `clientes.js` muestran los avisos de almacenamiento tras `cargarX()` (las llamadas a `cargarX()` ya existen; no cambian).
- Verificación manual de SU-02 en Chrome y Firefox con `file://` (editar `libreria.libros` desde una página y verlo en otra), con plan alternativo documentado si Firefox no comparte.
- README: actualización mínima de lo que pasa a ser falso (línea de estado, funcionalidades, frase de "datos en memoria" y sección 7 "Persistencia") con el resultado observado de SU-02, cómo restaurar los datos iniciales y los casos manuales de persistencia (`P1..P6`) en "Pendiente de ejecutar" hasta que el usuario los ejecute. C-09 sigue siendo dueño del README final.

## Capabilities

### New Capabilities
- `persistencia-local`: capa de almacenamiento en `localStorage` — claves por colección, carga de semilla solo si falta la clave, guardado inmediato con JSON compacto editable a mano, copias independientes, manejo de datos dañados y de almacenamiento no disponible, aviso visible en cada vista y datos compartidos entre las páginas abiertas por `file://`.

### Modified Capabilities
- `datos-semilla`: el requisito "Acceso a las colecciones de libros y clientes" deja de devolver la semilla en memoria y pasa a devolver la colección guardada (la semilla solo inicializa la clave ausente).
- `catalogo-filtro`: "Catálogo generado desde los datos" muestra la colección guardada; el escenario de carga completa se condiciona a almacenamiento limpio y se agrega el de datos guardados.
- `listados-libros-clientes`: los listados de libros y de clientes muestran la colección guardada (mismo ajuste de escenarios).
- `documentacion-entrega`: el README pasa a declarar "Etapa 2 en desarrollo", la persistencia figura como implementada y la sección de `localStorage` describe el comportamiento real, el resultado de SU-02 por navegador y los casos manuales de persistencia.

## Impact

- **Código**: `js/comun.js` (nueva sección `// ===== Almacenamiento =====` y cuerpo de `cargarLibros/Clientes`; nuevo helper DOM), `js/catalogo.js`, `js/libros.js`, `js/clientes.js` (una llamada en `Inicio`), los cinco `*.html` (una zona de mensajes). `js/ventas.js` e `js/historial.js` no cambian.
- **Datos del navegador**: se crean las claves `libreria.libros`, `libreria.clientes` y `libreria.ventas` en el origen `file://`.
- **Documentación**: `README.md` secciones 0, 5, 6, 7 y 8 (actualización mínima; C-09 reescribe).
- **Sin dependencias** nuevas, sin módulos, sin tests automatizados (DD-05): verificación manual en Chrome y Firefox.
- **Desbloquea**: C-06 (altas), C-07 (venta), C-08 (historial y precio histórico editado a mano en `libreria.libros`).
