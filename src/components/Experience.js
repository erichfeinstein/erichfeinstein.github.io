import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const experiences = [
  {
    company: "Grubhub",
    logo: require('../assets/photos/grubhub.png'),
    title: "Senior Software Engineer",
    period: "Dec 2021 - Present",
    details: [
      "Led implementation of a BFF for dynamically generated merchant and product pages, leveraging Protobuf and a web renderer which I developed",
      "Built a content management tool for the Grubhub+ program in React which reduced the number of SEVs related to page performance and legal copy",
      "Unified the offers and promotions platform for enterprise and small business restaurants, lowering the overhead of maintaining both portals"
    ]
  },
  {
    company: "Branding Brand",
    logo: require('../assets/photos/bb.png'),
    title: "Development Manager",
    period: "June 2020 - Dec 2021",
    details: [
      "Led team of engineers to build COVID-19 vaccination and PPE management forms, as well as e-commerce pages in React for Fortune 500 pharmaceuticals retailer",
      "Maintained and contributed to Flagship, an open-source code platform for developing e-commerce solutions across Web, iOS and Android using React Native Web"
    ]
  },
  {
    company: "Cedrus Digital",
    logo: require('../assets/photos/cedrus.png'),
    title: "Software Engineer",
    period: "April 2019 - May 2020",
    details: [
      "Developed enterprise web application for an international auto rental company, scaffolded and built out pages for account management",
      "Created reusable and well-tested components using React, partnered with design team to develop efficient and responsive solutions for a great user experience"
    ]
  }
];

const Experience = () => {
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
      {experiences.map((exp, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 600 }}>
              {exp.company}
            </Typography>
            <Box
              component="img"
              src={exp.logo}
              alt={`${exp.company} logo`}
              sx={{ width: 100, height: 100, objectFit: 'contain' }}
            />
          </Box>
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 400, mb: 1 }}>
            {exp.title}
          </Typography>
          <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '1.2rem', color: '#bbbbbb', mb: 2 }}>
            {exp.period}
          </Typography>
          <List dense>
            {exp.details.map((detail, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={detail}
                  primaryTypographyProps={{ sx: { fontSize: '1.1rem' } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default Experience;