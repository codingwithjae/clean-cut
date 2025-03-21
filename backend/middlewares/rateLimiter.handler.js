const { rateLimit } = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  limit: 100, // 100 request per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many request in a short time, please try again in a few minutes!'
});

module.exports = { rateLimiter };
