const db = require('../database/database.js');

async function saveUrl(originalUrl, shortId, userId) {
  const savingUrl = db.prepare('INSERT INTO urls (originalUrl, shortId, userId) VALUES (?, ?, ?)');
  savingUrl.run(originalUrl, shortId, userId);
}

async function getUrl(shortId) {
  const gettingUrl = db.prepare('SELECT originalUrl FROM urls WHERE shortId = ?');
  return gettingUrl.get(shortId);
}

async function getUserIdByShortId(shortId) {
  const gettingUserId = db.prepare('SELECT userId FROM urls WHERE shortId = ?');
  return gettingUserId.get(shortId);
}

async function checkingId(shortId) {
  const findingId = db.prepare('SELECT 1 FROM urls WHERE shortId = ?');
  const result = findingId.get(shortId);
  return !!result;
}

async function updateShortId(shortId, newShortId) {
  const updatingShortId = db.prepare('UPDATE urls SET shortId = ? WHERE shortId = ?');
  return updatingShortId.run(newShortId, shortId);
}

function deleteUrl(shortId) {
  const deletingUrl = db.prepare('DELETE FROM urls WHERE shortId = ?');
  return deletingUrl.run(shortId);
}

module.exports = { saveUrl, getUrl, deleteUrl, checkingId, updateShortId, getUserIdByShortId };
