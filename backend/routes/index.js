const express = require('express');
const shortenRouter = require('./shorten.router.js');
const userLinksRouter = require('./userLinks.router.js');
const loggingRouter = require('./login.router.js');
const registrationRouter = require('./register.router.js');
const { urlValidator, shortIdValidator, userIdValidator, validateShortIdUpdate } = require('../middlewares/shorten.handler.js');
const { loginValidation, jwtHandler, registrationValidation } = require('../middlewares/auth.handler.js');
const { publicUrlGenerator, redirectUrl, deleteShortenedUrl, updateUrlId, privateUrlGenerator, getUserLinks } = require('../controllers/shorten.controller.js');
const { registrationHandler, loginHandler } = require('../controllers/auth.controller.js');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // General routes
  router.get('/my-links', jwtHandler, getUserLinks);
  router.patch('/update/:shortId', jwtHandler, userIdValidator, validateShortIdUpdate, updateUrlId);
  router.delete('/delete/:shortId', jwtHandler, shortIdValidator, userIdValidator, deleteShortenedUrl);

  // General endpoints
  router.use('/shorten', shortenRouter);
  router.use('/my-links', userLinksRouter);
  router.use('/register', registrationRouter);
  router.use('/login', loginValidation, loggingRouter);

  // POST paths
  router.post('/register', registrationValidation, registrationHandler);
  router.post('/login', loginHandler);
  router.post('/public/shorten', urlValidator, publicUrlGenerator);
  router.post('/shorten', jwtHandler, urlValidator, privateUrlGenerator);

  // General route for redirection
  router.get('/:shortId', redirectUrl);
  app.get('/:shortId', redirectUrl);
}

module.exports = routerApi;
