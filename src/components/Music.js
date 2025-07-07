import React from 'react';
import { Box, Typography, Link, List, ListItem } from '@mui/material';

const Music = () => {
  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        mx: 'auto',
        color: 'white',
        backgroundColor: '#121212',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="body1" sx={{ fontSize: '1.5rem', mb: 3 }}>
        Music is my passion! I love playing guitar,
        singing, and recently have even been taking drum lessons. Writing songs and jamming
        with other musicians connects me to the world 🤘. I'm in a few bands and I also produce
        some of my own music on the side. I love to play live and have played at a few
        venues in New York City with my bands.
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.5rem', mb: 3 }}>
        Below is my Samply, where I frequently upload new jams I'm working on. Feel free to check them out, I hope you enjoy it and thank you for
        listening!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <iframe
          src="https://samply.app/player/Sl4jNP6vw14nakUYZjr7"
          width="800"
          height="600"
          style={{ border: '1px solid #ccc', borderRadius: '16px' }}
          title="Samply Music Player"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        />
      </Box>
    </Box>
  );
};

export default Music;