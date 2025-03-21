function requestLogger(req, res, next) {
  if (req.method && req.originalUrl) {
    console.log(`[${new Date().toString()}] ${req.method} request to: ${req.originalUrl}`);
  }
  next();
}

module.exports = { requestLogger };
