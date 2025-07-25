import React, { useState } from 'react';
import { Box, Typography, Chip, Stack, Tooltip } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import confetti from 'canvas-confetti';
import '../styles/animations.css';

const initialCategories = {
  Languages: ["JavaScript", "TypeScript", "Python", "Java"],
  "Markup & Styling": ["HTML", "CSS", "Sass"],
  Frameworks: ["React", "React Native", "Redux", "Node", "Jest", "Jasmine"],
  APIs: ["REST APIs", "GraphQL"],
  Tools: ["Git", "GitHub", "Jenkins", "Spinnaker", "Datadog", "Sentry"],
  Databases: ["SQL", "PostgreSQL"],
  "Coding Assistance": ["GitHub Copilot", "Cursor AI"]
};

const Skills = () => {
  const [categories, setCategories] = useState(initialCategories);

  const isSortedAlphabetically = (arr) => {
    const sortedArr = [...arr].sort();
    return arr.join() === sortedArr.join();
  };

  const triggerFullScreenConfetti = () => {
    for (let i = 0; i < 10; i++) {
      confetti({
        particleCount: 20,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() },
      });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.droppableId !== result.destination.droppableId) return;
    const category = result.source.droppableId;
    const items = Array.from(categories[category]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCategories((prev) => ({ ...prev, [category]: items }));
    if (isSortedAlphabetically(items)) {
      triggerFullScreenConfetti();
    }
  };

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
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(categories).map(([categoryName, skills]) => (
          <Box key={categoryName} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
              {categoryName}
            </Typography>
            <Droppable droppableId={categoryName} direction="horizontal">
              {(provided) => (
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  justifyContent="flex-start"
                  columnGap={1} // gap between chips horizontally
                  rowGap={1}    // gap between rows
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {skills.map((skill, index) => (
                    <Draggable key={skill} draggableId={skill} index={index}>
                      {(provided) => (
                        <Chip
                          label={skill}
                          sx={{
                            cursor: 'grab',
                            backgroundColor: 'white',
                            color: 'black'
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </Box>
        ))}
      </DragDropContext>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Sort the skills alphabetically for a surprise!
      </Typography>
    </Box>
  );
};

export default Skills;