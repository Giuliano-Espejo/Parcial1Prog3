// libros.js — Libros (libros.html): listado (C-03 datos-semilla-catalogo-filtro) y alta de libros (C-06 altas-libros-clientes).
'use strict';

// ===== Lógica =====

// Convierte el texto del precio a número con 2 decimales: acepta coma o punto,
// devuelve NaN si está vacío o no es un número finito.
function convertirPrecio(texto) {
  const crudo = String(texto).trim().replace(',', '.');
  if (crudo === '') {
    return NaN;
  }
  const numero = Number(crudo);
  if (!Number.isFinite(numero)) {
    return NaN;
  }
  return redondear2(numero);
}

// Valida los datos de un libro contra la colección; devuelve [{ campo, mensaje }]
// en el orden del formulario. Pura: no toca el DOM ni el almacenamiento.
function validarLibro(datos, libros) {
  const errores = [];
  const titulo = datos.titulo === null || datos.titulo === undefined ? '' : String(datos.titulo).trim();
  if (titulo === '') {
    errores.push({ campo: 'titulo', mensaje: 'El título es obligatorio.' });
  }
  const isbnEscrito = datos.isbn === null || datos.isbn === undefined ? '' : String(datos.isbn).trim();
  if (normalizarIsbn(datos.isbn) === '') {
    errores.push({ campo: 'isbn', mensaje: 'El ISBN es obligatorio.' });
  } else if (libros.some(function (libro) { return normalizarIsbn(libro.isbn) === normalizarIsbn(datos.isbn); })) {
    errores.push({ campo: 'isbn', mensaje: 'Ya existe un libro con el ISBN «' + isbnEscrito + '».' });
  }
  const precio = convertirPrecio(datos.precio);
  if (Number.isNaN(precio) || precio <= 0) {
    errores.push({ campo: 'precio', mensaje: 'El precio debe ser un número mayor que 0.' });
  }
  const editorialId = datos.editorialId === null || datos.editorialId === undefined ? '' : String(datos.editorialId);
  if (editorialId === '') {
    errores.push({ campo: 'editorialId', mensaje: 'Elegí una editorial.' });
  } else if (!buscarPorId(EDITORIALES, editorialId)) {
    errores.push({ campo: 'editorialId', mensaje: 'La editorial elegida no existe.' });
  }
  const generoId = datos.generoId === null || datos.generoId === undefined ? '' : String(datos.generoId);
  if (generoId !== '' && !buscarPorId(GENEROS, generoId)) {
    errores.push({ campo: 'generoId', mensaje: 'El género elegido no existe.' });
  }
  const autorIds = Array.isArray(datos.autorIds) ? datos.autorIds : [];
  if (autorIds.length === 0) {
    errores.push({ campo: 'autorIds', mensaje: 'Elegí al menos un autor.' });
  } else if (autorIds.some(function (id) { return !buscarPorId(AUTORES, id); })) {
    errores.push({ campo: 'autorIds', mensaje: 'Uno de los autores elegidos no existe.' });
  }
  return errores;
}

// Arma el registro listo para guardar (asume datos ya validados). Pura: no modifica la lista.
function crearLibro(datos, libros) {
  return {
    id: siguienteId(libros, 'lib'),
    titulo: String(datos.titulo).trim(),
    isbn: String(datos.isbn).trim(),
    precio: convertirPrecio(datos.precio),
    editorialId: datos.editorialId,
    generoId: (datos.generoId === '' || datos.generoId === null || datos.generoId === undefined) ? null : datos.generoId,
    autorIds: datos.autorIds.slice(),
    imagen: null
  };
}

// Textos de las celdas de una fila, en el orden de las columnas de la tabla.
function celdasLibro(libro) {
  return [
    libro.titulo,
    libro.isbn,
    nombreEditorial(libro.editorialId),
    nombreGenero(libro.generoId),
    nombresAutores(libro.autorIds),
    formatearPrecio(libro.precio)
  ];
}

// ===== Render =====

function renderListadoLibros(cuerpo, libros) {
  const fragmento = document.createDocumentFragment();
  libros.forEach(function (libro) {
    const fila = document.createElement('tr');
    celdasLibro(libro).forEach(function (texto) {
      fila.appendChild(crearElemento('td', texto));
    });
    fragmento.appendChild(fila);
  });
  limpiar(cuerpo);
  cuerpo.appendChild(fragmento);
}

