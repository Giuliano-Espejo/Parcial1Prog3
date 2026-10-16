## MODIFIED Requirements

### Requirement: Catálogo generado desde los datos
Al abrir `index.html`, el catálogo SHALL mostrar una tarjeta por cada libro de la colección actual guardada en el navegador, en el orden de la colección, generada por JavaScript dentro del contenedor del catálogo. El HTML MUST NOT contener tarjetas o filas de libros escritas a mano.

#### Scenario: Catálogo completo al cargar
- **WHEN** con el almacenamiento sin claves de la librería el usuario abre `index.html` con `file://`
- **THEN** ve una tarjeta por cada libro semilla, la zona de estado del catálogo no muestra ningún mensaje, la zona de aviso de almacenamiento está vacía y la consola no muestra errores

#### Scenario: Catálogo con datos guardados
- **WHEN** la clave `libreria.libros` contiene los libros con el precio de "Cartas a la Noche" cambiado a 2100 y el usuario abre o recarga `index.html`
- **THEN** el catálogo muestra los libros guardados y la tarjeta de "Cartas a la Noche" muestra "Precio: $ 2.100,00"

#### Scenario: Sin tarjetas en el HTML
- **WHEN** se inspecciona el código fuente de `index.html` (no el DOM en vivo)
- **THEN** el contenedor del catálogo está vacío
