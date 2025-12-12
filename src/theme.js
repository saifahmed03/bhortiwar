import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F9CFF',
      light: '#7AB4FF',
      dark: '#3D84E5',
    },
    secondary: {
      main: '#FF4FD2',
      light: '#FF7DE0',
      dark: '#E63FB8',
    },
    success: {
      main: '#00E676',
      light: '#33EB8C',
      dark: '#00C853',
    },
    warning: {
      main: '#FFD700',
      light: '#FFE033',
      dark: '#E6C200',
    },
    error: {
      main: '#FF5252',
      light: '#FF7575',
      dark: '#E63F3F',
    },
    background: {
      default: '#0E0E14',
      paper: '#1E1E25',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 156, 255, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(79, 156, 255, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(79, 156, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4F9CFF',
            },
          },
        },
      },
    },
  },
});

export default theme;


