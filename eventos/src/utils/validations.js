const { body } = require('express-validator');

exports.eventoValidationRules = () => [
  body('idCategoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isInt().withMessage('El ID de categoría debe ser un número entero'),
  body('nombreEvento')
    .notEmpty().withMessage('El nombre del evento es obligatorio')
    .isLength({ min: 2, max: 20 }).withMessage('El nombre debe tener entre 2 y 20 caracteres'),
  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('La fecha de inicio debe ser válida'),
  body('fecha_fin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('La fecha de fin debe ser válida'),
  body('hora_inicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria')
    .isISO8601().withMessage('La hora de inicio debe ser válida'),
  body('ubicacion')
    .notEmpty().withMessage('La ubicación es obligatoria')
    .isLength({ min: 2, max: 100 }).withMessage('La ubicación debe tener entre 2 y 100 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 100 }).withMessage('La descripción no debe exceder los 100 caracteres'),
  body('estado')
    .optional()
    .isIn(['activo', 'inactivo', 'cancelado']).withMessage('Estado inválido'),
];