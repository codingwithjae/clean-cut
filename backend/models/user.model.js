const db = require('../database/database.js');

function saveUserCredentials(email, password, apiKey) {
  const savingCredentials = db.prepare('INSERT INTO users (email, password, apiKey) VALUES (?, ?, ?)');
  savingCredentials.run(email, password, apiKey);
}

function checkingUsername(email) {
  const checkingUsername = db.prepare('SELECT 1 FROM users WHERE email = ?');
  const result = checkingUsername.get(email);
  return !!result;
}

function getUrlsByUserId(userId) {
  const gettingLinks = db.prepare('SELECT * FROM urls WHERE userId = ?');
  return gettingLinks.all(userId);
}

function gettingUserCredentials(email) {
  const gettingCredentials = db.prepare('SELECT * FROM users WHERE email = ?');
  return gettingCredentials.get(email);
}

module.exports = {
  saveUserCredentials,
  gettingUserCredentials,
  checkingUsername,
  getUrlsByUserId
};
