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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
