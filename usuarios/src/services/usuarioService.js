const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.crearUsuario = async (data) => {
  data.contrasenia = await bcrypt.hash(data.contrasenia, 10);
  return Usuario.create(data);
};

exports.buscarPorEmail = async (email) => Usuario.findOne({ where: { email } });

exports.buscarPorId = async (idCliente) => Usuario.findByPk(idCliente);

exports.actualizarUsuario = async (idCliente, data) => Usuario.update(data, { where: { idCliente } });

exports.eliminarUsuario = async (idCliente) => Usuario.destroy({ where: { idCliente } });