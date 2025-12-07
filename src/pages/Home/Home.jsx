// src/pages/Home/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Dashboard, AdminPanelSettings, Speed } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
  >
    <Card
      sx={{
        height: '100%',
        background: 'rgba(30, 30, 37, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(79, 156, 255, 0.3)',
          border: '1px solid rgba(79, 156, 255, 0.5)'
        },
        '&:hover .card-underline': {
          width: '100%',
        }
      }}
    >
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
            mb: 3
          }}
        >
          <Icon sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        {/* Title with Underline */}
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="white" sx={{ pb: 0.5 }}>
            {title}
          </Typography>

          {/* Animated Underline */}
          <Box
            className="card-underline"
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

        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* HERO SECTION */}
      <Box
        sx={{
          pt: 16,
          pb: 12,
          background: 'linear-gradient(135deg, #1A1A24 0%, #13131A 50%, #0E0E14 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 156, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 79, 210, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              fontWeight="extrabold"
              sx={{
                background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF, #C5FF66)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              Welcome to <Box component="span" sx={{ fontFamily: '"Nova Round", cursive', fontWeight: 400 }}>bhortijuddho</Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto', mb: 5, lineHeight: 1.6 }}
            >
              Your next-gen smart admission companion — faster, smoother, and fully student-focused.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/auth/login')}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF, #C5FF66)',
                  color: 'black',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 32px rgba(79, 156, 255, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(79, 156, 255, 0.6)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/auth/login')}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderColor: '#4F9CFF',
                  color: '#4F9CFF',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#3D84E5',
                    background: 'rgba(79, 156, 255, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Already a user?
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ py: 10, background: '#16161C', display: 'flex', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              textAlign="center"
              mb={3}
              sx={{
                background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              What We Offer
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 600, mx: 'auto', mb: 6, lineHeight: 1.8, fontSize: '1.1rem' }}
            >
              Discover the powerful features that make BhortiJuddho your ultimate admission companion.
              From intelligent dashboards to comprehensive admin controls, we've built everything you need
              for a seamless university application experience.
            </Typography>
          </motion.div>

          {/* Cards - Full Width with Padding */}
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FeatureCard
                icon={Dashboard}
                title="Smart Dashboard"
                description="Experience a comprehensive dashboard that puts all your application information at your fingertips. Monitor multiple university applications simultaneously, track important deadlines with intelligent reminders."
                delay={0.2}
              />
            </Grid>

            <Grid item xs={12}>
              <FeatureCard
                icon={AdminPanelSettings}
                title="Admin Tools"
                description="Empower administrators with a robust suite of management tools designed for maximum efficiency. Control user permissions, manage application workflows, generate detailed reports, and oversee the entire admission process from a centralized interface."
                delay={0.4}
              />
            </Grid>

            <Grid item xs={12}>
              <FeatureCard
                icon={Speed}
                title="Student-Friendly"
                description="Built with students in mind, our platform prioritizes simplicity without sacrificing functionality. Navigate through your applications effortlessly with our clean, intuitive interface that works seamlessly across all devices."
                delay={0.6}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>

      {/* Footer */}
      <Box py={4} bgcolor="#0E0E14" borderTop="1px solid rgba(255,255,255,0.05)" textAlign="center">
        <Typography variant="body2" color="text.secondary">
          © 2024 BhortiJuddho. All rights reserved.
        </Typography>
        <Button
          size="small"
          onClick={() => navigate('/admin/login')}
          sx={{ mt: 1, color: 'rgba(255,255,255,0.2)', '&:hover': { color: '#4F9CFF' } }}
        >
          Admin Access
        </Button>
      </Box>
    </Layout>
  );
};

export default Home;
