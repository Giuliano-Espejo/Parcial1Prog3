> Las tareas asumen las recomendaciones de design.md → Open Questions (1–8). Si el usuario elige otra opción, actualizar specs/design/tasks antes de aplicar. Sin tests automatizados (AGENTS.md / DD-05): cada tarea se verifica en Chrome con `file://`, salvo Firefox indicado.

Decision needed before apply: Yes
Chained PRs recommended: No
400-line budget risk: Low

## 1. Helper de id de venta (`js/comun.js`)

- [x] 1.1 Agregar en "Búsqueda y formato" `siguienteIdVenta(ventas)` (regex `^V-(\d+)$`, máximo + 1, `V-` + 4 dígitos con ceros, ignora ajenos, no muta); verificar en la consola de cualquier página: `siguienteIdVenta([]) === 'V-0001'`, `siguienteIdVenta([{id:'V-0001'},{id:'V-0002'}]) === 'V-0003'`, `siguienteIdVenta([{id:'V-0001'},{id:'V-0009'},{id:'x-5'}]) === 'V-0010'`
- [x] 1.2 Actualizar el comentario de cabecera de `comun.js` para mencionar `siguienteIdVenta` (C-07); verificar que las 5 páginas cargan sin errores en consola

## 2. Lógica pura (`js/ventas.js`, sección Lógica)

- [x] 2.1 Implementar `agregarRenglon(enCurso, libroId, cantidad)` pura (entero > 0 con `Number.isInteger`, suma si repetido con aviso, sin mutar; ver design D2); verificar en consola: `agregarRenglon({clienteId:'cli-1',renglones:[]},'lib-1',0).errores` → ["La cantidad debe ser un número entero mayor que 0."], igual con `-1` y `1.5`; con `renglones:[{libroId:'lib-1',cantidad:2}]` + `('lib-1',3)` → un renglón `cantidad:5` y aviso 'Se sumaron 3 unidades a «La noche del faro».'; con `('lib-2',1)` → dos renglones en orden
- [x] 2.2 Implementar `calcularSubtotal(cantidad, precioUnitario)` y `calcularTotal(renglones, libros)` puras con `redondear2`; verificar: `calcularSubtotal(2,1500) === 3000`, `calcularSubtotal(1,2000) === 2000`, `calcularTotal([{libroId:'lib-1',cantidad:2},{libroId:'lib-2',cantidad:1}], cargarLibros()) === 5000`, `formatearPrecio(5000)` muestra "$ 5.000,00" (espacio o no separable)
- [x] 2.3 Implementar `validarVenta(enCurso, libros, clientes)` → `{campo,mensaje}[]` en orden cliente → renglones → por renglón (textos del spec); verificar con semilla: `{clienteId:'',renglones:[{libroId:'lib-1',cantidad:2}]}` → solo "Elegí un cliente."; `{clienteId:'cli-1',renglones:[]}` → solo "Agregá al menos un libro a la venta."; `{clienteId:'cli-1',renglones:[{libroId:'lib-1',cantidad:1.5}]}` → error de cantidad de «La noche del faro»; `{clienteId:'cli-99',renglones:[{libroId:'lib-1',cantidad:1}]}` → "El cliente elegido no existe."; venta válida → `[]`
- [x] 2.4 Implementar `construirVenta(enCurso, libros, clientes, ventas)` pura (copias + `siguienteIdVenta` + ISO + subtotales/total); verificar: con `cli-1`, `lib-1×2` + `lib-2×1`, `ventas=[]` → `id:'V-0001'`, `clienteNombre`/`clienteEmail` de `cli-1`, renglones con `titulo`/`isbn`/`precioUnitario` copiados, `subtotal:3000`/`2000`, `total:5000`, `fecha` parseable por `Date.parse`; luego cambiar `libros[0].precio` a 9999 y comprobar que lo construido conserva `1500`

## 3. Render y composición (secciones Render + Eventos)

- [x] 3.1 Implementar `renderSelectores()` (opciones con `crearElemento` + `textContent`, después de placeholders, preserva `enCurso.clienteId`); verificar abriendo `ventas.html` con almacenamiento limpio: 3 clientes y 6 libros, sin ids visibles; luego en consola `guardarLibros(cargarLibros().concat([{id:'lib-7',titulo:'Mareas de invierno',isbn:'978-987-8000-07-7',precio:1999.9,editorialId:'ed-2',generoId:null,autorIds:['aut-2'],imagen:null}]))` y `guardarClientes(cargarClientes().concat([{id:'cli-4',nombreCompleto:'Diego Paz',email:'Diego.Paz@example.com'}]))`, recargar y comprobar que ambos aparecen (caso D12 / V5)
- [x] 3.2 Implementar `renderRenglones()` + `renderTotal()` (reconstrucción con `DocumentFragment`, `formatearPrecio`, `#estado-renglones` y `#venta-total` en vivo, `textContent` siempre); verificar UI: agregar `lib-1 × 2` → fila con "$ 1.500,00" y "$ 3.000,00", total "$ 3.000,00"; agregar `lib-2 × 1` → total "$ 5.000,00"; inspeccionar que un título `<b>Hola</b>` quedaría como texto (probar con `renderRenglones` y libro ficticio si hace falta)
- [x] 3.3 Implementar handler de `submit` de `#form-renglon` (`preventDefault`, `buscarPorId` para "El libro elegido no existe.", `agregarRenglon`, `mostrarMensaje` info para el aviso de suma o `mostrarErrores` para cantidad); verificar UI: cantidad `0`, `-1`, `1.5` → "Error: La cantidad debe ser un número entero mayor que 0.", sin filas nuevas; libro repetido → "Aviso: Se sumaron N unidades a «…»." y una sola fila con cantidad sumada
- [x] 3.4 Implementar edición de cantidad (delegación `change` en `tbody`, `aria-invalid`, texto de error, recálculo) y "Quitar" (delegación `click`, `aria-label` con título, recálculo); verificar UI: cambiar a `3` → subtotal/total actualizados; cambiar a `0` → `aria-invalid="true"` y confirmación bloqueada (tarea 4.1); "Quitar" el primero de dos → queda uno con su subtotal como total

