import React, { useState, useEffect, forwardRef } from 'react';
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
  Fade,
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
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface AnalysisResult {
  id: number;
  postId: string;
  date: string;
  overallScore: number;
  overallSentiment: string;
  topPositiveWords?: string[];
  topNegativeWords?: string[];
  scoreMagnitude?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>((props, ref) => {
  const { children, value, index, ...other } = props;

  return (
    <div ref={ref} role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
});

TabPanel.displayName = 'TabPanel'; // Adding a display name for debugging purposes


export const Admin = () => {
  const [value, setValue] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [topPosts, setTopPosts] = useState<AnalysisResult[]>([]);
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
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    } else {
      fetchAnalysisHistory();
      fetchTopPosts();
    }
  }, [isAuthenticated, navigate]);

  const fetchAnalysisHistory = async () => {
    try {
      const response = await axios.get<AnalysisResult[]>('/api/getResults');
      setAnalysisHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching analysis history:', error);
      setAnalysisHistory([]);
    }
  };

  const fetchTopPosts = async () => {
    try {
      const response = await axios.get<AnalysisResult[]>('/api/getTopPosts');
      setTopPosts(response.data);
    } catch (error) {
      console.error('Error fetching top posts:', error);
    }
  };

  useEffect(() => {
    fetchAnalysisHistory();
    fetchTopPosts();
  }, []);

  const handleNewPostSubmission = async () => {
    const newResult: AnalysisResult = {
      id: 0,
      postId: newPostId,
      date: new Date().toISOString(),
      overallScore: newOverallScore,
      overallSentiment: newOverallSentiment,
      topPositiveWords: [],
      topNegativeWords: [],
      scoreMagnitude: 0,
    };

    try {
      const response = await axios.post('/api/saveResult', newResult);
      setAnalysisHistory((prevHistory) => [...prevHistory, response.data as AnalysisResult]);
      setNewPostId('');
      setNewOverallScore(0);
      setNewOverallSentiment('');
      fetchTopPosts();
    } catch (error) {
      console.error('Error submitting new post:', error);
    }
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleNewPostSubmission();
    console.log(handleSubmit);
  };
  
  const handleDeletePost = async (id: number) => {
    try {
      await axios.delete(`/api/deletePost/${id}`);
      setAnalysisHistory((prev) => prev.filter((post) => post.id !== id));
      setTopPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteAllPosts = async () => {
    try {
      await axios.delete('/api/deleteAllPosts');
      setAnalysisHistory([]);
      setTopPosts([]);
    } catch (error) {
      console.error('Error deleting all posts:', error);
    }
  };

  const getWeeklyScoreSums = () => {
    const weekScores: { [key: string]: number } = {};
    analysisHistory.forEach(result => {
      const date = new Date(result.date);
      const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      weekScores[weekKey] = (weekScores[weekKey] || 0) + result.overallScore;
    });
    return {
      labels: Object.keys(weekScores),
      data: Object.values(weekScores),
    };
  };

  const weeklyData = getWeeklyScoreSums();
  const chartData = {
    labels: weeklyData.labels,
    datasets: [{
      label: 'Total Overall Score per Week',
      data: weeklyData.data,
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      borderWidth: 1,
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Overall Score',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Score Analytics',
      },
    },
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Algorithm Info" />
          <Tab label="Post History" />
          <Tab label="Top Posts" />
          <Tab label="Analytics" />
        </Tabs>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ marginTop: 2, borderRadius: 2, float: 'right' }}
        >
          Logout
        </Button>
      </Paper>
      <Fade in={true} timeout={500}>
        <TabPanel value={value} index={0}>
          <Card sx={{ padding: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Algorithm Information</Typography>
              <Typography>Name: {algorithmInfo.name}</Typography>
              <Typography>Description: </Typography>
              <Typography>Accuracy: {algorithmInfo.accuracy}</Typography>
              <Typography>Precision: {algorithmInfo.precision}</Typography>
              <Typography>Recall: {algorithmInfo.recall}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Formula:</Typography>
              <Typography sx={{ fontFamily: 'monospace' }}>{algorithmInfo.formula}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Description:</Typography>
              <Typography>
                The sentiment analysis algorithm used in this system is based on a scoring system derived from the feedback data. Each piece of feedback is assigned a score:
              </Typography>
              <Typography>- <strong>Positive feedback</strong> is assigned a <strong>positive score</strong>.</Typography>
              <Typography>- <strong>Negative feedback</strong> is assigned a <strong>negative score</strong>.</Typography>
              <Typography>- <strong>Neutral feedback</strong> receives a score of <strong>zero</strong>.</Typography>
              <Typography>
                The algorithm computes an overall sentiment score by summing the individual feedback scores. If the feedback is positive, the score is added to the total, and if it’s negative, the score is subtracted. This basic scoring mechanism provides an overall sentiment representation for the entire set of feedback, where a higher positive total indicates generally positive sentiment, a negative total indicates negative sentiment, and a zero total suggests a neutral stance.
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Why This Works:</Typography>
              <Typography>
                This approach focuses on evaluating the overall sentiment of the feedback by aggregating the sentiment scores of individual entries. It is a simple and effective method for determining sentiment based on predefined scores.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>
      </Fade>
      <TabPanel value={value} index={1}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAllPosts}
          sx={{ marginTop: 2, borderRadius: 2 }}
        >
          Delete All Posts
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Post ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Overall Score</TableCell>
                <TableCell>Overall Sentiment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analysisHistory.map((result) => (
                <TableRow key={result.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{result.postId}</TableCell>
                  <TableCell>{new Date(result.date).toLocaleString()}</TableCell>
                  <TableCell>{result.overallScore}</TableCell>
                  <TableCell>{result.overallSentiment}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletePost(result.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
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
                <TableCell>Post ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Sentiment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topPosts.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.postId}</TableCell>
                  <TableCell>{new Date(result.date).toLocaleString()}</TableCell>
                  <TableCell>{result.overallScore}</TableCell>
                  <TableCell>{result.overallSentiment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Line data={chartData} options={options} />
      </TabPanel>
    </Box>
  );
};


// Helper function to get week number from a date
const getWeekNumber = (date: Date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.valueOf() - startDate.valueOf()) / 86400000);
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

export default Admin;
