const db = require('../database/database.js');

function saveUrl(originalUrl, shortId, userId) {
  const savingUrl = db.prepare('INSERT INTO urls (originalUrl, shortId, userId) VALUES (?, ?, ?)');
  savingUrl.run(originalUrl, shortId, userId);
}

function getUrl(shortId) {
  const gettingUrl = db.prepare('SELECT * FROM urls WHERE shortId = ?');
  return gettingUrl.get(shortId);
}

function getUserIdByShortId(shortId) {
  const gettingUserId = db.prepare('SELECT userId FROM urls WHERE shortId = ?');
  return gettingUserId.get(shortId);
}

function checkingId(shortId) {
  const findingId = db.prepare('SELECT 1 FROM urls WHERE shortId = ?');
  const result = findingId.get(shortId);
  return !!result;
}

function updateShortId(shortId, newShortId) {
  const updatingShortId = db.prepare('UPDATE urls SET shortId = ? WHERE shortId = ?');
  return updatingShortId.run(newShortId, shortId);
}

function incrementClicks(shortId) {
  const clickCounter = db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE shortId = ?');
  return clickCounter.run(shortId);
}

function deleteUrl(shortId) {
  const deletingUrl = db.prepare('DELETE FROM urls WHERE shortId = ?');
  return deletingUrl.run(shortId);
}

module.exports = { saveUrl, getUrl, deleteUrl, checkingId, updateShortId, getUserIdByShortId, incrementClicks };
