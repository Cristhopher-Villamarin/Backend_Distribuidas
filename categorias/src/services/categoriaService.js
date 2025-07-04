const Categoria = require('../models/categoria');

exports.crearCategoria = async (data) => {
  return Categoria.create(data);
};

exports.buscarPorId = async (idCategoria) => Categoria.findByPk(idCategoria);

exports.actualizarCategoria = async (idCategoria, data) => {
  return Categoria.update(data, { where: { idCategoria } });
};

exports.eliminarCategoria = async (idCategoria) => Categoria.destroy({ where: { idCategoria } });

exports.obtenerTodos = async () => {
  return Categoria.findAll();
};

exports.obtenerPorId = async (idCategoria) => {
  return Categoria.findByPk(idCategoria);
};