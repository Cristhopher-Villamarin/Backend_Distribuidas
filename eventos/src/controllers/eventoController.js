const eventoService = require('../services/eventoService');
const notificationService = require('../services/notificationService');

// Crear evento
exports.crearEvento = async (req, res, next) => {
  try {
    const evento = await eventoService.crearEvento(req.body);
    await notificationService.sendNotification('eventos', { tipo: 'creacion', evento: evento.idEvento });
    res.status(201).json(evento);
  } catch (err) { next(err); }
};

// Obtener todos los eventos
exports.obtenerTodos = async (req, res, next) => {
  try {
    const eventos = await eventoService.obtenerTodos();
    res.json(eventos);
  } catch (err) { next(err); }
};

// Obtener evento por ID
exports.obtenerPorId = async (req, res, next) => {
  try {
    const evento = await eventoService.obtenerPorId(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  } catch (err) { next(err); }
};

// Actualizar evento
exports.actualizarEvento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evento = await eventoService.buscarPorId(id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    await eventoService.actualizarEvento(id, req.body);
    await notificationService.sendNotification('eventos', { tipo: 'actualizacion', evento: id });
    res.json({ message: 'Evento actualizado correctamente' });
  } catch (err) { next(err); }
};

// Eliminar evento
exports.eliminarEvento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evento = await eventoService.buscarPorId(id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    await eventoService.eliminarEvento(id);
    await notificationService.sendNotification('eventos', { tipo: 'eliminacion', evento: id });
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err) { next(err); }
};