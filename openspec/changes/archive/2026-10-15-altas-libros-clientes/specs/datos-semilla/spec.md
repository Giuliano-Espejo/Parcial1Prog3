## ADDED Requirements

### Requirement: Normalización de ISBN y email para comparar
El script común SHALL ofrecer una normalización de ISBN que quite todos los espacios y guiones y pase las letras a mayúsculas, y una normalización de email que quite los espacios exteriores y pase a minúsculas. Un valor ausente (`null` o `undefined`) MUST normalizarse como texto vacío. Estas normalizaciones MUST usarse solo para comparar: MUST NOT alterar los valores que se guardan ni los que se muestran.

#### Scenario: ISBN con separadores
- **WHEN** se normaliza el ISBN `978-987 8000-01-5`
- **THEN** el resultado es `9789878000015`

#### Scenario: ISBN-10 con X minúscula
- **WHEN** se normalizan `0-306-40615-x` y `030640615X`
- **THEN** ambos resultados son `030640615X`

#### Scenario: Email con mayúsculas y espacios
- **WHEN** se normaliza el email `  ANA.Mendez@Example.com `
- **THEN** el resultado es `ana.mendez@example.com`

#### Scenario: Valor ausente
- **WHEN** se normaliza `undefined` como ISBN o como email
- **THEN** el resultado es una cadena vacía

### Requirement: Id siguiente para registros nuevos
El script común SHALL calcular el id de un registro nuevo a partir de una lista y un prefijo (`lib` o `cli`): el resultado MUST ser `<prefijo>-<N>`, donde N es el mayor número de los ids de la lista con ese prefijo más 1, o 1 si no hay ninguno. Los ids que no tengan la forma `<prefijo>-<número>` MUST ignorarse. El cálculo MUST NOT modificar la lista.

#### Scenario: Lista semilla
- **WHEN** se calcula el id siguiente de los 6 libros semilla con el prefijo `lib`
- **THEN** el resultado es `lib-7`

#### Scenario: Ids con huecos
- **WHEN** se calcula el id siguiente de una lista con `lib-1` y `lib-9` con el prefijo `lib`
- **THEN** el resultado es `lib-10`

#### Scenario: Lista vacía o con ids ajenos
- **WHEN** se calcula el id siguiente de `[]`, y luego de una lista con un único id `x-5`, con el prefijo `cli`
- **THEN** ambos resultados son `cli-1`
