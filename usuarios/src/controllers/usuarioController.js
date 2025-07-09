const usuarioService = require('../services/usuarioService');
const notificationService = require('../services/notificationService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../config/redisClient');
const emailService = require('../utils/emailService');



// Registrar usuario
exports.registrar = async (req, res, next) => {
  try {
    const usuario = await usuarioService.crearUsuario(req.body);
    await notificationService.sendNotification('usuarios', { tipo: 'registro', usuario: usuario.email });
    res.status(201).json(usuario);
  } catch (err) { next(err); }
};

// Login usuario 1
exports.loginFase1 = async (req, res, next) => {
  try {
    const { email, contrasenia } = req.body;
    const usuario = await usuarioService.buscarPorEmail(email);

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!esValido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.set(`2fa:${email}`, codigo, 'EX', 300); // Expira en 5 min

    await emailService.enviarCodigo(email, codigo);

    res.status(200).json({ message: 'Código de verificación enviado al correo electrónico' });
  } catch (err) {
    next(err);
  }
};
// Login usuario 2
exports.loginFase2 = async (req, res, next) => {
  try {
    const { email, codigo } = req.body;

    const codigoGuardado = await redisClient.get(`2fa:${email}`);
    if (!codigoGuardado) {
      return res.status(400).json({ error: 'Código expirado o no encontrado' });
    }

    if (codigo !== codigoGuardado) {
      return res.status(401).json({ error: 'Código incorrecto' });
    }

    await redisClient.del(`2fa:${email}`); // Eliminar después de usar

    const usuario = await usuarioService.buscarPorEmail(email);
    const token = jwt.sign(
      { id: usuario.idCliente, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } // o más si lo deseas
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

// Obtener perfil del usuario autenticado
exports.obtenerPerfil = async (req, res, next) => {
  try {
    const usuario = await usuarioService.buscarPorId(req.user.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) { next(err); }
};

// Actualizar perfil del usuario autenticado
exports.actualizarPerfil = async (req, res, next) => {
  try {
    const actualizado = await usuarioService.actualizarUsuario(req.user.id, req.body);
    if (!actualizado[0]) return res.status(404).json({ error: 'Usuario no encontrado o sin cambios' });
    await notificationService.sendNotification('usuarios', { tipo: 'actualizacion', usuario: req.user.id });
    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (err) { next(err); }
};

exports.actualizarUsuarioPorAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.buscarPorId(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuarioService.actualizarUsuario(id, req.body);
    await notificationService.sendNotification('usuarios', { tipo: 'actualizacion_por_admin', usuario: usuario.email });
    res.json({ message: 'Usuario actualizado correctamente por administrador' });
  } catch (err) {
    next(err);
  }
};

exports.eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.buscarPorId(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuarioService.eliminarUsuario(id);
    await notificationService.sendNotification('usuarios', { tipo: 'eliminacion', usuario: usuario.email });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};

// Obtener todos los usuarios (solo admin)
exports.obtenerTodos = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.obtenerTodos();
    res.json(usuarios);
  } catch (err) { next(err); }
};
// Genera los métodos: obtener perfil, actualizar, eliminar, etc.