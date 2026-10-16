## Context

Proyecto greenfield: la raíz solo tiene documentación (`knowledge-base/`, `discovery/`, `openspec/`, `CHANGES.md`, `AGENTS.md`) y la consigna en PDF. No hay HTML, CSS ni JS. Motivación y alcance: ver `proposal.md`; comportamiento exigido: ver `specs/`.

Restricciones que condicionan el diseño (de `AGENTS.md` y la KB):

- La app se abre con doble clic (`file://`): scripts clásicos con `defer`, nunca `type="module"` (DD-02).
- Multipágina (DD-01) con un JS por página más `js/comun.js` (DD-04), cada JS dividido en secciones `Lógica / Render / Eventos / Inicio`.
- Sin librerías, CDNs, npm ni build; sin `innerHTML` con datos del usuario (RN-UI-01).
- Sin tests automatizados ni Strict TDD (DD-05): la verificación es manual.
- C-02 debe poder estilar todo **sin cambiar la estructura semántica** de este change, y C-03/C-06/C-07/C-08 deben encontrar los contenedores e ids que necesitan. Por eso este change fija los nombres de ids y clases "gancho".

## Goals / Non-Goals

**Goals:**
- Dejar un esqueleto HTML estable que los changes siguientes completen sin reestructurar.
- Fijar una convención de ids, clases gancho y zonas de mensaje compartida por las 5 vistas.
- Que el proyecto abra sin errores de consola desde el primer change.

**Non-Goals:**
- Estilos reales (C-02): los CSS quedan como placeholders con comentario.
- Datos, semilla, render del catálogo, filtro (C-03); persistencia (C-05); validaciones y altas (C-06); lógica de venta e historial (C-07, C-08).
- Poblar los selectores de editorial, autores, cliente y libro: sus opciones salen de los datos locales en C-06/C-07.
- Filas de ejemplo estáticas en las tablas: la consigna las permite pero no las exige (IN-02); C-03 renderiza desde la semilla.
- Marcar el enlace activo con JS (ver D3).

## Decisions

### D1 — Crear placeholders para todos los CSS y JS referenciados
**Decisión**: C-01 crea `css/base.css`, `css/layout.css`, `css/componentes.css`, `js/catalogo.js`, `js/libros.js`, `js/clientes.js`, `js/ventas.js` y `js/historial.js` con solo un comentario de cabecera (propósito + change que lo completa). Los JS de página llevan además `'use strict';` y los cuatro comentarios de sección vacíos (`Lógica`, `Render`, `Eventos`, `Inicio`), para que los changes posteriores solo completen.
**Alternativas**: (a) no referenciar los archivos hasta que existan → obliga a editar los 5 HTML en cada change y rompe el orden de carga fijo; (b) referenciarlos sin crearlos → errores "archivo no encontrado" en consola en cada página.
**Por qué**: el orden de carga queda fijo desde el inicio (C-02 y C-03 no tocan `<head>`), y la consola queda limpia, que es parte de la verificación.

### D2 — Marca de maqueta "Pendiente — Etapa 2" desde C-01
**Decisión**: cada sección cuyo comportamiento todavía no existe lleva un párrafo `<p class="aviso-maqueta" id="aviso-<seccion>">` con el texto "Pendiente — Etapa 2: …" explicando qué falta. El botón de acción pendiente lo referencia con `aria-describedby`. Aplica a: formulario de alta de libro, formulario de alta de cliente, composición de venta (un aviso que referencian "Agregar renglón" y "Confirmar venta") e historial.
**Alternativas**: (a) dejarlo en C-04 como dice hoy `CHANGES.md` → entre C-01 y C-04 habría controles presentados como completos, contra la consigna ("los controles pendientes se identifican como parte de la maqueta"); (b) deshabilitar los botones con `disabled` → salen del orden de Tab y no se puede verificar el foco en C-02.
**Por qué**: la marca nace junto con los controles que describe. Cada change que vuelve funcional una sección (C-06 libros/clientes, C-07 venta, C-08 historial) quita su aviso y el `aria-describedby`. C-04 pasa a **verificar y documentar** la marca en el README, no a crearla (ajuste a `CHANGES.md` pendiente, ver Open Questions).
**Consecuencia aceptada**: en la Etapa 1 los botones `type="submit"` sin manejador recargan la misma página con los valores en la URL (sin pérdida de datos, porque no hay datos). El aviso lo explica; C-03 agrega `preventDefault` al buscador y C-06/C-07 a los formularios.

### D3 — `aria-current="page"` estático en el HTML
**Decisión**: cada página escribe `aria-current="page"` en su propio enlace del menú. `comun.js` no marca la navegación.
**Alternativas**: marcarlo con JS desde `comun.js` (como sugiere la sección "Contenido de comun.js" de la arquitectura) → depende de que JS cargue y agrega lógica sin beneficio en multipágina.
**Por qué**: el `CHANGES.md` y US-001 piden el atributo en cada HTML; es robusto sin JS y C-02 lo usa como selector de estilo (`[aria-current="page"]`).

