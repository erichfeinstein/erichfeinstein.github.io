import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Tabs, Tab, Box, CssBaseline, useMediaQuery, IconButton, List, ListItem,
  ListItemText, AppBar, Toolbar, Typography, SwipeableDrawer,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import About from './About';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Music from './Music';

const theme = createTheme({
  palette: { text: { primary: '#fff' }, background: { default: '#000' } },
  typography: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
});

const routes = [
  { path: '/',           label: 'About',      element: <About /> },
  { path: '/experience', label: 'Experience', element: <Experience /> },
  { path: '/education',  label: 'Education',  element: <Education /> },
  { path: '/skills',     label: 'Skills',     element: <Skills /> },
  { path: '/music',      label: 'Music',      element: <Music /> },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activeIndex = Math.max(0, routes.findIndex((r) => r.path === location.pathname));

  const handleChange = (_e, newValue) => navigate(routes[newValue].path);

  const handleNavItemClick = (index) => {
    navigate(routes[index].path);
    setDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {isMobile ? (
          <>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ width: 48, height: 48 }}>
                  <Typography variant="h4" component="span" sx={{ color: 'white' }}>menu</Typography>
                </IconButton>
                <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h5" component="span">{routes[activeIndex].label}</Typography>
                </Box>
                <Box sx={{ width: 48, height: 48 }} />
              </Toolbar>
            </AppBar>
            <SwipeableDrawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onOpen={() => setDrawerOpen(true)}
              disableSwipeToOpen
              sx={{ '& .MuiDrawer-paper': { width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }}
            >
              <Box onClick={() => setDrawerOpen(false)} sx={{ position: 'absolute', left: 16, top: 16, cursor: 'pointer' }}>
                <Typography variant="h4" sx={{ color: '#777' }}>back</Typography>
              </Box>
              <List sx={{ width: '100%', textAlign: 'center' }}>
                {routes.map((r, index) => (
                  <ListItem button key={r.label} onClick={() => handleNavItemClick(index)} sx={{ justifyContent: 'center' }}>
                    <ListItemText primary={r.label} sx={{ '& span': { fontSize: '3.5rem !important' } }} />
                  </ListItem>
                ))}
              </List>
            </SwipeableDrawer>
          </>
        ) : (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeIndex} onChange={handleChange} centered>
              {routes.map((r) => <Tab key={r.label} label={r.label} />)}
            </Tabs>
          </Box>
        )}

        <Box sx={{ p: { xs: 2, sm: 3 }, color: 'white' }}>
          <Routes>
            {routes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Home;
