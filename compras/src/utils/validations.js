const { body, param } = require('express-validator');

exports.compraValidationRules = () => {
  return [
    body('asientos')
      .isArray()
      .withMessage('Por favor, selecciona al menos un asiento para tu compra.')
      .notEmpty()
      .withMessage('Debes elegir al menos un asiento para proceder.'),
    body('asientos.*')
      .isInt()
      .withMessage('Cada asiento debe tener un número de identificación válido.'),
    body('metodoCompra')
      .isString()
      .notEmpty()
      .withMessage('Por favor, elige cómo deseas pagar (tarjeta, efectivo o transferencia).')
      .isIn(['tarjeta', 'efectivo', 'transferencia'])
      .withMessage('El método de pago debe ser tarjeta, efectivo o transferencia.'),
    body('subtotal').optional().isDecimal().withMessage('El subtotal debe ser un valor numérico válido.'),
    body('iva').optional().isDecimal().withMessage('El IVA debe ser un valor numérico válido.'),
    body('montoTotal').optional().isDecimal().withMessage('El monto total debe ser un valor numérico válido.')
  ];
};