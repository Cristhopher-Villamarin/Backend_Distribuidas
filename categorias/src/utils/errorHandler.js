module.exports = (err, req, res, next) => {
  console.error(err);

  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  // Manejo de errores específicos para el microservicio de categorías
  if (err.message === 'Categoría no encontrada') {
    status = 400;
    message = 'La categoría especificada no existe.';
  } else if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = err.errors.map(e => e.message).join(', ');
  } else if (err.name === 'SequelizeDatabaseError') {
    status = 500;
    message = 'Ocurrió un error en la base de datos. Intente de nuevo más tarde.';
  } else if (err.name === 'JsonWebTokenError' || err.message === 'jwt malformed') {
    status = 401;
    message = 'Token de autenticación inválido o mal formado.';
  } else if (err.message.includes('Unauthorized')) {
    status = 403;
    message = 'No tienes permiso para realizar esta acción.';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    if (err.errors[0].path === 'nombre') {
      status = 400;
      message = 'Ya existe una categoría con el nombre especificado. Por favor, elige un nombre diferente.';
    }
  }

  res.status(status).json({ error: message });
};