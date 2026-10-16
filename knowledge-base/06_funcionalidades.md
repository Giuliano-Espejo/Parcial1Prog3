# Funcionalidades

Organizadas por épica (≈ ejercicio de la consigna) y por historia de usuario. La columna **Etapa** indica si entra en el avance de la Etapa 1 o en la entrega final.

| Épica | Ejercicio | Puntos | Etapa |
|-------|-----------|--------|-------|
| E1 Estructura y navegación | Ej. 1 | 20 | 1 |
| E2 Identidad visual y adaptabilidad | Ej. 2 | 20 | 1 |
| E3 Datos locales y catálogo | Ej. 3 | 15 | 1 (render + filtro) / 2 (persistencia) |
| E4 Altas | Ej. 4 | 15 | 2 |
| E5 Ventas e historial | Ej. 5 | 20 | 2 |
| E6 Persistencia, verificación y documentación | Ej. 6 | 10 | 2 (README de avance en 1) |

---

## Épica 1: Estructura y navegación (Ej. 1)

### US-001 — Navegar entre vistas
**Como** operador **quiero** una navegación común en todas las páginas **para** moverme entre Catálogo, Libros, Clientes, Ventas e Historial.

**Criterios de aceptación**:
- [ ] `index.html` es la entrada y muestra el Catálogo.
- [ ] Las 5 páginas tienen `header`, `nav` y `main` semánticos, con el mismo menú.
- [ ] El enlace de la página actual se marca con `aria-current="page"` y un estilo visible.

### US-002 — Estructura de formularios y tablas
**Como** operador **quiero** formularios y tablas claros **para** entender qué cargar y qué estoy viendo.

**Criterios de aceptación**:
- [ ] Cada campo tiene `<label for>` asociado.
- [ ] Los botones describen su acción ("Registrar libro", "Agregar renglón", "Confirmar venta").
- [ ] Las tablas tienen `<thead>` con `<th scope="col">`.
- [ ] Existen las zonas de mensaje: lista vacía, sin resultados, operación correcta y operación rechazada.

**Reglas relacionadas**: RN-UI-04, RN-UI-06

---

## Épica 2: Identidad visual y adaptabilidad (Ej. 2)

### US-003 — Identidad visual moderna minimal
**Como** operador **quiero** una interfaz coherente **para** reconocer cada tipo de elemento.

**Criterios de aceptación**:
- [ ] CSS en archivos externos, con custom properties para colores, tipografía y espaciado.
- [ ] Clases reutilizadas para elementos equivalentes (`.tarjeta`, `.boton`, `.campo`, `.mensaje--error`…).
- [ ] Fondo claro, un color de acento y sans-serif del sistema.
- [ ] Layout con Flexbox o Grid.

### US-004 — Uso adaptable y accesible
**Como** operador **quiero** usar la app en el celular y en la computadora y con el teclado **para** trabajar en cualquier contexto.

**Criterios de aceptación**:
- [ ] A 320 px y a 1280 px no hay scroll horizontal de la página.
- [ ] Las tablas tienen un contenedor con `overflow-x: auto`.
- [ ] `:focus-visible` es visible en todos los controles.
- [ ] Los errores tienen texto y no dependen solo del color.
- [ ] Las tapas tienen `alt` descriptivo; las imágenes decorativas, `alt=""`.

**Reglas relacionadas**: RN-UI-05, RN-UI-07, RN-UI-08, RN-UI-09

---

## Épica 3: Datos locales y catálogo (Ej. 3)

### US-005 — Datos semilla
**Como** docente **quiero** un conjunto inicial consistente **para** evaluar sin cargar nada antes.

**Criterios de aceptación**:
- [ ] ≥ 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes, todos con ids estables.
- [ ] Todas las referencias son válidas; al menos un libro sin género y uno con varios autores.
- [ ] Hay libros a 1500 y a 2000 para el caso manual de venta.

### US-006 — Catálogo generado por JS
**Como** operador **quiero** ver el catálogo completo **para** consultar los libros disponibles.

**Criterios de aceptación**:
- [ ] Las tarjetas o filas se generan desde el array de libros.
- [ ] Cada libro muestra título, ISBN, editorial, género (o «Sin clasificar»), autores y precio con 2 decimales.
- [ ] Los datos se insertan con `textContent`.

### US-007 — Filtro por título
**Como** operador **quiero** filtrar por parte del título **para** encontrar un libro rápido.

**Criterios de aceptación**:
- [ ] El filtro ignora mayúsculas y minúsculas, acepta coincidencias parciales y hace trim de la búsqueda.
- [ ] Una búsqueda vacía muestra todo el catálogo.
- [ ] Una búsqueda sin coincidencias muestra un mensaje claro.

