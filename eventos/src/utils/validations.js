const { body } = require('express-validator');

exports.eventoValidationRules = () => [
  body('idCategoria')
    .notEmpty().withMessage('La categoría es obligatoria'),
  
  body('nombreEvento')
    .notEmpty().withMessage('El nombre del evento es obligatorio')
    .isLength({ min: 2, max: 20 }).withMessage('El nombre debe tener entre 2 y 20 caracteres'),
  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD)'),
  body('fecha_fin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('La fecha de fin debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD)')
    .toDate()
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.fecha_inicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  body('hora_inicio')
    .notEmpty().withMessage('La hora de inicio es obligatoria')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora de inicio debe estar en formato HH:MM (24 horas)'),
  body('ubicacion')
    .notEmpty().withMessage('La ubicación es obligatoria')
    .isLength({ min: 2, max: 100 }).withMessage('La ubicación debe tener entre 2 y 100 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 100 }).withMessage('La descripción no debe exceder los 100 caracteres'),
  body('estado')
    .optional()
    .isIn(['activo', 'inactivo', 'cancelado']).withMessage('El estado debe ser "activo", "inactivo" o "cancelado"'),
];