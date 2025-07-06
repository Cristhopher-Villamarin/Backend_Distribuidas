const express = require('express');
const { obtenerTodasEntradas, obtenerEntradaPorId, actualizarEntrada, eliminarEntrada, obtenerMisEntradas, crearEntradasBulk } = require('../controllers/entradaController');
const { entradaValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Obtener todas las entradas (solo admin)
router.get('/', auth, role('admin'), obtenerTodasEntradas);

// Obtener entrada por ID (solo admin)
router.get('/:id', auth, role('admin'), obtenerEntradaPorId);

// Crear entradas en bulk (solo interno, accesible por compras)
router.post('/bulk', auth, role('admin'), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, crearEntradasBulk);

// Actualizar entrada (solo admin)
router.put('/:id', auth, role('admin'), entradaValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarEntrada);

// Eliminar entrada (solo admin)
router.delete('/:id', auth, role('admin'), eliminarEntrada);

// Obtener entradas del usuario autenticado (solo usuario) con compraIds como query
router.get('/mis-entradas', auth, obtenerMisEntradas);

module.exports = router;