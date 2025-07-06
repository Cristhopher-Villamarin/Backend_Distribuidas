const { body } = require('express-validator');

// Validación para Localidad
exports.localidadValidationRules = () => [
  body('idEvento')
    .notEmpty().withMessage('El evento es obligatorio')
    .isInt({ min: 1 }).withMessage('El idEvento debe ser un número entero positivo'),

  body('capacidad')
    .notEmpty().withMessage('La capacidad es obligatoria')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero positivo'),

  body('disponibilidad')
    .notEmpty().withMessage('La disponibilidad es obligatoria')
    .isInt({ min: 0 }).withMessage('La disponibilidad debe ser un número entero igual o mayor a 0'),

  body('nombre_localidad')
    .notEmpty().withMessage('El nombre de la localidad es obligatorio')
    .isLength({ min: 2, max: 20 }).withMessage('El nombre debe tener entre 2 y 20 caracteres')
    .matches(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/).withMessage('El nombre solo debe contener letras, números y espacios'),
];

// Validación para Asiento
exports.asientoValidationRules = () => [
  body('idLocalidad')
    .notEmpty().withMessage('La localidad es obligatoria')
    .isInt({ min: 1 }).withMessage('El idLocalidad debe ser un número entero positivo'),

  body('fila')
    .notEmpty().withMessage('La fila es obligatoria')
    .isLength({ min: 1, max: 10 }).withMessage('La fila debe tener entre 1 y 10 caracteres')
    .matches(/^[A-Za-z0-9]+$/).withMessage('La fila solo debe contener letras o números'),

  body('numero')
    .notEmpty().withMessage('El número es obligatorio')
    .isLength({ min: 1, max: 10 }).withMessage('El número debe tener entre 1 y 10 caracteres')
    .matches(/^[A-Za-z0-9]+$/).withMessage('El número solo debe contener letras o números'),

  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['disponible', 'ocupado', 'reservado']).withMessage('Estado inválido'),

  body('precio')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal con hasta 2 decimales'),
];
