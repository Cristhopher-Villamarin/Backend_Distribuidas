const errorHandler = (err, req, res, next) => {
  console.error('Error en compras:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Ha ocurrido un error al procesar tu compra. Intenta de nuevo o contacta al soporte.'
  });
};

module.exports = errorHandler;