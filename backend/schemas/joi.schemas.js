const Joi = require('@hapi/joi')

const urlSchema = Joi.object({
  originalUrl: Joi.string().uri().required().messages({
    'string.uri': 'Please provide a valid URL',
    'any.required': 'URL is required'
  })
})

const shortIdSchema = Joi.object({
  shortId: Joi.string().required().messages({
    'any.required': 'Short ID is required'
  })
})

const updateShortIdSchema = Joi.object({
  newShortId: Joi.string().required().messages({
    'any.required': 'New Short ID is required'
  })
})

const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
})

module.exports = {
  urlSchema,
  shortIdSchema,
  updateShortIdSchema,
  authSchema
} 