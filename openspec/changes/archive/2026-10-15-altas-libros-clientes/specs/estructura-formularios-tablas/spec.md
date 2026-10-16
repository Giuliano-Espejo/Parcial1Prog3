## MODIFIED Requirements

### Requirement: Controles pendientes identificados como maqueta
Mientras un formulario o vista no tenga su comportamiento implementado, SHALL mostrar un aviso visible con el texto "Pendiente — Etapa 2" que explique que es parte de la maqueta. El aviso MUST ser texto (no solo color ni ícono) y MUST estar asociado al botón de acción pendiente para que también lo anuncien los lectores de pantalla. El aviso aplica a la composición de venta y al historial. Los formularios de alta de libro y de alta de cliente, ya implementados, MUST NOT mostrar el aviso y sus botones MUST NOT quedar asociados a ningún aviso de maqueta.

#### Scenario: Formularios de alta sin aviso
- **WHEN** el usuario abre `libros.html` o `clientes.html`
- **THEN** no ve el texto "Pendiente — Etapa 2" en ninguna parte de la página

#### Scenario: Aviso en venta e historial
- **WHEN** el usuario abre `ventas.html` o `historial.html`
- **THEN** ve el texto "Pendiente — Etapa 2" en la vista

#### Scenario: Botón de alta sin aviso asociado
- **WHEN** un lector de pantalla enfoca el botón "Registrar libro" o "Registrar cliente"
- **THEN** anuncia solo el texto del botón, sin ningún aviso de maqueta

#### Scenario: Aviso en formularios pendientes
- **WHEN** el usuario abre `ventas.html`
- **THEN** ve el texto "Pendiente — Etapa 2" junto al formulario de renglón y al botón "Confirmar venta"

#### Scenario: Aviso anunciado con el botón
- **WHEN** un lector de pantalla enfoca el botón "Agregar renglón" o "Confirmar venta"
- **THEN** anuncia también el aviso de maqueta asociado
