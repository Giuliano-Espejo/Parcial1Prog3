## MODIFIED Requirements

### Requirement: Controles pendientes identificados como maqueta

Ninguna vista tiene comportamiento pendiente: el aviso "Pendiente — Etapa 2" MUST NOT aparecer en ninguna página. `historial.html` MUST NOT contener el aviso ni asociarlo a ningún control; `ventas.html` MUST seguir sin aviso ni asociaciones de maqueta.
(Previously: el aviso aplicaba solo al historial; ventas ya estaba implementada.)

#### Scenario: Venta sin aviso

- GIVEN el usuario abre `ventas.html`
- WHEN recorre la página
- THEN no ve el texto "Pendiente — Etapa 2" en ninguna parte de la página

#### Scenario: Botones de venta sin aviso asociado

- GIVEN un lector de pantalla enfocado en "Agregar renglón" o "Confirmar venta"
- WHEN anuncia el control
- THEN anuncia solo el texto del botón, sin ningún aviso de maqueta

#### Scenario: Aviso solo en historial

- GIVEN el usuario abre `historial.html`
- WHEN recorre la página
- THEN no ve el texto "Pendiente — Etapa 2" y ve el listado o "No hay ventas registradas"

#### Scenario: Aviso anunciado con el botón de historial

- GIVEN un lector de pantalla enfocado en "Ver detalle de V-000N"
- WHEN anuncia el control
- THEN anuncia solo el texto del botón, sin ningún aviso de maqueta
