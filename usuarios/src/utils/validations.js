const { body } = require('express-validator');

// Función para validar cédula ecuatoriana
const validarCedulaEcuatoriana = (value) => {
  if (!/^\d{10}$/.test(value)) {
    throw new Error('La cédula debe tener exactamente 10 dígitos');
  }

  const provincia = parseInt(value.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    throw new Error('Código de provincia inválido (01-24)');
  }

  const tercerDigito = parseInt(value.charAt(2), 10);
  if (tercerDigito > 5) {
    throw new Error('Tercer dígito inválido (0-5)');
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let producto = parseInt(value.charAt(i), 10) * coeficientes[i];
    if (producto >= 10) producto -= 9;
    suma += producto;
  }

  const digitoVerificador = parseInt(value.charAt(9), 10);
  const modulo = suma % 10;
  const esperado = modulo === 0 ? 0 : 10 - modulo;

  if (digitoVerificador !== esperado) {
    throw new Error('Cédula inválida: dígito verificador incorrecto');
  }

  return true;
};

exports.usuarioValidationRules = () => [
  body('cedula')
    .notEmpty().withMessage('La cédula es obligatoria')
    .custom(validarCedulaEcuatoriana).withMessage('Cédula ecuatoriana inválida'),
  body('nombre')
    .isLength({ min: 2, max: 20 }).withMessage('El nombre debe tener entre 2 y 20 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo debe contener letras y espacios'),
  body('apellido')
    .isLength({ min: 2, max: 20 }).withMessage('El apellido debe tener entre 2 y 20 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo debe contener letras y espacios'),
  body('email')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage('Formato de email inválido'),
  body('telefono')
    .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos')
    .matches(/^\d+$/).withMessage('El teléfono solo debe contener dígitos'),
  body('contrasenia')
    .isLength({ min: 8, max: 50 }).withMessage('La contraseña debe tener entre 8 y 50 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'),
  body('direccion')
    .isLength({ min: 5, max: 50 }).withMessage('La dirección debe tener entre 5 y 50 caracteres'),
  body('ciudad')
    .notEmpty().withMessage('La ciudad es obligatoria')
    .isLength({ max: 20 }).withMessage('La ciudad no debe exceder los 20 caracteres'),
  body('provincia')
    .notEmpty().withMessage('La provincia es obligatoria')
    .isLength({ max: 20 }).withMessage('La provincia no debe exceder los 20 caracteres'),
];