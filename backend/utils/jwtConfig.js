const jwt = require("jsonwebtoken");
const JWT_PRIVATE_KEY = process.env.JWT_SECRET_KEY;

async function tokenGeneration(user) {
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_PRIVATE_KEY, { algorithm: 'HS256', expiresIn: "1h" });
  return token;
}

async function decodeToken(token) {
  return jwt.verify(token, JWT_PRIVATE_KEY);
}

module.exports = { tokenGeneration, decodeToken };