## Context

C-01 dejó las cinco vistas con estructura semántica estable y tres CSS placeholder ya enlazados en orden (`base.css` → `layout.css` → `componentes.css`). Motivación y alcance: ver `proposal.md`; comportamiento exigido: ver `specs/`.

Lo que condiciona el diseño (observado en el HTML actual y en el diseño archivado de C-01):

- Clases gancho disponibles (C-01 D6): `salto`, `encabezado`, `marca`, `menu`, `pie`, `campo`, `boton`, `tabla-contenedor`, `zona-mensajes`, `aviso-maqueta`, `ayuda`. Los mensajes los crea `mostrarMensaje` como `<p class="mensaje mensaje--<tipo>">` con prefijo textual (C-01 D8). `.tarjeta` todavía no existe en el HTML: la genera C-03.
- `aria-current="page"` está escrito en el HTML de cada página (C-01 D3) y sirve de selector.
- Los campos obligatorios tienen `required` y los formularios `novalidate` (C-01 D6): no se debe estilar `:invalid`.
- En `historial.html` hay un `<dl>` y un `div.tabla-contenedor` con `hidden`; cualquier `display` aplicado a esas clases anularía el `hidden` del navegador.
- Las zonas `zona-mensajes` con `aria-live` / `role="status"` deben existir en el árbol de accesibilidad antes de actualizarse (C-01 D7).
- `<main id="contenido-principal" tabindex="-1">` recibe el foco del enlace de salto.
- Restricciones: CSS puro, sin CDNs, fuentes web ni `@import`; sin tests automatizados (verificación manual); recursos solo locales.

## Goals / Non-Goals

**Goals:**
- Una paleta y un set de variables documentados con sus contrastes medidos, para que cualquier change futuro estile sin inventar colores.
- Selectores basados en clases y atributos (no en ids), para que los elementos que agreguen C-03, C-06, C-07 y C-08 hereden el estilo sin tocar CSS.
- Que la verificación de 320/1280 px, teclado y contraste se pueda hacer en una pasada por vista.

**Non-Goals:**
- Modo oscuro, tema alternativo o estilos de impresión.
- Menú hamburguesa o cualquier comportamiento que requiera JS.
- Imágenes de tapas, contenido de tarjetas y estilos de botones creados dinámicamente que no usen `.boton` (C-03/C-07/C-08 deben usar las clases existentes).
- Estilar `:invalid`, `:user-invalid` o la validación nativa.

## Decisions

### D1 — Paleta "moderna minimal" con un acento verde azulado
**Decisión**: estas custom properties en `:root` de `base.css` (contrastes calculados con la fórmula WCAG 2.x):

| Variable | Valor | Uso | Contraste medido |
|----------|-------|-----|------------------|
| `--color-fondo` | `#f7f8fa` | fondo de página | — |
| `--color-superficie` | `#ffffff` | encabezado, tarjetas, campos, tablas | — |
| `--color-texto` | `#1f2933` | texto principal | 13.89:1 sobre fondo · 14.76:1 sobre superficie |
| `--color-texto-suave` | `#52606d` | ayudas, pie, zonas de estado | 6.08:1 sobre fondo · 6.46:1 sobre superficie |
| `--color-borde` | `#d5dbe3` | bordes decorativos (tarjetas, filas) | decorativo, no transmite información |
| `--color-borde-control` | `#6b7280` | borde de campos | 4.83:1 sobre superficie · 4.55:1 sobre fondo (≥ 3:1) |
| `--color-acento` | `#0f766e` | botones, marca, anillo de foco, borde de página actual | blanco sobre acento 5.47:1 · acento sobre fondo 5.15:1 |
| `--color-acento-oscuro` | `#115e59` | hover de botón, texto del enlace actual | blanco sobre él 7.58:1 · sobre acento-suave 6.71:1 |
| `--color-acento-suave` | `#e6f4f1` | fondo del enlace actual y de `.mensaje--info` | texto sobre él 13.05:1 |
| `--color-error` / `--color-error-suave` | `#b42318` / `#fdecea` | `.mensaje--error`, `aria-invalid` | error sobre superficie 6.57:1 · sobre error-suave 5.75:1 |
| `--color-exito` / `--color-exito-suave` | `#166534` / `#e8f5ec` | `.mensaje--exito` | 7.13:1 · 6.35:1 |
| `--color-aviso` / `--color-aviso-suave` | `#8a4b08` / `#fff7e6` | `.aviso-maqueta` | aviso sobre aviso-suave 6.37:1 · texto sobre aviso-suave 13.84:1 |

