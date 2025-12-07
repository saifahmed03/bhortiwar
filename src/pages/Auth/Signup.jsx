// src/pages/Auth/Signup.jsx
import { useState } from 'react';
import { signUpWithEmail, signInWithGoogle } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  LinearProgress
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Google, PersonAdd } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (pwd.length < 6) return { value: 25, color: 'error', text: 'Weak' };
    if (pwd.length < 10) return { value: 50, color: 'warning', text: 'Fair' };
    if (pwd.length < 14) return { value: 75, color: 'info', text: 'Good' };
    return { value: 100, color: 'success', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await signUpWithEmail(email, password);
      // Update AuthContext with the user
      if (result.user) {
        setUser(result.user);
      }
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithGoogle();
      // Update AuthContext with the user
      if (result.user) {
        setUser(result.user);
      }
      // Note: For OAuth, Supabase will redirect automatically
      // This navigate is for mock auth fallback
      navigate('/student/dashboard');
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
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                  mb: 2
                }}
              >
                <PersonAdd sx={{ fontSize: 32, color: 'white' }} />
              </Box>
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
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join Bhortijuddho and start your journey
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleEmailSignup}>
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
              />

              {password && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength
                    </Typography>
                    <Typography variant="caption" color={`${passwordStrength.color}.main`}>
                      {passwordStrength.text}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.value}
                    color={passwordStrength.color}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                margin="normal"
                error={confirmPassword !== '' && password !== confirmPassword}
                helperText={
                  confirmPassword !== '' && password !== confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#4F9CFF' }} />
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
                Create Account
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
              onClick={handleGoogleSignup}
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
              Sign up with Google
            </Button>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  size="small"
                  onClick={() => navigate('/auth/login')}
                  sx={{
                    color: '#FF4FD2',
                    textTransform: 'none',
                    '&:hover': { background: 'rgba(255, 79, 210, 0.1)' }
                  }}
                >
                  Sign In
                </Button>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Signup;
