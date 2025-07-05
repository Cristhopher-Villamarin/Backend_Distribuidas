const Localidad = require('../models/localidad');
const Asiento = require('../models/asiento');
const axios = require('axios');

// LOCALIDAD CRUD

exports.crearLocalidad = async (data) => {
  // Validar que el evento existe en el microservicio de eventos
  const eventoRes = await axios.get(`http://kong:8000/api/eventos/${data.idEvento}`);
  if (!eventoRes.data) throw new Error('Evento no encontrado');
  return Localidad.create(data);
};

exports.buscarPorId = async (idLocalidad) =>
  Localidad.findByPk(idLocalidad, { include: [Asiento] });

exports.obtenerTodos = async () =>
  Localidad.findAll({ include: [Asiento] });

exports.actualizarLocalidad = async (idLocalidad, data) => {
  const localidad = await Localidad.findByPk(idLocalidad);
  if (!localidad) throw new Error('Localidad no encontrada');
  // Si actualizas idEvento, vuelve a validar
  if (data.idEvento) {
    const eventoRes = await axios.get(`http://kong:8000/api/eventos/${data.idEvento}`);
    if (!eventoRes.data) throw new Error('Evento no encontrado');
  }
  await Localidad.update(data, { where: { idLocalidad } });
  return Localidad.findByPk(idLocalidad, { include: [Asiento] });
};

exports.eliminarLocalidad = async (idLocalidad) => {
  const localidad = await Localidad.findByPk(idLocalidad);
  if (!localidad) throw new Error('Localidad no encontrada');
  // Elimina primero los asientos dependientes
  await Asiento.destroy({ where: { idLocalidad } });
  return Localidad.destroy({ where: { idLocalidad } });
};

// ASIENTO CRUD

exports.crearAsiento = async (data) => {
  // Validar que la localidad existe
  const localidad = await Localidad.findByPk(data.idLocalidad);
  if (!localidad) throw new Error('Localidad no encontrada');
  return Asiento.create(data);
};

exports.buscarAsientoPorId = async (idAsiento) =>
  Asiento.findByPk(idAsiento, { include: [Localidad] });

exports.obtenerTodosAsientos = async () =>
  Asiento.findAll({ include: [Localidad] });

exports.actualizarAsiento = async (idAsiento, data) => {
  const asiento = await Asiento.findByPk(idAsiento);
  if (!asiento) throw new Error('Asiento no encontrado');
  // Si actualizas idLocalidad, vuelve a validar
  if (data.idLocalidad) {
    const localidad = await Localidad.findByPk(data.idLocalidad);
    if (!localidad) throw new Error('Localidad no encontrada');
  }
  await Asiento.update(data, { where: { idAsiento } });
  return Asiento.findByPk(idAsiento, { include: [Localidad] });
};

exports.eliminarAsiento = async (idAsiento) => {
  const asiento = await Asiento.findByPk(idAsiento);
  if (!asiento) throw new Error('Asiento no encontrado');
  return Asiento.destroy({ where: { idAsiento } });
};