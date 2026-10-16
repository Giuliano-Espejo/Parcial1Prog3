// ventas.js — Ventas (ventas.html): composición y confirmación de la venta (C-07 venta-composicion-confirmacion). Lógica pura en js/ventas-logica.js (se carga antes que este archivo).
'use strict';

// ===== Render =====

// Agrega después de los placeholders una opción por cliente y por libro.
// El texto visible es el nombre/título (nunca el id); todo va con textContent.
// Conserva el cliente elegido si sigue existiendo.
function renderSelectores() {
  const selectorCliente = document.getElementById('venta-cliente');
  while (selectorCliente.options.length > 1) {
    selectorCliente.remove(1);
  }
  clientes.forEach(function (cliente) {
    const opcion = crearElemento('option', cliente.nombreCompleto);
    opcion.value = cliente.id;
    selectorCliente.appendChild(opcion);
  });
  selectorCliente.value = buscarPorId(clientes, enCurso.clienteId) ? enCurso.clienteId : '';
  const selectorLibro = document.getElementById('renglon-libro');
  while (selectorLibro.options.length > 1) {
    selectorLibro.remove(1);
  }
  libros.forEach(function (libro) {
    const opcion = crearElemento('option', libro.titulo);
    opcion.value = libro.id;
    selectorLibro.appendChild(opcion);
  });
}

// Reconstruye la tabla de renglones con DocumentFragment (título, precio,
// cantidad editable, subtotal, "Quitar"); todo el texto va con textContent.
// Marca con aria-invalid las cantidades inválidas para bloquear la confirmación.
function renderRenglones() {
  const cuerpo = document.getElementById('tabla-renglones-cuerpo');
  const fragmento = document.createDocumentFragment();
  enCurso.renglones.forEach(function (renglon) {
    const libro = buscarPorId(libros, renglon.libroId);
    const titulo = libro ? libro.titulo : 'Libro no disponible';
    const precio = libro ? libro.precio : 0;
    const fila = document.createElement('tr');
    fila.appendChild(crearElemento('td', titulo));
    fila.appendChild(crearElemento('td', formatearPrecio(precio)));
    const celdaCantidad = document.createElement('td');
    const campo = document.createElement('input');
    campo.type = 'number';
    campo.min = '1';
    campo.step = '1';
    campo.value = String(renglon.cantidad);
    campo.id = 'cantidad-' + renglon.libroId;
    campo.setAttribute('aria-label', 'Cantidad de «' + titulo + '»');
    campo.setAttribute('data-libro-id', renglon.libroId);
    if (!Number.isInteger(renglon.cantidad) || renglon.cantidad <= 0) { campo.setAttribute('aria-invalid', 'true'); }
    celdaCantidad.appendChild(campo);
    fila.appendChild(celdaCantidad);
    fila.appendChild(crearElemento('td', formatearPrecio(calcularSubtotal(renglon.cantidad, precio))));
    const celdaAcciones = document.createElement('td');
    const boton = crearElemento('button', 'Quitar');
    boton.type = 'button';
    boton.setAttribute('aria-label', 'Quitar «' + titulo + '» de la venta');
    boton.setAttribute('data-libro-id', renglon.libroId);
    celdaAcciones.appendChild(boton);
    fila.appendChild(celdaAcciones);
    fragmento.appendChild(fila);
  });
  limpiar(cuerpo);
  cuerpo.appendChild(fragmento);
  mostrarMensaje(
    document.getElementById('estado-renglones'),
    'info',
    enCurso.renglones.length > 0 ? '' : 'Todavía no agregaste renglones a la venta.'
  );
}

// Muestra el total con 2 decimales; la celda es región viva (anuncia sin mover el foco).
function renderTotal() {
  document.getElementById('venta-total').textContent = formatearPrecio(calcularTotal(enCurso.renglones, libros));
}

// ===== Eventos =====

// Colecciones en memoria de esta página; se asignan en Inicio y se reemplazan
// solo tras un guardado exitoso. enCurso es la venta en curso: solo vive en
// memoria y se descarta al recargar (SU-05); nunca se guarda hasta confirmar.
let libros = [];
let clientes = [];
let ventas = [];
let enCurso = { clienteId: '', renglones: [] };

// Traduce el campo de cada error de validarVenta al id del control:
// 'cantidad-<libroId>' ya coincide con el id del input de la fila.
function idCampoVenta(campo) {
  if (campo === 'clienteId') { return 'venta-cliente'; }
  if (campo === 'renglones') { return 'renglon-libro'; }
  return campo;
}

// Quita la marca de error de los controles de la venta.
function limpiarMarcasVenta() {
  document.getElementById('venta-cliente').removeAttribute('aria-invalid');
  document.getElementById('renglon-libro').removeAttribute('aria-invalid');
  Array.from(document.querySelectorAll('#tabla-renglones-cuerpo input')).forEach(function (campo) {
    campo.removeAttribute('aria-invalid');
  });
}

// Cliente de la venta: guarda el elegido y limpia su marca de error.
function alCambiarCliente(evento) {
  enCurso.clienteId = evento.target.value;
  evento.target.removeAttribute('aria-invalid');
}

