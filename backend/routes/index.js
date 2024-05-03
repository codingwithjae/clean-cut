const express = require('express');
const shortenRouter = require('./shorten.router');
const userLinksRouter = require('./userLinks.router.js');
const loggingRouter = require('./login.router');
const registrationRouter = require('./register.router');
const { urlValidator, shortIdValidator, userIdValidator } = require('../middlewares/shorten.handler.js');
const { loginValidation, jwtHandler, registrationValidation } = require('../middlewares/auth.handler.js');
const { publicUrlGenerator, redirectUrl, deleteShortenedUrl, updateUrlId, privateUrlGenerator, getUserLinks } = require('../controllers/shorten.controller.js');
const { registrationHandler, loginHandler } = require('../controllers/auth.controller.js');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Define rutas específicas antes de las generales
  router.get('/my-links', jwtHandler, getUserLinks); // Ruta específica para obtener los enlaces del usuario
  router.patch('/update/:shortId', jwtHandler, userIdValidator, shortIdValidator, updateUrlId); // Ruta específica para actualizar
  router.delete('/delete/:shortId', jwtHandler, shortIdValidator, userIdValidator, deleteShortenedUrl);

  // Rutas generales
  router.use('/shorten', shortenRouter);
  router.use('/my-links', userLinksRouter);
  router.use('/register', registrationRouter);
  router.use('/login', loginValidation, loggingRouter);

  // Rutas POST
  router.post('/register', registrationValidation, registrationHandler);
  router.post('/login', loginHandler);
  router.post('/public/shorten', urlValidator, publicUrlGenerator);
  router.post('/shorten', jwtHandler, urlValidator, privateUrlGenerator);

  // Ruta general para redirección (debe ir al final)
  router.get('/:shortId', redirectUrl);

  // Ruta adicional para redirección (debe ir al final)
  app.get('/:shortId', redirectUrl);
}

module.exports = routerApi;
