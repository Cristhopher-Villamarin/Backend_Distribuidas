const express = require('express');
const {
  crearLocalidad,
  obtenerTodosLocalidades,
  obtenerLocalidadPorId,
  actualizarLocalidad,
  eliminarLocalidad,
  crearAsiento,
  obtenerTodosAsientos,
  obtenerAsientoPorId,
  actualizarAsiento,
  eliminarAsiento,
  reservarAsiento,
  confirmarReservaAsiento
} = require('../controllers/localidadController');

const { localidadValidationRules, asientoValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// --- LOCALIDAD ROUTES ---

// Crear localidad (solo admin)
router.post('/', auth, role('admin'), localidadValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, crearLocalidad);

// Obtener todas las localidades (todos los usuarios)
router.get('/', obtenerTodosLocalidades);

// Obtener localidad por ID (todos los usuarios)
router.get('/:id', obtenerLocalidadPorId);

// Actualizar localidad (solo admin)
router.put('/:id', auth, role('admin'), localidadValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarLocalidad);

// Eliminar localidad (solo admin)
router.delete('/:id', auth, role('admin'), eliminarLocalidad);

// --- ASIENTO ROUTES ---

// Crear asiento (solo admin)
router.post('/asientos', auth, role('admin'), asientoValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, crearAsiento);

// Obtener todos los asientos (todos los usuarios)
router.get('/asientos', obtenerTodosAsientos);

// Obtener asiento por ID (todos los usuarios)
router.get('/asientos/:id', obtenerAsientoPorId);

// Actualizar asiento (solo admin)
router.put('/asientos/:id', auth, role('admin'), asientoValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, actualizarAsiento);

// Eliminar asiento (solo admin)
router.delete('/asientos/:id', auth, role('admin'), eliminarAsiento);

// Reservar asiento temporalmente (autenticado)
router.post('/asientos/reservar', auth, reservarAsiento);

// Confirmar reserva de asiento (autenticado, usado por microservicio de compras)
router.post('/asientos/confirmar', confirmarReservaAsiento);

module.exports = router;