Más: `--fuente: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; `--espacio-1..6` = `0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem`; `--radio: 0.5rem`; `--sombra: 0 1px 2px rgb(31 41 51 / 0.06), 0 2px 8px rgb(31 41 51 / 0.08)`; `--ancho-max: 72rem`; `--alto-control: 2.75rem` (44 px).
**Alternativas**: azul (`#1d4ed8`) → genérico, se confunde con el azul de enlaces del navegador; derivar las variantes con `color-mix()` → menos control sobre el contraste de cada par; ámbar o rojo como acento → chocan con los colores semánticos de aviso y error.
**Por qué**: un verde azulado sobrio funciona como "librería" sin ser genérico, todas las combinaciones de texto superan 4.5:1 y los componentes 3:1. Las variantes oscura y suave son del mismo tono, así que se respeta "un solo acento". Error, éxito y aviso son semánticos y solo aparecen en estados.

### D2 — Archivos y selectores: clases y atributos, nunca ids
**Decisión**: `base.css` = variables, reset mínimo (`box-sizing`, márgenes, `img { max-width: 100%; height: auto; display: block }`, `[hidden] { display: none !important }`), tipografía, enlaces, `:focus-visible` y bloque de movimiento. `layout.css` = `.salto`, `.encabezado`, `.marca`, `.menu`, `main`, `.pie`, `.grilla-tarjetas`, disposición de `form` y `dl`. `componentes.css` = `.boton`, `.campo`, `.ayuda`, `[aria-invalid="true"]`, `.tabla-contenedor` y tablas, `.zona-mensajes`, `.mensaje`, `.mensaje--*`, `.aviso-maqueta`, `.tarjeta`. Solo se agrega **una** clase al HTML: `class="grilla-tarjetas"` en `<div id="catalogo">`.
**Alternativas**: estilar `#catalogo`, `#form-libro`, etc. → acopla estilo a ids que son contrato de JS y no se reutiliza; agregar clases a cada `<form>` → innecesario, el selector de tipo `main form` alcanza porque los cuatro formularios comparten disposición.
**Por qué**: ids para JS, clases para estilo; el resto de la estructura de C-01 queda intacta.

### D3 — Tipografía y escala
**Decisión**: `html { font-size: 100% }` (16 px, respeta la preferencia del usuario), `body { line-height: 1.5 }`. Escala ~1.25 con `clamp()`: `h1: clamp(1.75rem, 1.4rem + 1.5vw, 2.25rem)`, `h2: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)`, `caption` y `label` en peso 600. Controles con `font: inherit` (evita el zoom automático de iOS por fuente < 16 px).
**Alternativas**: tamaños fijos en px → no escalan con la preferencia del usuario ni con el zoom.

### D4 — Mobile-first con un breakpoint en 48em
**Decisión**: estilos base para 320 px; un único `@media (min-width: 48em)` (768 px) para encabezado en fila, formularios en columnas y más espaciado lateral. `main` con `max-width: var(--ancho-max)`, `margin-inline: auto` y padding lateral `clamp(1rem, 4vw, 2rem)`. `body` en columna flex con `min-height: 100vh; min-height: 100dvh` y `main { flex: 1 }` para que el pie quede abajo. Hijos flex/grid con `min-width: 0`.
**Alternativas**: varios breakpoints (480/768/1024) → más superficie de prueba sin beneficio para este contenido; container queries → válidas pero innecesarias aquí.
**Por qué**: el breakpoint se usa en `em`, así con zoom al 200 % en 1280 px (640 px CSS efectivos) la vista cae en el layout angosto, que ya está probado.

### D5 — Menú a 320 px: envolver en filas, sin hamburguesa
**Decisión**: `.encabezado` en columna (marca arriba, `nav` abajo); `.menu` con `display: flex; flex-wrap: wrap; gap: var(--espacio-1)`, sin viñetas; cada enlace con `min-height: var(--alto-control)`, `display: inline-flex; align-items: center`, padding horizontal `var(--espacio-2)` y `white-space: nowrap`. A ≥ 48em: `.encabezado` en fila con `justify-content: space-between`. Enlaces del menú sin subrayado (son navegación reconocible por posición); hover subrayado solo bajo `@media (hover: hover)`. Enlace actual: `[aria-current="page"]` con fondo `--color-acento-suave`, texto `--color-acento-oscuro`, `font-weight: 700` y `border-bottom: 3px solid var(--color-acento)`.
**Alternativas**: apilar los cinco enlaces en columna → ocupa ~5 × 44 px de alto antes del contenido; menú hamburguesa → requiere JS y oculta la navegación.
**Por qué**: los cinco textos ("Catálogo", "Libros", "Clientes", "Ventas", "Historial") entran en dos filas a 320 px, sin desplazamiento y sin JS.

