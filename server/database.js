import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the absolute path to the current file using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a function to open the SQLite database connection
const openDb = async () => {
  // Get the absolute path to the analysis.db file in the same directory as database.js
  const dbPath = join(__dirname, 'analysis.db');  // Corrected the path

  // Open the database connection to the analysis.db file
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
};

// Initialize the database (create table if it doesn't exist)
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
