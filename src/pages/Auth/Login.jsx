// src/pages/Auth/Login.jsx
import { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Google } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/student/dashboard';
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmail(email, password);
      // Update AuthContext with the user
      if (result.user) {
        setUser(result.user);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      // Update AuthContext with the user
      if (result.user) {
        setUser(result.user);
      }
      // Navigate to intended destination after successful sign-in
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A24 0%, #0E0E14 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'rgba(30, 30, 37, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to Bhortijuddho
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleEmailLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#4F9CFF' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#4F9CFF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                  color: 'white',
                  fontWeight: 'bold',
                  py: 1.5,
                  mb: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E63FB8, #3D84E5)',
                  }
                }}
              >
                Sign In
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{
                borderColor: '#4F9CFF',
                color: '#4F9CFF',
                py: 1.5,
                '&:hover': {
                  borderColor: '#3D84E5',
                  background: 'rgba(79, 156, 255, 0.1)'
                }
              }}
            >
              Sign in with Google
            </Button>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  size="small"
                  onClick={() => navigate('/auth/signup')}
                  sx={{
                    color: '#FF4FD2',
                    textTransform: 'none',
                    '&:hover': { background: 'rgba(255, 79, 210, 0.1)' }
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
