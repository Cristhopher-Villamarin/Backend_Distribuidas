const express = require('express');
const { crearCategoria, obtenerTodos, obtenerPorId, actualizarCategoria, eliminarCategoria } = require('../controllers/categoriaController');
const { categoriaValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Crear categoría (solo admin)
router.post('/', auth, role('admin'), categoriaValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, crearCategoria);

// Obtener todas las categorías (todos los usuarios)
router.get('/', obtenerTodos);

// Obtener categoría por ID (todos los usuarios)
router.get('/:id', obtenerPorId);

// Actualizar categoría (solo admin)
router.put('/:id', auth, role('admin'), categoriaValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarCategoria);

// Eliminar categoría (solo admin)
router.delete('/:id', auth, role('admin'), eliminarCategoria);

module.exports = router;