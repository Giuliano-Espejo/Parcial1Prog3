# Discovery — TPI Frontend de una Librería (Programación III · Parcial 1)

**Fecha**: 2026-10-15
**Fuentes investigadas**: enunciado oficial `Repaso Primer Parcial.pdf` (UTN-TUP, Prof. Matías Torres). Sin competidores: es un trabajo práctico académico.

## 1. Problema que resuelve

Una librería necesita presentar su catálogo y registrar libros, clientes y ventas. El TPI construye **exclusivamente el frontend** de ese sistema, con datos y operaciones simulados en el navegador, como repaso para el Parcial 1 de Programación III. El backend equivalente es el TP de otro docente; acá no hay conexión con él.

## 2. Usuarios / roles

- **Operador de la librería**: consulta el catálogo, da de alta libros y clientes, compone y confirma ventas, revisa el historial.
- **Docente evaluador**: ejecuta los casos manuales del README (incluida la manipulación guiada de `localStorage`) y evalúa funcionamiento, código y documentación.

No hay inicio de sesión real ni roles diferenciados en la interfaz.

## 3. Casos de uso

1. Como operador, quiero buscar libros por una parte del título (sin importar mayúsculas ni espacios extremos) para encontrarlos rápido.
2. Como operador, quiero dar de alta un libro con editorial, género opcional y uno o más autores para que aparezca en el catálogo y en la venta.
3. Como operador, quiero dar de alta un cliente con nombre completo y email único para poder venderle.
4. Como operador, quiero componer una venta (cliente + renglones), ajustar cantidades o quitar renglones y confirmarla para registrar el total.
5. Como operador, quiero consultar el historial y el detalle de cada venta con los precios vigentes al momento de confirmarla.

## 4. Competidores / soluciones existentes

No aplica: es una consigna académica con alcance cerrado. La referencia de dominio es el TP backend de Programación III (mismas entidades: libros, editoriales, géneros, autores, clientes, ventas).

## 5. Funcionalidades necesarias (TPI completo, 100 puntos)

- **Ej. 1 — HTML (20)**: 5 vistas con navegación clara — Catálogo (`index.html`), Libros, Clientes, Ventas, Historial. HTML semántico, labels asociados, botones descriptivos, tablas con encabezados, mensajes de lista vacía / sin resultados / operación correcta o rechazada.
- **Ej. 2 — CSS (20)**: identidad visual propia en CSS externo con clases reutilizables; Flexbox/Grid; legible a 320 px y 1280 px sin scroll horizontal de página (tablas con scroll propio); foco visible, navegable por teclado; errores con texto, no solo color; `alt` correcto.
- **Ej. 3 — Datos y catálogo (15)**: arrays/objetos con ids estables; semilla mínima de 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes; catálogo generado por JS; filtro por título case-insensitive, parcial, con trim; datos de usuario insertados como texto (`textContent`).
- **Ej. 4 — Altas (15)**: formularios de libro y cliente con `preventDefault`, errores cerca del formulario, alta solo si pasan todas las validaciones, actualización de listados y selectores sin recargar.
- **Ej. 5 — Ventas (20)**: composición con renglones, subtotales y total a 2 decimales, validaciones de confirmación, historial inmutable con precio histórico.
- **Ej. 6 — Cierre (10)**: persistencia en `localStorage` sin duplicar la semilla; README con casos manuales ejecutados y resultado real observado.

## 6. Funcionalidades opcionales / fuera de alcance

Explícitamente **no requeridas** por el enunciado (no se implementan salvo que sobre tiempo):

- Editar o eliminar libros y clientes.
- ABM de editoriales, géneros y autores.
- Gestión de stock, cobros, facturación fiscal.
- Login real, `fetch`, API, servidor, base de datos.
- Validación del dígito de control del ISBN.
- Pantalla para editar precios.

## 7. Reglas de negocio

