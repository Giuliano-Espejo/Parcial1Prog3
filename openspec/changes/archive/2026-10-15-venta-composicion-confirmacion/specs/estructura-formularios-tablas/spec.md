## MODIFIED Requirements

### Requirement: Controles pendientes identificados como maqueta

Mientras un formulario o vista no tenga su comportamiento implementado, SHALL mostrar un aviso visible con el texto "Pendiente — Etapa 2" que explique que es parte de la maqueta. El aviso MUST ser texto (no solo color ni ícono) y MUST estar asociado al botón de acción pendiente para que también lo anuncien los lectores de pantalla. El aviso aplica solo al historial. La composición y confirmación de la venta, ya implementadas, MUST NOT mostrar el aviso y sus botones MUST NOT quedar asociados a ningún aviso de maqueta.

#### Scenario: Venta sin aviso

- **WHEN** el usuario abre `ventas.html`
- **THEN** no ve el texto "Pendiente — Etapa 2" en ninguna parte de la página

#### Scenario: Botones de venta sin aviso asociado

- **WHEN** un lector de pantalla enfoca el botón "Agregar renglón" o "Confirmar venta"
- **THEN** anuncia solo el texto del botón, sin ningún aviso de maqueta

#### Scenario: Aviso solo en historial

- **WHEN** el usuario abre `historial.html`
- **THEN** ve el texto "Pendiente — Etapa 2" en la vista

#### Scenario: Aviso anunciado con el botón de historial

- **WHEN** un lector de pantalla enfoca el control pendiente de `historial.html`
- **THEN** anuncia también el aviso de maqueta asociado
