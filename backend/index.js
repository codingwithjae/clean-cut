require('dotenv').config();
const express = require('express');
const routerApi = require('./routes/index.js');
const { rateLimiter } = require('./middlewares/rateLimiter.handler.js');
const { requestLogger } = require('./middlewares/request.logger.js');
const { notFound, errorHandler } = require('./middlewares/errors.handler.js');
const cacheMiddleware = require('./middlewares/cache.handler.js');
const cors = require('cors');
// const morgan = require('morgan');

const app = express();
const port = 4000;

// PENDIENTE: MEJORAR EL ESQUEMA DE DATOS CON HAPI
// PENDIENTE: CONECTAR EL FRONTEND

// app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

// Configurar el middleware de caché para todas las rutas
// El parámetro 300 significa que la caché expirará después de 300 segundos (5 minutos)
app.use(cacheMiddleware(300));

routerApi(app);

// Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

