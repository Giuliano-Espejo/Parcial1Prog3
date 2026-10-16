# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — Momento de la persistencia
**La consigna (Ej. 6) dice**: "En la etapa final se utiliza localStorage…".
**La decisión DD-01 (multipágina) implica**: sin `localStorage`, un alta en `libros.html` no llega a `index.html` ni a `ventas.html`, y el Ej. 4 exige que el libro nuevo "aparezca en catálogo y selección de venta".
**Impacto**: si se posterga la persistencia, los Ej. 4 y 5 no se pueden verificar entre páginas.
**Resolución propuesta**: adoptada en DD-03. `localStorage` entra al conectar las pantallas a datos; el Ej. 6 suma el README y los casos manuales.

### IN-02 — "Datos estáticos de ejemplo" en la Etapa 1 vs. render JS
**La consigna dice**: en la Etapa 1, los listados "pueden mostrar datos estáticos de ejemplo".
**Decisión DD-08**: el catálogo y los listados ya se generan desde la semilla JS.
**Impacto**: ninguno; es una opción permitida ("pueden"), no una obligación.
**Resolución propuesta**: en el README del avance se aclara qué pantallas son maqueta (formularios de alta, venta, historial vacío) y qué funciona (catálogo y filtro).

### IN-03 — Un archivo JS por página vs. "funciones acotadas y separación"
**Criterio de evaluación**: "Se valora código legible… funciones acotadas y separación entre estructura, estilos y comportamiento".
**Decisión DD-04**: lógica y DOM conviven en el mismo archivo por página.
**Impacto**: puede restar puntos de legibilidad si el archivo queda monolítico.
**Resolución propuesta**: secciones obligatorias (Lógica pura / Render / Eventos / Inicio) y funciones cortas. Revisar el tamaño de `ventas.js`, que es el más complejo, y partirlo si supera ~250 líneas.

## Preguntas abiertas (priorizadas)

| ID | Prioridad | Pregunta | Bloquea | Decisor |
|----|-----------|----------|---------|---------|
| P-01 | Alta | Fechas, canal y modalidad de entrega (avance de la Etapa 1 y final) | Planificación de la entrega | Docente |
| P-02 | Media | ¿Las 5 páginas comparten `localStorage` en Firefox abriendo desde `file://`? (SU-02) — **Parcial (C-05)**: en Chrome sí comparte (verificado 2026-10-15); Firefox no está disponible en el equipo del autor y queda sin verificar | Entrega final (README §2/§7) | Autor |
| P-03 | Media | Si `JSON.parse` falla por una edición manual mal hecha, ¿se avisa y se usa `[]`, o se restaura la semilla? (propuesta: avisar y no pisar) | Change de persistencia | Autor |
| P-04 | Media | ¿Los archivos de `knowledge-base/`, `discovery/`, `openspec/` y `.claude/` van en el zip de entrega? (propuesta: excluirlos) | Entrega | Autor / docente |
| P-05 | Baja | ¿Hace falta validar el formato del ISBN (10 o 13 dígitos)? (SU-03) | — | Docente |
| P-06 | Baja | ~~¿Qué fuentes de las imágenes de tapas se citan en el README (URL + licencia)?~~ **Resuelta (C-03)**: las tapas son SVG de elaboración propia; el README solo indica que son obra del autor | README final | Autor |
| P-07 | Baja | ¿Se muestra imagen o placeholder para los libros dados de alta? (SU-04) | Change de altas | Autor |
