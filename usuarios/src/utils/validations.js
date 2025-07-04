const { body } = require('express-validator');

exports.usuarioValidationRules = () => [
  body('cedula').isLength({ min: 10, max: 10 }).withMessage('Cédula debe tener 10 dígitos'),
  body('nombre').isLength({ min: 2, max: 20 }),
  body('apellido').isLength({ min: 2, max: 20 }),
  body('email').isEmail(),
  body('telefono').isLength({ min: 7, max: 15 }),
  body('contrasenia').isLength({ min: 8 }),
  body('direccion').isLength({ min: 5, max: 50 }),
  body('ciudad').notEmpty(),
  body('provincia').notEmpty(),
];