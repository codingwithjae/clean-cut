const {
  checkingId,
  getUserIdByShortId,
} = require("../models/shorten.model.js");
const { urlSchema, shortIdSchema, updateShortIdSchema } = require('../schemas/joi.schemas');
const boom = require('@hapi/boom');

const urlValidator = (req, res, next) => {
  const { error } = urlSchema.validate(req.body);
  if (error) {
    next(boom.badRequest(error.details[0].message));
    return;
  }
  next();
};

const shortIdValidator = (req, res, next) => {
  const { error } = shortIdSchema.validate({ shortId: req.params.shortId });
  if (error) {
    next(boom.badRequest(error.details[0].message));
    return;
  }

  const shortIdExists = checkingId(req.params.shortId);
  if (!shortIdExists) {
    next(boom.notFound('The shortened link does not exist'));
    return;
  }

  next();
};

const userIdValidator = (req, res, next) => {
  if (!req.user || !req.user.id) {
    next(boom.unauthorized('User identification required'));
    return;
  }

  const shortId = req.params.shortId;
  const linkOwner = getUserIdByShortId(shortId);

  if (!linkOwner) {
    next(boom.notFound('The shortened link does not exist'));
    return;
  }

  if (linkOwner.userId !== req.user.id) {
    next(boom.forbidden('You do not have permission to modify this link'));
    return;
  }

  next();
};

const validateShortIdUpdate = (req, res, next) => {
  const { error } = updateShortIdSchema.validate(req.body);
  if (error) {
    next(boom.badRequest(error.details[0].message));
    return;
  }

  const { newShortId } = req.body;

  if (newShortId.length > 5) {
    next(boom.badRequest('The new shortId must not exceed 5 characters'));
    return;
  }

  const shortIdExists = checkingId(newShortId);

  if (shortIdExists) {
    next(boom.conflict('This short ID is already in use, please choose another one'));
    return;
  }

  next();
};

const validateNewShortId = (req, res, next) => {
  const shortId = req.body.shortId || req.shortId;

  if (!shortId) {
    return next();
  }

  const shortIdExists = checkingId(shortId);
  if (shortIdExists) {
    next(boom.conflict('This short ID is already in use, please choose another one'));
    return;
  }

  next();
};

module.exports = {
  urlValidator,
  shortIdValidator,
  userIdValidator,
  validateShortIdUpdate,
  validateNewShortId
};
