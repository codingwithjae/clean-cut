require('dotenv').config();
const express = require('express');
const routerApi = require('./routes/index.js');
const { rateLimiter } = require('./middlewares/rateLimiter.handler.js');
const { requestLogger } = require('./middlewares/request.logger.js');
const { notFound } = require('./middlewares/errors.handler.js');
const cors = require('cors');
// const morgan = require('morgan');

const app = express();
const port = 4000;

// PENDIENTE: MEJORAR EL MANEJO DE ERRORES CON BOOM
// PENDIENTE: MEJORAR EL ESQUEMA DE DATOS CON HAPI
// PENDIENTE: CONECTAR EL FRONTEND

// app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

routerApi(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.use(notFound);