## 4. Confirmación, Inicio y fin de maqueta (`ventas.html` + `js/ventas.js`)

- [x] 4.1 Implementar `alConfirmarVenta()` según design D8 (validar → `mostrarErrores` + `aria-invalid` + `focus()` al primero; construir → `concat` + `guardarVentas`; `true` → limpiar y éxito con id/total reales; `false` → error de guardado sin limpiar); verificar UI: sin cliente y sin renglones → errores "Elegí un cliente." + "Agregá al menos un libro…", foco en `#venta-cliente`, `libreria.ventas` sin cambios; venta `cli-1` + `lib-1×2` + `lib-2×1` → "Éxito: Venta V-0001 confirmada. Total: $ 5.000,00.", tabla vacía, `libreria.ventas` con `V-0001` (`titulo`/`isbn`/`precioUnitario`/`clienteNombre`/`clienteEmail` copiados)
- [x] 4.2 Reordenar Inicio según design D3 (cargar → avisos → selectores → renglones/total → listeners de `change`/`submit`/`click`) y variable `enCurso` en memoria; verificar: recargar con venta a medio armar descarta todo; `cargarVentas()` en consola no incluye la venta en curso hasta confirmar
- [x] 4.3 Quitar `<p id="aviso-venta">` y los dos `aria-describedby="aviso-venta"` (conservar `novalidate`, `label for`, `caption`/`th scope`, `#mensajes-almacenamiento` y regiones vivas); verificar: `ventas.html` no contiene "Pendiente — Etapa 2" ni `aviso-venta`, `historial.html` conserva su aviso; lector/Tabs: Tab recorre cliente → libro → cantidad → Agregar → tabla (cantidad + Quitar) → Confirmar con foco visible
- [x] 4.4 Verificar tamaño IN-03: ejecutar `(Get-Content js/ventas.js).Count` en PowerShell; si pasa ~250 líneas, partir Lógica a `js/ventas-logica.js` (cargado entre `comun.js` y `ventas.js` en `ventas.html`) sin cambiar firmas y repetir 2.1–2.4

## 5. README

- [x] 5.1 Actualizar §4 (Ventas: composición y confirmación con snapshot; maqueta "Nada"; Historial sigue maqueta) y §5 (venta a Implementadas; pendiente solo Historial); verificar coherencia con los avisos que quedan en las páginas
- [x] 5.2 Agregar a §8 los casos V1–V8 de design D12 (V1 sin cliente, V2 `0`/`-1`/`1.5`, V3 repetido, V4 válida 5000 = caso 5 de la consigna, V5 `lib-7`/`cli-4`, V6 edición inválida bloquea, V7 Quitar recalcula, V8 `libreria.ventas` dañada), con entrada, esperado, Chrome "Pendiente de ejecutar" y Firefox "No ejecutado: Firefox no disponible en el equipo del autor"; verificar formato Markdown en vista previa

## 6. Verificación manual integral (Chrome, `file://`)

- [x] 6.1 Con `libreria.ventas` borrada (`localStorage.removeItem('libreria.ventas')` + recarga), ejecutar en Chrome los casos V1–V8 del README y pedir al usuario lo observado; registrar en Chrome solo lo efectivamente visto (nunca marcar sin ejecutar) — ejecutado 2026-10-15: V1–V8 cumplen lo esperado (V4: V-0001 $ 5.000,00 con copias; V5: lib-7/cli-4 en selectores; V8: clave dañada rechaza preservando enCurso + valor)
- [x] 6.2 Repetir accesibilidad y responsive: teclado completo con foco visible, `aria-invalid` + `role=alert` en errores, región viva anuncia total; 320 px y 1280 px sin scroll horizontal de página, tabla con scroll propio, botones ≥ 44 px — confirmado 2026-10-15 (Tab cliente → libro → cantidad → Agregar → tabla → Confirmar; foco visible; total en vivo)
- [x] 6.3 Repetir controles de alcance en PowerShell sobre la entrega (`Select-String -Pattern 'innerHTML|outerHTML|insertAdjacentHTML|document\.write' js/*.js`, `Select-String -Pattern 'type="module"' *.html js/*.js`, `Select-String -Pattern 'http://|https://' *.html js/*.js css/*.css`) y confirmar 0 coincidencias (salvo `https://` en comentarios si los hay, documentarlo); actualizar fecha del README — confirmado 2026-10-15: 0 coincidencias, README §8 con fecha 2026-10-15
- [x] 6.4 Medir `ventas.js` y confirmar ≤ ~250 líneas o el split de 4.4; confirmar que `js/ventas.js` no menciona `localStorage`
- [x] 6.5 Marcar C-07 como completado en `CHANGES.md` (archivado 2026-10-15, verificado solo en Chrome)
