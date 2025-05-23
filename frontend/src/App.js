import React, {useEffect , useState, Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { UserContext } from './context/UserContext';
import { CssBaseline, ThemeProvider, createTheme, Box, CircularProgress, Snackbar, Slide } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviePage = lazy(() => import('./pages/MoviePage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Custom Material UI theme for a modern look
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff1744' },
    background: { default: '#181818', paper: '#232323' },
    secondary: { main: '#00e676' },
    text: {
      primary: '#fff',
      secondary: '#b0b0b0',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-1px' },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
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
  },
});

// Page transition animation
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 32, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -32, scale: 0.98 }}
    transition={{ duration: 0.4, ease: 'easeInOut' }}
    style={{ minHeight: 'calc(100vh - 64px)' }}
  >
    {children}
  </motion.div>
);

// Custom loading spinner with branding
function BrandedLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        color: 'primary.main',
        gap: 2,
      }}
    >
      <CircularProgress size={56} thickness={4} color="primary" />
      <Box sx={{ fontWeight: 700, fontSize: 28, letterSpacing: 2 }}>
        MovieZone
      </Box>
      <Box sx={{ color: 'secondary.main', fontSize: 16, letterSpacing: 1 }}>
        Loading your experience...
      </Box>
    </Box>
  );
}

// Snackbar for global notifications (example, can be extended)
function GlobalSnackbar({ open, message, onClose }) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      message={message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
      autoHideDuration={3000}
      ContentProps={{
        sx: {
          background: 'rgba(40,40,40,0.95)',
          color: '#fff',
          fontWeight: 600,
          borderRadius: 2,
        },
      }}
    />
  );
}

// Wrapper to animate route changes
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/movies/:id"
          element={
            <PageTransition>
              <MoviePage />
            </PageTransition>
          }
        />
        <Route
          path="/payment"
          element={
            <PageTransition>
              <PaymentPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
    // 1. Initialize user from localStorage (if exists)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // 2. Save user to localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  // Example: global notification state (could be Redux or context in a real app)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  // Example: show a welcome message on first load
  React.useEffect(() => {
    setSnackbarMsg('Welcome to MovieZone!');
    setSnackbarOpen(true);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Suspense fallback={<BrandedLoader />}>
          <AnimatedRoutes />
        </Suspense>
        <GlobalSnackbar
          open={snackbarOpen}
          message={snackbarMsg}
          onClose={() => setSnackbarOpen(false)}
        />
      </Router>
    </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
