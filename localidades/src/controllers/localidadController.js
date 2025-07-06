const localidadService = require('../services/localidadService');
const notificationService = require('../services/notificationService');

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
    }); // Asegúrate de devolver estos campos
  } catch (err) { next(err); }
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