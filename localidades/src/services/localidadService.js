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

exports.buscarPorId = async (idLocalidad) => {
  // Convertir a string para manejar BigInt
  const id = String(idLocalidad);
  return Localidad.findByPk(id, { include: [Asiento] });
};

exports.obtenerTodos = async () =>
  Localidad.findAll({ include: [Asiento] });

exports.actualizarLocalidad = async (idLocalidad, data) => {
  const id = String(idLocalidad);
  const localidad = await Localidad.findByPk(id);
  if (!localidad) throw new Error('Localidad no encontrada');
  // Si actualizas idEvento, vuelve a validar
  if (data.idEvento) {
    const eventoRes = await axios.get(`http://kong:8000/api/eventos/${data.idEvento}`);
    if (!eventoRes.data) throw new Error('Evento no encontrado');
  }
  await Localidad.update(data, { where: { idLocalidad: id } });
  return Localidad.findByPk(id, { include: [Asiento] });
};

exports.eliminarLocalidad = async (idLocalidad) => {
  const id = String(idLocalidad);
  const localidad = await Localidad.findByPk(id);
  if (!localidad) throw new Error('Localidad no encontrada');
  // Elimina primero los asientos dependientes
  await Asiento.destroy({ where: { idLocalidad: id } });
  return Localidad.destroy({ where: { idLocalidad: id } });
};

// ASIENTO CRUD

exports.crearAsiento = async (data) => {
  // Validar que la localidad existe
  const localidad = await Localidad.findByPk(String(data.idLocalidad));
  if (!localidad) throw new Error('Localidad no encontrada');
  return Asiento.create(data);
};

exports.buscarAsientoPorId = async (idAsiento) => {
  // Convertir a string para manejar BigInt
  const id = String(idAsiento);
  console.log(`Buscando asiento con ID: ${id}`);
  const asiento = await Asiento.findByPk(id, { include: [Localidad] });
  console.log(`Asiento encontrado:`, asiento ? 'Sí' : 'No');
  return asiento;
};

exports.obtenerTodosAsientos = async () =>
  Asiento.findAll({ include: [Localidad] });

exports.actualizarAsiento = async (idAsiento, data) => {
  const id = String(idAsiento);
  const asiento = await Asiento.findByPk(id);
  if (!asiento) throw new Error('Asiento no encontrado');
  // Si actualizas idLocalidad, vuelve a validar
  if (data.idLocalidad) {
    const localidad = await Localidad.findByPk(String(data.idLocalidad));
    if (!localidad) throw new Error('Localidad no encontrada');
  }
  await Asiento.update(data, { where: { idAsiento: id } });
  return Asiento.findByPk(id, { include: [Localidad] });
};

exports.eliminarAsiento = async (idAsiento) => {
  const id = String(idAsiento);
  const asiento = await Asiento.findByPk(id);
  if (!asiento) throw new Error('Asiento no encontrado');
  return Asiento.destroy({ where: { idAsiento: id } });
};