### D6 — Enlace de salto
**Decisión**: `.salto` con `position: absolute; top: var(--espacio-2); left: var(--espacio-2); z-index: 10`, fondo `--color-acento`, texto blanco, padding y radio; fuera de vista con `transform: translateY(-200%)` y visible con `.salto:focus { transform: none }` (el anillo lo da `:focus-visible`). `main[tabindex="-1"]:focus { outline: none }`: `main` no es un control; el siguiente Tab cae en el primer control con su foco visible.
**Alternativas**: `display: none` hasta el foco → no se puede enfocar; técnica `clip` de "solo lectores de pantalla" → equivalente, pero `transform` es más simple de leer; dejar el contorno en `main` → un recuadro alrededor de toda la página sin valor informativo.

### D7 — Formularios: una columna en celular, grilla en escritorio
**Decisión**: `main form` con `display: grid; gap: var(--espacio-3)`. A ≥ 48em: `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))`; el botón con `grid-column: 1 / -1; justify-self: start`. El buscador del catálogo (`[role="search"]`) limitado a `max-width: 32rem`. `.campo` en columna con `gap: var(--espacio-1)`; controles con `width: 100%`, `min-height: var(--alto-control)`, borde `1px solid var(--color-borde-control)`, fondo superficie, radio. `select[multiple]` con `min-height: 8rem`. `.ayuda` en `0.875rem` y `--color-texto-suave`. El `.campo` de cliente en `ventas.html` (fuera de formulario) usa `max-width: 32rem`.
**Alternativas**: columnas fijas de 2 → a 768 px los selectores múltiples quedan estrechos; `flex-wrap` → alineación irregular de alturas.

### D8 — Estado de error de campo solo por `aria-invalid`
**Decisión**: ningún selector `:invalid` / `:user-invalid`. `[aria-invalid="true"]` = `border: 2px solid var(--color-error)` (más grueso que el normal, no solo color). Queda listo para C-06, que además pone el texto del error con `aria-describedby`.
**Alternativas**: `:user-invalid` → depende de la validación nativa, desactivada por `novalidate`, y produciría estados distintos a los de la validación JS.

### D9 — Tablas: desplazamiento dentro de `.tabla-contenedor`
**Decisión**: `.tabla-contenedor { overflow-x: auto; max-width: 100%; border: 1px solid var(--color-borde); border-radius: var(--radio); background: var(--color-superficie) }`; `table { width: 100%; border-collapse: collapse }`; `th, td` con padding `var(--espacio-2) var(--espacio-3)` y borde inferior `--color-borde`; `th { white-space: nowrap; text-align: left }`; `thead th` con fondo `--color-fondo` y peso 600; `caption` alineado a la izquierda, peso 600, con padding; `tfoot` en negrita con borde superior de 2px `--color-texto`. Sin `min-width` en la tabla: las celdas de datos parten texto y solo desborda lo que no entra (encabezados `nowrap`). No se agrega `tabindex` al contenedor: Chrome (≥ 130) y Firefox ya hacen enfocables por teclado los contenedores con desbordamiento; se verifica en la pasada de Tab a 320 px.
**Alternativas**: convertir las tablas en tarjetas a 320 px con `display: block` → rompe la semántica de tabla para lectores de pantalla en algunos navegadores; `tabindex="0"` + `role="region"` en cada contenedor → agrega cinco paradas de Tab aunque la tabla no desborde y cambia el HTML de C-01.

