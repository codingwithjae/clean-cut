const db = require('../database/database.js');

function saveUserCredentials(username, password, apiKey) {
  const savingCredentials = db.prepare('INSERT INTO users (username, password, apiKey) VALUES (?, ?, ?)');
  savingCredentials.run(username, password, apiKey);
}

function checkingUsername(username) {
  const checkingUsername = db.prepare('SELECT 1 FROM users WHERE username = ?');
  const result = checkingUsername.get(username);
  return !!result;
}

function getUrlsByUserId(userId) {
  const gettingLinks = db.prepare('SELECT * FROM urls WHERE userId = ?');
  return gettingLinks.all(userId);
}

function gettingUserCredentials(username) {
  const gettingCredentials = db.prepare('SELECT * FROM users WHERE username = ?');
  return gettingCredentials.get(username);
}

module.exports = {
  saveUserCredentials,
  gettingUserCredentials,
  checkingUsername,
  getUrlsByUserId
};
