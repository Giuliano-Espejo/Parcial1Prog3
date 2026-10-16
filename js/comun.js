// comun.js — helpers compartidos por las 5 páginas; C-01 DOM, C-03 datos semilla, acceso y formato; C-05 almacenamiento (sección Almacenamiento); C-06 normalización, id siguiente y varios errores (normalizarIsbn, normalizarEmail, siguienteId, mostrarErrores); C-07 id siguiente de venta (siguienteIdVenta).
'use strict';

// ===== Datos =====

// Todos los datos son ficticios. Los ISBN usan el prefijo 978-987 y los emails dominios reservados (RFC 2606).
const EDITORIALES = [
  { id: 'ed-1', nombre: 'Ediciones del Faro Austral' },
  { id: 'ed-2', nombre: 'Editorial Cardón' }
];

const GENEROS = [
  { id: 'gen-1', nombre: 'Novela' },
  { id: 'gen-2', nombre: 'Ensayo' }
];

const AUTORES = [
  { id: 'aut-1', nombre: 'Marta Quiroga Vidal' },
  { id: 'aut-2', nombre: 'Tomás Aldao' },
  { id: 'aut-3', nombre: 'Inés Barrionuevo' }
];

const LIBROS_SEMILLA = [
  { id: 'lib-1', titulo: 'La noche del faro', isbn: '978-987-8000-01-5', precio: 1500, editorialId: 'ed-1', generoId: 'gen-1', autorIds: ['aut-1'], imagen: 'img/tapas/lib-1.svg' },
  { id: 'lib-2', titulo: 'Cartas a la Noche', isbn: '978-987-8000-02-2', precio: 2000, editorialId: 'ed-2', generoId: 'gen-2', autorIds: ['aut-2'], imagen: 'img/tapas/lib-2.svg' },
  { id: 'lib-3', titulo: 'Mapas del puerto', isbn: '978-987-8000-03-9', precio: 2499.9, editorialId: 'ed-1', generoId: null, autorIds: ['aut-1', 'aut-3'], imagen: 'img/tapas/lib-3.svg' },
  { id: 'lib-4', titulo: 'Diario de una NOCHE sin luna', isbn: '978-987-8000-04-6', precio: 1850.75, editorialId: 'ed-2', generoId: 'gen-1', autorIds: ['aut-3'], imagen: 'img/tapas/lib-4.svg' },
  { id: 'lib-5', titulo: 'El Puerto dormido', isbn: '978-987-8000-05-3', precio: 3200, editorialId: 'ed-1', generoId: 'gen-1', autorIds: ['aut-2'], imagen: 'img/tapas/lib-5.svg' },
  { id: 'lib-6', titulo: 'Ensayos sobre el viento', isbn: '978-987-8000-06-0', precio: 2750, editorialId: 'ed-2', generoId: 'gen-2', autorIds: ['aut-2', 'aut-3'], imagen: 'img/tapas/lib-6.svg' }
];

const CLIENTES_SEMILLA = [
  { id: 'cli-1', nombreCompleto: 'Ana Sofía Méndez', email: 'ana.mendez@example.com' },
  { id: 'cli-2', nombreCompleto: 'Bruno Iriarte', email: 'bruno.iriarte@example.com' },
  { id: 'cli-3', nombreCompleto: 'Carla Domínguez Paz', email: 'carla.dominguez@example.org' }
];

// ===== Almacenamiento =====

// Único código del proyecto que toca localStorage. No usa el DOM: los problemas quedan en
// avisosAlmacenamiento y la sección DOM los muestra (mostrarAvisosAlmacenamiento).
const CLAVES = { libros: 'libreria.libros', clientes: 'libreria.clientes', ventas: 'libreria.ventas' };

const NOMBRES_COLECCION = { 'libreria.libros': 'libros', 'libreria.clientes': 'clientes', 'libreria.ventas': 'ventas' };

const MENSAJE_SIN_ALMACENAMIENTO = 'No se pueden guardar datos en este navegador. Se muestran los datos iniciales y los cambios no se conservarán.';

// Textos sin repetir de los problemas detectados en esta carga de página.
const avisosAlmacenamiento = [];

// Claves cuyo valor guardado está dañado: no se sobrescriben mientras dure la página.
const clavesDaniadas = {};

