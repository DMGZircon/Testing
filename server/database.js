// server/database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Path to database file (it will create this file if it doesn't exist)
const dbPath = path.resolve('analysis.db');

// Function to open the database connection
const openDb = async () => {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};

// Create table if it does not exist
const initDb = async () => {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS analysis_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId TEXT,
      date TEXT,
      overallScore REAL,
      overallSentiment TEXT
    )
  `);
  await db.close();
};

// Initialize the database
initDb().catch(console.error);

export { openDb }; // Export the openDb function for use in other files
