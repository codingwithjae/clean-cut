const { checkingUsername } = require("../models/user.model.js");
const { decodeToken } = require("../utils/jwtConfig.js");

async function registrationValidation(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userExist = checkingUsername(username);

  if (userExist) {
    return res.status(409).json({ message: "Username already exists" });
  }

  next();
}

async function loginValidation(req, res, next) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const userExist = checkingUsername(username);

  if (!userExist) {
    return res
      .status(401)
      .json({ message: "User does not exist, you must register first" });
  }

  next();
}

async function jwtHandler(req, res, next) {
  const header = req.header("Authorization");

  if (!header) {
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  try {
    const decoded = await decodeToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Authentication token not valid" });
  }
}

module.exports = { loginValidation, registrationValidation, jwtHandler };
