const entradaService = require('../services/entradaService');
const notificationService = require('../services/notificationService');

exports.obtenerTodasEntradas = async (req, res, next) => {
  try {
    const entradas = await entradaService.obtenerTodasEntradas();
    res.json(entradas);
  } catch (err) { next(err); }
};

exports.obtenerEntradaPorId = async (req, res, next) => {
  try {
    const entrada = await entradaService.obtenerEntradaPorId(req.params.id);
    if (!entrada) return res.status(404).json({ error: 'Entrada no encontrada' });
    res.json(entrada);
  } catch (err) { next(err); }
};

exports.crearEntradasBulk = async (req, res, next) => {
  try {
    const entradasData = req.body; // Array de objetos { idCompra, idAsiento, codigoQR, estado }
    const createdEntradas = await entradaService.crearEntradasBulk(entradasData);
    await notificationService.sendNotification('entradas', { tipo: 'creacion', entradas: createdEntradas.map(e => e.idEntrada) });
    res.status(201).json(createdEntradas);
  } catch (err) { next(err); }
};

exports.actualizarEntrada = async (req, res, next) => {
  try {
    const { id } = req.params;
    await entradaService.actualizarEntrada(id, req.body);
    await notificationService.sendNotification('entradas', { tipo: 'actualizacion', entrada: id });
    res.json({ message: 'Entrada actualizada correctamente' });
  } catch (err) { next(err); }
};

exports.eliminarEntrada = async (req, res, next) => {
  try {
    const { id } = req.params;
    await entradaService.eliminarEntrada(id);
    await notificationService.sendNotification('entradas', { tipo: 'eliminacion', entrada: id });
    res.json({ message: 'Entrada eliminada correctamente' });
  } catch (err) { next(err); }
};

exports.obtenerMisEntradas = async (req, res, next) => {
  try {
    const { compraIds } = req.query; // Obtener compraIds desde los parámetros de consulta (e.g., ?compraIds=1,2,3)
    const idsArray = compraIds ? compraIds.split(',').map(id => parseInt(id)) : [];
    const entradas = await entradaService.obtenerMisEntradas(req.user.id, idsArray);
    res.json(entradas);
  } catch (err) { next(err); }
};