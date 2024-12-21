const jwt = require('jsonwebtoken')
const { authSchema } = require('../schemas/joi.schemas')
const { checkingUsername } = require('../models/user.model.js')

const loginValidation = (req, res, next) => {
  const { error } = authSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: errorMessage
    })
  }

  const userExist = checkingUsername(req.body.email)
  if (!userExist) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Email does not exist, you must register first'
    })
  }

  next()
}

const registrationValidation = (req, res, next) => {
  const { error } = authSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: errorMessage
    })
  }

  const userExist = checkingUsername(req.body.email)
  if (userExist) {
    return res.status(409).json({
      statusCode: 409,
      error: 'Conflict',
      message: 'Email already exists'
    })
  }

  next()
}

const jwtHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'No token provided'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  }
}

module.exports = {
  loginValidation,
  jwtHandler,
  registrationValidation
}
