import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const About = () => {
  const [showInitial, setShowInitial] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitial(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showInitial) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" className="typewriter" sx={{ fontSize: '3rem' }}>
          hey
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        mx: 'auto',
        backgroundColor: '#121212',
        borderRadius: 2,
        boxShadow: 3,
        color: 'white',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ flex: '0 0 auto', mr: { md: 4 }, mb: { xs: 2, md: 0 } }}>
          <img
            src="/me.jpg"
            alt="hey that's me!"
            style={{ width: '250px', borderRadius: '4px' }}
          />
        </Box>
        <Box sx={{ flex: '1' }}>
          <Typography variant="body1" sx={{ fontSize: '1.5rem' }}>
            With over 5 years of experience, I am a front-end software engineer with
            a strong foundation in computer science and extensive knowledge of modern TypeScript and React.
            I thrive on collaborating with designers, product owners, and fellow engineers to create outstanding user experiences.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default About;