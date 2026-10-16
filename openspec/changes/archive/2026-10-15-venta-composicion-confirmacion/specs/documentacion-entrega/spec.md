## MODIFIED Requirements

### Requirement: Maquetas e interacciones funcionales identificadas por vista

Mientras queden partes en maqueta, el README SHALL incluir una sección que indique expresamente, para cada una de las cinco vistas, qué ya funciona y qué es maqueta. Lo declarado como maqueta MUST coincidir con las partes de las páginas que muestran el aviso "Pendiente — Etapa 2", y lo declarado como funcional MUST limitarse a lo que efectivamente está implementado (en este estado: catálogo generado por JS con filtro por título; listados de Libros y Clientes generados desde los datos guardados; alta validada de libros y de clientes con actualización del listado sin recargar; composición y confirmación de ventas con snapshot histórico; datos guardados en `localStorage` y compartidos entre las vistas).

#### Scenario: Ventas funcional, Historial maqueta

- **WHEN** el docente lee la sección de maquetas e interacciones funcionales
- **THEN** Ventas figura con composición, cálculos y confirmación como funcional y sin maqueta, e Historial figura con listado y detalle como maqueta

#### Scenario: Coherencia con los avisos de las páginas

- **WHEN** se compara la sección del README con los avisos "Pendiente — Etapa 2" de las páginas
- **THEN** solo Historial tiene declarada su parte de maqueta, y Ventas (sin aviso) no figura con partes de maqueta

#### Scenario: Sin funcionalidades exageradas

- **WHEN** se intenta en el navegador cualquier interacción que el README declara como funcional
- **THEN** la interacción se comporta como el README la describe; ningún historial figura como funcional mientras su vista muestre el aviso "Pendiente — Etapa 2"

### Requirement: Funcionalidades implementadas y pendientes

El README SHALL listar por separado las funcionalidades implementadas y las pendientes. Las pendientes MUST indicar en qué etapa se completan. Una funcionalidad MUST figurar como implementada solo cuando funciona en el proyecto.

#### Scenario: Venta implementada

- **WHEN** el docente revisa la lista con la venta implementada
- **THEN** ve la composición y confirmación de la venta entre las implementadas y solo el historial como pendiente de la Etapa 2

### Requirement: Casos manuales con resultado realmente observado

El README SHALL incluir una tabla de casos manuales con, para cada caso, los pasos o la entrada, el resultado esperado y el resultado observado en Chrome y en Firefox. Un resultado observado MUST registrar únicamente lo que vio quien ejecutó el caso; un caso no ejecutado MUST mostrar el texto literal "Pendiente de ejecutar" y MUST NOT figurar como aprobado. Si un navegador no está disponible para el autor, su celda MUST decirlo con texto y MUST NOT figurar como aprobado.

#### Scenario: Casos de venta

- **WHEN** el docente revisa la tabla con la venta implementada
- **THEN** encuentra además casos de venta sin cliente, cantidad 0 / -1 / 1.5, libro repetido que suma, venta válida 2 × 1500 + 1 × 2000 = 5000 con mensaje con id y total, venta con `lib-7`/`cli-4` de C-06, edición inválida que bloquea, "Quitar" que recalcula, y confirmación con clave de ventas dañada

#### Scenario: Firefox no disponible

- **WHEN** el autor no tiene Firefox en su equipo
- **THEN** la columna Firefox de cada caso V dice "No ejecutado: Firefox no disponible en el equipo del autor"
