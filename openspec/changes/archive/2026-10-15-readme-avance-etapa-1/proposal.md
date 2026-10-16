## Why

La Etapa 1 (C-01..C-03) ya dejó las cinco vistas maquetadas, el CSS completo y el catálogo generado por JS con filtro, pero el proyecto no tiene `README.md`. La consigna (Formato de entrega, pág. 7) exige un README que identifique al autor, explique cómo abrir y navegar, liste lo implementado y lo pendiente, ubique los datos iniciales, hable de `localStorage`, registre los casos manuales y la procedencia de las imágenes, y que **en el avance de la Etapa 1 identifique expresamente qué pantallas son maquetas y qué interacciones ya funcionan**. Este change cierra el hito de la Etapa 1 (US-014 parcial, SU-01, IN-02).

## What Changes

- Nuevo `README.md` en la raíz, en español, con estructura reutilizable para el README final de C-09: autor (Giuliano Espejo, trabajo individual), estado de la entrega (avance de la Etapa 1), cómo abrir `index.html` sin npm ni servidor, navegación entre las cinco vistas, tabla "Maquetas e interacciones funcionales" por vista, funcionalidades implementadas y pendientes, ubicación de los datos iniciales (`js/comun.js`), estado de `localStorage` (todavía no se usa: llega en la Etapa 2), casos manuales del avance con el resultado **realmente observado**, procedencia de las imágenes (tapas SVG de elaboración propia) y contenido de la entrega.
- Verificación (sin lógica nueva) de que los avisos `p.aviso-maqueta` "Pendiente — Etapa 2" de `libros.html`, `clientes.html`, `ventas.html` e `historial.html` coinciden con lo que declara el README.
- Checklist de cierre de la Etapa 1: 320 px / 1280 px sin scroll horizontal, foco visible, y barrido de `innerHTML`, `type="module"`, `http://` y `https://` en `*.html`, `*.js` y `*.css`.
- Definición de la carpeta/zip de avance: solo los cinco HTML, `css/`, `js/`, `img/` y `README.md`, armada a mano en Windows sin scripts ni herramientas de build.

**Non-goals**: no se modifica ningún `*.html`, `*.css` ni `*.js`; no se implementa `localStorage`, altas, ventas ni historial; no se agregan tests automatizados; no se inventan fecha, canal ni modalidad de entrega (P-01); no se registra ningún caso manual como aprobado sin que el usuario lo haya ejecutado.

## Capabilities

### New Capabilities
- `documentacion-entrega`: contenido obligatorio del `README.md` de entrega (avance de la Etapa 1, extensible a la entrega final), el registro honesto de los casos manuales y la composición de la carpeta/zip de entrega.

### Modified Capabilities
<!-- Ninguna: el change no cambia requisitos de las capacidades existentes; solo documenta y verifica lo construido en C-01..C-03. -->

## Impact

- **Archivos nuevos**: `README.md` (raíz). Es el único archivo del proyecto que se crea; ningún archivo existente cambia.
- **Entrega**: define la carpeta/zip del avance (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `css/`, `js/`, `img/`, `README.md`) y excluye `knowledge-base/`, `discovery/`, `openspec/`, `.claude/`, `.atl/`, `AGENTS.md`, `CLAUDE.md`, `CHANGES.md`, `.active-orchestrator-state.json` y el PDF de la consigna.
- **Changes posteriores**: C-09 (`cierre-readme-casos-manuales`) extiende este README: reemplaza el estado de la entrega, la sección de maquetas, la de `localStorage` y la tabla de casos por los 8 casos de la consigna.
- **Dependencias**: C-02 y C-03 (archivados). Sin dependencias técnicas nuevas.