### D4 — Nombres de capacidades
**Decisión**: cuatro capacidades planas en kebab-case: `estructura-proyecto`, `navegacion-vistas`, `estructura-formularios-tablas` y `utilidades-dom`.
**Alternativas**: una sola `maquetacion-html` → mezcla requisitos que evolucionan en changes distintos (C-02 estiliza la navegación, C-06 modifica los formularios, C-07 y C-08 usan las zonas de mensaje); dominios anidados (`ui/navegacion`) → innecesario con este tamaño.
**Por qué**: cada capacidad agrupa requisitos que cambian juntos, y los changes futuros pueden emitir deltas `MODIFIED` sobre una sola.

### D5 — Esqueleto común de cada página
**Decisión**: todas las páginas comparten este esqueleto, copiado a mano (no hay includes sin build):

```
<!DOCTYPE html> <html lang="es">
<head> charset, viewport, <title>Vista — Librería TUP</title>, meta description,
       3 <link> CSS, <script src="js/comun.js" defer>, <script src="js/<pagina>.js" defer> </head>
<body>
  <a class="salto" href="#contenido-principal">Saltar al contenido principal</a>
  <header class="encabezado"> <p class="marca">Librería TUP</p>
    <nav aria-label="Principal"> <ul class="menu"> 5 × <li><a href>…</a></li> </ul> </nav>
  </header>
  <main id="contenido-principal" tabindex="-1"> <h1>…</h1> <section aria-labelledby>…</section>… </main>
  <footer class="pie"> <p>TPI Programación III — UTN-TUP · Giuliano Espejo</p> </footer>
</body>
```

- La marca del header es un `<p>`, no un encabezado: el único `h1` vive en `<main>`. En `index.html` el `h1` es el nombre de la librería ("Librería TUP") con el subtítulo de la vista en un `h2` ("Catálogo"), cumpliendo "Catálogo: título de la librería". En las demás, el `h1` es el nombre de la vista.
- Cada `<section>` usa `aria-labelledby` apuntando a su `h2`.
- `tabindex="-1"` en `<main>` permite que el enlace de salto mueva el foco en todos los navegadores.

### D6 — Convención de ids y clases gancho
**Decisión**: ids en español y kebab-case, con prefijo de entidad; clases gancho que C-02 estiliza sin tocar la estructura.

| Vista | Elementos (id) |
|-------|----------------|
| `index.html` | `form-busqueda` (con `role="search"`), `buscador-titulo` (`type="search"`), `catalogo` (contenedor de tarjetas), `estado-catalogo` (vacío / sin resultados) |
| `libros.html` | `form-libro`, `libro-titulo`, `libro-isbn`, `libro-precio` (`type="number" min="0.01" step="0.01"`), `libro-editorial`, `libro-genero` (opción `value=""` «Sin clasificar»), `libro-autores` (`multiple`, `aria-describedby="ayuda-autores"`), `mensajes-libro`, `tabla-libros-cuerpo`, `estado-libros`, `aviso-libro` |
| `clientes.html` | `form-cliente`, `cliente-nombre` (`autocomplete="name"`), `cliente-email` (`type="email"`, `autocomplete="email"`), `mensajes-cliente`, `tabla-clientes-cuerpo`, `estado-clientes`, `aviso-cliente` |
| `ventas.html` | `venta-cliente` (selector fuera de formulario), `form-renglon`, `renglon-libro`, `renglon-cantidad` (`type="number" min="1" step="1" value="1"`), `tabla-renglones-cuerpo`, `venta-total` (celda del total en `<tfoot>`), `estado-renglones`, `boton-confirmar-venta` (`type="button"`), `mensajes-venta`, `aviso-venta` |
| `historial.html` | `tabla-ventas-cuerpo`, `estado-historial`, `detalle-venta` (sección), `detalle-datos` (`<dl>` cliente/email/fecha/total), `tabla-detalle-cuerpo`, `detalle-total`, `aviso-historial` |

Clases gancho: `salto`, `encabezado`, `marca`, `menu`, `pie`, `campo` (envoltorio label + control), `boton`, `tabla-contenedor` (envoltorio de cada `<table>`, para el `overflow-x: auto` de C-02), `zona-mensajes`, `aviso-maqueta`, `ayuda` (textos de ayuda de campo).

- Los selectores de editorial, cliente y libro llevan solo una opción inicial `value=""` ("Seleccioná …"); autores queda sin opciones. Los campos obligatorios llevan `required` (semántica para lectores de pantalla); con `novalidate` el navegador no bloquea el envío y la autoridad es la validación JS de C-06. C-02 no debe estilar `:invalid`.
- Cada control lleva `name` igual a su `id` sin prefijo de entidad, para poder leerlo con `FormData` más adelante.
- La tabla de detalle del historial y su `<dl>` se incluyen con el atributo `hidden` (definen los campos que usa C-08); mientras tanto la sección muestra "Seleccioná una venta para ver su detalle.".

