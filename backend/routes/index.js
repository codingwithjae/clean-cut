const express = require("express");
const shortenRouter = require("./shorten.router");
const dashboardRouter = require("./dashboard.router");
const loggingRouter = require("./login.router");
const registrationRouter = require("./register.router");
const {
  urlValidator,
  shortIdValidator,
  userIdValidator,
} = require("../middlewares/shorten.handler.js");
const {
  loginValidation,
  jwtHandler,
  registrationValidation,
} = require("../middlewares/auth.handler.js");
const {
  publicUrlGenerator,
  redirectUrl,
  deleteShortenedUrl,
  updateUrlId,
  privateUrlGenerator,
} = require("../controllers/shorten.controller.js");
const {
  registrationHandler,
  loginHandler,
} = require("../controllers/auth.controller.js");

function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/shorten", shortenRouter);
  router.use("/dashboard", dashboardRouter);
  router.use("/register", registrationRouter);
  router.post("/register", registrationValidation, registrationHandler);
  router.use("/login", loginValidation, loggingRouter);
  router.post("/login", loginHandler);
  router.post("/public/shorten", urlValidator, publicUrlGenerator);
  router.post("/shorten", jwtHandler, urlValidator, privateUrlGenerator);
  router.get("/:shortId", redirectUrl);
  router.patch("/update/:shortId", jwtHandler, userIdValidator, shortIdValidator, updateUrlId);
  router.delete("/delete", jwtHandler, userIdValidator, shortIdValidator, deleteShortenedUrl);

  app.get("/:shortId", redirectUrl);
}

module.exports = routerApi;