- **Libro**: título e ISBN no vacíos; ISBN único comparado sin espacios ni guiones; precio numérico > 0; editorial existente; al menos un autor y todos existentes; género opcional (si se asigna, existente). Sin género se muestra «Sin clasificar».
- **Cliente**: nombre completo y email no vacíos; email con formato válido; email único comparado con trim y sin distinguir mayúsculas.
- **Venta**: cliente existente obligatorio; al menos un renglón; cantidad entera > 0; libro existente. **Libro repetido → se suma la cantidad al renglón existente y se avisa** (decisión de Discovery). Subtotal = cantidad × precio; total = suma de subtotales; importes con 2 decimales.
- **Confirmación**: registra id, fecha, cliente, renglones y total. El precio unitario y los datos descriptivos (título, nombre del cliente) se **copian** al renglón/venta como valores históricos. Las ventas confirmadas no se editan ni eliminan. Al confirmar se limpia el formulario y se muestra mensaje.
- **Persistencia**: la semilla se carga solo en el primer inicio; al reabrir se recuperan los datos guardados sin duplicar ejemplos ni ventas.

## 8. Integraciones

Ninguna. Sin API, sin backend, sin `fetch`, sin CDNs. Todos los recursos (CSS, JS, imágenes) son locales.

## 9. Restricciones

- Solo HTML, CSS y JavaScript nativos. Prohibido usar librerías, frameworks o CDNs (incumple el alcance técnico).
- La entrega es una carpeta o zip con `index.html`, demás HTML, carpetas de CSS/JS/recursos y `README.md`; sin dependencias instaladas ni herramientas de compilación.
- Se abre `index.html` directamente en el navegador, sin npm. **Decisión derivada**: scripts clásicos (sin `type="module"`), porque los ES modules fallan con `file://`.
- **Estructura multipágina** (decisión de Discovery): `index.html` (Catálogo), `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, con nav común. **Consecuencia**: los datos se comparten entre páginas vía `localStorage` desde que las pantallas se conectan a datos (inicio de Etapa 2), no recién en el Ej. 6.
- **Testing**: solo casos manuales registrados en el README (decisión de Discovery). Strict TDD desactivado para este proyecto.
- Trabajo **individual**.
- Organización en dos etapas: **Etapa 1** (maqueta de Ej. 1 + Ej. 2 con datos estáticos y una interacción básica, p. ej. filtro o validación; controles pendientes marcados como maqueta) y **Etapa 2** (TPI completo, Ej. 3 a 6).

## 10. Riesgos

- **ES modules con `file://`**: si se usa `type="module"`, la app no carga al abrir el archivo directamente → mitigado con scripts clásicos y un orden de carga explícito.
- **Prueba guiada del precio histórico**: el docente edita a mano el catálogo en `localStorage`. Si la estructura guardada es confusa o la venta referencia el precio del catálogo en vez de copiarlo, falla el caso → claves simples y documentadas en el README.
- **Duplicación de semilla**: si la inicialización no distingue "primer inicio" de "reapertura", se duplican ejemplos → bandera o chequeo de existencia de claves.
- **Inyección en el DOM**: usar `innerHTML` con datos del usuario viola la consigna → `textContent` / `createElement`.
- **Supuesto sin probar**: que el avance de Etapa 1 se entrega por separado y requiere que el README distinga maquetas de interacciones funcionales.
- **Sin tests automatizados**: las regresiones solo se detectan re-ejecutando los casos manuales → conviene re-correr la tabla completa antes de cada entrega.

## 11. Preguntas abiertas

- Nombre del autor a consignar en el README. Giuliano Espejo
- Fechas, canal y modalidad de entrega (las comunica el docente por separado). 
- Imágenes de tapas: ¿propias, generadas o placeholders? Si son ajenas, documentar procedencia en el README. Imagenes de internet
  - **Resuelto en C-03**: el autor eligió tapas SVG de elaboración propia (`img/tapas/lib-N.svg`); sin imágenes de terceros, el README indica que son obra propia.

