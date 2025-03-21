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
  newShortId: Joi.string().min(1).max(5).required().messages({
    'string.min': 'New Short ID is required',
    'string.max': 'New Short ID must not exceed 5 characters',
    'any.required': 'New Short ID is required'
  })
})

const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format. Please enter a valid email address',
    'string.empty': 'Email field cannot be empty',
    'any.required': 'Email field is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.empty': 'Password field cannot be empty',
    'any.required': 'Password field is required'
  })
})

module.exports = {
  urlSchema,
  shortIdSchema,
  updateShortIdSchema,
  authSchema
} 