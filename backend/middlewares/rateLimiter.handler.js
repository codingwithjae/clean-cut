const { rateLimit } = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowsMs: 5 * 60 * 1000, // Ventana de tiempo que permite el rateLimit las ejecuciones
  limit: 1000, // La cantidad de solicitudes
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many request  in a short time, please try again in a few minutes!'
});

module.exports = { rateLimiter };
