import React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Home from './components/Home';
import './styles/index.css';

const theme = createTheme({
  typography: {
    fontFamily: "'Courier New', Courier, monospace",
  },
  palette: {
    background: {
      default: '#0c0c0c',
    },
    primary: {
      main: '#1976d2',
    },
    text: {
      primary: '#fff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}

export default App;