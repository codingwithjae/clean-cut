const boom = require('@hapi/boom');

function notFound(req, res) {
  const { output } = boom.notFound('Endpoint not found');
  res.status(output.statusCode).json(output.payload);
}

function errorHandler(err, req, res, next) {

  if (err.isBoom) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }

  const { output } = boom.badImplementation('Internal server error');
  return res.status(output.statusCode).json(output.payload);

}

module.exports = {
  notFound,
  errorHandler
}; 