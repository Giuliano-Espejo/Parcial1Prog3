## MODIFIED Requirements

### Requirement: Id siguiente para ventas nuevas

El script común SHALL calcular el id de una venta nueva a partir de la lista de ventas: el resultado MUST ser `V-NNNN` con 4 dígitos con ceros a la izquierda, donde NNNN es el mayor número de los ids con forma `V-<número>` más 1, o 1 si no hay ninguno (`V-0001`). Los ids que no tengan esa forma MUST ignorarse. El cálculo MUST NOT modificar la lista ni tocar el DOM o el almacenamiento.

#### Scenario: Lista vacía

- **WHEN** se ejecuta `siguienteIdVenta([])`
- **THEN** devuelve `"V-0001"`

#### Scenario: Correlativo con ceros

- **WHEN** se ejecuta `siguienteIdVenta([{id:'V-0001'},{id:'V-0002'}])`
- **THEN** devuelve `"V-0003"`

#### Scenario: Huecos e ids ajenos

- **WHEN** se ejecuta `siguienteIdVenta([{id:'V-0001'},{id:'V-0009'},{id:'x-5'}])`
- **THEN** devuelve `"V-0010"`
