const { body } = require('express-validator');

exports.localidadValidationRules = () => [
  body('idEvento')
    .notEmpty().withMessage('El evento es obligatorio')
    .isInt().withMessage('El idEvento debe ser un número entero'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isDecimal().withMessage('El precio debe ser decimal'),
  body('capacidad')
    .notEmpty().withMessage('La capacidad es obligatoria')
    .isInt().withMessage('La capacidad debe ser un número entero'),
  body('disponibilidad')
    .notEmpty().withMessage('La disponibilidad es obligatoria')
    .isInt().withMessage('La disponibilidad debe ser un número entero'),
  body('nombre_localidad')
    .notEmpty().withMessage('El nombre de la localidad es obligatorio')
    .isLength({ min: 2, max: 20 }).withMessage('El nombre debe tener entre 2 y 20 caracteres'),
];

// Validación para Asiento
exports.asientoValidationRules = () => [
  body('idLocalidad')
    .notEmpty().withMessage('La localidad es obligatoria')
    .isInt().withMessage('El idLocalidad debe ser un número entero'),
  body('fila')
    .notEmpty().withMessage('La fila es obligatoria')
    .isLength({ min: 1, max: 10 }).withMessage('La fila debe tener entre 1 y 10 caracteres'),
  body('numero')
    .notEmpty().withMessage('El número es obligatorio')
    .isLength({ min: 1, max: 10 }).withMessage('El número debe tener entre 1 y 10 caracteres'),
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['disponible', 'ocupado', 'reservado']).withMessage('Estado inválido'),
  body('precio')
    .optional()
    .isDecimal().withMessage('El precio debe ser decimal'),
];