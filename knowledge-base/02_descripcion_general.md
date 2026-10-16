# Descripción General

## Stack tecnológico

| Capa | Tecnologías | Versión mínima / notas |
|------|-------------|------------------------|
| Estructura | HTML5 semántico | `header`, `nav`, `main`, `section`, `form`, `table`, `label` |
| Presentación | CSS3 en archivos externos | Custom properties, Flexbox, Grid, `:focus-visible`, media queries |
| Comportamiento | JavaScript nativo (ES2015+) | **Scripts clásicos** con `defer`, sin `type="module"` |
| Persistencia | Web Storage API (`localStorage`) | JSON serializado, una clave por colección |
| Formato | `Intl.NumberFormat`, `Date#toLocaleString` | Locale `es-AR` |
| Tipografía | Fuentes del sistema | Sin Google Fonts (es un CDN) |
| Recursos | Imágenes locales en `img/` | Tapas SVG de elaboración propia en `img/tapas/`; el README indica que son obra del autor |

**Prohibido** (incumple el alcance técnico): librerías, frameworks, CDNs de CSS o JS, npm, bundlers, transpiladores.

## Arquitectura general

Aplicación **estática multipágina**. Cada vista es un archivo HTML independiente que carga el mismo CSS, un script común y un script propio. El estado compartido entre páginas vive en `localStorage`.

```
┌───────────────────────── Navegador (file://) ─────────────────────────┐
│                                                                       │
│  index.html   libros.html   clientes.html   ventas.html   historial.html
│      │             │              │              │              │     │
│      ▼             ▼              ▼              ▼              ▼     │
│  catalogo.js   libros.js     clientes.js     ventas.js    historial.js│
│      └─────────────┴──────────────┼──────────────┴──────────────┘     │
│                                   ▼                                   │
│                              comun.js                                 │
│        (semilla, almacenamiento, normalización, formato, DOM helpers) │
│                                   │                                   │
│                                   ▼                                   │
│                            localStorage                               │
│       libreria.libros · libreria.clientes · libreria.ventas           │
└───────────────────────────────────────────────────────────────────────┘
```

Justificación:
- **Multipágina** (DD-01): navegación con enlaces reales, sin router; cada página se entiende por separado.
- **Scripts clásicos** (DD-02): los ES modules no cargan desde `file://`, y la consigna exige abrir `index.html` sin npm ni servidor.
- **`localStorage` desde la Etapa 2** (DD-03): al ser multipágina, el estado en memoria se pierde al navegar; el alta en `libros.html` tiene que verse en `index.html` y en `ventas.html`.

## Integraciones externas

| Servicio | Propósito | Tipo |
|----------|-----------|------|
| — | Ninguna | La consigna excluye API, `fetch`, backend y CDNs |

## API REST

No aplica. No hay backend ni llamadas de red.
