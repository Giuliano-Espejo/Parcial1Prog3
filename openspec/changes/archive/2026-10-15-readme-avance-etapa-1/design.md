## Context

Motivación y alcance: ver `proposal.md`. Requisitos: ver `specs/documentacion-entrega/spec.md`.

Estado actual observado (después de C-01..C-03):

- Cinco páginas con el mismo `nav aria-label="Principal"` (enlace activo con `aria-current="page"`) y pie "TPI Programación III — UTN-TUP · Giuliano Espejo".
- `index.html`: catálogo generado por `js/catalogo.js` desde `cargarLibros()` (6 libros) con filtro por título en vivo. Sin aviso de maqueta.
- `libros.html` / `clientes.html`: listados generados desde la semilla (6 libros / 3 clientes); formularios de alta con `p.aviso-maqueta` (`#aviso-libro`, `#aviso-cliente`) "Pendiente — Etapa 2: el formulario es parte de la maqueta y todavía no registra …"; los selectores de editorial, género y autores todavía están vacíos.
- `ventas.html`: `#aviso-venta` "Pendiente — Etapa 2: la composición y la confirmación de la venta son parte de la maqueta y todavía no funcionan."; selectores vacíos, tabla de renglones vacía; `js/ventas.js` es un placeholder.
- `historial.html`: `#aviso-historial` "Pendiente — Etapa 2: el historial es parte de la maqueta y todavía no muestra ventas."; tablas vacías; `js/historial.js` es un placeholder.
- `js/comun.js`: sección `// ===== Datos =====` con `EDITORIALES`, `GENEROS`, `AUTORES`, `LIBROS_SEMILLA` (6) y `CLIENTES_SEMILLA` (3); `cargarLibros()` / `cargarClientes()` devuelven copias en memoria (C-05 las conecta a `localStorage`). No hay ninguna llamada a `localStorage`.
- `img/tapas/lib-1.svg` … `lib-6.svg`: SVG dibujados a mano por el autor (C-03 D9).
- C-03 `tasks.md` registra "verificado manualmente por el usuario en Chrome y Firefox, 2026-10-15" para la tabla del filtro (3.5) y los anchos/foco (6.3), pero como confirmación global: no hay resultado observado caso por caso.
- No existe `README.md`. El proyecto no es un repositorio git. El sistema del usuario es Windows 11.

Restricciones (AGENTS.md): sin tests automatizados ni Strict TDD; nunca marcar un caso como aprobado sin ejecutarlo (RN-GL-02); la entrega lleva solo los HTML, `css/`, `js/`, `img/` y `README.md`; sin builds ni scripts. Estilo del README: skill `cognitive-doc-design` (respuesta primero, encabezados como señales, tablas y checklists antes que prosa).

## Goals / Non-Goals

**Goals:**
- Un README que el docente pueda recorrer en orden (quién, qué entrega es, cómo abrir, qué funciona) y que C-09 extienda reemplazando secciones enteras, sin reestructurar.
- Que ningún resultado del README dependa de la memoria del agente: solo lo que el usuario observó o lo que el agente ejecutó él mismo (búsquedas en archivos).
- Un procedimiento de empaquetado que el usuario pueda repetir en Windows con el Explorador, sin herramientas.

**Non-Goals:**
- Tocar `*.html`, `*.css` o `*.js` (si la verificación encuentra una incoherencia entre página y README, se corrige el README o se reporta; no se cambia la página en este change).
- Documentar `localStorage` en detalle (claves, estructura de `libreria.libros`, límites): es de C-05/C-09.
- Crear el zip desde el agente o dejar scripts de empaquetado en el proyecto.

## Decisions

### D1 — Estructura y orden del README

Un único `# Librería TUP — TPI Programación III` y secciones `##` en este orden. La columna "C-09" indica qué hace el README final con cada sección, para que el esqueleto no cambie.

| # | Sección (`##`) | Contenido en el avance | C-09 |
|---|----------------|------------------------|------|
| 0 | (párrafo inicial bajo el `#`) | Qué es (frontend estático de una librería, HTML/CSS/JS nativos, sin librerías ni build) + línea **Estado: avance de la Etapa 1** con remisión a la sección 4 | Cambia el estado a "entrega final" |
| 1 | Autor | Giuliano Espejo · trabajo individual · Programación III, UTN-TUP | Igual |
| 2 | Cómo abrir el proyecto | Pasos numerados: descomprimir conservando carpetas → doble clic en `index.html` → Chrome o Firefox; sin npm, sin servidor, sin internet | Igual (+ nota de `localStorage` por navegador/perfil) |
| 3 | Navegación entre vistas | Tabla Vista · Archivo · Para qué sirve; menú común en todas las páginas, con mouse o teclado (Tab/Enter) | Igual |
| 4 | Maquetas e interacciones funcionales | Tabla por vista (D2) + cita del aviso "Pendiente — Etapa 2" | Se elimina (no quedan maquetas) |
| 5 | Funcionalidades | `### Implementadas` y `### Pendientes (Etapa 2)` como listas de verificación | Pendientes se vacían o listan lo que quede |
| 6 | Datos iniciales | `js/comun.js`, sección `// ===== Datos =====`; constantes y cantidades (6 libros, 3 clientes, editoriales, géneros, autores); en el avance los datos viven en memoria y se recrean al recargar | Agrega cómo actúa la semilla sobre `localStorage` |
| 7 | Persistencia con `localStorage` | "En este avance la aplicación todavía no guarda datos en `localStorage`; llega en la Etapa 2." | Se reescribe: funcionamiento, límites, claves y estructura de `libreria.libros` |
| 8 | Casos manuales | Tabla A1–A12 (D3) + `### Controles de alcance` (D6) | Se reemplaza por los 8 casos de la consigna |
| 9 | Imágenes | Las seis tapas de `img/tapas/` son SVG de elaboración propia del autor; no hay imágenes de terceros | Igual (citar procedencia si se agrega alguna ajena) |
| 10 | Contenido de la entrega | Árbol de lo incluido (D4) y aclaración de que no hay dependencias ni build | Igual |

