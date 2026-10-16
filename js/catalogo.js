// catalogo.js — Catálogo (index.html): filtro por título y render de tarjetas (C-03 datos-semilla-catalogo-filtro).
'use strict';

// ===== Lógica =====

// Libros cuyo título contiene el texto (sin distinguir mayúsculas ni espacios exteriores); texto vacío devuelve todos.
function filtrarLibrosPorTitulo(libros, texto) {
  const t = normalizarBusqueda(texto);
  if (t === '') {
    return libros.slice();
  }
  return libros.filter(function (libro) {
    return normalizarBusqueda(libro.titulo).includes(t);
  });
}

// Mensaje de la zona de estado: vacío si hay libros visibles.
function mensajeEstadoCatalogo(total, visibles, texto) {
  if (visibles > 0) {
    return '';
  }
  if (total === 0) {
    return 'Todavía no hay libros en el catálogo.';
  }
  return 'No se encontraron libros para «' + String(texto).trim() + '».';
}

// ===== Render =====

// Tarjeta de un libro: imagen (si tiene), título y un párrafo rotulado por dato. Todo con textContent.
function crearTarjetaLibro(libro) {
  const tarjeta = crearElemento('article', null, 'tarjeta');
  if (libro.imagen) {
    const imagen = document.createElement('img');
    imagen.src = libro.imagen;
    imagen.alt = 'Tapa de «' + libro.titulo + '»';
    imagen.loading = 'lazy';
    tarjeta.appendChild(imagen);
  }
  tarjeta.appendChild(crearElemento('h3', libro.titulo));
  tarjeta.appendChild(crearElemento('p', 'ISBN: ' + libro.isbn));
  tarjeta.appendChild(crearElemento('p', 'Editorial: ' + nombreEditorial(libro.editorialId)));
  tarjeta.appendChild(crearElemento('p', 'Género: ' + nombreGenero(libro.generoId)));
  tarjeta.appendChild(crearElemento('p', 'Autores: ' + nombresAutores(libro.autorIds)));
  tarjeta.appendChild(crearElemento('p', 'Precio: ' + formatearPrecio(libro.precio)));
  return tarjeta;
}

function renderCatalogo(contenedor, libros) {
  const fragmento = document.createDocumentFragment();
  libros.forEach(function (libro) {
    fragmento.appendChild(crearTarjetaLibro(libro));
  });
  limpiar(contenedor);
  contenedor.appendChild(fragmento);
}

// Filtra, dibuja las tarjetas y actualiza la zona de estado.
function actualizarCatalogo(libros, texto) {
  const visibles = filtrarLibrosPorTitulo(libros, texto);
  renderCatalogo(document.getElementById('catalogo'), visibles);
  mostrarMensaje(
    document.getElementById('estado-catalogo'),
    'info',
    mensajeEstadoCatalogo(libros.length, visibles.length, texto)
  );
}

// ===== Eventos =====

let librosCatalogo = [];

// Cubre escribir, borrar, pegar, la "x" del campo de búsqueda y Escape.
function alEscribirBusqueda(evento) {
  actualizarCatalogo(librosCatalogo, evento.target.value);
}

// El filtro es en vivo: Enter no debe recargar la página.
function alEnviarBusqueda(evento) {
  evento.preventDefault();
}

// ===== Inicio =====

function iniciarCatalogo() {
  librosCatalogo = cargarLibros();
  mostrarAvisosAlmacenamiento();
  const buscador = document.getElementById('buscador-titulo');
  buscador.addEventListener('input', alEscribirBusqueda);
  document.getElementById('form-busqueda').addEventListener('submit', alEnviarBusqueda);
  // El navegador puede restaurar el texto del buscador al volver con "Atrás".
  actualizarCatalogo(librosCatalogo, buscador.value);
}

document.addEventListener('DOMContentLoaded', iniciarCatalogo);
