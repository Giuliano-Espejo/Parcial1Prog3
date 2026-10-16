# TPI Frontend Librería — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

Frontend estático de una librería (Catálogo, Libros, Clientes, Ventas, Historial) para el TPI de **Programación III** (UTN-TUP, repaso Parcial 1). Autor: Giuliano Espejo, trabajo individual.

---

## Stack Tecnológico

| Capa | Tecnología | Notas |
|------|------------|-------|
| Estructura | HTML5 semántico | Multipágina: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` |
| Presentación | CSS3 en archivos externos | Custom properties, Flexbox/Grid, `:focus-visible`, 320 px y 1280 px |
| Comportamiento | JavaScript nativo (ES2015+) | **Scripts clásicos** con `defer`, sin `type="module"` |
| Persistencia | `localStorage` | Claves `libreria.libros`, `libreria.clientes`, `libreria.ventas` |
| Integraciones | Ninguna | Sin API, `fetch`, backend ni CDNs |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Propósito, etapas 1 y 2, alcance y fuera de alcance |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Quién usa qué, páginas y permisos |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, claves de `localStorage`, semilla |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-XX) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario (US-001..014) por épica |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E y prueba del precio histórico |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Directorios, orden de carga, convención de los JS |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | DD-01..10 (incluye cómo se verifica) y SU-01..05 |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias y preguntas a resolver ANTES de codear |

> ⚠️ Resolver las preguntas de prioridad **Alta** de `10_preguntas_abiertas.md` antes de arrancar el primer change: P-01 (fechas y modalidad de entrega) y P-02 (¿las 5 páginas comparten `localStorage` en Firefox con `file://`?).

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Maquetación y estilos** | HTML semántico, CSS, responsive, accesibilidad (Ej. 1 y 2) | `semantic-html-and-seo`, `responsive-design`, `accessibility` |
| **Lógica y datos** | JS nativo, validaciones, `localStorage`, venta (Ej. 3 a 5) | `security-and-hardening` (solo validación de entradas y DOM seguro), `diagnosing-bugs` |
| **Documentación** | README y casos manuales (Ej. 6) | `cognitive-doc-design` |
| **Orquestación** | OPSX / fundación / docs del proyecto | `kb-creator`, `roadmap-generator`, `agent-instruction`, `skill-creator` |

Cargá la skill correspondiente al contexto ANTES de escribir código. Las skills de Python, Go, Postgres, Docker, Redis, TypeScript y las de Moodle están instaladas pero **no aplican** a este proyecto.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 9 changes en 5 fases, en dos hitos de entrega (Etapa 1: C-01..C-04; Etapa 2: C-05..C-09).
- **Camino crítico** (7): `C-01 → C-03 → C-04 → C-05 → C-07 → C-08 → C-09`. C-02 y C-06 son obligatorios y se pueden hacer en paralelo lógico.
- **Primer change**: `C-01` (`foundation-estructura-html`).

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras (específicas del proyecto)

> Reglas globales ya definidas en `~/.claude/CLAUDE.md` (orquestador, governance, TDD, engram): el proyecto las hereda. Acá viven solo las reglas **específicas de este proyecto** + las universales que el global no cubra.

Son contrato; romperlas es un defecto.

**Alcance técnico**
- NUNCA usar librerías, frameworks, CDNs, npm ni herramientas de build → solo HTML, CSS y JavaScript nativos, con todos los recursos locales.
- NUNCA usar `type="module"` → scripts clásicos con `defer`, cargando `js/comun.js` antes del script de cada página (los módulos fallan con `file://`).
- NUNCA insertar datos escritos por el usuario con `innerHTML` → `textContent` o `createElement`.

**Datos y venta**
- NUNCA leer el precio del catálogo para mostrar una venta ya confirmada → copiar `precioUnitario`, título e ISBN de cada renglón, y nombre y email del cliente, al confirmar la venta.
- NUNCA mezclar validaciones o cálculos con DOM o `localStorage` → funciones puras, y cada JS dividido en secciones `Lógica / Render / Eventos / Inicio`.

**Testing**
- NUNCA agregar tests automatizados ni aplicar Strict TDD en este proyecto (sobrescribe el global; ver DD-05) → verificar con los casos manuales del README, y NUNCA marcar un caso como aprobado sin ejecutarlo.

**Calidad y entrega**
- NUNCA dejar un campo sin `label` asociado, un control sin foco visible ni un error expresado solo con color → `label for`, `:focus-visible` y mensajes de error con texto.
- NUNCA incluir `knowledge-base/`, `discovery/`, `openspec/`, `.claude/`, `.atl/` ni los archivos de estado en la carpeta o zip de entrega → la entrega lleva solo los HTML, `css/`, `js/`, `img/` y `README.md`.
- NUNCA commitear ni ejecutar builds sin que el usuario lo pida expresamente → el proyecto no tiene build y hoy no es un repositorio git.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose <nombre-del-change>             → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive <nombre-del-change> + marcar [x] → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
