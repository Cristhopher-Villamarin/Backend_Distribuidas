const localidadService = require('../services/localidadService');
const notificationService = require('../services/notificationService');
const Localidad = require('../models/localidad');
const Asiento = require('../models/asiento');

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


exports.crearAsiento = async (req, res, next) => {
  try {
    const { idLocalidad, fila, numero, estado, precio } = req.body;

    // 1. Validar existencia de la localidad
    const localidad = await Localidad.findByPk(idLocalidad);
    if (!localidad) {
      return res.status(404).json({ error: 'Localidad no encontrada' });
    }

    // 2. Validar que no se exceda la capacidad
    const totalAsientos = await Asiento.count({ where: { idLocalidad } });
    if (totalAsientos >= localidad.capacidad) {
      return res.status(400).json({
        error: 'Capacidad alcanzada',
        message: `No se pueden registrar más asientos. La capacidad máxima de esta localidad es ${localidad.capacidad}.`,
      });
    }

    // 3. Validar que no exista el mismo asiento (fila + número) en la localidad
    const asientoExistente = await Asiento.findOne({
      where: { idLocalidad, fila, numero }
    });
    if (asientoExistente) {
      return res.status(409).json({
        error: 'Asiento duplicado',
        message: `Ya existe un asiento en la fila "${fila}" y número "${numero}" en esta localidad.`,
      });
    }

    // 4. Crear el asiento
    const asiento = await Asiento.create({ idLocalidad, fila, numero, estado, precio });

    // 5. Notificación y respuesta
    await notificationService.sendNotification('asientos', {
      tipo: 'creacion',
      asiento: asiento.idAsiento
    });

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
    res.json(asiento);
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