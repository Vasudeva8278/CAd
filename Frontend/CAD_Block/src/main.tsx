
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './style.css';


import Upload from './Component/Upload';
import BlockList from './Component/BlockList';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: '100% !important',
          padding: '0 16px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    }
  }
});

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          {/* Header */}
          <AppBar position="static" color="primary" sx={{ width: '100%' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                CAD Block Manager
              </Typography>
              <Button
                component={Link}
                to="/upload"
                color="inherit"
                sx={{ mr: 2 }}
              >
                Upload
              </Button>
              <Button
                component={Link}
                to="/blocks"
                color="inherit"
              >
                Blocks
              </Button>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container sx={{ flex: 1, width: '100%', py: 4 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/upload" replace />} />
              <Route path="/upload" element={
                <Grid container sx={{ width: '100%' }}>
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
                      <Upload />
                    </Paper>
                  </Grid>
                </Grid>
              } />
              <Route path="/blocks" element={
                <Grid container sx={{ width: '100%' }}>
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
                      <BlockList />
                    </Paper>
                  </Grid>
                </Grid>
              } />
            </Routes>
          </Container>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
