const {
  checkingId,
  getUserIdByShortId,
} = require("../models/shorten.model.js");
const { urlSchema, shortIdSchema, updateShortIdSchema } = require('../schemas/joi.schemas')

const urlValidator = (req, res, next) => {
  const { error } = urlSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: error.details[0].message
    })
  }
  next()
}

const shortIdValidator = (req, res, next) => {
  const { error } = shortIdSchema.validate({ shortId: req.params.shortId })
  if (error) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: error.details[0].message
    })
  }
  next()
}

const userIdValidator = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'User ID is required'
    })
  }
  next()
}

const validateShortIdUpdate = (req, res, next) => {
  const { error } = updateShortIdSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: error.details[0].message
    })
  }
  next()
}

module.exports = {
  urlValidator,
  shortIdValidator,
  userIdValidator,
  validateShortIdUpdate
};