Convenciones de redacción: español rioplatense coherente con la interfaz ("consultá", "Seleccioná"), oraciones cortas, tablas en lugar de párrafos, rutas y nombres de archivo en `código`, enlaces relativos solo a archivos de la entrega (sin URLs externas), UTF-8. No se incluye índice ni insignias.

Alternativas descartadas: README por vista (más largo de recorrer, duplica la navegación); dejar "Funcionalidades" antes de "Cómo abrir" (el docente primero necesita abrir el proyecto).

### D2 — Sección "Maquetas e interacciones funcionales" como tabla por vista

Tabla con columnas **Vista (archivo) · Qué ya funciona · Qué es maqueta ("Pendiente — Etapa 2")**, una fila por vista, y una fila final "Todas las vistas":

| Vista | Funciona | Maqueta |
|-------|----------|---------|
| Catálogo (`index.html`) | 6 tarjetas generadas con JS desde la semilla (tapa, título, autores, editorial, género, precio); filtro por título en vivo, sin distinguir mayúsculas, ignorando espacios exteriores y con búsqueda parcial; mensaje cuando no hay resultados; Enter no recarga | — (nada) |
| Libros (`libros.html`) | Listado de los 6 libros generado desde la semilla | Formulario "Registrar libro" (no registra; selectores vacíos) |
| Clientes (`clientes.html`) | Listado de los 3 clientes generado desde la semilla | Formulario "Registrar cliente" (no registra) |
| Ventas (`ventas.html`) | Solo estructura y navegación | Toda la venta: cliente, renglones, resumen y confirmación |
| Historial (`historial.html`) | Solo estructura y navegación | Listado de ventas y detalle (vacíos) |
| Todas | Menú de navegación, diseño adaptable 320–1280 px, foco visible | — |

Debajo, una línea que explica que cada parte de maqueta muestra en pantalla el aviso "Pendiente — Etapa 2". La maqueta se describe como "no registra / no funciona todavía", sin afirmar qué pasa exactamente al presionar el botón (no está verificado y no forma parte del avance).

Alternativa descartada: dos listas separadas (maquetas / funcional): obliga a cruzar listas para saber el estado de una pantalla; la consigna pide identificar "qué pantallas", y la fila por vista lo responde directo.

### D3 — Casos manuales del avance y regla de registro

Tabla con columnas **# · Caso · Pasos / entrada · Resultado esperado · Chrome · Firefox**. Casos (prefijo `A` = avance, para no chocar con la numeración 1–8 de C-09):

| # | Caso | Entrada / pasos | Esperado |
|---|------|-----------------|----------|
| A1 | Filtro, minúsculas | `noche` | 3 libros: La noche del faro, Cartas a la Noche, Diario de una NOCHE sin luna |
| A2 | Filtro, mayúsculas | `NOCHE` | Los mismos 3 |
| A3 | Filtro, espacios exteriores | `   noche   ` | Los mismos 3 |
| A4 | Filtro, parcial | `noch` | Los mismos 3 |
| A5 | Filtro, otra palabra | `PUERTO` | 2: Mapas del puerto, El Puerto dormido |
| A6 | Filtro vacío | vacío o solo espacios (también la "x" del campo o Escape) | Los 6 libros, sin mensaje |
| A7 | Filtro sin resultados | `Zzz` | Ninguna tarjeta + "Aviso: No se encontraron libros para «Zzz»." |
| A8 | Filtro con etiquetas | `<b>hola</b>` | Ninguna tarjeta + el texto literal en el mensaje, sin negrita |
| A9 | Apertura sin servidor | Doble clic en `index.html` sin conexión; recorrer las 5 vistas por el menú | 6 tarjetas con tapa; las 5 vistas abren; consola sin errores |
| A10 | Ancho 320 px | Las 5 vistas a 320 px (DevTools, modo responsive) | Sin scroll horizontal de página; tarjetas en una columna; tablas con desplazamiento propio |
| A11 | Ancho 1280 px | Las 5 vistas a 1280 px | Sin scroll horizontal; 4 o más tarjetas por fila en el catálogo |
| A12 | Teclado | Recorrer con Tab el menú, el buscador y los controles de las 5 vistas; Enter en el buscador | Foco siempre visible; Enter filtra sin recargar ni cambiar la URL |

