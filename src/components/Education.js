import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const educationItems = [
  {
    institution: "Fullstack Academy of Code",
    period: "October 2018 - February 2019",
    degree: "Software Engineering Immersive Program",
    location: "New York, NY"
  },
  {
    institution: "Case Western Reserve University",
    period: "August 2014 - May 2018",
    degree: "Bachelor of Arts, Computer Science",
    location: "Cleveland, OH"
  }
];

const Education = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Education
      </Typography>
      <List dense>
        {educationItems.map((edu, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${edu.institution} - ${edu.degree}`}
              secondary={`${edu.period} | ${edu.location}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Education;