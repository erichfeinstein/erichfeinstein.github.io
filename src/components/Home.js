import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  CssBaseline,
  useMediaQuery,
  IconButton,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  SwipeableDrawer,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import About from './About';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Music from './Music'; // New Music component

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
        <Box sx={{ p: { xs: 2, sm: 3 }, color: 'white' }}>
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
          color: 'inherit',
          fontSize: '1.5rem',
          '& .MuiTab-wrapper': {
            background:
              'linear-gradient(270deg, #ff0000, #00ff00, #0000ff, #ff0000) !important',
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

const navItems = ["About", "Experience", "Education", "Skills", "Music"]; // Updated navItems

const Home = () => {
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNavItemClick = (index) => {
    setTabValue(index);
    setDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {isMobile ? (
          <>
            <AppBar
              position="static"
              sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }}
            >
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ width: 48, height: 48 }} // ensure fixed size
                >
                  <Typography variant="h4" component="span" sx={{ color: 'white' }}>
                    ☰
                  </Typography>
                </IconButton>
                <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                  {/* Display the currently selected nav item */}
                  <Typography variant="h5" component="span">
                    {navItems[tabValue]}
                  </Typography>
                </Box>
                {/* Empty box to balance the hamburger button */}
                <Box sx={{ width: 48, height: 48 }} />
              </Toolbar>
            </AppBar>
            <SwipeableDrawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onOpen={() => setDrawerOpen(true)}
              swipeAreaWidth={30} // optional: adjust the swipe area
              disableSwipeToOpen
              sx={{
                '& .MuiDrawer-paper': {
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              }}
            >
              <Box
                onClick={() => setDrawerOpen(false)}
                sx={{ position: 'absolute', left: 16, top: 16, cursor: 'pointer' }}
              >
                <Typography variant="h4" sx={{ color: '#777' }}>
                  ←
                </Typography>
              </Box>
              <List sx={{ width: '100%', textAlign: 'center' }}>
                {navItems.map((item, index) => (
                  <ListItem
                    button
                    key={item}
                    onClick={() => handleNavItemClick(index)}
                    sx={{ justifyContent: 'center' }}
                  >
                    <ListItemText
                      primary={item}
                      sx={{
                        '& span': {
                          fontSize: '3.5rem !important'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </SwipeableDrawer>
          </>
        ) : (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="resume tabs"
              centered
            >
              {navItems.map((item) => (
                <Tab key={item} label={item} />
              ))}
            </Tabs>
          </Box>
        )}
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
        <TabPanel value={tabValue} index={4}>
          <Music />
        </TabPanel>
      </div>
    </ThemeProvider>
  );
};

export default Home;