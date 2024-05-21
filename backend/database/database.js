const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'database.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    apiKey TEXT UNIQUE NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    originalUrl TEXT NOT NULL,
    shortId TEXT NOT NULL,
    userId INTEGER,
    clicks INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

console.log('Database connected');

module.exports = db;
