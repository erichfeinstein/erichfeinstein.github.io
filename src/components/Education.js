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

const EducationItem = ({ edu }) => (
  <ListItem>
    <ListItemText
      primary={
        <>
          <Typography component="span" sx={{ fontSize: '1.4rem', fontWeight: 600 }}>
            {edu.institution}
          </Typography>
          <br />
          <Typography component="span" sx={{ fontSize: '1.2rem', fontWeight: 400 }}>
            {edu.degree}
          </Typography>
        </>
      }
      secondary={`${edu.period} | ${edu.location}`}
      secondaryTypographyProps={{ style: { color: '#bbbbbb', fontSize: '1rem' } }}
    />
  </ListItem>
);

const Education = () => {
  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        backgroundColor: '#121212',
        borderRadius: 2,
        boxShadow: 3,
        color: 'white',
      }}
    >
      <List dense>
        {educationItems.map((edu, index) => (
          <EducationItem key={index} edu={edu} />
        ))}
      </List>
    </Box>
  );
};

export default Education;