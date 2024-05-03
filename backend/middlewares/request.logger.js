// Este middleware verifica la solictiud y la url de la solicitud e imprime en consola la fecha,
// la url y el método de la solicitud

function requestLogger(req, res, next) {
  if (req.method && req.originalUrl) {
    console.log(`[${new Date().toString()}] ${req.method} request to: ${req.originalUrl}`);
  }
  next();
}

module.exports = { requestLogger };
