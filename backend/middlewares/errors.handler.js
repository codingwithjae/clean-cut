const boom = require('@hapi/boom');

function notFound(req, res) {
  const {
    output: { statusCode, payload }
  } = boom.notFound('The requested resource was not found');

  res.status(statusCode).json(payload);
}

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Manejo de errores de validación
  if (err.name === 'ValidationError') {
    const {
      output: { statusCode, payload }
    } = boom.badRequest(err.message);
    return res.status(statusCode).json(payload);
  }

  // Manejo de errores de duplicación
  if (err.code === 'ER_DUP_ENTRY') {
    const {
      output: { statusCode, payload }
    } = boom.conflict('Resource already exists');
    return res.status(statusCode).json(payload);
  }

  // Manejo de errores de autenticación
  if (err.name === 'JsonWebTokenError') {
    const {
      output: { statusCode, payload }
    } = boom.unauthorized('Invalid token');
    return res.status(statusCode).json(payload);
  }

  // Manejo de errores de Boom
  if (err.isBoom) {
    const { output: { statusCode, payload } } = err;
    return res.status(statusCode).json(payload);
  }

  // Manejo de errores de base de datos
  if (err.code === 'ECONNREFUSED') {
    const {
      output: { statusCode, payload }
    } = boom.badGateway('Database connection error');
    return res.status(statusCode).json(payload);
  }

  // Error por defecto
  const {
    output: { statusCode, payload }
  } = boom.badImplementation(err.message || 'Internal server error');

  res.status(statusCode).json(payload);
}

module.exports = {
  notFound,
  errorHandler
}; 