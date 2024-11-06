// server/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { openDb } from './database.js'; // Import the openDb function

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint to save analysis results
app.post('/api/saveResult', async (req, res) => {
  const { postId, date, overallScore, overallSentiment } = req.body;

  try {
    const db = await openDb();
    await db.run(
      `INSERT INTO analysis_results (postId, date, overallScore, overallSentiment) VALUES (?, ?, ?, ?)`,
      [postId, date, overallScore, overallSentiment]
    );
    res.status(200).send('Analysis result saved successfully');
    await db.close();
  } catch (error) {
    console.error('Error saving analysis result:', error.message);
    res.status(500).send('Error saving analysis result');
  }
});

// Endpoint to retrieve all analysis results
app.get('/api/getResults', async (req, res) => {
  try {
    const db = await openDb();
    const results = await db.all(`SELECT * FROM analysis_results`);
    res.status(200).json(results);
    await db.close();
  } catch (error) {
    console.error('Error retrieving results:', error.message);
    res.status(500).send('Error retrieving results');
  }
});

// New endpoint to get top posts
app.get('/api/getTopPosts', async (req, res) => {
  try {
    const db = await openDb();
    // Modify the query to fit your logic for determining "top posts"
    const topPosts = await db.all(`
      SELECT postId, date, overallScore, overallSentiment 
      FROM analysis_results 
      ORDER BY overallScore DESC 
      LIMIT 10
    `);
    res.status(200).json(topPosts);
    await db.close();
  } catch (error) {
    console.error('Error fetching top posts:', error.message);
    res.status(500).send('Error fetching top posts');
  }
});

// Endpoint to delete a specific post
app.delete('/api/deletePost/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await openDb();
    const result = await db.run(`DELETE FROM analysis_results WHERE id = ?`, [id]);
    if (result.changes === 1) {
      res.status(200).send(`Post with ID ${id} deleted successfully`);
    } else {
      res.status(404).send(`Post with ID ${id} not found`);
    }
    await db.close();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Internal server error');
  }
});

// Endpoint to delete all posts
app.delete('/api/deleteAllPosts', async (req, res) => {
  try {
    const db = await openDb();
    await db.run(`DELETE FROM analysis_results`);
    res.status(200).send('All posts deleted successfully');
    await db.close();
  } catch (error) {
    console.error('Error deleting all posts:', error.message);
    res.status(500).send('Error deleting all posts');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
