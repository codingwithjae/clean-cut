const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
const { tokenGeneration } = require('../utils/jwtConfig.js');
const { saveUserCredentials, gettingUserCredentials } = require('../models/user.model.js');

async function registrationHandler(req, res) {
  const { username, password } = req.body;

  const apiKey = uuidv4();
  const passwordHash = await argon2.hash(password);

  try {
    await saveUserCredentials(username, passwordHash, apiKey);
    res.status(201).json({
      message: 'User registered successfully',
      apiKey: `your registration key is: ${apiKey}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed, please try again' });
  }
}

async function loginHandler(req, res) {
  const { username, password } = req.body;
  const credentials = await gettingUserCredentials(username);

  try {
    if (await argon2.verify(credentials.password, password)) {
      const token = await tokenGeneration({
        id: credentials.id,
        username: credentials.username
      });
      res.status(200).json({
        message: `Welcome ${username}, your log in was successful`,
        accessToken: token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { registrationHandler, loginHandler };
