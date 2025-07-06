const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuario');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Mejora: mensaje especial si el token expiró
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado, por favor inicia sesión de nuevo' });
      }
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;