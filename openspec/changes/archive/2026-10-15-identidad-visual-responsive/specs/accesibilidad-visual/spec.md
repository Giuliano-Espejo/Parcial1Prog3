## Purpose

Fija los requisitos visuales de accesibilidad de la librería: foco siempre visible, enlace de salto que aparece al enfocarse, contraste suficiente, estados que no dependen solo del color, objetivos táctiles amplios y respeto por las preferencias de movimiento del usuario.

## ADDED Requirements

### Requirement: Foco visible en todo elemento enfocable
Todo enlace, botón, campo y selector SHALL mostrar un indicador de foco visible al recibir el foco con el teclado: un contorno del color de acento de al menos 3 px separado del elemento. Ninguna regla MUST eliminar el contorno de foco de un control sin reemplazarlo por un indicador equivalente.

#### Scenario: Recorrido completo con Tab
- **WHEN** el usuario recorre cada una de las cinco vistas solo con Tab y Shift+Tab
- **THEN** en cada paso el elemento enfocado muestra el contorno de foco y nunca se pierde de vista dónde está el foco

#### Scenario: Foco sobre el botón de acento
- **WHEN** el usuario enfoca con Tab el botón "Confirmar venta"
- **THEN** el contorno de foco se distingue del fondo del botón y del fondo de la página

### Requirement: Enlace de salto visible al enfocarse
El enlace "Saltar al contenido principal" SHALL permanecer fuera de la vista mientras no tenga el foco y MUST aparecer visible, por encima del encabezado y con su indicador de foco, en cuanto lo recibe.

#### Scenario: Primer Tab
- **WHEN** el usuario carga cualquier vista y presiona Tab una vez
- **THEN** aparece en la esquina superior el enlace "Saltar al contenido principal" con el foco visible

#### Scenario: Oculto sin foco
- **WHEN** el usuario abre una vista sin usar el teclado
- **THEN** el enlace de salto no se ve

### Requirement: Contraste mínimo AA
El texto normal SHALL tener una relación de contraste de al menos 4.5:1 con su fondo, y el texto grande, los bordes de los campos, el indicador de foco y los demás componentes de interfaz al menos 3:1, en todos los estados (normal, página actual, mensajes y avisos).

#### Scenario: Botón de acción
- **WHEN** se mide con DevTools el contraste del texto de cualquier botón de acción sobre su fondo
- **THEN** la relación es de al menos 4.5:1

#### Scenario: Borde de campo
- **WHEN** se mide el contraste del borde de un campo de texto contra el fondo de la superficie
- **THEN** la relación es de al menos 3:1

### Requirement: Estados no transmitidos solo por color
Ningún estado SHALL comunicarse únicamente por color: los mensajes MUST conservar su prefijo textual y sumar un borde visible, la página actual del menú MUST distinguirse también por peso de letra y borde, el aviso de maqueta MUST llevar texto y borde discontinuo, y un campo marcado como inválido (`aria-invalid="true"`) MUST mostrar un borde más grueso además del color de error.

#### Scenario: Campo marcado inválido
- **WHEN** se agrega en DevTools `aria-invalid="true"` al campo ISBN de `libros.html`
- **THEN** su borde se vuelve más grueso y de color de error

#### Scenario: Mensaje de error en escala de grises
- **WHEN** se muestra un mensaje de error con `mostrarMensaje` y se activa la emulación de visión acromática
- **THEN** el mensaje sigue identificándose por su prefijo "Error:" y su borde lateral

### Requirement: Sin marcas de error antes de interactuar
Los campos obligatorios SHALL verse en estado normal al cargar la página y mientras el usuario escribe: la interfaz MUST NOT marcar campos como erróneos por la validación nativa del navegador. El estado de error solo SHALL mostrarse cuando JavaScript marca el campo con `aria-invalid="true"`.

#### Scenario: Formulario recién abierto
- **WHEN** el usuario abre `clientes.html`, enfoca el campo Email, escribe "abc" y pasa al campo siguiente
- **THEN** ningún campo cambia a color de error ni muestra borde de error

### Requirement: Objetivos táctiles amplios
Los botones, los campos, los selectores y los enlaces del menú SHALL tener un área activa de al menos 44 px de alto.

#### Scenario: Menú en el celular
- **WHEN** se mide en DevTools a 320 px la altura de un enlace del menú y del botón "Registrar cliente"
- **THEN** ambos miden al menos 44 px de alto

### Requirement: Movimiento reducido
Si la interfaz usa transiciones o animaciones, SHALL aplicarlas solo cuando el usuario no haya pedido reducir el movimiento; con la preferencia de movimiento reducido activada los cambios de estado MUST ser instantáneos.

#### Scenario: Preferencia de movimiento reducido
- **WHEN** se emula `prefers-reduced-motion: reduce` en DevTools y se pasa el mouse sobre un botón o se enfoca el enlace de salto
- **THEN** el cambio de estilo ocurre sin transición