A1–A8 salen de C-03 D10; A10–A12 corresponden al caso 8 de C-09; A1–A8 al caso 1.

**Regla de registro (RN-GL-02)**: las columnas Chrome y Firefox se escriben inicialmente con el texto literal **"Pendiente de ejecutar"**. El agente de apply MUST NOT reemplazarlo por su cuenta: le pide al usuario el resultado observado de cada caso y navegador y escribe exactamente lo que el usuario informa (por ejemplo "OK: 3 tarjetas", o la descripción de la falla). La confirmación global de C-03 no alcanza para llenar celdas; sirve solo como recordatorio para el usuario. Si el usuario no ejecuta un caso antes de la entrega, la celda queda "Pendiente de ejecutar": es honesto y cumple la consigna. Se agrega la fecha de ejecución en una línea bajo la tabla solo si el usuario la informa.

Alternativa descartada: una columna única "Resultado" (oculta diferencias entre motores, que la KB pide documentar).

### D4 — Armado del zip del avance en Windows, sin herramientas

- **Qué entra** (lo lista el README en la sección 10 como árbol): `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `css/`, `js/`, `img/` (con `img/tapas/`), `README.md`. Todo lo demás de la raíz queda afuera (ver spec).
- **Cómo se arma**: lo hace el usuario a mano; el procedimiento vive en `tasks.md`, no en el README (al docente no le sirve):
  1. Crear una carpeta nueva fuera del proyecto, por ejemplo `TPI-Libreria-Espejo-avance-etapa-1`.
  2. Copiar en ella los cinco HTML, `css/`, `js/`, `img/` y `README.md` desde el Explorador.
  3. Clic derecho sobre la carpeta → "Comprimir en archivo ZIP" (Windows 11) o "Enviar a → Carpeta comprimida (en zip)". El zip contiene la carpeta como raíz.
  4. Descomprimir el zip en otra ubicación, sin conexión, y abrir `index.html` para confirmar que abre igual (escenario "La entrega abre igual que el proyecto").
- Alternativa opcional para el usuario: `Compress-Archive` escrito en la consola de PowerShell, sin guardar ningún script. Se descarta un `.ps1`/`.bat` en el proyecto: la consigna excluye herramientas de compilación y AGENTS.md prohíbe builds; además se colaría en la entrega.
- El agente de apply no crea el zip ni carpetas fuera del proyecto; solo verifica que los archivos listados existen y que el árbol del README coincide con ellos.

### D5 — Sin fecha, canal ni modalidad de entrega

P-01 sigue abierta. El README no menciona fecha, canal ni modalidad; tampoco usa marcadores tipo "Fecha: a confirmar" (no aportan al docente). Si el usuario informa la fecha durante el apply, tampoco se agrega: no forma parte de lo que la consigna pide en el README.

### D6 — Quién registra cada resultado

- Casos de navegador (A1–A12): solo el usuario (D3).
- Controles de alcance (subsección `### Controles de alcance` dentro de Casos manuales): el agente de apply los ejecuta él mismo con búsquedas sobre `*.html`, `*.js` y `*.css` (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `type="module"`, `http://`, `https://`) y registra el resultado obtenido ("sin resultados" o el archivo y línea encontrados). El README es `.md` y queda fuera del barrido.

### D7 — Capacidad nueva `documentacion-entrega`

Ninguna de las 10 capacidades existentes cubre la documentación ni la carpeta de entrega (`estructura-proyecto` cubre directorios y recursos locales del código). Se crea `documentacion-entrega` con requisitos redactados de forma general y condiciones "mientras la entrega sea un avance de la Etapa 1", para que C-09 solo modifique los requisitos de maquetas, persistencia y casos.

## Risks / Trade-offs

- [El README describe algo distinto de lo que muestran las páginas] → tarea de verificación que compara cada fila de D2 con la página abierta y con los avisos `p.aviso-maqueta`; ante una diferencia se ajusta el README, no la página.
- [El agente "completa" resultados por inercia o a partir de la nota global de C-03] → D3 fija el texto "Pendiente de ejecutar" y prohíbe reemplazarlo sin respuesta explícita del usuario; la tarea final busca "OK" en la tabla y lo contrasta con lo informado.
- [Los avisos o el comportamiento cambian en C-05..C-08 y el README queda desactualizado] → la columna C-09 de D1 marca qué secciones se reescriben; C-09 es dueño del README final.
- [El zip incluye por error carpetas de planificación] → el procedimiento copia elemento por elemento a una carpeta nueva (no comprime la raíz del proyecto) y la última tarea lista el contenido del zip.
- [El docente lee el README como texto plano] → Markdown simple (encabezados, tablas, listas) legible también sin renderizar.

## Migration Plan

No hay datos ni código que migrar. Rollback: borrar `README.md`.

## Open Questions

- Nombre del zip y si el docente pide una convención (por ejemplo apellido y comisión): se ajusta al armarlo, sin cambiar el contenido.
- Fecha, canal y modalidad de entrega (P-01): las comunica el docente; no afectan el README (D5).
