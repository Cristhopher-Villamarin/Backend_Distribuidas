const express = require('express');
const { registrar, login } = require('../controllers/usuarioController');
const { usuarioValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', usuarioValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, registrar);

// Crear un nuevo usuario (solo admin)
router.post('/', auth, role('admin'), usuarioValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, registrar);

router.post('/login', login);

// Obtener perfil del usuario autenticado (requiere token, no necesariamente admin)
router.get('/perfil', auth, obtenerPerfil);

// Actualizar perfil del usuario autenticado (requiere token, no necesariamente admin)
router.put('/perfil', auth, actualizarUsuarioValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarPerfil);

// Actualizar un usuario por ID (solo admin)
router.put('/:id', auth, role('admin'), actualizarUsuarioValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarUsuarioPorAdmin);

// Eliminar un usuario por ID (requiere token y rol admin, o ser el propio usuario)
router.delete('/:id', auth, role('admin'), eliminarUsuario);

// Eliminar un usuario por ID (solo admin)
router.delete('/:id', auth, role('admin'), eliminarUsuario);

// Obtener todos los usuarios (requiere token y rol admin)
router.get('/', auth, role('admin'), obtenerTodos);

// Ruta protegida solo para admin
router.get('/admin', auth, role('admin'), (req, res) => res.json({ msg: 'Solo admin' }));

module.exports = router;