const localidadService = require('../services/localidadService');
const notificationService = require('../services/notificationService');
const { sendToQueue } = require('../config/rabbitmq');

// Controladores para Localidad
exports.crearLocalidad = async (req, res, next) => {
  try {
    const localidad = await localidadService.crearLocalidad(req.body);
    await notificationService.sendNotification('localidades', { tipo: 'creacion', localidad: localidad.idLocalidad });
    res.status(201).json(localidad);
  } catch (err) {
    next(err);
  }
};

exports.obtenerTodosLocalidades = async (req, res, next) => {
  try {
    const localidades = await localidadService.obtenerTodos();
    res.json(localidades);
  } catch (err) {
    next(err);
  }
};

exports.obtenerLocalidadPorId = async (req, res, next) => {
  try {
    const localidad = await localidadService.buscarPorId(req.params.id);
    if (!localidad) return res.status(404).json({ error: 'Localidad no encontrada' });
    res.json(localidad);
  } catch (err) {
    next(err);
  }
};

exports.actualizarLocalidad = async (req, res, next) => {
  try {
    const { id } = req.params;
    await localidadService.actualizarLocalidad(id, req.body);
    await notificationService.sendNotification('localidades', { tipo: 'actualizacion', localidad: id });
    res.json({ message: 'Localidad actualizada correctamente' });
  } catch (err) {
    next(err);
  }
};

exports.eliminarLocalidad = async (req, res, next) => {
  try {
    const { id } = req.params;
    await localidadService.eliminarLocalidad(id);
    await notificationService.sendNotification('localidades', { tipo: 'eliminacion', localidad: id });
    res.json({ message: 'Localidad eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};

// Controladores para Asiento
exports.crearAsiento = async (req, res, next) => {
  try {
    const asiento = await localidadService.crearAsiento(req.body);
    await notificationService.sendNotification('asientos', { tipo: 'creacion', asiento: asiento.idAsiento });
    res.status(201).json(asiento);
  } catch (err) {
    next(err);
  }
};

exports.obtenerTodosAsientos = async (req, res, next) => {
  try {
    const asientos = await localidadService.obtenerTodosAsientos();
    res.json(asientos);
  } catch (err) {
    next(err);
  }
};

exports.obtenerAsientoPorId = async (req, res, next) => {
  try {
    const asiento = await localidadService.buscarAsientoPorId(req.params.id);
    if (!asiento) return res.status(404).json({ error: 'Asiento no encontrado' });
    res.json({
      idAsiento: asiento.idAsiento,
      fila: asiento.fila,
      numero: asiento.numero,
      precio: asiento.precio,
      estado: asiento.estado
    });
  } catch (err) {
    next(err);
  }
};

exports.actualizarAsiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    await localidadService.actualizarAsiento(id, req.body);
    await notificationService.sendNotification('asientos', { tipo: 'actualizacion', asiento: id });
    res.json({ message: 'Asiento actualizado correctamente' });
  } catch (err) {
    next(err);
  }
};

exports.eliminarAsiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    await localidadService.eliminarAsiento(id);
    await notificationService.sendNotification('asientos', { tipo: 'eliminacion', asiento: id });
    res.json({ message: 'Asiento eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};

exports.reservarAsiento = async (req, res, next) => {
  try {
    const { idAsiento } = req.body;
    if (!idAsiento) {
      return res.status(400).json({ error: 'Se requiere idAsiento' });
    }
    const asiento = await localidadService.buscarAsientoPorId(idAsiento);
    if (!asiento) {
      return res.status(404).json({ error: 'Asiento no encontrado' });
    }
    if (asiento.estado !== 'disponible') {
      return res.status(400).json({ error: `El asiento está en estado ${asiento.estado}, no puede reservarse` });
    }
    await localidadService.actualizarAsiento(idAsiento, { estado: 'reservado' });
    await sendToQueue('asiento_reservas', { idAsiento });
    await notificationService.sendNotification('asientos', { tipo: 'reserva', asiento: idAsiento });
    res.status(200).json({ message: 'Asiento reservado temporalmente', idAsiento });
  } catch (err) {
    next(err);
  }
};

exports.confirmarReservaAsiento = async (req, res, next) => {
  try {
    const { idAsiento } = req.body;
    if (!idAsiento) {
      return res.status(400).json({ error: 'Se requiere idAsiento' });
    }
    const asiento = await localidadService.buscarAsientoPorId(idAsiento);
    if (!asiento) {
      return res.status(404).json({ error: 'Asiento no encontrado' });
    }
    if (asiento.estado !== 'reservado') {
      console.warn(`Intento de confirmar asiento ${idAsiento} que no está reservado (estado: ${asiento.estado})`);
      return res.status(400).json({ error: `El asiento no está reservado, estado actual: ${asiento.estado}` });
    }
    await localidadService.actualizarAsiento(idAsiento, { estado: 'no disponible' });
    await notificationService.sendNotification('asientos', { tipo: 'confirmacion', asiento: idAsiento });
    res.status(200).json({ message: 'Reserva confirmada, asiento no disponible', idAsiento });
  } catch (err) {
    console.error(`Error al confirmar reserva del asiento ${req.body.idAsiento}:`, err.message);
    next(err);
  }
};