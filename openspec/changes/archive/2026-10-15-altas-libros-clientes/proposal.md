## Why

El Ejercicio 4 de la consigna (15 puntos) pide registrar libros y clientes con validación completa, y hoy los formularios de `libros.html` y `clientes.html` son maqueta: muestran el aviso "Pendiente — Etapa 2" y no hacen nada al enviarse. Con la persistencia de C-05 ya disponible (`guardarLibros` / `guardarClientes` devuelven `true`/`false` y bloquean claves dañadas), este es el momento de convertir ambos formularios en altas reales, que además alimentan el catálogo y, desde C-07, los selectores de la venta.

## What Changes

- **Selectores generados desde los datos** (RN-LI-08): las opciones de editorial, género (conservando «Sin clasificar» = `null`) y autores se crean con JavaScript a partir de `EDITORIALES`, `GENEROS` y `AUTORES`.
- **Alta de libro validada**: `validarLibro(datos, libros)` pura (sin DOM ni `localStorage`) que devuelve la lista de errores en el orden de los campos: título no vacío; ISBN no vacío y no duplicado comparado normalizado (sin espacios ni guiones); precio numérico > 0 (después de redondear a 2 decimales); editorial existente; al menos un autor y todos existentes; género existente si se asigna. `crearLibro` pura arma el registro (id `lib-N` siguiente, valores con trim, precio con 2 decimales, `imagen: null`).
- **Alta de cliente validada**: `validarCliente(datos, clientes)` pura: nombre completo y email no vacíos, email con formato `algo@dominio.ext` sin espacios internos y único comparado con trim y sin distinguir mayúsculas. `crearCliente` pura (id `cli-N`, valores con trim, email guardado tal como se escribió).
- **Flujo de envío** (RN-UI-02/03/05): `submit` con `preventDefault`; si hay errores, se muestran todos en la zona de mensajes del formulario, cada uno con "Error:", se marcan los campos con `aria-invalid="true"` y el foco va al primer campo inválido, sin guardar nada. Si no hay errores, se guarda la colección completa; solo si el guardado devuelve `true` se actualiza el listado sin recargar, se resetea el formulario, se limpian las marcas y se muestra "Éxito: Libro «título» registrado." (o "Cliente «nombre» registrado."). Si el guardado devuelve `false`, el alta se rechaza con un error y el formulario conserva lo escrito.
- **Helpers comunes** en `js/comun.js`: `normalizarIsbn`, `normalizarEmail`, `siguienteId(lista, prefijo)` y `mostrarErrores(contenedor, mensajes)`.
- **Fin de la maqueta en Libros y Clientes**: se quitan los avisos "Pendiente — Etapa 2" de ambos formularios y su `aria-describedby` en los botones; el aviso sigue en Ventas e Historial.
- **README**: §4 y §5 pasan las altas a "funciona/implementadas", §7 ajusta lo que ocurre si no se puede guardar, §8 suma los casos manuales de altas (casos 2 y 3 de la consigna) y se repiten los controles de alcance.

## Capabilities

### New Capabilities
- `alta-libros`: formulario de alta de libros operativo — selectores generados desde los datos, validación pura con reglas RN-LI-01..08, presentación accesible de errores, guardado y actualización sin recargar.
- `alta-clientes`: formulario de alta de clientes operativo — validación pura con reglas RN-CL-01..04, presentación accesible de errores, guardado y actualización sin recargar.

### Modified Capabilities
- `datos-semilla`: se agregan los helpers de normalización de ISBN y email y el cálculo del id siguiente (`siguienteId`).
- `utilidades-dom`: se agrega `mostrarErrores` para mostrar varios errores con prefijo "Error:" en una zona.
- `listados-libros-clientes`: se elimina "Formularios de alta siguen como maqueta" y se agrega la actualización del listado tras un alta.
- `estructura-formularios-tablas`: el aviso "Pendiente — Etapa 2" deja de aplicar a los formularios de libro y cliente.
- `documentacion-entrega`: el README declara las altas como funcionales e incluye sus casos manuales.

## Impact

- Código: `libros.html`, `clientes.html` (quitar avisos y `aria-describedby`), `js/comun.js` (helpers), `js/libros.js` y `js/clientes.js` (secciones Lógica / Render / Eventos / Inicio completas), `README.md`.
- Sin cambios en `css/`: el estilo `[aria-invalid="true"]` y las clases `.mensaje--error` / `.mensaje--exito` ya existen (C-02).
- Datos: los libros dados de alta se guardan con `imagen: null`; el catálogo ya los muestra sin tapa y sin errores.
- Dependencias: C-05 (archivado). Habilita C-07, cuyos selectores de venta leerán las colecciones guardadas e incluirán los registros nuevos.
- Verificación manual solo en Chrome; la columna Firefox del README queda como "No ejecutado: Firefox no disponible en el equipo del autor". Sin tests automatizados.
