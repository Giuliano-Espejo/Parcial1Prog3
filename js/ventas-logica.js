// ventas-logica.js — Lógica pura de Ventas (C-07 venta-composicion-confirmacion).
// Se carga entre js/comun.js y js/ventas.js (ver ventas.html); no toca el DOM
// ni el almacenamiento.
'use strict';

// ===== Lógica =====

// Todas las funciones de esta sección son puras: no tocan el DOM ni el almacenamiento.

// Agrega un renglón a la venta en curso sin modificar la entrada.
// cantidad debe ser un entero > 0; si no, devuelve el error sin cambios.
// Si el libro ya tiene renglón, suma la cantidad y avisa con su título:
// el llamador lo pasa como 4.º argumento opcional (lo resuelve con buscarPorId);
// si falta, se busca en la semilla y si no está se usa el id.
function agregarRenglon(enCurso, libroId, cantidad, titulo) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return { enCurso: enCurso, errores: ['La cantidad debe ser un número entero mayor que 0.'], aviso: '' };
  }
  let nombre = titulo;
  if (nombre === null || nombre === undefined || nombre === '') {
    const semilla = buscarPorId(LIBROS_SEMILLA, libroId);
    nombre = semilla ? semilla.titulo : libroId;
  }
  const existe = enCurso.renglones.some(function (renglon) { return renglon.libroId === libroId; });
  if (!existe) {
    return {
      enCurso: { clienteId: enCurso.clienteId, renglones: enCurso.renglones.concat([{ libroId: libroId, cantidad: cantidad }]) },
      errores: [],
      aviso: ''
    };
  }
  return {
    enCurso: {
      clienteId: enCurso.clienteId,
      renglones: enCurso.renglones.map(function (renglon) {
        if (renglon.libroId !== libroId) {
          return renglon;
        }
        return { libroId: renglon.libroId, cantidad: renglon.cantidad + cantidad };
      })
    },
    errores: [],
    aviso: 'Se sumaron ' + cantidad + ' unidades a «' + nombre + '».'
  };
}

// Subtotal de un renglón con redondeo a 2 decimales.
function calcularSubtotal(cantidad, precioUnitario) {
  return redondear2(cantidad * precioUnitario);
}

// Total de los renglones buscando cada precio en libros, con redondeo a 2 decimales.
// Un libro inexistente aporta 0 (validarVenta bloquea la confirmación en ese caso).
function calcularTotal(renglones, libros) {
  return redondear2(renglones.reduce(function (acumulado, renglon) {
    const libro = buscarPorId(libros, renglon.libroId);
    return acumulado + calcularSubtotal(renglon.cantidad, libro ? libro.precio : 0);
  }, 0));
}

// Valida la venta en curso; devuelve [{ campo, mensaje }] en orden
// cliente → renglones → por renglón. Vacío significa válida.
function validarVenta(enCurso, libros, clientes) {
  const errores = [];
  if (!enCurso.clienteId) {
    errores.push({ campo: 'clienteId', mensaje: 'Elegí un cliente.' });
  } else if (!buscarPorId(clientes, enCurso.clienteId)) {
    errores.push({ campo: 'clienteId', mensaje: 'El cliente elegido no existe.' });
  }
  if (enCurso.renglones.length === 0) {
    errores.push({ campo: 'renglones', mensaje: 'Agregá al menos un libro a la venta.' });
  }
  enCurso.renglones.forEach(function (renglon) {
    const libro = buscarPorId(libros, renglon.libroId);
    if (!libro) {
      errores.push({ campo: 'renglones', mensaje: 'El libro elegido no existe.' });
    }
    if (!Number.isInteger(renglon.cantidad) || renglon.cantidad <= 0) {
      errores.push({
        campo: 'cantidad-' + renglon.libroId,
        mensaje: libro
          ? 'La cantidad de «' + libro.titulo + '» debe ser un número entero mayor que 0.'
          : 'La cantidad debe ser un número entero mayor que 0.'
      });
    }
  });
  return errores;
}

// Arma la venta lista para guardar con copias históricas (asume datos ya validados).
// Copia titulo/isbn/precioUnitario de cada libro y nombre/email del cliente;
// id con siguienteIdVenta y fecha ISO. No modifica las colecciones ni enCurso.
function construirVenta(enCurso, libros, clientes, ventas) {
  const cliente = buscarPorId(clientes, enCurso.clienteId);
  const renglones = enCurso.renglones.map(function (renglon) {
    const libro = buscarPorId(libros, renglon.libroId);
    return {
      libroId: renglon.libroId,
      titulo: libro.titulo,
      isbn: libro.isbn,
      cantidad: renglon.cantidad,
      precioUnitario: libro.precio,
      subtotal: redondear2(renglon.cantidad * libro.precio)
    };
  });
  const total = redondear2(renglones.reduce(function (acumulado, renglon) { return acumulado + renglon.subtotal; }, 0));
  return {
    id: siguienteIdVenta(ventas),
    fecha: new Date().toISOString(),
    clienteId: enCurso.clienteId,
    clienteNombre: cliente.nombreCompleto,
    clienteEmail: cliente.email,
    renglones: renglones,
    total: total
  };
}
