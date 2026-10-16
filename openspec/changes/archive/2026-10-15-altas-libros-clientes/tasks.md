> Las tareas asumen las recomendaciones de design.md → Open Questions (1–9). Si el usuario elige otra opción, actualizar specs/design/tasks antes de aplicar. Sin tests automatizados (AGENTS.md / DD-05): cada tarea se verifica en Chrome (consola o UI) con `file://`.

## 1. Helpers comunes (`js/comun.js`)

- [x] 1.1 Agregar en la sección "Búsqueda y formato" `normalizarIsbn(texto)` (quita espacios y guiones, mayúsculas; `null`/`undefined` → `''`) y `normalizarEmail(texto)` (trim + minúsculas); verificar en la consola de cualquier página: `normalizarIsbn('978-987 8000-01-5') === '9789878000015'`, `normalizarIsbn('0-306-40615-x') === '030640615X'`, `normalizarEmail('  ANA.Mendez@Example.com ') === 'ana.mendez@example.com'`, `normalizarIsbn(undefined) === ''`
- [x] 1.2 Agregar `siguienteId(lista, prefijo)` (regex `^prefijo-(\d+)$`, máximo + 1, ignora ids ajenos, no muta la lista); verificar en la consola: `siguienteId(cargarLibros(),'lib')` → `'lib-7'` (con semilla), `siguienteId([{id:'lib-1'},{id:'lib-9'}],'lib')` → `'lib-10'`, `siguienteId([],'cli')` y `siguienteId([{id:'x-5'}],'cli')` → `'cli-1'`
- [x] 1.3 Agregar en la sección "DOM" `mostrarErrores(contenedor, mensajes)` (limpia y crea un `p.mensaje.mensaje--error[role=alert]` con "Error: " + texto por mensaje, vía `crearElemento`); verificar en la consola los 4 escenarios del delta `utilidades-dom` (dos errores en orden, reemplaza un éxito previo, lista vacía deja la zona vacía, `<img src=x onerror=alert(1)>` queda como texto)
- [x] 1.4 Actualizar el comentario de cabecera de `comun.js` para mencionar los helpers de C-06; verificar que la página sigue cargando sin errores en la consola

## 2. Lógica pura de libros (`js/libros.js`)

- [x] 2.1 Implementar `convertirPrecio(texto)` y `validarLibro(datos, libros)` → `{ campo, mensaje }[]` en el orden título, ISBN, precio, editorial, género, autores, con los textos exactos del spec `alta-libros` y las reglas de no duplicar errores de design D3; verificar en la consola con `cargarLibros()`: ISBN `'978 987 8000 01 5'` y `'9789878000022'` → error de duplicado; precios `'0'`, `'-5'`, `''`, `'abc'`, `'0.004'` → error de precio; `'1500,5'` → sin error; `autorIds: []` → "Elegí al menos un autor."; `editorialId: 'ed-99'`, `generoId: 'gen-99'`, `autorIds: ['aut-99']` → sus errores; datos vacíos → 5 errores en orden y ninguno de género
- [x] 2.2 Implementar `crearLibro(datos, libros)` (id `siguienteId`, trim de título e ISBN, precio `convertirPrecio`, `generoId` `''` → `null`, copia de `autorIds`, `imagen: null`); verificar en la consola que con la semilla devuelve `id: 'lib-7'`, `precio: 1999.9` para `'1999.9'`, `generoId: null` para `''` y que la lista recibida no cambió

## 3. Render y eventos de libros

- [x] 3.1 Implementar `renderOpcionesLibro()` que agrega, después de los placeholders, una opción por editorial, género y autor con el nombre como texto (sin `innerHTML`); verificar abriendo `libros.html`: 2 editoriales, «Sin clasificar» + 2 géneros (seleccionado «Sin clasificar»), 3 autores, sin ids visibles
- [x] 3.2 Implementar el handler de `submit` de `#form-libro`: `preventDefault`, leer datos (`selectedOptions` para autores), limpiar `aria-invalid` de todos los controles, validar contra la colección en memoria; con errores → `mostrarErrores`, `aria-invalid="true"` en los campos con error (mapa campo → id) y `focus()` al primero; verificar en Chrome: envío vacío muestra los 5 errores en orden, foco en Título, sin globos nativos ni recarga; corrección parcial quita las marcas de los campos corregidos
- [x] 3.3 Completar el camino válido: `concat` + `guardarLibros`; si `true` → reemplazar la colección en memoria, `actualizarListadoLibros`, `form.reset()`, limpiar marcas y `mostrarMensaje(zona,'exito','Libro «título» registrado.')`; si `false` → error "No se pudo guardar el libro. Revisá el aviso de almacenamiento al principio de la página." + `mostrarAvisosAlmacenamiento()`, sin tocar lista ni formulario; verificar en Chrome el escenario "Alta correcta" (fila al final con "$ 1.999,90", `lib-7` en `libreria.libros`, `imagen: null`) y el de clave dañada (alta rechazada, valor dañado intacto)
- [x] 3.4 Reordenar Inicio según design D10 (cargar → avisos → opciones → listado → listener) y actualizar los comentarios de las secciones; verificar recarga de `libros.html` sin errores en consola y libro nuevo visible en el Catálogo sin tapa

