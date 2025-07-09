const express = require('express');
const { obtenerTodasEntradas, obtenerEntradaPorId, actualizarEntrada, eliminarEntrada, obtenerMisEntradas, crearEntradasBulk } = require('../controllers/entradaController');
const { entradaValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Obtener todas las entradas (solo admin)
router.get('/', auth, role('admin'), obtenerTodasEntradas);

// Obtener entradas del usuario autenticado (solo usuario) con compraIds como query
router.get('/misentradas', auth, obtenerMisEntradas);

// Crear entradas en bulk (sin autenticación, para microservicio de compras)
router.post('/bulk', entradaValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, crearEntradasBulk);

// Obtener entrada por ID (solo admin)
router.get('/:id', auth, role('admin'), obtenerEntradaPorId);

// Actualizar entrada (solo admin)
router.put('/:id', auth, role('admin'), entradaValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarEntrada);

// Eliminar entrada (solo admin)
router.delete('/:id', auth, role('admin'), eliminarEntrada);

module.exports = router;