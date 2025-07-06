module.exports = (err, req, res, next) => {
  console.error('🔴 Error:', err);

  // Valores por defecto
  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  // Manejo de errores específicos personalizados
  if (err.message === 'Localidad no encontrada') {
    status = 400;
    message = 'Ya existe una localidad con el nombre especificado. Por favor, elige un nombre diferente.';
  }

  // Puedes añadir más errores específicos aquí:
  // if (err.message === 'Asiento duplicado') { ... }

  res.status(status).json({
    error: err.name || 'Error',
    message,
    path: req.originalUrl,
    method: req.method,
    status
  });
};
