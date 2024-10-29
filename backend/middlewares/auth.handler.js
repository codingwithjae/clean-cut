const { checkingUsername } = require('../models/user.model.js');
const { decodeToken } = require('../utils/jwtConfig.js');

function registrationValidation(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const userExist = checkingUsername(email);

  if (userExist) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  next();
}

function loginValidation(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const userExist = checkingUsername(email);

  if (!userExist) {
    return res.status(401).json({ message: 'Email does not exist, you must register first' });
  }

  next();
}

async function jwtHandler(req, res, next) {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).json({
      message: 'Access denied. No token provided'
    });
  }

  const token = header.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access denied. No token provided'
    });
  }

  try {
    const decoded = await decodeToken(token);
    req.user = decoded;
    console.log('Decoded user:', req.user);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Authentication token not valid' });
  }
}

module.exports = { loginValidation, registrationValidation, jwtHandler };
