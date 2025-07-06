const Compra = require('../models/compra');
const axios = require('axios');
const QRCode = require('qrcode');

exports.crearCompra = async (idUsuario, data) => {
  const asientoIds = data.asientos;
  const asientoDetalles = await Promise.all(asientoIds.map(async (id) => {
    const response = await axios.get(`http://kong:8000/api/localidades/asientos/${id}`);
    const { fila, numero, precio, estado } = response.data;
    if (!fila || !numero || !precio || estado !== 'disponible') {
      throw new Error(`El asiento ${id} no está disponible o tiene datos inválidos.`);
    }
    return { idAsiento: id, fila, numero, precio };
  }));
  const subtotal = asientoDetalles.reduce((sum, detalle) => sum + detalle.precio, 0);
  const iva = subtotal * 0.15; // IVA establecido en 15%
  const montoTotal = subtotal + iva;

  // Crear la compra
  const compra = await Compra.create({
    idUsuario,
    asientos: asientoIds,
    cantidad: asientoIds.length,
    subtotal,
    iva,
    montoTotal,
    metodoCompra: data.metodoCompra,
    estado: 'completada'
  });

  // Preparar datos para las entradas y enviar solicitud al microservicio de entradas
  const entradaData = asientoDetalles.map((detalle) => ({
    idCompra: compra.idCompra,
    idAsiento: detalle.idAsiento,
    codigoQR: QRCode.toDataURL(`Entrada-${compra.idCompra}-${detalle.idAsiento}-${Date.now()}`), // Genera QR como string
    estado: 'activa'
  }));

  // Enviar solicitud al microservicio de entradas para crear las entradas
  await axios.post('http://kong:8000/api/entradas/bulk', entradaData, {
    headers: { 'Content-Type': 'application/json' }
  }).catch(err => {
    console.error('Error al crear entradas en el microservicio de entradas:', err.message);
    // Opcional: manejar el error (e.g., rollback de la compra si es crítico)
  });

  return compra;
};

exports.obtenerTodasCompras = async () => Compra.findAll();

exports.obtenerCompraPorId = async (idCompra) => Compra.findByPk(idCompra);

exports.actualizarCompra = async (idCompra, data) => {
  const compra = await exports.obtenerCompraPorId(idCompra);
  if (!compra) throw new Error('Compra no encontrada');
  return Compra.update(data, { where: { idCompra } });
};

exports.eliminarCompra = async (idCompra) => {
  const compra = await exports.obtenerCompraPorId(idCompra);
  if (!compra) throw new Error('Compra no encontrada');
  return Compra.destroy({ where: { idCompra } });
};

exports.obtenerMisCompras = async (idUsuario) => Compra.findAll({ where: { idUsuario } });