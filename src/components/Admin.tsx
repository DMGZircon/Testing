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
    formula: 'sentiment = analyze(text)'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load analysis history from localStorage
    const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    console.log('Loaded Analysis History:', history);
    setAnalysisHistory(history);
  }, []);

  // Calculate posts per week for the chart
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log(event);
    console.log(handleChange); 
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth'); // Clear authentication
    navigate('/'); // Redirect to homepage
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
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
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
} 