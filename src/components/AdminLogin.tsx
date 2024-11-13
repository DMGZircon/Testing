import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Alert, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      login(username, password);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #d9d9d9, #bfbfbf)', // Gray gradient
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
            Admin Login
          </Typography>
          
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                marginBottom: 2,
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                marginBottom: 2,
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              }}
            />
            
            {error && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                padding: '12px',
                backgroundColor: '#3f51b5',
                color: '#fff',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};
