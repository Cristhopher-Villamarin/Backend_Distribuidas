const Evento = require('../models/evento');
const axios = require('axios');

exports.crearEvento = async (data) => {
  // Validate that the idCategoria exists in the categorias microservice
  const response = await axios.get(`http://kong:8000/api/categorias/${data.idCategoria}`);
  if (!response.data) throw new Error('Categoría no encontrada');
  return Evento.create(data);
};

exports.buscarPorId = async (idEvento) => Evento.findByPk(idEvento);

exports.actualizarEvento = async (idEvento, data) => {
  const evento = await exports.buscarPorId(idEvento);
  if (!evento) throw new Error('Evento no encontrado');
  if (data.idCategoria) {
    const response = await axios.get(`http://kong:8000/api/categorias/${data.idCategoria}`);
    if (!response.data) throw new Error('Categoría no encontrada');
  }
  return Evento.update(data, { where: { idEvento } });
};

exports.eliminarEvento = async (idEvento) => {
  const evento = await exports.buscarPorId(idEvento);
  if (!evento) throw new Error('Evento no encontrado');
  return Evento.destroy({ where: { idEvento } });
};

exports.obtenerTodos = async () => {
  return Evento.findAll();
};