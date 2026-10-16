# Librería TUP — TPI Programación III

Frontend estático de una librería (catálogo, libros, clientes, ventas e historial) hecho solo con HTML, CSS y JavaScript nativos: sin librerías, sin frameworks y sin build.

**Estado: entrega final.** Las cinco vistas son funcionales; el detalle está en la sección [4](#4-maquetas-e-interacciones-funcionales).

## 1. Autor

| Dato | Valor |
|------|-------|
| Autor | Giuliano Espejo |
| Modalidad | Trabajo individual |
| Materia | Programación III, UTN-TUP |

## 2. Cómo abrir el proyecto

1. Descomprimí la entrega conservando las carpetas (`css/`, `js/`, `img/`) junto a los archivos HTML.
2. Hacé doble clic en `index.html`.
3. Se abre en el navegador y muestra el catálogo. El proyecto se verificó en Google Chrome; en Firefox no se probó (ver sección 7).

No hace falta instalar nada, ejecutar comandos, levantar un servidor ni tener conexión a internet.

## 3. Navegación entre vistas

Todas las páginas comparten el mismo menú "Principal", que se usa con el mouse o con el teclado (Tab y Enter).

| Vista | Archivo | Para qué sirve |
|-------|---------|----------------|
| Catálogo | [`index.html`](index.html) | Ver los libros en tarjetas y filtrarlos por título |
| Libros | [`libros.html`](libros.html) | Listado de libros y formulario de alta |
| Clientes | [`clientes.html`](clientes.html) | Listado de clientes y formulario de alta |
| Ventas | [`ventas.html`](ventas.html) | Composición y confirmación de una venta |
| Historial | [`historial.html`](historial.html) | Listado de ventas y su detalle |

## 4. Maquetas e interacciones funcionales

| Vista | Qué ya funciona | Qué es maqueta ("Pendiente — Etapa 2") |
|-------|-----------------|-----------------------------------------|
| Catálogo (`index.html`) | 6 tarjetas generadas con JavaScript desde los datos guardados (tapa, título, autores, editorial, género y precio). Filtro por título en vivo: sin distinguir mayúsculas, ignorando espacios exteriores y con búsqueda parcial. Mensaje cuando no hay resultados. Enter no recarga la página. Los libros dados de alta desde Libros aparecen sin imagen de tapa | Nada |
| Libros (`libros.html`) | Listado generado desde los datos guardados + alta validada (título, ISBN único, precio mayor que 0, editorial, género y autores; errores con "Error:", foco al primer campo inválido y actualización del listado sin recargar) | Nada |
| Clientes (`clientes.html`) | Listado generado desde los datos guardados + alta validada (nombre completo y email único; errores con "Error:", foco al primer campo inválido y actualización del listado sin recargar) | Nada |
| Ventas (`ventas.html`) | Composición y confirmación con snapshot histórico (cliente, renglones editables con cantidad, total a 2 decimales, mensaje con id y total) | Nada |
| Historial (`historial.html`) | Listado de ventas confirmadas (número, fecha, cliente, total) con detalle por venta armado solo con las copias históricas (título, ISBN, precio unitario, nombre y email del cliente); los valores del historial no cambian si después cambia el precio en el catálogo | Nada |
| Todas las vistas | Menú de navegación, diseño adaptable (320 a 1280 px), foco visible con teclado. Los datos se guardan en `localStorage` del navegador y las vistas los leen de ahí (ver la sección [7](#7-persistencia-con-localstorage) sobre si se comparten entre páginas según el navegador) | Nada |

Todas las vistas son funcionales y ninguna página muestra el aviso de maqueta.

## 5. Funcionalidades

### Implementadas

- [x] Menú de navegación común a las cinco vistas.
- [x] Catálogo con 6 tarjetas generadas desde los datos guardados.
- [x] Filtro del catálogo por título, en vivo.
- [x] Listado de libros (6) y de clientes (3).
- [x] Alta de libros validada (título, ISBN único, precio mayor que 0, editorial, género y autores) con actualización del listado sin recargar.
- [x] Alta de clientes validada (nombre completo y email único) con actualización del listado sin recargar.
- [x] Composición y confirmación de la venta con snapshot histórico (cliente, renglones editables con cantidad, total a 2 decimales y mensaje con id y total).
- [x] Historial de ventas con detalle armado solo con las copias históricas (los valores mostrados no cambian si después cambia el precio en el catálogo).
- [x] Diseño adaptable y foco visible con teclado.
- [x] Persistencia en `localStorage`: los datos iniciales se guardan la primera vez y las vistas leen de lo guardado (sección 7).

### Pendientes

- Ninguna — entrega final completa.

## 6. Datos iniciales

| Qué | Dónde | Cantidad |
|-----|-------|----------|
| Archivo | [`js/comun.js`](js/comun.js), sección `// ===== Datos =====` | — |
| Libros (`LIBROS_SEMILLA`) | Misma sección | 6 |
| Clientes (`CLIENTES_SEMILLA`) | Misma sección | 3 |
| Editoriales, géneros y autores | `EDITORIALES`, `GENEROS`, `AUTORES` | 2, 2 y 3 |

La primera vez que falta una clave, estos datos se copian a `localStorage`; después se usan los datos guardados (ver sección 7).

## 7. Persistencia con `localStorage`

### Qué se guarda

| Clave | Contenido | Valor inicial |
|-------|-----------|---------------|
| `libreria.libros` | Arreglo de libros | Los 6 libros de `LIBROS_SEMILLA` |
| `libreria.clientes` | Arreglo de clientes | Los 3 clientes de `CLIENTES_SEMILLA` |
| `libreria.ventas` | Arreglo de ventas | `[]` (sin ventas) |

Editoriales, géneros y autores no se guardan: siempre salen de `js/comun.js`.

Los datos iniciales se escriben solo cuando falta la clave. Recargar la página no duplica ni reemplaza lo guardado.

### Ver y editar los datos

- Chrome: herramientas de desarrollo (F12) → Application → Local Storage → origen `file://`.
- Firefox: herramientas de desarrollo (F12) → Almacenamiento → Almacenamiento local → origen `file://`.

Los valores se guardan en JSON compacto, en una sola línea. Ejemplo de un libro dentro de `libreria.libros`:

```
{"id":"lib-1","titulo":"La noche del faro","isbn":"978-987-8000-01-5","precio":1500,"editorialId":"ed-1","generoId":"gen-1","autorIds":["aut-1"],"imagen":"img/tapas/lib-1.svg"}
```

Para cambiar un precio, buscar el patrón `"precio":1500` (sin espacio) y reemplazarlo, por ejemplo por `"precio":9999`. Después hay que recargar las páginas abiertas para ver el cambio.

### Restaurar los datos iniciales

- Desde las herramientas de desarrollo: borrar una clave o las tres en Almacenamiento local y recargar. Solo se restaura la colección cuya clave se borró.
- Desde la consola: `localStorage.removeItem('libreria.libros')` (o `libreria.clientes`, `libreria.ventas`) y recargar.

### Datos dañados y navegador sin almacenamiento

- Si el valor guardado de una clave no es JSON válido o no es un arreglo, la página muestra un aviso de error, trabaja con una lista vacía y no modifica lo guardado. Hay que corregir el valor o borrar la clave y recargar. Mientras tanto no se guarda nada en esa clave: un alta con la clave dañada se rechaza con "Error: No se pudo guardar el libro…" (o "…el cliente…"), sin agregar la fila y sin modificar el valor dañado.
- Si el navegador no permite usar `localStorage`, la página muestra un único aviso, usa los datos iniciales en memoria y no permite registrar libros ni clientes (el alta se rechaza con el mismo error de guardado y los cambios no se conservan).

### Alcance de los datos guardados

`localStorage` depende del navegador, del perfil y de la ubicación desde la que se abre el archivo: no se comparte entre usuarios, equipos ni navegadores. Un cambio hecho en otra pestaña se ve al recargar la página.

### Verificación: ¿las páginas abiertas con `file://` comparten los datos?

Procedimiento: borrar las claves; abrir `libros.html` con doble clic; cambiar el precio del primer libro a 9999; ir a Catálogo desde el menú y ver el precio; abrir `clientes.html` con doble clic en otra pestaña, ir a Libros desde su menú y ver el precio; cerrar el navegador, reabrir `index.html` y ver el precio.

| Navegador | Resultado observado |
|-----------|---------------------|
| Chrome | Comparte los datos: el precio 9999 se ve desde Catálogo, desde otra pestaña abierta con doble clic y después de cerrar y reabrir el navegador |
| Firefox | No ejecutado: Firefox no disponible en el equipo del autor |

## 8. Casos manuales

Los resultados se registran solo después de ejecutar cada caso en el navegador. Casos ejecutados por el autor el 2026-10-15 en Google Chrome, abriendo `index.html` desde `file://` (Firefox no estaba disponible, por eso su columna figura como no ejecutada); "Cumple lo esperado" significa que el comportamiento observado coincidió con la columna "Resultado esperado".

| # | Caso | Entrada / pasos | Resultado esperado | Chrome | Firefox |
|---|------|-----------------|--------------------|--------|---------|
| A1 | Filtro, minúsculas | Escribir `noche` | 3 libros: La noche del faro, Cartas a la Noche, Diario de una NOCHE sin luna | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A2 | Filtro, mayúsculas | Escribir `NOCHE` | Los mismos 3 libros | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A3 | Filtro, espacios exteriores | Escribir `   noche   ` | Los mismos 3 libros | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A4 | Filtro, búsqueda parcial | Escribir `noch` | Los mismos 3 libros | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A5 | Filtro, otra palabra | Escribir `PUERTO` | 2 libros: Mapas del puerto, El Puerto dormido | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A6 | Filtro vacío | Dejar vacío o solo espacios (también la "x" del campo o Escape) | Los 6 libros, sin mensaje | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A7 | Filtro sin resultados | Escribir `Zzz` | Ninguna tarjeta y el mensaje "Aviso: No se encontraron libros para «Zzz»." | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A8 | Filtro con etiquetas HTML | Escribir `<b>hola</b>` | Ninguna tarjeta y el texto literal en el mensaje, sin negrita | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A9 | Apertura sin servidor | Doble clic en `index.html` sin conexión; recorrer las 5 vistas por el menú | 6 tarjetas con tapa; las 5 vistas abren; consola sin errores | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A10 | Ancho 320 px | Abrir las 5 vistas a 320 px (herramientas de desarrollo, modo responsive) | Sin scroll horizontal de página; tarjetas en una columna; tablas con desplazamiento propio | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A11 | Ancho 1280 px | Abrir las 5 vistas a 1280 px | Sin scroll horizontal; 4 o más tarjetas por fila en el catálogo | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| A12 | Teclado | Recorrer con Tab el menú, el buscador y los controles de las 5 vistas; Enter en el buscador | Foco siempre visible; Enter filtra sin recargar ni cambiar la URL | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| P1 | Persistencia, primera apertura | Borrar las 3 claves `libreria.*`; abrir `index.html` y `clientes.html` | Se crean `libreria.libros` (6) y `libreria.clientes` (3), sin aviso | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| P2 | Persistencia, recargar no duplica | Recargar 3 veces `libros.html`, ir a Clientes y a Catálogo | 6 libros, 3 clientes, 6 tarjetas | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| P3 | Datos compartidos entre páginas | Procedimiento de la sección 7 | Precio 9999 visible desde otra página y tras cerrar el navegador | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| P4 | Restaurar datos iniciales | Borrar solo `libreria.libros` y recargar | 6 libros con los precios originales; clientes intactos | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| P5 | Datos dañados | Quitar el `]` final de `libreria.libros`, recargar `index.html`; escribir `noche`; en la consola `guardarLibros([])` | Aviso de error con la clave; catálogo vacío sin romperse; el aviso no desaparece al filtrar; devuelve `false` y el valor dañado queda intacto | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| P6 | Sin almacenamiento | En Firefox: `about:config` → `dom.storage.enabled` = `false`, abrir `index.html` (luego volver a `true`) | 6 tarjetas, el filtro funciona y un único aviso "Error: No se pueden guardar datos en este navegador…" | No aplica: Chrome no permite deshabilitar `localStorage` de forma simple | No ejecutado: Firefox no disponible en el equipo del autor |
| L1 | Alta de libro, formulario vacío | En `libros.html`, pulsar "Registrar libro" con el formulario vacío | 5 errores en orden (título, ISBN, precio, editorial, autores) con "Error:", sin error de género; foco en Título; sin recarga ni globos nativos | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L2 | Alta de libro, ISBN existente con espacios | Registrar un libro válido con ISBN `978 987 8000 01 5` (el de "La noche del faro" sin guiones). Caso 2 de la consigna, parte 1 (duplicado) | Se rechaza con "Error: Ya existe un libro con el ISBN «978 987 8000 01 5»." y el listado no cambia | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L3 | Alta de libro, ISBN existente sin separadores | Registrar un libro válido con ISBN `9789878000022`. Caso 2 de la consigna, parte 1 (duplicado) | Se rechaza por ISBN existente y el listado no cambia | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L4 | Alta de libro, precio 0 / negativo / no numérico | Registrar un libro válido salvo el precio, primero con `0`, después con `-5` y después con `1e` | Cada intento se rechaza con "Error: El precio debe ser un número mayor que 0." | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L5 | Alta de libro sin autores | Registrar un libro válido salvo los autores (ninguno elegido) | Se rechaza con "Error: Elegí al menos un autor." | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L6 | Alta de libro, editorial manipulada | En DevTools cambiar el valor de una opción de editorial a `ed-99` (o de autor a `aut-99`, o de género a `gen-99`), elegirla y enviar | Se rechaza con "Error: La editorial elegida no existe." (o "Error: Uno de los autores elegidos no existe." / "Error: El género elegido no existe.") | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L7 | Alta válida de libro | Registrar "Mareas de invierno", ISBN `978-987-8000-07-7`, precio `1999.9`, "Editorial Cardón", «Sin clasificar» y los autores Tomás Aldao e Inés Barrionuevo. Caso 2 de la consigna, parte 2 (alta) | Fila nueva al final con "$ 1.999,90"; formulario vacío; "Éxito: Libro «Mareas de invierno» registrado."; `libreria.libros` con `lib-7`, `precio` 1999.9, `generoId` null e `imagen` null; en Catálogo tarjeta sin tapa. La aparición en la selección de venta se verifica en C-07 | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L8 | Alta de libro, título con marcas HTML | Registrar un libro válido con título `<b>Hola</b>` | El listado y el mensaje de éxito muestran el texto literal `<b>Hola</b>`, sin negrita | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| L9 | Alta de libro con clave dañada | Dañar `libreria.libros` (quitar el `]` final), recargar `libros.html` e intentar un alta válida | Se rechaza con "Error: No se pudo guardar el libro…"; el listado sigue vacío, el aviso sigue visible y el valor dañado queda intacto | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| C1 | Alta de cliente, email inválido | Registrar "Diego Paz" con `diego`, `diego@example`, `diego paz@example.com` y `diego@@example.com`, uno por vez. Caso 3 de la consigna, parte 1 (formato) | Cada intento se rechaza con "Error: El email no tiene un formato válido (ejemplo: nombre@dominio.com)." | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| C2 | Alta de cliente, email existente en mayúsculas | Registrar "Ana Duplicada" con `ANA.MENDEZ@EXAMPLE.COM`. Caso 3 de la consigna, parte 2 (duplicado) | Se rechaza con "Error: Ya existe un cliente con el email «ANA.MENDEZ@EXAMPLE.COM»." y el listado no cambia | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| C3 | Alta válida de cliente | Registrar "Diego Paz" con `Diego.Paz@example.com`. Caso 3 de la consigna, parte 3 (alta) | Fila nueva al final con ese nombre y email; formulario vacío; "Éxito: Cliente «Diego Paz» registrado."; `libreria.clientes` con `cli-4`; el cliente sigue tras ir a Catálogo y volver. La aparición en la selección de venta se verifica en C-07 | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| C4 | Alta de cliente, formulario vacío | En `clientes.html`, pulsar "Registrar cliente" con el formulario vacío | Se muestran "Error: El nombre completo es obligatorio." y "Error: El email es obligatorio.", en ese orden y sin otros errores | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V1 | Venta sin cliente | Con un renglón `lib-1 × 2`, pulsar "Confirmar venta" sin elegir cliente | "Error: Elegí un cliente.", foco en el selector de cliente, `libreria.ventas` sin cambios | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V2 | Venta, cantidad 0 / -1 / 1.5 | En "Agregar libro a la venta", probar cantidad `0`, `-1` y `1.5`, uno por vez | Cada intento se rechaza con "Error: La cantidad debe ser un número entero mayor que 0.", sin filas nuevas | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V3 | Venta, libro repetido suma | Agregar `lib-1 × 2` y después `lib-1 × 3` | Una sola fila con `lib-1 × 5` y "Aviso: Se sumaron 3 unidades a «La noche del faro»." | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V4 | Venta válida 2 × 1500 + 1 × 2000. Caso 5 de la consigna | Con `cli-1`, agregar `lib-1 × 2` y `lib-2 × 1`, pulsar "Confirmar venta" | Subtotales "$ 3.000,00" y "$ 2.000,00", total "$ 5.000,00" y "Éxito: Venta V-0001 confirmada. Total: $ 5.000,00."; tabla vacía y `libreria.ventas` con `V-0001` (título, ISBN, precio unitario, nombre y email copiados) | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V5 | Venta con `lib-7` / `cli-4` de C-06 | Registrar "Mareas de invierno" (L7) y "Diego Paz" (C3), abrir `ventas.html` | El selector de libro incluye "Mareas de invierno" y el de cliente incluye "Diego Paz" | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V6 | Venta, edición inválida bloquea | Con `lib-1 × 2`, cambiar la cantidad a `0` y pulsar "Confirmar venta" | El campo queda con `aria-invalid="true"`, aparece el texto de error y no se guarda nada | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V7 | Venta, "Quitar" recalcula | Con dos renglones, pulsar "Quitar" en el primero | La tabla queda con un solo renglón y el total es su subtotal | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| V8 | Venta con clave de ventas dañada | Quitar el `]` final de `libreria.ventas`, recargar `ventas.html` y confirmar una venta válida | Se rechaza con "Error: No se pudo guardar la venta…", la venta en curso se conserva y el valor dañado queda intacto | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |

### Casos de la consigna (cierre final)

Verificación final de los 8 casos de la consigna, ejecutados por el autor el 2026-10-16 en Google Chrome abriendo por `file://` (Firefox no estaba disponible, por eso su columna figura como no ejecutada). "Cumple lo esperado" significa que el comportamiento observado coincidió con la columna "Resultado esperado". No hubo fallas que registrar: todo funcionó según lo esperado. La carpeta de entrega (tareas 5.1 y 5.2) se armó a mano, se descomprimió en otra ubicación y se abrió sin conexión con el mismo resultado.

| # | Caso | Entrada / pasos | Resultado esperado | Chrome | Firefox |
|---|------|-----------------|--------------------|--------|---------|
| 1 | Filtro | En `index.html`: escribir `NOCHE`, vaciar el campo, escribir `Zzz` | `NOCHE` muestra los mismos 3 libros que en minúsculas; vacío muestra los 6 sin mensaje; `Zzz` muestra 0 tarjetas con el aviso literal | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| 2 | Alta de libro (duplicado y nuevo) | En `libros.html`: registrar con ISBN existente escrito con espacios/guiones; luego con ISBN nuevo | Rechazo con "Ya existe…" sin cambios en el listado; alta `lib-7` visible en el listado y en el catálogo sin tapa | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| 3 | Alta de cliente (inválido, duplicado en mayúsculas, nuevo) | En `clientes.html`: registrar con email inválido; con `ANA.MENDEZ@EXAMPLE.COM`; con email nuevo | Rechazo de formato; rechazo de duplicado; alta `cli-4` visible en el listado | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| 4 | Venta inválida y libro repetido | En `ventas.html`: confirmar sin cliente; probar cantidad `0`, `-1` y `1.5`; agregar `lib-1` dos veces | Errores con texto y sin guardar; el repetido suma la cantidad con el aviso "Se sumaron N…" | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| 5 | Venta válida 2 × 1500 + 1 × 2000 | Con `cli-1`, agregar `lib-1 × 2` y `lib-2 × 1`, pulsar "Confirmar venta" | Subtotales 3000 y 2000, total 5000 y mensaje con id y total | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| 6 | Precio histórico (solo-precio) | Respaldo de `libreria.libros`; cambiar solo `"precio":1500` por `"precio":9999` en `lib-1`; recargar `historial.html`; restaurar el respaldo y recargar | Precios unitarios, subtotales y total intactos; datos restaurados | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| 7 | Recarga sin duplicados | Tras las altas y la venta, recargar las vistas | Sin duplicados; la venta sigue guardada | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |
| 8 | Teclado y anchos 320/1280 px | Recorrer las 5 vistas con Tab; abrir a 320 px y a 1280 px | Foco siempre visible; sin scroll horizontal de página (tablas con desplazamiento propio) | Cumple lo esperado | No ejecutado: Firefox no disponible en el equipo del autor |

### Controles de alcance

Búsquedas realizadas con herramientas del autor el 2026-10-16 sobre los archivos de la entrega:

| Búsqueda | Archivos | Resultado |
|----------|----------|-----------|
| `innerHTML` | `*.html`, `js/*.js` | Sin resultados |
| `outerHTML` | `*.html`, `js/*.js` | Sin resultados |
| `insertAdjacentHTML` | `*.html`, `js/*.js` | Sin resultados |
| `document.write` | `*.html`, `js/*.js` | Sin resultados |
| `type="module"` | `*.html`, `js/*.js` | Sin resultados |
| `http://` y `https://` | `*.html`, `css/*.css`, `js/*.js` | Sin resultados |

## 9. Imágenes

Las seis tapas de `img/tapas/` (`lib-1.svg` a `lib-6.svg`) son SVG de elaboración propia del autor. No hay imágenes de terceros.

## 10. Contenido de la entrega

```
index.html
libros.html
clientes.html
ventas.html
historial.html
README.md
css/
js/
img/
  tapas/
```

La entrega no tiene dependencias ni paso de build.
