const roleMiddleware = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para gestionar compras. Contacta a un administrador.' });
  }
  next();
};

module.exports = roleMiddleware;