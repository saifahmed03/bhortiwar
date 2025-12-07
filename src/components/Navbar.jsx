// src/components/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useScrollTrigger,
  Slide
} from '@mui/material';
import {
  Home,
  Dashboard,
  AdminPanelSettings,
  Login,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(14, 14, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo Section - Enhanced & Branded */}
            <Box
              display="flex"
              alignItems="center"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                '&:hover .logo-text': {
                  textShadow: '0 0 25px rgba(79, 156, 255, 0.8), 0 0 50px rgba(255, 79, 210, 0.5)',
                },
                '&:hover .logo-underline': {
                  width: '100%',
                }
              }}
              onClick={() => navigate('/')}
            >
              {/* Logo Text with Underline */}
              <Box sx={{ position: 'relative' }}>
                <Typography
                  className="logo-text"
                  variant="h4"
                  sx={{
                    fontFamily: '"Nova Round", cursive',
                    fontWeight: 400,
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(45deg, #FF4FD2 0%, #4F9CFF 40%, #C5FF66 80%, #FF4FD2 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 15px rgba(79, 156, 255, 0.4)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    pb: 0.5,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  bhortijuddho
                </Typography>

                {/* Animated Underline */}
                <Box
                  className="logo-underline"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    width: 0,
                    background: 'linear-gradient(90deg, #FF4FD2, #4F9CFF, #C5FF66)',
                    transition: 'width 0.4s ease',
                    borderRadius: '2px',
                    boxShadow: '0 0 15px rgba(79, 156, 255, 0.8)',
                  }}
                />
              </Box>
            </Box>

            {/* Center Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(79, 156, 255, 0.1)',
                    color: '#4F9CFF'
                  }
                }}
              >
                Home
              </Button>
              <Button
                startIcon={<Dashboard />}
                onClick={() => navigate('/auth/login', { state: { from: '/student/dashboard' } })}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(79, 156, 255, 0.1)',
                    color: '#4F9CFF'
                  }
                }}
              >
                Dashboard
              </Button>
              <Button
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate('/admin')}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(79, 156, 255, 0.1)',
                    color: '#4F9CFF'
                  }
                }}
              >
                Admin
              </Button>
            </Box>

            {/* Auth Buttons */}
            <Box display="flex" gap={2} alignItems="center">
              <Button
                startIcon={<Login />}
                variant="outlined"
                onClick={() => navigate('/auth/login')}
                sx={{
                  borderColor: '#4F9CFF',
                  color: '#4F9CFF',
                  '&:hover': {
                    borderColor: '#3D84E5',
                    background: 'rgba(79, 156, 255, 0.1)'
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                startIcon={<PersonAdd />}
                variant="contained"
                onClick={() => navigate('/auth/signup')}
                sx={{
                  background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E63FB8, #3D84E5)',
                    boxShadow: '0 4px 20px rgba(79, 156, 255, 0.4)'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
