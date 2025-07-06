const express = require('express');
const { crearCompra, obtenerTodasCompras, obtenerCompraPorId, actualizarCompra, eliminarCompra, obtenerMisCompras } = require('../controllers/compraController');
const { compraValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Crear compra (solo usuario autenticado)
router.post('/', auth, compraValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, crearCompra);

// Obtener todas las compras (solo admin)
router.get('/', auth, role('admin'), obtenerTodasCompras);

// Obtener compra por ID (solo admin)
router.get('/:id', auth, role('admin'), obtenerCompraPorId);

// Actualizar compra (solo admin)
router.put('/:id', auth, role('admin'), compraValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarCompra);

// Eliminar compra (solo admin)
router.delete('/:id', auth, role('admin'), eliminarCompra);

// Obtener compras del usuario autenticado (solo usuario)
router.get('/mis-compras', auth, obtenerMisCompras);

module.exports = router;