function registrarAvisoAlmacenamiento(texto) {
  if (avisosAlmacenamiento.indexOf(texto) === -1) {
    avisosAlmacenamiento.push(texto);
  }
}

// Copia profunda de datos simples (objetos, arreglos, textos, números, null).
function copiarDatos(datos) {
  return JSON.parse(JSON.stringify(datos));
}

// Devuelve el arreglo guardado en la clave. Si falta, guarda y devuelve una copia de la semilla.
// Si está dañado, devuelve [] sin tocar lo guardado. Nunca lanza.
function leerColeccion(clave, semilla) {
  let texto;
  try {
    texto = localStorage.getItem(clave);
  } catch (error) {
    registrarAvisoAlmacenamiento(MENSAJE_SIN_ALMACENAMIENTO);
    return copiarDatos(semilla);
  }
  if (texto === null) {
    guardarColeccion(clave, semilla);
    return copiarDatos(semilla);
  }
  let datos = null;
  try {
    datos = JSON.parse(texto);
  } catch (error) {
    datos = null;
  }
  if (Array.isArray(datos)) {
    return datos;
  }
  clavesDaniadas[clave] = true;
  registrarAvisoAlmacenamiento(
    'Los datos guardados de ' + NOMBRES_COLECCION[clave] + ' están dañados y no se pudieron leer. ' +
    'No se modificaron: corregí el valor o borrá la clave «' + clave + '» en las herramientas de desarrollo ' +
    'y recargá la página para recuperar los datos iniciales.'
  );
  return [];
}

// Guarda la colección completa (JSON compacto). Devuelve true si se guardó, false si no.
function guardarColeccion(clave, datos) {
  if (clavesDaniadas[clave]) {
    return false;
  }
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch (error) {
    registrarAvisoAlmacenamiento(MENSAJE_SIN_ALMACENAMIENTO);
    return false;
  }
}

// ===== Acceso a datos =====

// Leen del almacenamiento (la semilla es el valor inicial si falta la clave) y devuelven copias nuevas:
// modificar lo devuelto nunca altera la semilla ni lo guardado hasta llamar a guardarX.
function cargarLibros() {
  return leerColeccion(CLAVES.libros, LIBROS_SEMILLA);
}

function cargarClientes() {
  return leerColeccion(CLAVES.clientes, CLIENTES_SEMILLA);
}

function cargarVentas() {
  return leerColeccion(CLAVES.ventas, []);
}

// Devuelven true si se guardó, false si no se pudo (ver Almacenamiento).
function guardarLibros(datos) {
  return guardarColeccion(CLAVES.libros, datos);
}

function guardarClientes(datos) {
  return guardarColeccion(CLAVES.clientes, datos);
}

function guardarVentas(datos) {
  return guardarColeccion(CLAVES.ventas, datos);
}

// ===== Búsqueda y formato =====

const FORMATO_PRECIO = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Devuelve el elemento con ese id o null.
function buscarPorId(lista, id) {
  return lista.find(function (elemento) { return elemento.id === id; }) || null;
}

function nombreEditorial(id) {
  const editorial = buscarPorId(EDITORIALES, id);
  return editorial ? editorial.nombre : 'Editorial desconocida';
}

// Un libro sin género (id null) se presenta como «Sin clasificar».
function nombreGenero(id) {
  if (id === null || id === undefined) {
    return 'Sin clasificar';
  }
  const genero = buscarPorId(GENEROS, id);
  return genero ? genero.nombre : 'Género desconocido';
}

function nombresAutores(ids) {
  return ids.map(function (id) {
    const autor = buscarPorId(AUTORES, id);
    return autor ? autor.nombre : 'Autor desconocido';
  }).join(', ');
}

// Recorta espacios exteriores y pasa a minúsculas; null/undefined dan cadena vacía.
function normalizarBusqueda(texto) {
  return (texto === null || texto === undefined ? '' : String(texto)).trim().toLowerCase();
}

// Quita espacios y guiones y pasa a mayúsculas (solo para comparar); null/undefined dan cadena vacía.
function normalizarIsbn(texto) {
  if (texto === null || texto === undefined) {
    return '';
  }
  return String(texto).replace(/[\s-]/g, '').toUpperCase();
}

