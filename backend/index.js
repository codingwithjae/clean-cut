require('dotenv').config();
const express = require('express');
const routerApi = require('./routes/index.js');
const { rateLimiter } = require('./middlewares/rateLimiter.handler.js');
const { requestLogger } = require('./middlewares/request.logger.js');
const { notFound, errorHandler } = require('./middlewares/errors.handler.js');
const cacheMiddleware = require('./middlewares/cache.handler.js');
const cors = require('cors');

const app = express();
const port = 4000;

const allowedOrigins = [
  'https://cleancut.codingwithjae.dev',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log para depuración de CORS
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);


app.use(cacheMiddleware(300));

routerApi(app);

// Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

