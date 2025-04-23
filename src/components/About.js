import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const About = () => {
  const [showInitial, setShowInitial] = useState(true);

  useEffect(() => {
    // After 3 seconds, reveal the full content including the image.
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
        <Typography variant="h2" className="typewriter">
          hey
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        About
      </Typography>
      <Typography variant="body1">
        With over 5 years of experience, I am a front-end software engineer with
        a strong foundation in computer science and a wealth of knowledge in
        modern TypeScript and React. Throughout my career, I have thrived by
        working cross-functionally with designers, product owners, and engineers
        of other disciplines to create great user experiences.
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <img
          src="/me.jpg"
          alt="hey that's me!"
          style={{ width: '250px', borderRadius: '50%' }}
        />
      </Box>
    </Box>
  );
};

export default About;