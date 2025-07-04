const express = require('express');
const { registrar, login } = require('../controllers/usuarioController');
const { usuarioValidationRules } = require('../utils/validations');
const { validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', usuarioValidationRules(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, registrar);

router.post('/login', login);

// Ejemplo de ruta protegida solo para admin:
router.get('/admin', auth, role('admin'), (req, res) => res.json({ msg: 'Solo admin' }));

module.exports = router;