**Reglas relacionadas**: RN-CA-01..06, RN-UI-01

---

## Épica 4: Altas (Ej. 4)

### US-008 — Alta de libro
**Como** operador **quiero** registrar un libro **para** que aparezca en el catálogo y en la venta.

**Criterios de aceptación**:
- [ ] Los selectores de editorial y género (con «Sin clasificar») y el selector múltiple de autores (o checkboxes) se generan desde los datos.
- [ ] Se valida: título no vacío; ISBN no vacío y no duplicado (sin espacios ni guiones); precio numérico > 0; editorial existente; ≥ 1 autor y todos existentes; género existente si se asigna.
- [ ] Se usa `preventDefault`, los errores se muestran junto al formulario y solo se agrega el libro si todo pasa.
- [ ] Tras el alta, el listado se actualiza sin recargar, se guarda en `localStorage` y aparece en el catálogo y en la venta.

**Reglas relacionadas**: RN-LI-01..08, RN-UI-02, RN-UI-03, RN-PE-03

### US-009 — Alta de cliente
**Como** operador **quiero** registrar un cliente **para** poder venderle.

**Criterios de aceptación**:
- [ ] Se valida: nombre completo no vacío; email no vacío, con formato válido y no duplicado (trim y sin distinguir mayúsculas).
- [ ] Tras el alta, el listado se actualiza sin recargar, se guarda en `localStorage` y aparece en el selector de la venta.

**Reglas relacionadas**: RN-CL-01..04, RN-UI-02, RN-UI-03

---

## Épica 5: Ventas e historial (Ej. 5)

### US-010 — Componer venta
**Como** operador **quiero** elegir cliente y agregar renglones **para** armar la venta.

**Criterios de aceptación**:
- [ ] El selector de clientes y el de libros se generan desde los datos.
- [ ] Al agregar un renglón se valida que la cantidad sea un entero mayor que 0.
- [ ] Un libro repetido suma su cantidad al renglón existente y muestra un aviso (no se crea otro renglón).
- [ ] Cada renglón muestra libro, cantidad (editable), precio unitario, subtotal y el botón "Quitar".
- [ ] El total se recalcula en cada cambio, con 2 decimales.

### US-011 — Confirmar venta
**Como** operador **quiero** confirmar la venta **para** registrarla en el historial.

**Criterios de aceptación**:
- [ ] Se rechaza si no hay cliente, si no hay renglones o si alguna cantidad es inválida, con un mensaje de texto.
- [ ] Se guarda `{id, fecha, clienteId, clienteNombre, clienteEmail, renglones[{libroId, titulo, isbn, cantidad, precioUnitario, subtotal}], total}`.
- [ ] El formulario se limpia y se muestra un mensaje de éxito con el id de la venta.

### US-012 — Historial inmutable
**Como** operador **quiero** consultar las ventas pasadas **para** revisar su detalle.

**Criterios de aceptación**:
- [ ] La tabla muestra id, fecha (en formato local), cliente y total.
- [ ] El botón "Ver detalle" muestra los renglones con los valores **copiados** al confirmar.
- [ ] No hay controles para editar ni para eliminar.
- [ ] Si no hay ventas, se muestra el mensaje "No hay ventas registradas".

**Reglas relacionadas**: RN-VE-01..10

---

## Épica 6: Persistencia, verificación y documentación (Ej. 6)

### US-013 — Persistencia sin duplicados
**Como** operador **quiero** que mis datos sigan al reabrir **para** no perder lo cargado.

**Criterios de aceptación**:
- [ ] En el primer inicio se carga la semilla; en las siguientes aperturas se recupera lo guardado.
- [ ] Recargar no duplica ejemplos ni ventas.

### US-014 — README y casos manuales
**Como** docente **quiero** un README completo **para** abrir, navegar y verificar el TPI.

**Criterios de aceptación**:
- [ ] Autor: Giuliano Espejo.
- [ ] Incluye los pasos para abrir `index.html` sin npm y la navegación entre vistas.
- [ ] Lista las funcionalidades implementadas y las pendientes; en el avance de la Etapa 1, marca qué es maqueta.
- [ ] Indica dónde están los datos iniciales.
- [ ] Explica el funcionamiento y los límites de `localStorage`, y las claves y la estructura de `libreria.libros` para la prueba del precio histórico.
- [ ] Tiene la tabla de los 8 casos manuales con el **resultado real observado**.
- [ ] Indica que las tapas son SVG de elaboración propia del autor (no hay imágenes tomadas de internet; si se agregara alguna, citar su procedencia).

**Reglas relacionadas**: RN-PE-01..04, RN-GL-02
