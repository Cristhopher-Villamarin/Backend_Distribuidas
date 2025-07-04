const { body } = require('express-validator');

exports.categoriaValidationRules = () => [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 200 }).withMessage('La descripción no debe exceder los 200 caracteres'),
];