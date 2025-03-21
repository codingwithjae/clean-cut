const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
const { tokenGeneration } = require('../utils/jwtConfig.js');
const { saveUserCredentials, gettingUserCredentials } = require('../models/user.model.js');
const boom = require('@hapi/boom');

async function registrationHandler(req, res, next) {
  const { email, password } = req.body;

  const apiKey = uuidv4();
  try {
    const passwordHash = await argon2.hash(password);
    await saveUserCredentials(email, passwordHash, apiKey);
    
    res.status(201).json({
      message: 'Registration successful, now you can login',
      apiKey: `Your registration key is: ${apiKey}`
    });
  } catch (error) {
    next(boom.badImplementation('Registration failed, please try again', error));
  }
}

async function loginHandler(req, res, next) {
  const { email, password } = req.body;
  
  try {
    const credentials = await gettingUserCredentials(email);
    
    if (!credentials) {
      return next(boom.unauthorized('User not found'));
    }
    
    if (await argon2.verify(credentials.password, password)) {
      const token = await tokenGeneration({
        id: credentials.id,
        username: credentials.username
      });
      
      res.status(200).json({
        message: `Welcome ${email}, your login was successful`,
        accessToken: token
      });
    } else {
      next(boom.unauthorized('Invalid credentials'));
    }
  } catch (error) {
    console.error('Error during login:', error);
    next(boom.badImplementation('An error occurred during login', error));
  }
}

module.exports = { registrationHandler, loginHandler };