### D10 — Mensajes, zonas y aviso de maqueta
**Decisión**:
- `.mensaje`: bloque con padding `var(--espacio-2) var(--espacio-3)`, `border-left: 4px solid`, radio, `margin-block: var(--espacio-2)`. `--error`: texto y borde `--color-error`, fondo `--color-error-suave`. `--exito`: idem con éxito. `--info`: texto `--color-texto`, borde `--color-acento`, fondo `--color-acento-suave`. El prefijo ("Error: ", "Éxito: ", "Aviso: ") lo pone `mostrarMensaje`; el CSS no lo duplica.
- `.zona-mensajes`: texto `--color-texto-suave`. **No** se oculta cuando está vacía (`display: none` puede sacarla del árbol de accesibilidad y perder el anuncio de la región viva); vacía solo pierde márgenes con `:empty { margin: 0 }`.
- `.aviso-maqueta`: `border: 2px dashed var(--color-aviso)`, fondo `--color-aviso-suave`, texto `--color-texto` en `font-weight: 600`, padding, radio y `margin-block: var(--espacio-3)`. El borde discontinuo ("en construcción") lo distingue de los mensajes (borde lateral sólido) aun sin color; el texto "Pendiente — Etapa 2:" ya está en el HTML.
**Alternativas**: agregar un ícono con `::before` → contenido generado que los lectores pueden leer dos veces y que no suma a un texto ya explícito; ocultar zonas vacías → riesgo de anuncios perdidos.

### D11 — Tarjetas e imagen de tapa
**Decisión**: `.grilla-tarjetas { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); gap: var(--espacio-4) }`. `.tarjeta`: superficie, borde `--color-borde`, `--radio`, `--sombra`, padding `var(--espacio-3)`, `display: flex; flex-direction: column; gap: var(--espacio-2)`. `.tarjeta img { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: calc(var(--radio) / 2); background: var(--color-fondo) }`. Contrato para C-03: `<article class="tarjeta">` con `<img>` primero y luego los datos; el título como `h3` (sigue al `h2` "Catálogo").
**Alternativas**: alto fijo en px → deforma la proporción según el ancho de columna; `object-fit: contain` → bandas vacías con tapas de distinta proporción.
**Por qué**: 2:3 es la proporción típica de una tapa; `min(220px, 100%)` evita desborde en anchos menores a 220 px.

### D12 — Botón, movimiento y modos de alto contraste
**Decisión**: `.boton`: fondo `--color-acento`, texto blanco, `border: 2px solid transparent` (visible en modo de colores forzados de Windows), `min-height: var(--alto-control)`, padding `var(--espacio-2) var(--espacio-4)`, radio, `font: inherit; font-weight: 600; cursor: pointer`. Hover (`@media (hover: hover)`): `--color-acento-oscuro`. Foco global: `:focus-visible { outline: 3px solid var(--color-acento); outline-offset: 2px }` (anillo sobre fondo claro: 5.15–5.47:1). La única transición (color de fondo del botón, 150 ms) vive dentro de `@media (prefers-reduced-motion: no-preference)`; el enlace de salto aparece sin transición.
**Alternativas**: `outline: 2px solid currentColor` (sugerido por la skill de accesibilidad) → sobre el botón blanco-sobre-acento el anillo sería blanco y no se vería contra el fondo claro.

## Risks / Trade-offs

- [`display` en `.tabla-contenedor` o `dl` anula `hidden`] → `[hidden] { display: none !important }` en `base.css`; la tarea de verificación de historial lo comprueba.
- [Contenedores de tabla no enfocables en navegadores viejos] → se verifica con Tab a 320 px en Chrome y Firefox actuales; si uno no permite desplazar con teclado, se agrega `tabindex="0"` + `role="region"` + `aria-labelledby` al contenedor (cambio de atributo, no de estructura) y se registra en `tasks.md`.
- [`.tarjeta` no existe hasta C-03] → se verifica inyectando tarjetas de prueba desde la consola con `crearElemento`, sin guardar código.
- [Tablas con muchas columnas a 320 px requieren desplazamiento lateral] → aceptado por la consigna (RN-UI-08: scroll dentro del contenedor).
- [Valores `clamp()` con `vw` y zoom] → los mínimos y máximos están en `rem`, así el texto crece con el zoom.
- [Hex elegidos a mano pueden no gustar al autor] → todo vive en variables de `:root`; cambiar el acento es editar tres valores y re-medir contraste.

## Migration Plan

No aplica: no hay datos ni versión previa estilada. Rollback = restaurar los tres CSS a su comentario de cabecera y quitar `class="grilla-tarjetas"` de `index.html`.

## Open Questions

- Ninguna que bloquee. El autor puede pedir otro tono de acento antes de la entrega de la Etapa 1; no cambia specs ni tareas (solo los valores de D1 y su re-medición).
