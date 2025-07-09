// compraService.js
const Compra = require('../models/compra');
const axios = require('axios');
const QRCode = require('qrcode');

exports.crearCompra = async (idCliente, data) => {
  // Convertir asientos a strings para manejar BigInt correctamente
  const asientoIds = data.asientos.map(id => String(id));
  
  // Obtener detalles de los asientos
  const asientoDetalles = await Promise.all(asientoIds.map(async (id) => {
    try {
      const response = await axios.get(`http://kong:8000/api/localidades/asientos/${id}`);
      if (!response.data) {
        throw new Error(`No se encontraron datos para el asiento ${id}`);
      }
      const { fila, numero, precio, estado } = response.data;
      if (!fila || !numero || precio === undefined || estado !== 'disponible') {
        throw new Error(`El asiento ${id} no está disponible o tiene datos inválidos. Estado: ${estado}`);
      }
      return { idAsiento: id, fila, numero, precio };
    } catch (error) {
      console.error(`Error al obtener datos del asiento ${id}:`, error.message);
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data:`, error.response.data);
      }
      throw new Error(`Error al obtener datos del asiento ${id}: ${error.message}`);
    }
  }));
  
  const subtotal = asientoDetalles.reduce((sum, detalle) => sum + parseFloat(detalle.precio), 0);
  const iva = subtotal * 0.15; // IVA establecido en 15%
  const montoTotal = subtotal + iva;

  // Crear la compra
  const compra = await Compra.create({
    idCliente,
    asientos: asientoIds,
    cantidad: asientoIds.length,
    subtotal,
    iva,
    montoTotal,
    metodoCompra: data.metodoCompra,
    estado: 'completada'
  });

  // Preparar datos para las entradas
  const entradaData = await Promise.all(asientoDetalles.map(async (detalle) => {
    const qrCode = await QRCode.toDataURL(`Entrada-${compra.idCompra}-${detalle.idAsiento}-${Date.now()}`);
    return {
      idCompra: compra.idCompra,
      idAsiento: detalle.idAsiento,
      codigoQR: qrCode,
      estado: 'activa'
    };
  }));

  // Enviar solicitud al microservicio de entradas
  try {
    const response = await axios.post('http://kong:8000/api/entradas/bulk', entradaData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_SERVICE_TOKEN}` // Token para autenticación
      }
    });
    console.log('Entradas creadas:', response.data); // Para depuración
  } catch (err) {
    console.error('Error al crear entradas:', err.message, err.response?.data);
    // Hacer rollback de la compra
    await Compra.destroy({ where: { idCompra: compra.idCompra } });
    throw new Error(`Error al crear entradas: ${err.message}`);
  }

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

exports.obtenerMisCompras = async (idCliente) => Compra.findAll({ where: { idCliente } });