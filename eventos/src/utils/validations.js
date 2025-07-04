const { body } = require('express-validator');

exports.eventoValidationRules = () => [
  body('idCategoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isInt().withMessage('El ID de categoría debe ser un número entero'),
  body('nombreEvento')
    .notEmpty().withMessage('El nombre del evento es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido'),
  body('fecha_fin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido'),
  body('hora_inicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Formato de hora inválido (HH:MM)'),
  body('ubicacion')
    .notEmpty().withMessage('La ubicación es obligatoria')
    .isLength({ min: 5, max: 200 }).withMessage('La ubicación debe tener entre 5 y 200 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 500 }).withMessage('La descripción no debe exceder los 500 caracteres'),
  body('estado')
    .optional()
    .isIn(['pendiente', 'activo', 'cancelado', 'completado']).withMessage('Estado inválido'),
];