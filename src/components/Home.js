import React, { useState } from 'react';
import { Tabs, Tab, Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import About from './About';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3, color: 'white' /* Force content color */ }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

const theme = createTheme({
  palette: {
    text: { primary: '#fff' },
    background: { default: '#000' },
  },
  typography: {
    fontFamily: "'Courier New', Courier, monospace",
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'inherit', // keep this so it doesn't force a dark color
          '& .MuiTab-wrapper': {
            background: 'linear-gradient(270deg, #ff0000, #00ff00, #0000ff, #ff0000) !important',
            backgroundSize: '400% !important',
            WebkitBackgroundClip: 'text !important',
            backgroundClip: 'text !important',
            animation: 'gradientAnimation 8s ease infinite !important',
          },
        },
      },
    },
  },
});

const Home = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="resume tabs" centered>
            <Tab label="About" />
            <Tab label="Experience" />
            <Tab label="Education" />
            <Tab label="Skills" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <About />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Experience />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Education />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Skills />
        </TabPanel>
      </div>
    </ThemeProvider>
  );
};

export default Home;