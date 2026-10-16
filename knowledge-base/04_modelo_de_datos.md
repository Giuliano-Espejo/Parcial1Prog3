# Modelo de Datos

## Dominios

- **Catálogo**: libros, editoriales, géneros, autores.
- **Clientes**: clientes de la librería.
- **Ventas**: ventas confirmadas con renglones (snapshot histórico).

## ERD

```
Editorial 1 ──── * Libro * ──── * Autor
                    │
                    * ──── 0..1 Genero

Cliente 1 ──── * Venta 1 ──── * Renglon
                                  │ (libroId como referencia; datos copiados)
                                  ▼
                                Libro
```

## Entidades

Los ids son **strings estables** con prefijo. Las referencias se guardan por id.

### Editorial (fija, semilla)
- `id: string` — `"ed-1"`
- `nombre: string`

### Genero (fijo, semilla)
- `id: string` — `"gen-1"`
- `nombre: string`

### Autor (fijo, semilla)
- `id: string` — `"aut-1"`
- `nombre: string` — nombre completo

### Libro (persistido en `libreria.libros`)
- `id: string` — `"lib-1"`, `"lib-2"`, … (nuevo = máximo numérico + 1)
- `titulo: string` — sin espacios exteriores
- `isbn: string` — tal como lo ingresó el usuario (con trim); se **compara** normalizado (sin espacios ni guiones)
- `precio: number` — > 0, redondeado a 2 decimales
- `editorialId: string` — referencia a una Editorial existente
- `generoId: string | null` — `null` = «Sin clasificar»
- `autorIds: string[]` — al menos uno, todos existentes
- `imagen: string | null` — ruta local a la tapa SVG propia (`img/tapas/lib-N.svg`) para los libros semilla; `null` para los dados de alta

Constraints: ISBN normalizado único (RN-LI-03).

### Cliente (persistido en `libreria.clientes`)
- `id: string` — `"cli-1"`, …
- `nombreCompleto: string`
- `email: string` — guardado con trim; se compara en minúsculas

Constraints: email normalizado (trim + minúsculas) único (RN-CL-04).

### Venta (persistida en `libreria.ventas`)
- `id: string` — `"V-0001"`, correlativo
- `fecha: string` — ISO 8601 (`new Date().toISOString()`)
- `clienteId: string`
- `clienteNombre: string` — **copia** al confirmar
- `clienteEmail: string` — **copia** al confirmar
- `renglones: Renglon[]` — al menos uno
- `total: number` — suma de subtotales, 2 decimales

### Renglon (embebido en Venta)
- `libroId: string`
- `titulo: string` — **copia**
- `isbn: string` — **copia**
- `cantidad: number` — entero > 0
- `precioUnitario: number` — **copia del precio al confirmar** (valor histórico)
- `subtotal: number` — `cantidad × precioUnitario`, 2 decimales

> Las ventas se leen **solo** con sus datos copiados. El historial nunca busca el precio actual del catálogo (RN-VE-07). Eso es lo que prueba el docente al editar `libreria.libros` a mano.

## Estructura en `localStorage`

| Clave | Contenido | Se carga desde la semilla si… |
|-------|-----------|-------------------------------|
| `libreria.libros` | `Libro[]` (JSON) | la clave no existe |
| `libreria.clientes` | `Cliente[]` (JSON) | la clave no existe |
| `libreria.ventas` | `Venta[]` (JSON) | la clave no existe (→ `[]`) |

Editoriales, géneros y autores **no se persisten**: son constantes en `comun.js` (no tienen ABM).

Ejemplo de lo que edita el docente (DevTools → Application → Local Storage → `libreria.libros`): cambiar `"precio": 1500` por `"precio": 9999` en un libro y recargar; la venta anterior conserva `precioUnitario: 1500`.

## Seed data inicial

Mínimos exigidos: **6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes** (ficticios).

Requisitos del set semilla para cubrir los casos:
- Al menos un libro **sin género** (para mostrar «Sin clasificar»).
- Al menos un libro con **más de un autor**.
- Libros con precios **1500** y **2000** (para el caso manual "dos unidades a 1500 y una a 2000").
- Títulos con palabras repetidas en distintas mayúsculas, para probar el filtro.
- Todas las referencias (`editorialId`, `generoId`, `autorIds`) apuntan a ids existentes.
- Cero ventas iniciales.