### D7 — Zonas de mensaje: dos tipos por vista
**Decisión**:
- **Zona de estado del listado** (`estado-*`): `<p class="zona-mensajes" role="status">` junto al listado. En C-01 muestra el texto de lista vacía, que es cierto porque no hay datos ("Todavía no hay libros en el catálogo.", "Todavía no hay libros registrados.", "Todavía no hay clientes registrados.", "Todavía no agregaste renglones a la venta.", "Todavía no hay ventas registradas."). En el catálogo también recibe el "sin resultados" (C-03).
- **Zona de operación** (`mensajes-*`): `<div class="zona-mensajes" aria-live="polite">` vacío, inmediatamente después del formulario o del botón "Confirmar venta" (RN-UI-02: errores cerca del formulario).
- "Sin resultados" solo existe en el Catálogo, que es la única vista con búsqueda; "operación correcta/rechazada" solo donde hay una operación (Libros, Clientes, Ventas).
**Alternativas**: una sola zona por vista → mezclaría el estado del listado con el resultado de un alta, y un mensaje borraría al otro.
**Por qué**: las regiones vivas tienen que existir en el DOM antes de actualizarse para que se anuncien.

### D8 — Contrato de `js/comun.js` (mínimo)
**Decisión**: archivo clásico con `'use strict';` y una sección `// ===== DOM =====` con tres funciones globales:
- `crearElemento(tag, texto, clase)`: `document.createElement(tag)`; si `texto` no es `null`/`undefined` asigna `textContent = String(texto)`; si `clase` es verdadera asigna `className`.
- `limpiar(contenedor)`: `contenedor.replaceChildren()`.
- `mostrarMensaje(contenedor, tipo, texto)`: normaliza `tipo` a `exito | error | info` (otro valor → `info`); llama a `limpiar`; si `texto` está vacío termina; si no, agrega un `<p class="mensaje mensaje--<tipo>">` creado con `crearElemento`, con el prefijo según tipo (`PREFIJOS_MENSAJE = { exito: 'Éxito: ', error: 'Error: ', info: 'Aviso: ' }`) y `role="alert"` cuando el tipo es `error`.
- `'use strict'` va al inicio de cada archivo (no global compartido: cada script clásico declara el suyo).
**Alternativas**: el prefijo lo pone quien llama → riesgo de mensajes de error sin texto distintivo (RN-UI-05). Usar `innerHTML = ''` para limpiar → prohibido por regla de proyecto aunque no lleve datos, y además ensucia la verificación por `grep`.
**Por qué**: C-03 en adelante agrega a `comun.js` constantes, storage y formato en secciones propias; este change deja solo la sección DOM.

### D9 — Directorio `img/tapas/` vacío
**Decisión**: se crea vacío; las imágenes llegan en C-03. No se agrega archivo marcador (no hay git que lo requiera).

## Risks / Trade-offs

- [Los 5 HTML duplican header, nav y footer sin includes] → copiar el esqueleto de D5 desde una página modelo (`index.html`) y verificar el menú en las 5 con la tarea de verificación; cualquier cambio futuro del menú se hace en las 5.
- [Enviar un formulario maquetado recarga la página con parámetros en la URL] → el aviso "Pendiente — Etapa 2" lo explica; desaparece cuando C-03/C-06/C-07 agregan `preventDefault`.
- [Mover la marca de maqueta de C-04 a C-01 desalinea `CHANGES.md`] → se registra en Open Questions para que el orquestador ajuste el bullet de C-04 a "verificar/documentar".
- [Los avisos de maqueta pueden quedar olvidados en Etapa 2] → los avisos tienen ids `aviso-*` y clase `aviso-maqueta`; C-09 incluye un `grep` de `aviso-maqueta` / "Pendiente — Etapa 2" en el checklist final.
- [`required` + `novalidate` pueden disparar estilos `:invalid` antes de interactuar] → C-02 no estiliza `:invalid`; el estado de error lo pone JS con `aria-invalid` en C-06.
- [El nombre "Librería TUP" es provisorio] → aparece en `<title>`, marca del header y `h1` del catálogo; cambiarlo es un reemplazo de texto en los 5 archivos.

## Migration Plan

No aplica: no hay versión previa ni datos. Rollback = borrar los archivos creados por este change.

## Open Questions

- **Ajuste en `CHANGES.md` (C-04)**: cambiar el bullet "Marca visual estática 'Pendiente — Etapa 2'…" por "Verificar y documentar en el README las marcas de maqueta creadas en C-01". No cambia este change; lo decide el orquestador.
- **Nombre de la librería**: se usa "Librería TUP" como nombre provisorio; el autor puede elegir otro antes de la entrega de la Etapa 1 (reemplazo de texto, no cambia specs ni tareas).
