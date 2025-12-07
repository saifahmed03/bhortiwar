// src/pages/Auth/GoogleRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const GoogleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles the OAuth callback
    // Just redirect to dashboard after a brief moment
    const timer = setTimeout(() => {
      navigate('/student/dashboard');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A24 0%, #0E0E14 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}
    >
      <CircularProgress size={60} sx={{ color: '#4F9CFF' }} />
      <Typography
        variant="h5"
        sx={{
          background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Signing you in...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we complete your authentication
      </Typography>
    </Box>
  );
};

export default GoogleRedirect;
