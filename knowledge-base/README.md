# TPI Frontend Librería — Base de Conocimiento

Base de conocimiento del TPI de Programación III (UTN-TUP), repaso para el Parcial 1. Se armó a partir del enunciado `Repaso Primer Parcial.pdf` y de `discovery/discovery.md`. Es documentación interna: **no forma parte de la entrega** (la entrega tiene su propio `README.md` en la raíz).

## Índice de Archivos

| Archivo | Contenido |
|---------|-----------|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos, etapas 1 y 2, alcance y fuera de alcance |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack nativo, arquitectura multipágina, sin integraciones |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Operador y docente, matriz de permisos, páginas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Entidades, ERD, estructura en `localStorage`, semilla |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas RN-CA/LI/CL/VE/PE/UI/GL |
| [06_funcionalidades.md](06_funcionalidades.md) | 6 épicas (= ejercicios) y 14 historias con criterios de aceptación |
| [07_flujos_principales.md](07_flujos_principales.md) | Carga de datos, filtro, altas, venta, historial, prueba del precio histórico |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Directorios, orden de carga, convención de los JS, identidad visual, seguridad |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | DD-01..10 y SU-01..05 |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | IN-01..03 y P-01..07 |

## Quick Start para Desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [10](10_preguntas_abiertas.md)

## Resumen Ejecutivo

Es un frontend estático de 5 páginas (Catálogo, Libros, Clientes, Ventas, Historial) en HTML, CSS y JS nativos, con scripts clásicos y sin librerías ni build, que se abre con doble clic en `index.html`. Los datos se cargan desde una semilla y persisten en `localStorage` con una clave por colección. Lo crítico para la nota son las validaciones de las altas, la venta con **precio histórico copiado** (el docente lo prueba editando `localStorage` a mano) y el README con los casos manuales efectivamente ejecutados.
