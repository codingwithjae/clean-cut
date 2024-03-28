require("dotenv").config();
const express = require("express");
const routerApi = require("./routes/index.js");
const { rateLimiter } = require("./middlewares/rateLimiter.handler.js");
const { requestLogger } = require("./middlewares/request.logger.js");
const { notFound } = require("./middlewares/errors.handler.js");

// LISTO: MIDDLEWARE O FUNCIÓN PARA VERIFICAR SI UNA URL ORIGINAL YA EXISTE EN LA BASE DE DATOS
// LISTO: MIDDLEWARE O FUNCIÓN PARA VERIFICAR SI UN SHORT ID YA EXISTE EN LA BASE DE DATOS ANTES DE BORRARLO
// LISTO: CREAR LA LÓGICA PARA MODIFICAR EL ID DE UNA URL ACORTADA
// LISTO: CREAR LA LÓGICA PARA MODIFICAR UNA URL ACORTADA EN LA BASE DE DATOS
// LISTO: CREAR UN MIDDELWARE QUE LIMITE EL NÚMERO DE SOLICITUDES EN TODA LA APP
// PENDIENTE: CREAR UN MIDDLEWARE DE AUNTENTIFICACIÓN PARA PROTEGER LAS RUTAS DE LA API
// PENDIENTE: CREAR UN MIDDLEWARE DE REDIRECCIÓN PARA VALIDAD LAS REDIRECCIONES DE URL

const app = express();
const port = 4000;

app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

routerApi(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.use(notFound);