// Agrega un renglón desde el formulario; repetido suma y avisa (DD-06).
function alAgregarRenglon(evento) {
  evento.preventDefault();
  const zona = document.getElementById('mensajes-venta');
  const selectorLibro = document.getElementById('renglon-libro');
  const campoCantidad = document.getElementById('renglon-cantidad');
  selectorLibro.removeAttribute('aria-invalid');
  campoCantidad.removeAttribute('aria-invalid');
  const libro = buscarPorId(libros, selectorLibro.value);
  if (!libro) {
    mostrarErrores(zona, ['El libro elegido no existe.']);
    selectorLibro.setAttribute('aria-invalid', 'true');
    selectorLibro.focus();
    return;
  }
  const resultado = agregarRenglon(enCurso, libro.id, Number(campoCantidad.value), libro.titulo);
  if (resultado.errores.length > 0) {
    mostrarErrores(zona, resultado.errores);
    campoCantidad.setAttribute('aria-invalid', 'true');
    campoCantidad.focus();
    return;
  }
  enCurso = resultado.enCurso;
  renderRenglones();
  renderTotal();
  document.getElementById('form-renglon').reset();
  mostrarMensaje(zona, 'info', resultado.aviso);
}

// Edición de cantidad en la tabla (delegación change): valida, actualiza en el
// lugar sin reconstruir (conserva el foco) y recalcula subtotal y total.
function alCambiarCantidad(evento) {
  const campo = evento.target.closest ? evento.target.closest('input[data-libro-id]') : null;
  if (!campo) { return; }
  const libroId = campo.getAttribute('data-libro-id');
  const cantidad = Number(campo.value);
  const guardada = Number.isNaN(cantidad) ? 0 : cantidad;
  enCurso = {
    clienteId: enCurso.clienteId,
    renglones: enCurso.renglones.map(function (renglon) {
      if (renglon.libroId !== libroId) {
        return renglon;
      }
      return { libroId: renglon.libroId, cantidad: guardada };
    })
  };
  const libro = buscarPorId(libros, libroId);
  const precio = libro ? libro.precio : 0;
  const celdaSubtotal = campo.closest('tr').cells[3];
  if (!Number.isInteger(guardada) || guardada <= 0) {
    campo.setAttribute('aria-invalid', 'true');
    celdaSubtotal.textContent = formatearPrecio(0);
    renderTotal();
    mostrarMensaje(document.getElementById('mensajes-venta'), 'error', 'La cantidad debe ser un número entero mayor que 0.');
    return;
  }
  campo.removeAttribute('aria-invalid');
  celdaSubtotal.textContent = formatearPrecio(calcularSubtotal(guardada, precio));
  renderTotal();
  mostrarMensaje(document.getElementById('mensajes-venta'), 'info', '');
}

// "Quitar" de una fila (delegación click): elimina el renglón y recalcula.
// Si queda otra cantidad inválida, conserva su aviso; si no, limpia la zona.
function alQuitarRenglon(evento) {
  const boton = evento.target.closest ? evento.target.closest('button[data-libro-id]') : null;
  if (!boton) { return; }
  const libroId = boton.getAttribute('data-libro-id');
  enCurso = {
    clienteId: enCurso.clienteId,
    renglones: enCurso.renglones.filter(function (renglon) { return renglon.libroId !== libroId; })
  };
  renderRenglones();
  renderTotal();
  const zona = document.getElementById('mensajes-venta');
  const pendientes = validarVenta(enCurso, libros, clientes).filter(function (error) {
    return error.campo.indexOf('cantidad-') === 0;
  });
  const aviso = pendientes.length > 0 ? pendientes[0].mensaje : '';
  mostrarMensaje(zona, pendientes.length > 0 ? 'error' : 'info', aviso);
  document.getElementById('renglon-libro').focus();
}

// Confirmación: valida → construye con copias → guarda → limpia (D8).
// Con guardarVentas en false rechaza sin limpiar (igual que C-06 D9).
function alConfirmarVenta() {
  const zona = document.getElementById('mensajes-venta');
  limpiarMarcasVenta();
  const errores = validarVenta(enCurso, libros, clientes);
  if (errores.length > 0) {
    mostrarErrores(zona, errores.map(function (error) { return error.mensaje; }));
    errores.forEach(function (error) {
      const control = document.getElementById(idCampoVenta(error.campo));
      if (control) { control.setAttribute('aria-invalid', 'true'); }
    });
    const primero = document.getElementById(idCampoVenta(errores[0].campo));
    if (primero) { primero.focus(); }
    return;
  }
  const venta = construirVenta(enCurso, libros, clientes, ventas);
  const nueva = ventas.concat([venta]);
  if (!guardarVentas(nueva)) {
    mostrarMensaje(zona, 'error', 'No se pudo guardar la venta. Revisá el aviso de almacenamiento al principio de la página.');
    mostrarAvisosAlmacenamiento();
    return;
  }
  ventas = nueva;
  enCurso = { clienteId: '', renglones: [] };
  document.getElementById('form-renglon').reset();
  limpiarMarcasVenta();
  renderSelectores();
  renderRenglones();
  renderTotal();
  mostrarMensaje(zona, 'exito', 'Venta ' + venta.id + ' confirmada. Total: ' + formatearPrecio(venta.total) + '.');
}

// ===== Inicio =====

document.addEventListener('DOMContentLoaded', function () {
  libros = cargarLibros();
  clientes = cargarClientes();
  ventas = cargarVentas();
  mostrarAvisosAlmacenamiento();
  renderSelectores();
  renderRenglones();
  renderTotal();
  document.getElementById('venta-cliente').addEventListener('change', alCambiarCliente);
  document.getElementById('form-renglon').addEventListener('submit', alAgregarRenglon);
  document.getElementById('boton-confirmar-venta').addEventListener('click', alConfirmarVenta);
  const cuerpo = document.getElementById('tabla-renglones-cuerpo');
  cuerpo.addEventListener('change', alCambiarCantidad);
  cuerpo.addEventListener('click', alQuitarRenglon);
});
