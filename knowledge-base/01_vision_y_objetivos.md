# Visión y Objetivos

## Propósito del sistema

Frontend de una librería que presenta su catálogo y registra libros, clientes y ventas, construido solo con HTML, CSS y JavaScript nativos, con datos simulados en el navegador.

Es el TPI de **Programación III** (Tecnicatura Universitaria en Programación a Distancia, UTN), repaso para el Parcial 1 (unidad HTML, CSS y JavaScript; revisor: Prof. Matías Torres). Toma como contexto de dominio el TP backend de la materia, pero **no se conecta con él**: todo ocurre en el navegador y persiste en `localStorage`.

Autor: **Giuliano Espejo** (trabajo individual).

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|-------|--------------------|-----------------------|
| Operador de la librería | Registrar ventas con totales correctos y precio histórico | Buscar libros por título; dar de alta libros y clientes; consultar el historial |
| Docente evaluador | Verificar funcionamiento, código y documentación contra la consigna | Reproducir los casos manuales del README, incluida la edición guiada de `localStorage` |

## Objetivos académicos (de la consigna)

- Construir interfaces con HTML semántico y CSS propio.
- Relacionar formularios, listados y navegación con las entidades del proyecto.
- Aplicar JavaScript nativo para representar datos locales, modificar el DOM y responder a eventos.
- Validar entradas y comprobar el comportamiento mediante casos manuales reproducibles.

## Alcance v1.0 (TPI completo)

- 5 vistas multipágina con navegación común: Catálogo (`index.html`), Libros, Clientes, Ventas, Historial.
- Identidad visual propia, adaptable a 320 px y 1280 px, accesible por teclado.
- Datos locales semilla: ≥ 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes.
- Catálogo generado por JS con filtro por título.
- Alta validada de libros y clientes.
- Venta simulada con renglones, subtotales, total y confirmación; historial inmutable con precio histórico.
- Persistencia en `localStorage` sin duplicar la semilla.
- README con instrucciones, límites de `localStorage`, casos manuales ejecutados y procedencia de imágenes.

### Etapas

| Etapa | Contenido | Resultado |
|-------|-----------|-----------|
| **Etapa 1** (semana de repaso) | Ej. 1 + Ej. 2: todas las pantallas maquetadas, CSS completo, catálogo renderizado desde la semilla JS con filtro funcionando | Avance: el README marca qué pantallas son maqueta y qué interacciones funcionan |
| **Etapa 2** (TPI completo) | Ej. 3 a 6: datos conectados, altas, ventas, historial, persistencia, README final | Entrega final |

## Fuera de alcance

- Editar o eliminar libros, clientes o ventas.
- ABM de editoriales, géneros y autores (son datos fijos de la semilla).
- Stock, cobros, facturación fiscal.
- Login, API, `fetch`, servidor, base de datos, backend.
- Dígito de control del ISBN.
- Pantalla para editar precios.
- Librerías, frameworks, CDNs, npm, herramientas de build.
- Tests automatizados (solo casos manuales — ver DD-05).

## Métricas de éxito

- Los 8 casos manuales del Ej. 6 pasan y su resultado real está registrado en el README.
- Puntaje objetivo: 100/100 según la grilla (HTML 20, CSS 20, Datos 15, Altas 15, Ventas 20, Cierre 10).
- Cero uso de `innerHTML` con datos escritos por el usuario.
- La app abre con doble clic en `index.html` en Chrome y Firefox, sin servidor.
