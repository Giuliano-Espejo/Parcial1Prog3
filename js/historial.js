// historial.js — Historial (historial.html): listado de ventas y detalle desde copias (C-08 historial-precio-historico).
'use strict';

// ===== Lógica =====

// Todas las funciones de esta sección son puras: no tocan el DOM ni el almacenamiento.

// Presenta la fecha guardada en formato local es-AR (día/mes/año + hora).
// Si el valor no se puede interpretar como fecha, devuelve el texto original.
// Nunca lanza: null/undefined devuelven cadena vacía.
function formatearFecha(fechaISO) {
  if (fechaISO === null || fechaISO === undefined) {
    return '';
  }
  const texto = String(fechaISO);
  if (texto === '') {
    return '';
  }
  const momento = Date.parse(texto);
  if (Number.isNaN(momento)) {
    return texto;
  }
  return new Date(momento).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Devuelve la venta con ese id o null. Pura: no modifica la lista.
function ventaPorId(ventas, id) {
  if (!Array.isArray(ventas)) {
    return null;
  }
  const encontrada = ventas.find(function (venta) {
    return venta !== null && venta !== undefined && venta.id === id;
  });
  return encontrada || null;
}

// ===== Render =====

// Todo el texto se inserta con crearElemento/textContent y DocumentFragment.
// Solo usa los valores copiados en cada venta: nunca consulta el catálogo.

// Una fila por venta (id, fecha local, clienteNombre, total) con botón nativo
// "Ver detalle de V-000N" (data-venta-id). Sin ventas deja el cuerpo vacío
// y anuncia "No hay ventas registradas" en la región viva.
function renderHistorial(ventas) {
  const cuerpo = document.getElementById('tabla-ventas-cuerpo');
  const estado = document.getElementById('estado-historial');
  const lista = Array.isArray(ventas) ? ventas : [];
  const fragmento = document.createDocumentFragment();
  lista.forEach(function (venta) {
    const fila = document.createElement('tr');
    fila.appendChild(crearElemento('td', venta.id));
    fila.appendChild(crearElemento('td', formatearFecha(venta.fecha)));
    fila.appendChild(crearElemento('td', venta.clienteNombre));
    fila.appendChild(crearElemento('td', formatearPrecio(venta.total)));
    const celdaAcciones = document.createElement('td');
    const boton = crearElemento('button', 'Ver detalle de ' + venta.id);
    boton.type = 'button';
    boton.setAttribute('data-venta-id', venta.id);
    celdaAcciones.appendChild(boton);
    fila.appendChild(celdaAcciones);
    fragmento.appendChild(fila);
  });
  limpiar(cuerpo);
  cuerpo.appendChild(fragmento);
  if (estado) {
    estado.textContent = lista.length > 0 ? '' : 'No hay ventas registradas';
  }
}

// Detalle construido solo con las copias guardadas en la venta
// (clienteNombre, clienteEmail, renglones con titulo/isbn/cantidad,
// precioUnitario/subtotal, total). Reemplaza el contenido anterior.
// Con null oculta el detalle y restaura el mensaje inicial.
function renderDetalle(venta) {
  const estado = document.getElementById('estado-detalle');
  const datos = document.getElementById('detalle-datos');
  const celdaCliente = document.getElementById('detalle-cliente');
  const celdaEmail = document.getElementById('detalle-email');
  const celdaFecha = document.getElementById('detalle-fecha');
  const cuerpo = document.getElementById('tabla-detalle-cuerpo');
  const celdaTotal = document.getElementById('detalle-total');
  const contenedor = document.querySelector('#detalle-venta .tabla-contenedor');
  if (!venta) {
    if (celdaCliente) {
      celdaCliente.textContent = '';
    }
    if (celdaEmail) {
      celdaEmail.textContent = '';
    }
    if (celdaFecha) {
      celdaFecha.textContent = '';
    }
    if (cuerpo) {
      limpiar(cuerpo);
    }
    if (celdaTotal) {
      celdaTotal.textContent = '';
    }
    if (datos) {
      datos.hidden = true;
    }
    if (contenedor) {
      contenedor.hidden = true;
    }
    if (estado) {
      estado.textContent = 'Seleccioná una venta para ver su detalle.';
    }
    return;
  }
  if (celdaCliente) {
    celdaCliente.textContent = venta.clienteNombre === null || venta.clienteNombre === undefined
      ? ''
      : String(venta.clienteNombre);
  }
  if (celdaEmail) {
    celdaEmail.textContent = venta.clienteEmail === null || venta.clienteEmail === undefined
      ? ''
      : String(venta.clienteEmail);
  }
  if (celdaFecha) {
    celdaFecha.textContent = formatearFecha(venta.fecha);
  }
  const renglones = Array.isArray(venta.renglones) ? venta.renglones : [];
  const fragmento = document.createDocumentFragment();
  renglones.forEach(function (renglon) {
    const fila = document.createElement('tr');
    fila.appendChild(crearElemento('td', renglon.titulo));
    fila.appendChild(crearElemento('td', renglon.isbn));
    fila.appendChild(crearElemento('td', formatearPrecio(renglon.precioUnitario)));
    fila.appendChild(crearElemento('td', renglon.cantidad === null || renglon.cantidad === undefined ? '' : String(renglon.cantidad)));
    fila.appendChild(crearElemento('td', formatearPrecio(renglon.subtotal)));
    fragmento.appendChild(fila);
  });
  if (cuerpo) {
    limpiar(cuerpo);
    cuerpo.appendChild(fragmento);
  }
  if (celdaTotal) {
    celdaTotal.textContent = formatearPrecio(venta.total);
  }
  if (datos) {
    datos.hidden = false;
  }
  if (contenedor) {
    contenedor.hidden = false;
  }
  if (estado) {
    estado.textContent = 'Detalle de la venta ' + venta.id + '.';
  }
}

// ===== Eventos =====

// Ventas en memoria de esta página; se asignan en Inicio.
let ventasHistorial = [];

// Delegación en el cuerpo del historial: muestra el detalle de la venta
// elegida y lleva el foco a su encabezado para teclado y lector.
function alClicHistorial(evento) {
  const boton = evento.target.closest ? evento.target.closest('button[data-venta-id]') : null;
  if (!boton) {
    return;
  }
  const venta = ventaPorId(ventasHistorial, boton.getAttribute('data-venta-id'));
  if (!venta) {
    return;
  }
  renderDetalle(venta);
  const titulo = document.getElementById('titulo-detalle-venta');
  if (titulo) {
    titulo.focus();
  }
}

// ===== Inicio =====

document.addEventListener('DOMContentLoaded', function () {
  ventasHistorial = cargarVentas();
  mostrarAvisosAlmacenamiento();
  renderHistorial(ventasHistorial);
  renderDetalle(null);
  document.getElementById('tabla-ventas-cuerpo').addEventListener('click', alClicHistorial);
});
