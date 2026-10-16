// clientes.js — Clientes (clientes.html): listado (C-03 datos-semilla-catalogo-filtro) y alta de clientes (C-06 altas-libros-clientes).
'use strict';

// ===== Lógica =====

// Valida los datos de un cliente contra la colección; devuelve [{ campo, mensaje }]
// en el orden del formulario. Pura: no toca el DOM ni el almacenamiento.
function validarCliente(datos, clientes) {
  const errores = [];
  const nombreCompleto = datos.nombreCompleto === null || datos.nombreCompleto === undefined ? '' : String(datos.nombreCompleto).trim();
  if (nombreCompleto === '') {
    errores.push({ campo: 'nombreCompleto', mensaje: 'El nombre completo es obligatorio.' });
  }
  const emailEscrito = datos.email === null || datos.email === undefined ? '' : String(datos.email).trim();
  if (emailEscrito === '') {
    errores.push({ campo: 'email', mensaje: 'El email es obligatorio.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEscrito)) {
    errores.push({ campo: 'email', mensaje: 'El email no tiene un formato válido (ejemplo: nombre@dominio.com).' });
  } else if (clientes.some(function (cliente) { return normalizarEmail(cliente.email) === normalizarEmail(datos.email); })) {
    errores.push({ campo: 'email', mensaje: 'Ya existe un cliente con el email «' + emailEscrito + '».' });
  }
  return errores;
}

// Arma el registro listo para guardar (asume datos ya validados). Pura: no modifica la lista.
function crearCliente(datos, clientes) {
  return {
    id: siguienteId(clientes, 'cli'),
    nombreCompleto: String(datos.nombreCompleto).trim(),
    email: String(datos.email).trim()
  };
}

// Textos de las celdas de una fila, en el orden de las columnas de la tabla.
function celdasCliente(cliente) {
  return [cliente.nombreCompleto, cliente.email];
}

// ===== Render =====

function renderListadoClientes(cuerpo, clientes) {
  const fragmento = document.createDocumentFragment();
  clientes.forEach(function (cliente) {
    const fila = document.createElement('tr');
    celdasCliente(cliente).forEach(function (texto) {
      fila.appendChild(crearElemento('td', texto));
    });
    fragmento.appendChild(fila);
  });
  limpiar(cuerpo);
  cuerpo.appendChild(fragmento);
}

// C-06 llama a esta función después de cada alta.
function actualizarListadoClientes(clientes) {
  renderListadoClientes(document.getElementById('tabla-clientes-cuerpo'), clientes);
  mostrarMensaje(
    document.getElementById('estado-clientes'),
    'info',
    clientes.length > 0 ? '' : 'Todavía no hay clientes registrados.'
  );
}

// ===== Eventos =====

// Colección en memoria de esta página; se asigna en Inicio y se reemplaza solo
// tras un guardado exitoso.
let clientes = [];

// Traduce la clave de cada error ({ campo }) al id del control del formulario.
const CAMPOS_CLIENTE = {
  nombreCompleto: 'cliente-nombre',
  email: 'cliente-email'
};

// Lee los valores crudos del formulario.
function leerDatosCliente() {
  return {
    nombreCompleto: document.getElementById('cliente-nombre').value,
    email: document.getElementById('cliente-email').value
  };
}

// Quita la marca de error de todos los controles del formulario.
function limpiarMarcasCliente() {
  Object.keys(CAMPOS_CLIENTE).forEach(function (campo) {
    document.getElementById(CAMPOS_CLIENTE[campo]).removeAttribute('aria-invalid');
  });
}

// Alta de cliente: valida, muestra errores con foco al primero o guarda y re-renderiza.
function alEnviarCliente(evento) {
  evento.preventDefault();
  const zona = document.getElementById('mensajes-cliente');
  const datos = leerDatosCliente();
  limpiarMarcasCliente();
  const errores = validarCliente(datos, clientes);
  if (errores.length > 0) {
    mostrarErrores(zona, errores.map(function (error) { return error.mensaje; }));
    errores.forEach(function (error) {
      document.getElementById(CAMPOS_CLIENTE[error.campo]).setAttribute('aria-invalid', 'true');
    });
    document.getElementById(CAMPOS_CLIENTE[errores[0].campo]).focus();
    return;
  }
  const nuevaColeccion = clientes.concat([crearCliente(datos, clientes)]);
  if (!guardarClientes(nuevaColeccion)) {
    mostrarMensaje(zona, 'error', 'No se pudo guardar el cliente. Revisá el aviso de almacenamiento al principio de la página.');
    mostrarAvisosAlmacenamiento();
    return;
  }
  clientes = nuevaColeccion;
  actualizarListadoClientes(clientes);
  document.getElementById('form-cliente').reset();
  limpiarMarcasCliente();
  mostrarMensaje(zona, 'exito', 'Cliente «' + nuevaColeccion[nuevaColeccion.length - 1].nombreCompleto + '» registrado.');
}

// ===== Inicio =====

document.addEventListener('DOMContentLoaded', function () {
  clientes = cargarClientes();
  mostrarAvisosAlmacenamiento();
  actualizarListadoClientes(clientes);
  document.getElementById('form-cliente').addEventListener('submit', alEnviarCliente);
});