// Recorta espacios exteriores y pasa a minúsculas (solo para comparar); null/undefined dan cadena vacía.
function normalizarEmail(texto) {
  if (texto === null || texto === undefined) {
    return '';
  }
  return String(texto).trim().toLowerCase();
}

// Redondea a 2 decimales corrigiendo el error binario (1.005 -> 1.01).
function redondear2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Presenta el precio como "$ 1.500,00" (siempre 2 decimales).
function formatearPrecio(n) {
  return FORMATO_PRECIO.format(redondear2(n));
}

// Calcula el id siguiente (<prefijo>-<N>, N = mayor número usado + 1, o 1 si no hay).
// Ignora los ids que no tienen la forma <prefijo>-<número>. No modifica la lista.
function siguienteId(lista, prefijo) {
  const patron = new RegExp('^' + prefijo + '-(\\d+)$');
  let maximo = 0;
  lista.forEach(function (elemento) {
    const coincidencia = patron.exec(elemento.id);
    if (coincidencia) {
      const numero = Number(coincidencia[1]);
      if (numero > maximo) {
        maximo = numero;
      }
    }
  });
  return prefijo + '-' + (maximo + 1);
}

// Calcula el id de una venta nueva (C-07): 'V-NNNN' con 4 dígitos con ceros,
// N = mayor número de los ids con forma V-<número> + 1, o 1 si no hay ninguno.
// Ignora los ids ajenos. No modifica la lista ni toca el DOM o el almacenamiento.
function siguienteIdVenta(ventas) {
  let maximo = 0;
  ventas.forEach(function (venta) {
    const coincidencia = /^V-(\d+)$/.exec(venta.id);
    if (coincidencia) {
      const numero = Number(coincidencia[1]);
      if (numero > maximo) {
        maximo = numero;
      }
    }
  });
  return 'V-' + String(maximo + 1).padStart(4, '0');
}

// ===== DOM =====

const PREFIJOS_MENSAJE = { exito: 'Éxito: ', error: 'Error: ', info: 'Aviso: ' };

// Crea un elemento; el texto se asigna con textContent (nunca como HTML).
function crearElemento(tag, texto, clase) {
  const elemento = document.createElement(tag);
  if (texto !== null && texto !== undefined) {
    elemento.textContent = String(texto);
  }
  if (clase) {
    elemento.className = clase;
  }
  return elemento;
}

// Quita todos los hijos del contenedor, conservando el contenedor y sus atributos.
function limpiar(contenedor) {
  contenedor.replaceChildren();
}

// Reemplaza el contenido de la zona por un único mensaje con prefijo textual según el tipo.
function mostrarMensaje(contenedor, tipo, texto) {
  const tipoFinal = Object.prototype.hasOwnProperty.call(PREFIJOS_MENSAJE, tipo) ? tipo : 'info';
  limpiar(contenedor);
  if (texto === null || texto === undefined || texto === '') {
    return;
  }
  const mensaje = crearElemento('p', PREFIJOS_MENSAJE[tipoFinal] + texto, 'mensaje mensaje--' + tipoFinal);
  if (tipoFinal === 'error') {
    mensaje.setAttribute('role', 'alert');
  }
  contenedor.appendChild(mensaje);
}

// Reemplaza el contenido de la zona por un mensaje de error por cada texto, en el mismo orden.
// Cada mensaje lleva "Error: " al inicio y rol de alerta; con lista vacía la zona queda vacía.
function mostrarErrores(contenedor, mensajes) {
  limpiar(contenedor);
  mensajes.forEach(function (texto) {
    const mensaje = crearElemento('p', PREFIJOS_MENSAJE.error + texto, 'mensaje mensaje--error');
    mensaje.setAttribute('role', 'alert');
    contenedor.appendChild(mensaje);
  });
}

// Muestra en #mensajes-almacenamiento un error por cada aviso de almacenamiento (si la zona existe).
// Cada página la llama después de cargar sus datos.
function mostrarAvisosAlmacenamiento() {
  const zona = document.getElementById('mensajes-almacenamiento');
  if (!zona) {
    return;
  }
  limpiar(zona);
  avisosAlmacenamiento.forEach(function (aviso) {
    const mensaje = crearElemento('p', PREFIJOS_MENSAJE.error + aviso, 'mensaje mensaje--error');
    mensaje.setAttribute('role', 'alert');
    zona.appendChild(mensaje);
  });
}
