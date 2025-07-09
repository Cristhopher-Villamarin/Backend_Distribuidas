const { body } = require('express-validator');

exports.entradaValidationRules = () => {
  return [
    body('idCompra')
      .optional()
      .isInt()
      .withMessage('El número de compra debe ser un valor entero válido si se proporciona.'),
    body('idAsiento')
      .optional()
      .isInt()
      .withMessage('El número de asiento debe ser un valor entero válido si se proporciona.'),
    body('codigoQR')
      .optional()
      .isString()
      .withMessage('El código QR debe ser un valor de texto válido si se proporciona.'),
    body('estado')
      .optional()
      .isString()
      .isIn(['activa', 'usada', 'cancelada'])
      .withMessage('El estado debe ser activa, usada o cancelada si se modifica.')
  ];
};