## 4. Lógica, render y eventos de clientes (`js/clientes.js`)

- [x] 4.1 Implementar `validarCliente(datos, clientes)` (regex de design D6, sin duplicar errores) y `crearCliente(datos, clientes)` (id `cli-N`, trim, email sin pasar a minúsculas); verificar en la consola con `cargarClientes()`: `diego`, `diego@example`, `diego paz@example.com`, `diego@@example.com` → error de formato; `ANA.MENDEZ@EXAMPLE.COM` y `'  bruno.iriarte@example.com  '` → duplicado; datos vacíos → solo los 2 obligatorios; `crearCliente` → `cli-4`
- [x] 4.2 Implementar el handler de `submit` de `#form-cliente` con el mismo flujo que 3.2/3.3 (errores, `aria-invalid`, foco, guardado con `guardarClientes`, mensaje "Cliente «nombre» registrado." o error de guardado) y reordenar Inicio; verificar en Chrome: `diego@example` deja el foco en Email con `aria-invalid`; "Diego Paz" / `Diego.Paz@example.com` aparece al final del listado y en `libreria.clientes`; luego `diego.paz@EXAMPLE.com` se rechaza; ir a Catálogo y volver conserva el cliente

## 5. HTML: fin de la maqueta en Libros y Clientes

- [x] 5.1 Quitar `<p id="aviso-libro">` y `<p id="aviso-cliente">` y el `aria-describedby` de los botones "Registrar libro" y "Registrar cliente" (conservar `aria-describedby="ayuda-autores"`); verificar que ninguna de las dos páginas contiene "Pendiente — Etapa 2" ni referencias a `aviso-libro`/`aviso-cliente`, y que `ventas.html` e `historial.html` conservan su aviso

## 6. README

- [x] 6.1 Actualizar §4 (Libros y Clientes: listado + alta validada; maqueta "Nada"; libros dados de alta sin tapa en el Catálogo) y §5 (altas a Implementadas; quedan Venta e Historial pendientes); verificar coherencia con los avisos que quedan en las páginas
- [x] 6.2 Ajustar §7 "Datos dañados y navegador sin almacenamiento" según design D9 (alta rechazada sin pisar lo guardado; sin almacenamiento no se registran libros ni clientes); verificar que no describe comportamiento inexistente
- [x] 6.3 Agregar a §8 los casos L1–L9 y C1–C4 de design D13 con entrada, resultado esperado (indicando qué casos cubren los casos 2 y 3 de la consigna y que la selección de venta se verifica en C-07), columna Chrome "Pendiente de ejecutar" y columna Firefox "No ejecutado: Firefox no disponible en el equipo del autor"; verificar el formato de la tabla en una vista previa de Markdown

## 7. Verificación manual integral (Chrome)

- [x] 7.1 Con las claves `libreria.*` borradas, ejecutar en Chrome los casos L1–L9 y C1–C4 del README y pedir al usuario que confirme lo observado; registrar en la columna Chrome solo lo efectivamente observado (nunca marcar como cumplido sin ejecutar)
- [x] 7.2 Repetir los casos A9, A10 (320 px en `libros.html` y `clientes.html` con errores visibles) y A12 (teclado: Tab por los formularios, foco visible en el campo enfocado tras un error) y confirmar que siguen cumpliendo
- [x] 7.3 Repetir los "Controles de alcance" (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `type="module"`, `http://`/`https://`) sobre los archivos de entrega y actualizar la tabla y la fecha del README con el resultado
- [x] 7.4 Marcar C-06 como completo en CHANGES.md solo después de que el usuario apruebe la verificación (al archivar)
