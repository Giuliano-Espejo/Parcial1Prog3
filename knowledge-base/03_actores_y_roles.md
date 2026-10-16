# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|-------|-------------|-----------------|
| Operador de la librería | Única persona que usa la interfaz | Navega las 5 vistas, busca, da de alta libros y clientes, compone y confirma ventas, consulta el historial |
| Docente evaluador | Corrige el TPI | Abre `index.html` desde la carpeta entregada, ejecuta los casos manuales del README y, en una copia del proyecto, edita a mano `libreria.libros` en `localStorage` con DevTools |

No hay autenticación ni roles diferenciados: la consigna aclara que no se requiere inicio de sesión real.

## RBAC — Matriz de permisos

Un único rol implícito (operador) con estos permisos sobre los datos:

| Recurso | Crear | Leer | Editar | Eliminar | Notas |
|---------|:-----:|:----:|:------:|:--------:|-------|
| Libros | ✅ | ✅ | — | — | Sin edición ni baja (fuera de alcance) |
| Clientes | ✅ | ✅ | — | — | Sin edición ni baja |
| Editoriales / Géneros / Autores | — | ✅ | — | — | Datos fijos de la semilla, sin ABM |
| Venta en curso | ✅ | ✅ | ✅ cantidades | ✅ renglones | Solo antes de confirmar; vive en memoria de `ventas.html` |
| Ventas confirmadas | ✅ (al confirmar) | ✅ | ❌ | ❌ | Inmutables desde la interfaz (RN-VE-09) |

## Rutas públicas

Todas las vistas son públicas (archivos locales):

| Archivo | Vista |
|---------|-------|
| `index.html` | Catálogo (entrada) |
| `libros.html` | Alta y listado de libros |
| `clientes.html` | Alta y listado de clientes |
| `ventas.html` | Composición y confirmación de venta |
| `historial.html` | Listado de ventas y detalle |