// Agrega después de los placeholders una opción por editorial, género y autor.
// El texto visible es el nombre (nunca el id); todo el texto va con textContent.
function renderOpcionesLibro() {
  const selectorEditorial = document.getElementById('libro-editorial');
  EDITORIALES.forEach(function (editorial) {
    const opcion = crearElemento('option', editorial.nombre);
    opcion.value = editorial.id;
    selectorEditorial.appendChild(opcion);
  });
  const selectorGenero = document.getElementById('libro-genero');
  GENEROS.forEach(function (genero) {
    const opcion = crearElemento('option', genero.nombre);
    opcion.value = genero.id;
    selectorGenero.appendChild(opcion);
  });
  const selectorAutores = document.getElementById('libro-autores');
  AUTORES.forEach(function (autor) {
    const opcion = crearElemento('option', autor.nombre);
    opcion.value = autor.id;
    selectorAutores.appendChild(opcion);
  });
}

// C-06 llama a esta función después de cada alta.
function actualizarListadoLibros(libros) {
  renderListadoLibros(document.getElementById('tabla-libros-cuerpo'), libros);
  mostrarMensaje(
    document.getElementById('estado-libros'),
    'info',
    libros.length > 0 ? '' : 'Todavía no hay libros registrados.'
  );
}

// ===== Eventos =====

// Colección en memoria de esta página; se asigna en Inicio y se reemplaza solo
// tras un guardado exitoso.
let libros = [];

// Traduce la clave de cada error ({ campo }) al id del control del formulario.
const CAMPOS_LIBRO = {
  titulo: 'libro-titulo',
  isbn: 'libro-isbn',
  precio: 'libro-precio',
  editorialId: 'libro-editorial',
  generoId: 'libro-genero',
  autorIds: 'libro-autores'
};

// Lee los valores crudos del formulario; los autores en el orden del selector.
function leerDatosLibro() {
  return {
    titulo: document.getElementById('libro-titulo').value,
    isbn: document.getElementById('libro-isbn').value,
    precio: document.getElementById('libro-precio').value,
    editorialId: document.getElementById('libro-editorial').value,
    generoId: document.getElementById('libro-genero').value,
    autorIds: Array.from(document.getElementById('libro-autores').selectedOptions, function (opcion) { return opcion.value; })
  };
}

// Quita la marca de error de todos los controles del formulario.
function limpiarMarcasLibro() {
  Object.keys(CAMPOS_LIBRO).forEach(function (campo) {
    document.getElementById(CAMPOS_LIBRO[campo]).removeAttribute('aria-invalid');
  });
}

// Alta de libro: valida, muestra errores con foco al primero o guarda y re-renderiza.
function alEnviarLibro(evento) {
  evento.preventDefault();
  const zona = document.getElementById('mensajes-libro');
  const datos = leerDatosLibro();
  limpiarMarcasLibro();
  const errores = validarLibro(datos, libros);
  if (errores.length > 0) {
    mostrarErrores(zona, errores.map(function (error) { return error.mensaje; }));
    errores.forEach(function (error) {
      document.getElementById(CAMPOS_LIBRO[error.campo]).setAttribute('aria-invalid', 'true');
    });
    document.getElementById(CAMPOS_LIBRO[errores[0].campo]).focus();
    return;
  }
  const nuevaColeccion = libros.concat([crearLibro(datos, libros)]);
  if (!guardarLibros(nuevaColeccion)) {
    mostrarMensaje(zona, 'error', 'No se pudo guardar el libro. Revisá el aviso de almacenamiento al principio de la página.');
    mostrarAvisosAlmacenamiento();
    return;
  }
  libros = nuevaColeccion;
  actualizarListadoLibros(libros);
  document.getElementById('form-libro').reset();
  limpiarMarcasLibro();
  mostrarMensaje(zona, 'exito', 'Libro «' + nuevaColeccion[nuevaColeccion.length - 1].titulo + '» registrado.');
}

// ===== Inicio =====

document.addEventListener('DOMContentLoaded', function () {
  libros = cargarLibros();
  mostrarAvisosAlmacenamiento();
  renderOpcionesLibro();
  actualizarListadoLibros(libros);
  document.getElementById('form-libro').addEventListener('submit', alEnviarLibro);
});
