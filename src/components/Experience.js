import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const experiences = [
  {
    company: "Grubhub",
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
    title: "Development Manager",
    period: "June 2020 - Dec 2021",
    details: [
      "Led team of engineers to build COVID-19 vaccination and PPE management forms, as well as e-commerce pages in React for Fortune 500 pharmaceuticals retailer",
      "Maintained and contributed to Flagship, an open-source code platform for developing e-commerce solutions across Web, iOS and Android using React Native Web"
    ]
  },
  {
    company: "Cedrus Digital",
    title: "Software Engineer",
    period: "April 2019 - May 2020",
    details: [
      "Developed enterprise web application for an international auto rental company, scaffolded and built out pages for account management",
      "Created reusable and well-tested components using React, partnered with design team to develop efficient and responsive solutions for a good user experience"
    ]
  }
];

const Experience = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Experience
      </Typography>
      {experiences.map((exp, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="h6">
            {exp.company} - {exp.title}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            {exp.period}
          </Typography>
          <List dense>
            {exp.details.map((detail, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={detail} />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default Experience;