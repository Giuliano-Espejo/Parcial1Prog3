## Why

Las cinco vistas de C-01 tienen estructura semántica completa pero se ven con los estilos por defecto del navegador: `css/base.css`, `css/layout.css` y `css/componentes.css` son placeholders. El Ej. 2 de la consigna (20 puntos: coherencia y organización 8, adaptación 8, accesibilidad básica 4) exige una identidad visual propia en CSS externo, legible a 320 px y 1280 px sin scroll horizontal, con foco visible y errores que no dependan solo del color. Es parte de la entrega de la Etapa 1 y no depende de ningún dato, así que puede hacerse ya, en paralelo con C-03.

## What Changes

- Completar `css/base.css` con custom properties (paleta "moderna minimal": fondo claro, un solo color de acento con contraste AA, colores semánticos de error/éxito/aviso, escala de espaciado, radio y sombra), reset mínimo, tipografía del sistema (`system-ui`), estilo de enlaces, `:focus-visible` global y regla que garantiza que el atributo `hidden` siempre oculte.
- Completar `css/layout.css` mobile-first desde 320 px con un breakpoint principal en 48em (~768 px): enlace de salto visible al recibir foco, encabezado y menú con Flexbox (el menú se reparte en filas en pantallas angostas), `main` centrado con ancho máximo, pie, grilla del catálogo con Grid y disposición de formularios en una o varias columnas.
- Completar `css/componentes.css` con clases reutilizables: `.boton`, `.campo` (etiqueta, control, `.ayuda`), tablas dentro de `.tabla-contenedor` con desplazamiento horizontal propio, `.mensaje` y sus variantes `--error`, `--exito`, `--info`, `.zona-mensajes`, `.aviso-maqueta` destacado y no solo por color, `.tarjeta` y `.tarjeta img` con proporción fija y `object-fit` listos para las tapas de C-03.
- Marcar visualmente la página actual del menú (`[aria-current="page"]`) con peso y borde además de color.
- Agregar la clase `grilla-tarjetas` al contenedor `#catalogo` de `index.html` (único cambio de HTML; no altera la estructura semántica de C-01).
- Transiciones solo bajo `prefers-reduced-motion: no-preference`; ningún estilo sobre `:invalid` (los campos tienen `required` + `novalidate`).
- Verificación manual en Chrome y Firefox por `file://`: 320 px y 1280 px sin scroll horizontal en las cinco vistas, recorrido completo con Tab, contraste y zoom al 200 %.

## Capabilities

### New Capabilities
- `identidad-visual`: hojas de estilo externas con variables, paleta clara con un único acento, tipografía del sistema y componentes visuales reutilizables (botón, campo, tabla, mensaje, aviso de maqueta, tarjeta) aplicados de forma uniforme en las cinco vistas.
- `diseno-adaptable`: comportamiento de la interfaz entre 320 px y 1280 px: sin scroll horizontal de página, menú, grilla del catálogo y formularios que se reacomodan, tablas con desplazamiento propio e imágenes que no desbordan.
- `accesibilidad-visual`: requisitos visuales de accesibilidad: foco visible en todo control, enlace de salto visible al enfocarse, contraste AA, estados que no dependen solo del color, objetivos táctiles amplios, sin marcas de error prematuras y respeto por la preferencia de movimiento reducido.

### Modified Capabilities
- Ninguna. Los requisitos de C-01 (estructura, navegación, formularios y tablas, utilidades DOM) siguen valiendo tal cual; este change agrega su presentación visual sin cambiar su comportamiento.

## Impact

- **Código**: `css/base.css`, `css/layout.css`, `css/componentes.css` (pasan de placeholder a contenido real); `index.html` (una clase agregada a `#catalogo`). No se tocan los JS ni el `<head>` de las páginas.
- **Changes siguientes**: C-03 genera `<article class="tarjeta">` con `<img>` dentro de `.grilla-tarjetas` y hereda su estilo; C-06/C-07/C-08 usan `.mensaje--*` vía `mostrarMensaje` y pueden marcar campos con `aria-invalid="true"`, que ya tiene estilo.
- **Dependencias**: ninguna nueva. Sin fuentes web, CDNs ni recursos `http(s)`.
- **Riesgo**: bajo (governance BAJO); el cambio es reversible restaurando los placeholders.
