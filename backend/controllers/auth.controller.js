const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
const { tokenGeneration } = require('../utils/jwtConfig.js');
const { saveUserCredentials, gettingUserCredentials } = require('../models/user.model.js');

async function registrationHandler(req, res) {
  const { email, password } = req.body;

  const apiKey = uuidv4();
  const passwordHash = await argon2.hash(password);

  try {
    await saveUserCredentials(email, passwordHash, apiKey);
    res.status(201).json({
      statusCode: 201,
      message: 'Registration successful, now you can login',
      apiKey: `Your registration key is: ${apiKey}`
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Registration failed, please try again'
    });
  }
}

async function loginHandler(req, res) {
  const { email, password } = req.body;
  const credentials = await gettingUserCredentials(email);

  try {
    if (await argon2.verify(credentials.password, password)) {
      const token = await tokenGeneration({
        id: credentials.id,
        username: credentials.username
      });
      res.status(200).json({
        statusCode: 200,
        message: `Welcome ${email}, your login was successful`,
        accessToken: token
      });
    } else {
      res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An error occurred during login'
    });
  }
}

module.exports = { registrationHandler, loginHandler };
