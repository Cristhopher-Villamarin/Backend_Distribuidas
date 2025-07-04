const express = require('express');
const { crearEvento, obtenerTodos, obtenerPorId, actualizarEvento, eliminarEvento } = require('../controllers/eventoController');
const { eventoValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Crear evento (solo admin y organizador)
router.post('/', auth, role('admin', 'organizador'), eventoValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, crearEvento);

// Obtener todos los eventos (todos los usuarios)
router.get('/', obtenerTodos);

// Obtener evento por ID (todos los usuarios)
router.get('/:id', obtenerPorId);

// Actualizar evento (solo admin y organizador)
router.put('/:id', auth, role('admin', 'organizador'), eventoValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarEvento);

// Eliminar evento (solo admin y organizador)
router.delete('/:id', auth, role('admin', 'organizador'), eliminarEvento);

module.exports = router;