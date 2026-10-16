# Reglas de Negocio

Cada regla tiene un código `RN-{DOMINIO}-{NN}`. Fuente: enunciado del TPI y decisiones de Discovery.

## Dominio: Catálogo y filtro (RN-CA)

- **RN-CA-01**: El catálogo se genera con JS a partir del array de libros (no son filas fijas en el HTML).
- **RN-CA-02**: Cada libro muestra título, ISBN, editorial, género, autores y precio.
- **RN-CA-03**: Un libro sin género muestra «Sin clasificar».
- **RN-CA-04**: El filtro por título quita los espacios exteriores de la búsqueda, ignora mayúsculas y minúsculas y acepta coincidencias parciales (`includes`).
- **RN-CA-05**: Una búsqueda vacía (o solo con espacios) muestra el catálogo completo.
- **RN-CA-06**: Una búsqueda sin coincidencias muestra un mensaje claro de "sin resultados".

## Dominio: Libros (RN-LI)

- **RN-LI-01**: El título no puede estar vacío (después de trim).
- **RN-LI-02**: El ISBN no puede estar vacío (después de quitar espacios y guiones).
- **RN-LI-03**: El ISBN no puede existir ya en el conjunto local. Se compara normalizado: sin espacios ni guiones. No se valida el dígito de control.
- **RN-LI-04**: El precio debe ser numérico y mayor que cero.
- **RN-LI-05**: La editorial debe existir en los datos locales.
- **RN-LI-06**: Hay que elegir al menos un autor, y todos los autores elegidos deben existir.
- **RN-LI-07**: El género es opcional. La opción «Sin clasificar» equivale a `generoId = null`; si se asigna un género, debe existir.
- **RN-LI-08**: Las opciones de editorial, género y autores se generan desde los datos locales.

## Dominio: Clientes (RN-CL)

- **RN-CL-01**: El nombre completo no puede estar vacío. No hay campo de apellido separado.
- **RN-CL-02**: El email no puede estar vacío.
- **RN-CL-03**: El email debe tener formato válido (`algo@dominio.ext`, sin espacios internos).
- **RN-CL-04**: No puede existir otro cliente con el mismo email, comparado sin espacios exteriores y sin distinguir mayúsculas.

## Dominio: Ventas (RN-VE)

- **RN-VE-01**: La venta requiere un cliente existente.
- **RN-VE-02**: Cada renglón referencia un libro existente con una cantidad **entera mayor que cero**. Cero, negativos y decimales se rechazan.
- **RN-VE-03**: No hay libros repetidos dentro de una venta. **Si se agrega un libro que ya tiene renglón, la cantidad nueva se suma al renglón existente y se muestra un aviso** (decisión de Discovery).
- **RN-VE-04**: Antes de confirmar se pueden cambiar cantidades y quitar renglones.
- **RN-VE-05**: `subtotal = cantidad × precioUnitario`, y `total = Σ subtotales`. Los importes se muestran con 2 decimales y se redondean con `Math.round(x * 100) / 100` para evitar errores de punto flotante.
- **RN-VE-06**: No se puede confirmar una venta sin cliente, sin renglones o con alguna cantidad inválida.
- **RN-VE-07**: Al confirmar se registran id, fecha, cliente, renglones y total. **El precio unitario, el título y el ISBN de cada renglón y el nombre y el email del cliente se copian** como valores históricos. El historial nunca vuelve a leer el precio del catálogo.
- **RN-VE-08**: Al confirmar, el formulario se limpia para una nueva venta y se muestra un mensaje de resultado.
- **RN-VE-09**: Las ventas confirmadas no se editan ni se eliminan desde la interfaz.
- **RN-VE-10**: El historial muestra id, fecha, cliente y total, y permite ver los renglones de cada venta.

## Dominio: Persistencia (RN-PE)

- **RN-PE-01**: Libros, clientes y ventas se guardan en `localStorage` con una clave por colección (`libreria.libros`, `libreria.clientes`, `libreria.ventas`).
- **RN-PE-02**: Cada colección se carga desde la semilla **solo si su clave no existe**. Al reabrir se recuperan los datos guardados sin duplicar ejemplos ni ventas.
- **RN-PE-03**: Cada alta o venta confirmada se escribe en `localStorage` en el momento.
- **RN-PE-04**: El README explica que `localStorage` depende del navegador, del perfil y de la ubicación desde donde se abre el archivo, y que no comparte datos entre usuarios.

## Dominio: Interfaz y accesibilidad (RN-UI)

- **RN-UI-01**: Los datos escritos por el usuario se insertan en el DOM como texto (`textContent` / `createElement`). Nunca con `innerHTML`.
- **RN-UI-02**: Los formularios controlan el envío con `preventDefault`, usan `novalidate` (para que manden las validaciones JS) y muestran los errores **cerca del formulario**.
- **RN-UI-03**: Un registro se agrega solo si pasan **todas** las comprobaciones. Tras un alta correcta, los listados y los selectores se actualizan sin recargar la página.
- **RN-UI-04**: Hay mensajes para lista vacía, búsqueda sin resultados y operación correcta o rechazada.
- **RN-UI-05**: Los errores se expresan con texto (por ejemplo, el prefijo "Error:"), no solo con color.
- **RN-UI-06**: Cada campo tiene un `label` asociado, los botones describen su acción y las tablas tienen `<th>`.
- **RN-UI-07**: El foco es visible y toda la interfaz se puede recorrer con el teclado.
- **RN-UI-08**: A 320 px y a 1280 px la página no tiene scroll horizontal. Las tablas anchas hacen scroll dentro de su propio contenedor.
- **RN-UI-09**: Las imágenes informativas tienen `alt` descriptivo; las decorativas usan `alt=""`.

## Dominio: Excepciones globales

- **RN-GL-01**: No se usan librerías, frameworks ni CDNs. El uso de cualquiera de ellos incumple el alcance técnico.
- **RN-GL-02**: Los casos manuales del README registran el **resultado real observado**. No se marca un caso como aprobado sin haberlo ejecutado.
