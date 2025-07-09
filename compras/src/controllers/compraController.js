const compraService = require('../services/compraService');
const notificationService = require('../services/notificationService');

exports.crearCompra = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const compra = await compraService.crearCompra(req.user.id, req.body); // Cambiar idUsuario por id
    await notificationService.sendNotification('compras', { tipo: 'creacion', compra: compra.idCompra });
    res.status(201).json(compra);
  } catch (err) { next(err); }
};

exports.obtenerTodasCompras = async (req, res, next) => {
  try {
    const compras = await compraService.obtenerTodasCompras();
    res.json(compras);
  } catch (err) { next(err); }
};

exports.obtenerCompraPorId = async (req, res, next) => {
  try {
    const compra = await compraService.obtenerCompraPorId(req.params.id);
    if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
    res.json(compra);
  } catch (err) { next(err); }
};

exports.actualizarCompra = async (req, res, next) => {
  try {
    const { id } = req.params;
    await compraService.actualizarCompra(id, req.body);
    await notificationService.sendNotification('compras', { tipo: 'actualizacion', compra: id });
    res.json({ message: 'Compra actualizada correctamente' });
  } catch (err) { next(err); }
};

exports.eliminarCompra = async (req, res, next) => {
  try {
    const { id } = req.params;
    await compraService.eliminarCompra(id);
    await notificationService.sendNotification('compras', { tipo: 'eliminacion', compra: id });
    res.json({ message: 'Compra eliminada correctamente' });
  } catch (err) { next(err); }
};

exports.obtenerMisCompras = async (req, res, next) => {
  try {
    const compras = await compraService.obtenerMisCompras(req.user.id);
    res.json(compras);
  } catch (err) { next(err); }
};