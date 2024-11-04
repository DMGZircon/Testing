import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Button,
  TextField,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { AnalysisResult } from '../types/AnalysisResult';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Admin = () => {
  const [value, setValue] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [algorithmInfo] = useState({
    name: 'Sentiment Analysis Algorithm',
    accuracy: '85%',
    precision: '82%',
    recall: '88%',
    formula: 'sentiment = analyze(text)',
  });
  const [newPostId, setNewPostId] = useState('');
  const [newOverallScore, setNewOverallScore] = useState<number>(0);
  const [newOverallSentiment, setNewOverallSentiment] = useState('');
  const navigate = useNavigate();

  // Fetch analysis history on component mount
  useEffect(() => {
    const fetchAnalysisHistory = async () => {
      try {
        const response = await axios.get<AnalysisResult[]>('/api/getResults');
        console.log('Fetched analysis history:', response.data); // Debugging line
        if (Array.isArray(response.data)) {
          setAnalysisHistory(response.data);
        } else {
          console.error('Expected an array, but got:', response.data);
          setAnalysisHistory([]); // Set to empty array if the data isn't as expected
        }
      } catch (error) {
        console.error('Error fetching analysis history:', error);
        setAnalysisHistory([]); // Fallback to empty array on error
      }
    };
    fetchAnalysisHistory();
  }, []);

  // Handle new post submission
  const handleNewPostSubmission = async () => {
    const newResult: AnalysisResult = {
      postId: newPostId,
      date: new Date().toISOString(),
      overallScore: newOverallScore,
      overallSentiment: newOverallSentiment,
      topPositiveWords: [], // Default value for top positive words
      topNegativeWords: [], // Default value for top negative words
      scoreMagnitude: 0,    // Default value for score magnitude
    };

    try {
      await axios.post('/api/saveResult', newResult); // Post to the saveResult endpoint
      setAnalysisHistory((prevHistory) => [...prevHistory, newResult]); // Update state with the new result
      // Clear input fields after submission
      setNewPostId('');
      setNewOverallScore(0);
      setNewOverallSentiment('');
    } catch (error) {
      console.error('Error submitting new post:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleNewPostSubmission();
  };

  const getWeeklyPostCounts = () => {
    const weekCounts: { [key: string]: number } = {};

    analysisHistory.forEach(result => {
      const date = new Date(result.date);
      const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;
    });

    return {
      labels: Object.keys(weekCounts),
      data: Object.values(weekCounts),
    };
  };

  const weeklyData = getWeeklyPostCounts();
  const chartData = {
    labels: weeklyData.labels,
    datasets: [{
      label: 'Posts per Week',
      data: weeklyData.data,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    // Handle logout logic here (if needed)
    navigate('/'); // Redirect to homepage
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Algorithm Info" />
          <Tab label="Post History" />
          <Tab label="Top Posts" />
          <Tab label="Analytics" />
        </Tabs>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ marginTop: 2 }}
        >
          Logout
        </Button>
      </Paper>

      <TabPanel value={value} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6">Algorithm Information</Typography>
            <Typography>Name: {algorithmInfo.name}</Typography>
            <Typography>Accuracy: {algorithmInfo.accuracy}</Typography>
            <Typography>Precision: {algorithmInfo.precision}</Typography>
            <Typography>Recall: {algorithmInfo.recall}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Formula:</Typography>
            <Typography sx={{ fontFamily: 'monospace' }}>{algorithmInfo.formula}</Typography>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <form onSubmit={handleSubmit}>
          <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Add New Analysis Result</Typography>
            <TextField
              label="Post ID"
              value={newPostId}
              onChange={(e) => setNewPostId(e.target.value)}
              required
              sx={{ marginRight: 1 }}
            />
            <TextField
              label="Overall Score"
              type="number"
              value={newOverallScore}
              onChange={(e) => setNewOverallScore(Number(e.target.value))}
              required
              sx={{ marginRight: 1 }}
            />
            <TextField
              label="Overall Sentiment"
              value={newOverallSentiment}
              onChange={(e) => setNewOverallSentiment(e.target.value)}
              required
              sx={{ marginRight: 1 }}
            />
            <Button type="submit" variant="contained" color="primary">Submit New Result</Button>
          </Paper>
        </form>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Post ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Overall Score</TableCell>
                <TableCell>Sentiment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analysisHistory.map((result) => (
                <TableRow key={result.postId}>
                  <TableCell>{result.postId}</TableCell>
                  <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                  <TableCell>{result.overallScore}</TableCell>
                  <TableCell>{result.overallSentiment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Post ID</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analysisHistory
                .sort((a, b) => b.overallScore - a.overallScore)
                .slice(0, 10)
                .map((result, index) => (
                  <TableRow key={result.postId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result.postId}</TableCell>
                    <TableCell>{result.overallScore}</TableCell>
                    <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={value} index={3}>
       

        <Paper sx={{ p: 2 }}>
          <Line data={chartData} />
        </Paper>
      </TabPanel>
    </Box>
  );
};

// Helper function to get week number
function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
