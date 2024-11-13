import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { openDb } from './database.js'; // Import the openDb function

const app = express();
const PORT = process.env.PORT || 3002; // Use environment variable for PORT

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'https://sentitracker.com' }));

// Endpoint to save analysis results
app.post('/api/saveResult', async (req, res) => {
  const { postId, date, overallScore, overallSentiment } = req.body;

  let db;
  try {
    db = await openDb(); // Open the database connection from database.js
    await db.run(
      `INSERT INTO analysis_results (postId, date, overallScore, overallSentiment) VALUES (?, ?, ?, ?)`,
      [postId, date, overallScore, overallSentiment]
    );
    res.status(200).send('Analysis result saved successfully');
  } catch (error) {
    console.error('Error saving analysis result:', error.message);
    res.status(500).send('Error saving analysis result');
  } finally {
    if (db) db.close(); // Close the DB connection
  }
});

// Endpoint to retrieve all analysis results
app.get('/api/getResults', async (req, res) => {
  let db;
  try {
    db = await openDb(); // Open the database connection from database.js
    const results = await db.all(`SELECT * FROM analysis_results`); // Fetch results from the DB
    res.status(200).json(results);
  } catch (error) {
    console.error('Error retrieving results:', error.message);
    res.status(500).send('Error retrieving results');
  } finally {
    if (db) db.close(); // Close the DB connection
  }
});

// Endpoint to get top posts
app.get('/api/getTopPosts', async (req, res) => {
  let db;
  try {
    db = await openDb(); // Open the database connection from database.js
    const topPosts = await db.all(`
      SELECT postId, date, overallScore, overallSentiment 
      FROM analysis_results 
      ORDER BY overallScore DESC 
      LIMIT 10
    `); // Fetch top posts based on overallScore
    res.status(200).json(topPosts);
  } catch (error) {
    console.error('Error fetching top posts:', error.message);
    res.status(500).send('Error fetching top posts');
  } finally {
    if (db) db.close(); // Close the DB connection
  }
});

// Endpoint to delete a specific post
app.delete('/api/deletePost/:id', async (req, res) => {
  const { id } = req.params;
  let db;
  try {
    db = await openDb(); // Open the database connection from database.js
    const result = await db.run(`DELETE FROM analysis_results WHERE id = ?`, [id]);
    if (result.changes === 1) { // Check if the post was deleted
      res.status(200).send(`Post with ID ${id} deleted successfully`);
    } else {
      res.status(404).send(`Post with ID ${id} not found`);
    }
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).send('Internal server error');
  } finally {
    if (db) db.close(); // Close the DB connection
  }
});

// Endpoint to delete all posts
app.delete('/api/deleteAllPosts', async (req, res) => {
  let db;
  try {
    db = await openDb(); // Open the database connection from database.js
    await db.run(`DELETE FROM analysis_results`); // Delete all posts
    res.status(200).send('All posts deleted successfully');
  } catch (error) {
    console.error('Error deleting all posts:', error.message);
    res.status(500).send('Error deleting all posts');
  } finally {
    if (db) db.close(); // Close the DB connection
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port', PORT);
});
