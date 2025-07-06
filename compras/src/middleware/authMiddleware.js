const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Por favor, inicia sesión para realizar compras.' });
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Tu sesión ha expirado o es inválida. Inicia sesión nuevamente.' });
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;