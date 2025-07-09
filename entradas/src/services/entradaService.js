const Entrada = require('../models/entrada');

exports.obtenerTodasEntradas = async () => Entrada.findAll();

exports.obtenerEntradaPorId = async (idEntrada) => Entrada.findByPk(idEntrada);

exports.crearEntradasBulk = async (entradasData) => {
  // Validar que los datos sean un array
  if (!Array.isArray(entradasData)) throw new Error('Los datos deben ser un array de entradas');
  return Entrada.bulkCreate(entradasData);
};

exports.actualizarEntrada = async (idEntrada, data) => {
  const entrada = await exports.obtenerEntradaPorId(idEntrada);
  if (!entrada) throw new Error('Entrada no encontrada');
  return Entrada.update(data, { where: { idEntrada } });
};

exports.eliminarEntrada = async (idEntrada) => {
  const entrada = await exports.obtenerEntradaPorId(idEntrada);
  if (!entrada) throw new Error('Entrada no encontrada');
  return Entrada.destroy({ where: { idEntrada } });
};

exports.obtenerMisEntradas = async (idCliente, compraIds) => {
  // Filtrar entradas basadas en los idCompra proporcionados (deben venir del cliente o compras)
  if (!Array.isArray(compraIds) || compraIds.length === 0) {
    throw new Error('Deben proporcionarse los IDs de compras válidos');
  }
  return Entrada.findAll({ where: { idCompra: compraIds } });
};