// src/utils/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: 'Error en el servidor',
    message: err.message || 'Ocurrió un error inesperado en el servidor.',
    path: req.originalUrl,
    method: req.method,
    status: statusCode
  });

};
