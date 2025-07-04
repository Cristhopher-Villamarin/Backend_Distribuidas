const Evento = require('../models/evento');
const axios = require('axios');

exports.crearEvento = async (data) => {
  // Validar que idCategoria exista en el microservicio de categorias
  const response = await axios.get(`http://categorias:3001/api/categorias/${data.idCategoria}`, {
    headers: { Authorization: 'Bearer <tu-token>' } // Añade token si es necesario
  });
  if (!response.data) {
    throw new Error('Categoría no encontrada');
  }

  return Evento.create(data);
};

exports.buscarPorId = async (idEvento) => Evento.findByPk(idEvento);

exports.actualizarEvento = async (idEvento, data) => {
  if (data.idCategoria) {
    const response = await axios.get(`http://categorias:3001/api/categorias/${data.idCategoria}`, {
      headers: { Authorization: 'Bearer <tu-token>' } // Añade token si es necesario
    });
    if (!response.data) {
      throw new Error('Categoría no encontrada');
    }
  }
  return Evento.update(data, { where: { idEvento } });
};

exports.eliminarEvento = async (idEvento) => Evento.destroy({ where: { idEvento } });

exports.obtenerTodos = async () => {
  return Evento.findAll();
};

exports.obtenerPorId = async (idEvento) => {
  return Evento.findByPk(idEvento);
};