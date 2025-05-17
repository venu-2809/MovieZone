import React, { createContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';

// Contexts for global notification and loading
export const UIContext = createContext();

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#ff4081' },
    background: { default: '#181c24', paper: '#23293a' },
    error: { main: '#e53935' },
    success: { main: '#43a047' },
    warning: { main: '#ffa726' },
    info: { main: '#29b6f6' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 500, fontSize: '1.5rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          background: 'rgba(35,41,58,0.95)',
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
          minHeight: '80vh',
        },
      },
    },
    MuiSnackbar: {
      defaultProps: {
        TransitionComponent: Slide,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
  },
});

function AlertSnackbar(props) {
  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      sx={{
        borderRadius: 2,
        fontSize: '1rem',
        alignItems: 'center',
        boxShadow: 3,
      }}
      {...props}
    />
  );
}

function UIProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

  return (
    <UIContext.Provider value={{ showSnackbar, setLoading }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Fade in>
          <Container
            maxWidth="md"
            sx={{
              py: { xs: 2, sm: 4 },
              px: { xs: 1, sm: 4 },
              mt: { xs: 2, sm: 6 },
              mb: { xs: 2, sm: 6 },
              minHeight: '80vh',
              transition: 'box-shadow 0.3s',
            }}
          >
            {children}
          </Container>
        </Fade>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Slide}
        >
          <AlertSnackbar
            onClose={hideSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </AlertSnackbar>
        </Snackbar>
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0, left: 0, width: '100vw', height: '100vh',
              bgcolor: 'rgba(24,28,36,0.7)', zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'background 0.3s',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress color="primary" size={64} thickness={4} />
              <Box sx={{ color: 'primary.main', fontWeight: 500, fontSize: '1.1rem', letterSpacing: 1 }}>
                Loading, please wait...
              </Box>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </UIContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </React.StrictMode>
);
