const jwt = require('jsonwebtoken')
const { authSchema } = require('../schemas/joi.schemas')
const { checkingUsername } = require('../models/user.model.js')
const boom = require('@hapi/boom')

const loginValidation = (req, res, next) => {
  const { error } = authSchema.validate(req.body, { abortEarly: true })

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    next(boom.badRequest(errorMessage))
    return
  }

  const userExist = checkingUsername(req.body.email)

  if (!userExist) {
    next(boom.unauthorized('Email does not exist, must register first'))
    return
  }

  next()
}

const registrationValidation = (req, res, next) => {
  const { error } = authSchema.validate(req.body, { abortEarly: true })

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    next(boom.badRequest(errorMessage))
    return
  }

  const userExist = checkingUsername(req.body.email)
  if (userExist) {
    next(boom.conflict('Email already in use'))
    return
  }

  next()
}

const jwtHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    next(boom.unauthorized('No token provided'))
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    next(boom.unauthorized('Invalid or expired token'))
    return
  }
}

module.exports = {
  loginValidation,
  jwtHandler,
  registrationValidation
}
