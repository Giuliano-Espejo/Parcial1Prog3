# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Estructura multipágina
**Decisión**: cinco archivos HTML: `index.html` (Catálogo), `libros.html`, `clientes.html`, `ventas.html` e `historial.html`.
**Contexto**: la consigna admite varias páginas o secciones de una misma página.
**Alternativas consideradas**: una sola página con secciones que se muestran u ocultan por hash.
**Justificación**: navegación clara con enlaces reales, sin lógica de router; cada vista se evalúa por separado.
**Trade-offs aceptados**: el estado no se comparte en memoria. Todo pasa por `localStorage` (DD-03) y la venta en curso se pierde si se sale de `ventas.html` antes de confirmar.

### DD-02 — Scripts clásicos, sin ES modules
**Decisión**: `<script src defer>` sin `type="module"`; funciones globales expuestas por `comun.js`.
**Contexto**: la consigna exige abrir `index.html` en el navegador sin npm, y los ES modules desde `file://` fallan por CORS en Chrome.
**Alternativas consideradas**: ES modules con un servidor local (Live Server), descartados porque el docente abre el archivo directamente.
**Justificación**: funciona con doble clic en cualquier navegador.
**Trade-offs aceptados**: hay nombres globales. Se mitiga con nombres descriptivos, `'use strict'` y que solo `comun.js` exponga utilidades compartidas.

### DD-03 — `localStorage` desde la Etapa 2, no solo en el Ej. 6
**Decisión**: desde el momento en que las pantallas se conectan a datos, todas las colecciones mutables se leen y escriben en `localStorage`.
**Contexto**: el Ej. 6 ubica la persistencia "en la etapa final", pero con multipágina un alta en `libros.html` no llegaría a `index.html` ni a `ventas.html`.
**Justificación**: es la consecuencia directa de DD-01; sin esto, el Ej. 4 no cumpliría "aparece en catálogo y selección de venta".
**Trade-offs aceptados**: la persistencia se implementa antes de lo que sugiere el orden de la consigna.

### DD-04 — Un archivo JS por página más `comun.js`
**Decisión**: `js/comun.js` más `catalogo.js`, `libros.js`, `clientes.js`, `ventas.js` e `historial.js`.
**Contexto**: el usuario lo eligió por sobre una estructura en capas (`datos/`, `dominio/`, `ui/`, `paginas/`).
**Justificación**: menos archivos y un mapeo directo con cada página.
**Trade-offs aceptados**: las validaciones conviven con el código de DOM en el mismo archivo. **Mitigación obligatoria**: cada archivo se divide en secciones `Lógica (pura)` / `Render` / `Eventos` / `Inicio`, y las funciones de validación y cálculo no tocan el DOM ni `localStorage`.

### DD-05 — Verificación solo con casos manuales
**Decisión**: no hay tests automatizados; la verificación es la tabla de casos manuales del README. **Strict TDD queda desactivado para este proyecto.**
**Contexto**: la consigna prohíbe incluir dependencias y herramientas en la entrega, y pide casos manuales reproducibles.
**Alternativas consideradas**: `node --test` sobre las funciones puras, con los tests fuera de la entrega.
**Justificación**: elección del usuario; se alinea literalmente con la consigna.
**Trade-offs aceptados**: las regresiones solo se detectan volviendo a correr los casos a mano antes de cada entrega.

### DD-06 — Libro repetido en una venta: sumar la cantidad
**Decisión**: si el libro ya tiene renglón, se suma la cantidad nueva y se muestra un aviso.
**Contexto**: la consigna admite "modificar la cantidad del renglón existente o informar el duplicado".
**Justificación**: es más cómodo para el operador; cumple "el duplicado no crea otro renglón".

### DD-07 — Una clave de `localStorage` por colección
**Decisión**: `libreria.libros`, `libreria.clientes` y `libreria.ventas`. Editoriales, géneros y autores son constantes en `comun.js`.
**Contexto**: el docente edita a mano el precio de un libro con DevTools.
**Alternativas consideradas**: una única clave `libreria` con todo el estado.
**Justificación**: el JSON de libros queda chico y fácil de ubicar y editar; la semilla se controla por clave (RN-PE-02).

### DD-08 — En la Etapa 1, el catálogo ya se genera con JS
**Decisión**: desde el avance de la Etapa 1, el catálogo se genera desde el array semilla y el filtro funciona. Libros y Clientes muestran sus listados desde la semilla; los formularios de alta y la venta quedan maquetados y marcados como "pendiente".
**Contexto**: la consigna permite datos estáticos de ejemplo en la Etapa 1, pero no los exige.
**Justificación**: evita reescribir en la Etapa 2; el filtro es la "interacción básica" que pide la Etapa 1.

### DD-09 — Identidad visual moderna minimal con fuentes del sistema
**Decisión**: fondo claro, un acento, `system-ui` sans-serif, tarjetas limpias.
**Contexto**: no se pueden usar CDNs (tampoco Google Fonts).
**Justificación**: elección del usuario; las fuentes del sistema no requieren archivos.

### DD-10 — Redondeo de importes a 2 decimales
**Decisión**: `redondear2(n) = Math.round(n * 100) / 100` para subtotales y total; `Intl.NumberFormat('es-AR')` para mostrar.
**Contexto**: errores de punto flotante (por ejemplo, `0.1 * 3`).
**Justificación**: los totales del caso manual (3000 + 2000 = 5000) tienen que coincidir exactamente.

## Supuestos inferidos

### SU-01 — El avance de la Etapa 1 es una entrega intermedia real
**Supuesto**: en la Etapa 1 se entrega un avance cuyo README distingue maquetas de interacciones funcionales.
**Origen**: "En un avance de la etapa 1 se identifica expresamente qué pantallas son maquetas…".
**Riesgo si es falso**: bajo; solo se ahorraría un README intermedio.
**Cómo validar**: consultar al docente la modalidad.

### SU-02 — `localStorage` se comparte entre las páginas de la misma carpeta
**Supuesto**: abriendo los HTML desde la misma carpeta con `file://`, las 5 páginas ven el mismo `localStorage`.
**Origen**: comportamiento de Chrome (origen `file://` compartido). La consigna menciona "la ubicación de apertura" como factor.
**Riesgo si es falso**: alto. En algunos navegadores o configuraciones (por ejemplo, Firefox con políticas estrictas sobre `file://`) las páginas podrían no compartir datos y el flujo multipágina se rompería.
**Cómo validar**: en el primer change con persistencia, dar de alta un libro en `libros.html` y verificarlo en `index.html` en Chrome **y** Firefox. Documentar el resultado en el README.

### SU-03 — El ISBN no requiere un formato de longitud
**Supuesto**: alcanza con que no esté vacío y no esté duplicado (normalizado); no se exigen 10 o 13 dígitos.
**Origen**: "no se requiere implementar su dígito de control".
**Riesgo si es falso**: bajo.
**Cómo validar**: consultar al docente; si lo pide, agregar una validación `^\d{9}[\dX]$|^\d{13}$`.

### SU-04 — Los libros dados de alta no llevan imagen
**Supuesto**: el formulario no pide imagen; esos libros se muestran sin tapa (o con un placeholder decorativo con `alt=""`).
**Origen**: el formulario de la consigna solo lista título, ISBN, precio, editorial, género y autores.
**Riesgo si es falso**: bajo.

### SU-05 — La venta en curso no se persiste
**Supuesto**: la composición de la venta vive en memoria hasta confirmarse.
**Origen**: la consigna exige persistir libros, clientes y ventas (confirmadas).
**Riesgo si es falso**: bajo; si se recarga a mitad de una venta, hay que rearmarla.
